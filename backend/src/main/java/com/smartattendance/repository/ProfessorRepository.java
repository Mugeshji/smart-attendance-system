package com.smartattendance.repository;

import com.smartattendance.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmail(String email);

    boolean existsByEmail(String email);
}
