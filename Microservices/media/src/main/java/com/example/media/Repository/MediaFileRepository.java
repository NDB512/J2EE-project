package com.example.media.Repository;

import org.springframework.data.repository.CrudRepository;
import com.example.media.Model.MediaFile;

public interface MediaFileRepository extends CrudRepository<MediaFile, Long>{

}
