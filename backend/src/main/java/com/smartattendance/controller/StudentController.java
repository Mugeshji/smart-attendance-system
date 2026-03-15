package com.smartattendance.controller;

import com.smartattendance.dto.StudentDTO;
import com.smartattendance.entity.Professor;
import com.smartattendance.service.ProfessorService;
import com.smartattendance.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final ProfessorService professorService;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getStudents(Authentication auth,
            @RequestParam(name = "search", required = false) String search) {
        Professor prof = professorService.getByEmail(auth.getName());
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(studentService.searchStudents(prof.getId(), search));
        }
        return ResponseEntity.ok(studentService.getStudentsByProfessor(prof.getId()));
    }

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(Authentication auth,
            @Valid @RequestBody StudentDTO dto) {
        Professor prof = professorService.getByEmail(auth.getName());
        return ResponseEntity.ok(studentService.createStudent(prof.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id,
            @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
}
