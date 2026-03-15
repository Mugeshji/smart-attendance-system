package com.smartattendance.service;

import com.smartattendance.entity.Attendance;
import com.smartattendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AttendanceRepository attendanceRepository;

    public byte[] generateExcelReport(Long professorId, LocalDate startDate, LocalDate endDate) throws IOException {
        List<Attendance> records = attendanceRepository.findByDateRangeAndProfessor(startDate, endDate, professorId);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Attendance Report");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] headers = { "Roll Number", "Student Name", "Date", "Check-In Time", "Check-Out Time", "Status" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowNum = 1;
            for (Attendance a : records) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(a.getStudent().getRollNumber());
                row.createCell(1).setCellValue(a.getStudent().getName());
                row.createCell(2).setCellValue(a.getDate().toString());
                row.createCell(3).setCellValue(a.getCheckInTime() != null ? a.getCheckInTime().toString() : "");
                row.createCell(4).setCellValue(a.getCheckOutTime() != null ? a.getCheckOutTime().toString() : "");
                row.createCell(5).setCellValue(a.getStatus().name());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public String generateCsvReport(Long professorId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> records = attendanceRepository.findByDateRangeAndProfessor(startDate, endDate, professorId);

        StringBuilder csv = new StringBuilder();
        csv.append("Roll Number,Student Name,Date,Check-In Time,Check-Out Time,Status\n");

        for (Attendance a : records) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s\n",
                    a.getStudent().getRollNumber(),
                    a.getStudent().getName(),
                    a.getDate(),
                    a.getCheckInTime() != null ? a.getCheckInTime() : "",
                    a.getCheckOutTime() != null ? a.getCheckOutTime() : "",
                    a.getStatus().name()));
        }

        return csv.toString();
    }
}
