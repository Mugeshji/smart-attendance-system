package com.smartattendance.security;

import com.smartattendance.entity.Professor;
import com.smartattendance.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final ProfessorRepository professorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Professor not found with email: " + email));

        return new User(professor.getEmail(), professor.getPassword(), new ArrayList<>());
    }
}
