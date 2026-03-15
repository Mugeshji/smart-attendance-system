package com.smartattendance.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDTO {
    private Long id;
    private String studentName;
    private String rollNumber;
    private String date;
    private String checkInTime;
    private String checkOutTime;
    private String status;
}
