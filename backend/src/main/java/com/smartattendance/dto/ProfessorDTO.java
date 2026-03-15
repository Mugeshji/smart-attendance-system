package com.smartattendance.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfessorDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate dob;
    private String address;
    private String avatarUrl;
    private String department;
    private String universityName;
}
