package com.example.media.Api;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.media.Dto.MediaFileDto;
import com.example.media.Model.MediaFile;
import com.example.media.Service.MediaFileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaFileApi {

    private final MediaFileService mediaFileService;

    @PostMapping("/upload")
    public ResponseEntity<MediaFileDto> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            MediaFileDto savedFile = mediaFileService.storeFile(file);
            return ResponseEntity.ok(savedFile);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    // Download file theo ID
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Optional<MediaFile> mediaFileOptional = mediaFileService.getFile(id);
        if (mediaFileOptional.isPresent()) {
            MediaFile mediaFile = mediaFileOptional.get();
            
            // Encode tên file UTF-8 để hỗ trợ tiếng Việt
            String filename = mediaFile.getName();
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
            String contentDisposition = "attachment; filename*=UTF-8''" + encodedFilename;
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .contentType(MediaType.parseMediaType(mediaFile.getType()))
                    .contentLength(mediaFile.getData().length)
                    .body(mediaFile.getData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
