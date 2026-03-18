package com.smartattendance.repository;

import com.smartattendance.entity.Attendance;
import com.smartattendance.entity.Attendance.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);

    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate start, LocalDate end);

    List<Attendance> findByDateAndStudentProfessorId(LocalDate date, Long professorId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = :status AND a.student.professor.id = :profId")
    long countByDateAndStatusAndProfessorId(@Param("date") LocalDate date,
            @Param("status") AttendanceStatus status,
            @Param("profId") Long profId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.student.professor.id = :profId")
    long countByDateAndProfessorId(@Param("date") LocalDate date, @Param("profId") Long profId);

    @Query("SELECT a.date, COUNT(a) FROM Attendance a WHERE a.student.professor.id = :profId AND a.date BETWEEN :start AND :end AND a.status IN ('PRESENT','LATE','CHECKED_OUT') GROUP BY a.date ORDER BY a.date")
    List<Object[]> getDailyAttendanceCounts(@Param("profId") Long profId, @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("SELECT a FROM Attendance a JOIN FETCH a.student WHERE a.date BETWEEN :start AND :end AND a.student.professor.id = :profId ORDER BY a.date DESC, a.checkInTime DESC")
    List<Attendance> findByDateRangeAndProfessor(@Param("start") LocalDate start, @Param("end") LocalDate end,
            @Param("profId") Long profId);
}
