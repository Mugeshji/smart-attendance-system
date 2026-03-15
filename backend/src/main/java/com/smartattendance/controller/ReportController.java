package com.smartattendance.controller;

import com.smartattendance.entity.Professor;
import com.smartattendance.service.ProfessorService;
import com.smartattendance.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ProfessorService professorService;

    @GetMapping("/excel")
    public ResponseEntity<byte[]> downloadExcel(Authentication auth,
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate) throws IOException {
        Professor prof = professorService.getByEmail(auth.getName());
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(30);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();

        byte[] report = reportService.generateExcelReport(prof.getId(), start, end);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("attendance_report.xlsx").build());

        return new ResponseEntity<>(report, headers, HttpStatus.OK);
    }

    @GetMapping("/csv")
    public ResponseEntity<String> downloadCsv(Authentication auth,
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate) {
        Professor prof = professorService.getByEmail(auth.getName());
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(30);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();

        String csv = reportService.generateCsvReport(prof.getId(), start, end);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("attendance_report.csv").build());

        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }
}
