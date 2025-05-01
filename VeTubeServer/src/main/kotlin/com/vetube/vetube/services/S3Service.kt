package com.vetube.vetube.services

import org.springframework.stereotype.Service
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest
import java.net.URL
import java.time.Duration

@Service
class S3Service(private val s3Client: S3Client) {

    fun generateUploadUrl(bucketName: String, key: String): URL {
        val presigner = S3Presigner.create()
        val putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build()

        val presignRequest = PutObjectPresignRequest.builder()
            .putObjectRequest(putObjectRequest)
            .signatureDuration(Duration.ofMinutes(10))
            .build()

        return presigner.presignPutObject(presignRequest).url()
    }

    fun generateDownloadUrl(bucketName: String, key: String): URL {
        val presigner = S3Presigner.create()
        val getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .build()

        val presignRequest = GetObjectPresignRequest.builder()
            .getObjectRequest(getObjectRequest)
            .signatureDuration(Duration.ofMinutes(10)) // URL valid for 10 minutes
            .build()

        return presigner.presignGetObject(presignRequest).url()
    }
}