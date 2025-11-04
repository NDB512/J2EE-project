package com.example.media.Model;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "media_files", indexes = {
    @Index(columnList = "name"),
    @Index(columnList = "storage")
})
public class MediaFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    private Long size;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = true)
    private byte[] data; // chỉ dùng khi lưu trong DB

    private String url; // dùng cho S3 / GC / AC

    @Enumerated(EnumType.STRING)
    private Storage storage;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
