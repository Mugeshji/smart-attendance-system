package com.smartattendance.service;

import com.smartattendance.dto.StudentDTO;
import com.smartattendance.entity.*;
import com.smartattendance.exception.ResourceNotFoundException;
import com.smartattendance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final AttendanceRepository attendanceRepository;

    public List<StudentDTO> getStudentsByProfessor(Long professorId) {
        List<Student> students = studentRepository.findByProfessorId(professorId);
        return students.stream().map(s -> enrichWithAttendance(s)).collect(Collectors.toList());
    }

    public List<StudentDTO> searchStudents(Long professorId, String query) {
        List<Student> students = studentRepository.findByProfessorIdAndNameContainingIgnoreCase(professorId, query);
        return students.stream().map(s -> enrichWithAttendance(s)).collect(Collectors.toList());
    }

    public StudentDTO createStudent(Long professorId, StudentDTO dto) {
        if (studentRepository.existsByRollNumberAndProfessorId(dto.getRollNumber(), professorId)) {
            throw new RuntimeException("Roll number already exists for this professor");
        }
        if (studentRepository.existsByBarcodeIdAndProfessorId(dto.getBarcodeId(), professorId)) {
            throw new RuntimeException("Barcode ID already exists for this professor");
        }

        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));

        Student student = Student.builder()
                .rollNumber(dto.getRollNumber())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .barcodeId(dto.getBarcodeId())
                .professor(professor)
                .build();

        student = studentRepository.save(student);
        return toDTO(student);
    }

    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (dto.getName() != null)
            student.setName(dto.getName());
        if (dto.getEmail() != null)
            student.setEmail(dto.getEmail());
        if (dto.getPhone() != null)
            student.setPhone(dto.getPhone());
        if (dto.getRollNumber() != null)
            student.setRollNumber(dto.getRollNumber());
        if (dto.getBarcodeId() != null)
            student.setBarcodeId(dto.getBarcodeId());

        student = studentRepository.save(student);
        return enrichWithAttendance(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found");
        }
        attendanceRepository.deleteByStudentId(id);
        studentRepository.deleteById(id);
    }

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a");

    private StudentDTO enrichWithAttendance(Student student) {
        StudentDTO dto = toDTO(student);
        Optional<Attendance> todayAttendance = attendanceRepository
                .findByStudentIdAndDate(student.getId(), LocalDate.now());

        if (todayAttendance.isPresent()) {
            Attendance att = todayAttendance.get();
            dto.setTodayStatus(att.getStatus().name());
            dto.setCheckInTime(att.getCheckInTime() != null ? att.getCheckInTime().format(TIME_FMT) : null);
            dto.setCheckOutTime(att.getCheckOutTime() != null ? att.getCheckOutTime().format(TIME_FMT) : null);
        } else {
            dto.setTodayStatus("ABSENT");
        }

        return dto;
    }

    private StudentDTO toDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .rollNumber(student.getRollNumber())
                .name(student.getName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .barcodeId(student.getBarcodeId())
                .build();
    }
}
