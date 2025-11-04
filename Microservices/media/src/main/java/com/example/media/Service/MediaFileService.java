package com.example.media.Service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.example.media.Dto.MediaFileDto;
import com.example.media.Model.MediaFile;

public interface MediaFileService {
    public MediaFileDto storeFile(MultipartFile file) throws IOException;
    
    public Optional<MediaFile> getFile(Long id);

    public boolean deleteFile(Long id);
}
