package com.smartattendance.controller;

import com.smartattendance.dto.*;
import com.smartattendance.entity.Professor;
import com.smartattendance.service.AttendanceService;
import com.smartattendance.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final ProfessorService professorService;

    @GetMapping("/today")
    public ResponseEntity<List<AttendanceDTO>> getTodayAttendance(Authentication auth) {
        Professor prof = professorService.getByEmail(auth.getName());
        return ResponseEntity.ok(attendanceService.getTodayAttendance(prof.getId()));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(Authentication auth) {
        Professor prof = professorService.getByEmail(auth.getName());
        return ResponseEntity.ok(attendanceService.getDashboardStats(prof.getId()));
    }

    @GetMapping("/weekly")
    public ResponseEntity<Map<String, Object>> getWeeklyStats(Authentication auth) {
        Professor prof = professorService.getByEmail(auth.getName());
        return ResponseEntity.ok(attendanceService.getWeeklyStats(prof.getId()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyStats(Authentication auth) {
        Professor prof = professorService.getByEmail(auth.getName());
        return ResponseEntity.ok(attendanceService.getMonthlyStats(prof.getId()));
    }

    @GetMapping("/pie")
    public ResponseEntity<Map<String, Long>> getPieStats(Authentication auth) {
        Professor prof = professorService.getByEmail(auth.getName());
        return ResponseEntity.ok(attendanceService.getPieStats(prof.getId()));
    }
}
