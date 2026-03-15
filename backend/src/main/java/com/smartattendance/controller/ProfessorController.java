package com.smartattendance.controller;

import com.smartattendance.dto.ProfessorDTO;
import com.smartattendance.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/professor")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping("/profile")
    public ResponseEntity<ProfessorDTO> getProfile(Authentication auth) {
        return ResponseEntity.ok(professorService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfessorDTO> updateProfile(Authentication auth, @RequestBody ProfessorDTO dto) {
        return ResponseEntity.ok(professorService.updateProfile(auth.getName(), dto));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication auth,
            @RequestBody Map<String, String> request) {
        professorService.changePassword(auth.getName(), request.get("oldPassword"), request.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
