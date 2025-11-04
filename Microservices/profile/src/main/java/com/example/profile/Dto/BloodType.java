package com.example.profile.Dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BloodType {
    A_POSITIVE("A+"),
    A_NEGATIVE("A-"),
    B_POSITIVE("B+"),
    B_NEGATIVE("B-"),
    AB_POSITIVE("AB+"),
    AB_NEGATIVE("AB-"),
    O_POSITIVE("O+"),
    O_NEGATIVE("O-");

    private final String label;

    BloodType(String label) {
        this.label = label;
    }

    @JsonValue // Khi serialize → trả ra "A+", "B-", ...
    public String getLabel() {
        return label;
    }

    @JsonCreator // Khi deserialize ← nhận vào "A+", "B-", ...
    public static BloodType fromValue(String value) {
        for (BloodType type : values()) {
            if (type.label.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid blood type: " + value);
    }
}
