package com.smartattendance.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalStudents;
    private long presentToday;
    private long absentToday;
    private long checkedOutToday;
    private long currentlyInside;
}
