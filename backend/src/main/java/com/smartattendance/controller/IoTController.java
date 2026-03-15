package com.smartattendance.controller;

import com.smartattendance.dto.BarcodeRequest;
import com.smartattendance.dto.AttendanceDTO;
import com.smartattendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/iot")
@RequiredArgsConstructor
public class IoTController {

    private final AttendanceService attendanceService;

    @PostMapping("/checkin")
    public ResponseEntity<AttendanceDTO> checkIn(@Valid @RequestBody BarcodeRequest request) {
        return ResponseEntity.ok(attendanceService.checkIn(request.getBarcodeId()));
    }

    @PostMapping("/checkout")
    public ResponseEntity<AttendanceDTO> checkOut(@Valid @RequestBody BarcodeRequest request) {
        return ResponseEntity.ok(attendanceService.checkOut(request.getBarcodeId()));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Smart Attendance IoT Gateway"));
    }
}
