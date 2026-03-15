package com.smartattendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {
    private Long id;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "Student name is required")
    private String name;

    private String email;
    private String phone;

    @NotBlank(message = "Barcode ID is required")
    private String barcodeId;

    // Read-only fields for table display
    private String todayStatus;
    private String checkInTime;
    private String checkOutTime;
}
