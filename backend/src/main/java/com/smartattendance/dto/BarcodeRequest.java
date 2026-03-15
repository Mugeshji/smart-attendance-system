package com.smartattendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeRequest {
    @NotBlank(message = "Barcode ID is required")
    private String barcodeId;
}
