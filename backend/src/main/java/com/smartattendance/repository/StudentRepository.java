package com.smartattendance.repository;

import com.smartattendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByBarcodeId(String barcodeId);

    Optional<Student> findByRollNumber(String rollNumber);

    List<Student> findByProfessorId(Long professorId);

    List<Student> findByProfessorIdAndNameContainingIgnoreCase(Long professorId, String name);

    boolean existsByBarcodeId(String barcodeId);

    boolean existsByRollNumber(String rollNumber);

    boolean existsByRollNumberAndProfessorId(String rollNumber, Long professorId);

    boolean existsByBarcodeIdAndProfessorId(String barcodeId, Long professorId);
}
