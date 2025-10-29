package com.example.media.Model;

public enum Storage {
    DB("Database"),
    S3("Amazon S3"),
    GC("Google Cloud"),
    AC("Azure Cloud");

    private final String label;

    Storage(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
