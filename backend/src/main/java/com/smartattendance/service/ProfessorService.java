package com.smartattendance.service;

import com.smartattendance.dto.ProfessorDTO;
import com.smartattendance.entity.Professor;
import com.smartattendance.exception.ResourceNotFoundException;
import com.smartattendance.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfessorDTO getProfile(String email) {
        Professor prof = professorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));
        return toDTO(prof);
    }

    public ProfessorDTO updateProfile(String email, ProfessorDTO dto) {
        Professor prof = professorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));

        if (dto.getName() != null)
            prof.setName(dto.getName());
        if (dto.getPhone() != null)
            prof.setPhone(dto.getPhone());
        if (dto.getDob() != null)
            prof.setDob(dto.getDob());
        if (dto.getAddress() != null)
            prof.setAddress(dto.getAddress());
        if (dto.getAvatarUrl() != null)
            prof.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getDepartment() != null)
            prof.setDepartment(dto.getDepartment());
        if (dto.getUniversityName() != null)
            prof.setUniversityName(dto.getUniversityName());

        prof = professorRepository.save(prof);
        return toDTO(prof);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        Professor prof = professorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));

        if (!passwordEncoder.matches(oldPassword, prof.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        prof.setPassword(passwordEncoder.encode(newPassword));
        professorRepository.save(prof);
    }

    public Professor getByEmail(String email) {
        return professorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));
    }

    private ProfessorDTO toDTO(Professor prof) {
        return ProfessorDTO.builder()
                .id(prof.getId())
                .name(prof.getName())
                .email(prof.getEmail())
                .phone(prof.getPhone())
                .dob(prof.getDob())
                .address(prof.getAddress())
                .avatarUrl(prof.getAvatarUrl())
                .department(prof.getDepartment())
                .universityName(prof.getUniversityName())
                .build();
    }
}
