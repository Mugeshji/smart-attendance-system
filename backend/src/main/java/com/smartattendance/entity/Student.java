package com.smartattendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"roll_number", "professor_id"}),
    @UniqueConstraint(columnNames = {"barcode_id", "professor_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "roll_number", nullable = false)
    private String rollNumber;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phone;

    @Column(name = "barcode_id", nullable = false)
    private String barcodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id")
    private Professor professor;
}
