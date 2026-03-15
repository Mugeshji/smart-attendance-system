package com.smartattendance.service;

import com.smartattendance.dto.*;
import com.smartattendance.entity.Professor;
import com.smartattendance.repository.ProfessorRepository;
import com.smartattendance.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (professorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Professor professor = Professor.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .department(request.getDepartment())
                .universityName(request.getUniversityName())
                .build();

        professor = professorRepository.save(professor);

        String token = jwtUtil.generateToken(professor.getEmail());
        return AuthResponse.builder()
                .token(token)
                .email(professor.getEmail())
                .name(professor.getName())
                .professorId(professor.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Professor professor = professorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        String token = jwtUtil.generateToken(professor.getEmail());
        return AuthResponse.builder()
                .token(token)
                .email(professor.getEmail())
                .name(professor.getName())
                .professorId(professor.getId())
                .build();
    }
}
