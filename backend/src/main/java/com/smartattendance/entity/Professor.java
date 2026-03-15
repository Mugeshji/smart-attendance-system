package com.smartattendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "professors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private LocalDate dob;

    private String address;

    @Column(name = "avatar_url")
    private String avatarUrl;

    private String department;

    @Column(name = "university_name")
    private String universityName;
}
