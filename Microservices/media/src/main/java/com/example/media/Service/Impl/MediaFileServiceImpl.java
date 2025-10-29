package com.example.media.Service.Impl;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.media.Dto.MediaFileDto;
import com.example.media.Model.MediaFile;
import com.example.media.Model.Storage;
import com.example.media.Repository.MediaFileRepository;
import com.example.media.Service.MediaFileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaFileServiceImpl implements MediaFileService {
    
    private final MediaFileRepository mediaFileRepository;
    
    @Override
    public MediaFileDto storeFile(MultipartFile file) throws IOException {
        MediaFile mediaFile = MediaFile.builder()
                                .name(file.getOriginalFilename())
                                .type(file.getContentType())
                                .size(file.getSize())
                                .data(file.getBytes())
                                .storage(Storage.DB)
                                .build();

        MediaFile saveFile = mediaFileRepository.save(mediaFile);
        return MediaFileDto.builder().id(saveFile.getId()).name(saveFile.getName()).type(saveFile.getType()).size(saveFile.getSize()).build();
    }

    @Override
    public Optional<MediaFile> getFile(Long id) {
        return mediaFileRepository.findById(id);
    }
    
}
