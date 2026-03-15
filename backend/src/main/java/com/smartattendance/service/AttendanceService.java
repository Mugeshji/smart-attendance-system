package com.smartattendance.service;

import com.smartattendance.dto.*;
import com.smartattendance.entity.*;
import com.smartattendance.entity.Attendance.AttendanceStatus;
import com.smartattendance.exception.ResourceNotFoundException;
import com.smartattendance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceDTO checkIn(String barcodeId) {
        Student student = studentRepository.findByBarcodeId(barcodeId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with barcode: " + barcodeId));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByStudentIdAndDate(student.getId(), today);

        if (existing.isPresent()) {
            throw new RuntimeException("Student already checked in today");
        }

        LocalTime now = LocalTime.now();
        AttendanceStatus status = now.isAfter(LocalTime.of(9, 15)) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        Attendance attendance = Attendance.builder()
                .student(student)
                .date(today)
                .checkInTime(now)
                .status(status)
                .build();

        attendance = attendanceRepository.save(attendance);
        return toDTO(attendance);
    }

    public AttendanceDTO checkOut(String barcodeId) {
        Student student = studentRepository.findByBarcodeId(barcodeId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with barcode: " + barcodeId));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByStudentIdAndDate(student.getId(), today)
                .orElseThrow(() -> new RuntimeException("No check-in record found for today"));

        attendance.setCheckOutTime(LocalTime.now());
        attendance.setStatus(AttendanceStatus.CHECKED_OUT);
        attendance = attendanceRepository.save(attendance);

        return toDTO(attendance);
    }

    public List<AttendanceDTO> getTodayAttendance(Long professorId) {
        List<Attendance> records = attendanceRepository.findByDateAndStudentProfessorId(LocalDate.now(), professorId);
        return records.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DashboardStats getDashboardStats(Long professorId) {
        LocalDate today = LocalDate.now();

        long totalStudents = studentRepository.findByProfessorId(professorId).size();
        long presentToday = attendanceRepository.countByDateAndStatusAndProfessorId(today, AttendanceStatus.PRESENT,
                professorId)
                + attendanceRepository.countByDateAndStatusAndProfessorId(today, AttendanceStatus.LATE, professorId);
        long checkedOut = attendanceRepository.countByDateAndStatusAndProfessorId(today, AttendanceStatus.CHECKED_OUT,
                professorId);
        long totalAttendanceToday = attendanceRepository.countByDateAndProfessorId(today, professorId);
        long absentToday = totalStudents - totalAttendanceToday;
        long currentlyInside = presentToday; // Present but not checked out

        return DashboardStats.builder()
                .totalStudents(totalStudents)
                .presentToday(presentToday + checkedOut) // Everyone who came today
                .absentToday(Math.max(0, absentToday))
                .checkedOutToday(checkedOut)
                .currentlyInside(currentlyInside)
                .build();
    }

    public Map<String, Object> getWeeklyStats(Long professorId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        List<Object[]> data = attendanceRepository.getDailyAttendanceCounts(professorId, start, end);

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", row[0].toString());
            point.put("count", ((Number) row[1]).intValue());
            chartData.add(point);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("data", chartData);
        return result;
    }

    public Map<String, Object> getMonthlyStats(Long professorId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(29);
        List<Object[]> data = attendanceRepository.getDailyAttendanceCounts(professorId, start, end);

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", row[0].toString());
            point.put("count", ((Number) row[1]).intValue());
            chartData.add(point);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("data", chartData);
        return result;
    }

    public Map<String, Long> getPieStats(Long professorId) {
        DashboardStats stats = getDashboardStats(professorId);
        Map<String, Long> pie = new HashMap<>();
        pie.put("present", stats.getPresentToday());
        pie.put("absent", stats.getAbsentToday());
        pie.put("checkedOut", stats.getCheckedOutToday());
        return pie;
    }

    private AttendanceDTO toDTO(Attendance a) {
        return AttendanceDTO.builder()
                .id(a.getId())
                .studentName(a.getStudent().getName())
                .rollNumber(a.getStudent().getRollNumber())
                .date(a.getDate().toString())
                .checkInTime(a.getCheckInTime() != null ? a.getCheckInTime().toString() : null)
                .checkOutTime(a.getCheckOutTime() != null ? a.getCheckOutTime().toString() : null)
                .status(a.getStatus().name())
                .build();
    }
}
