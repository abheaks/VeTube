package com.vetube.vetube.controllers

import com.vetube.vetube.dto.UploadVideoDto
import com.vetube.vetube.models.VideoMetaData
import com.vetube.vetube.services.S3Service
import com.vetube.vetube.services.VideoService
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["http://localhost:9002", "https://vetube-8v5ws.web.app/"])
@RestController
@RequestMapping("/api/videos")
class VideoController(
    private val videoService: VideoService,
    private val s3Service: S3Service
) {


    @GetMapping
    fun getAllVideos(): List<VideoMetaData> = videoService.getAllVideos()

    @PostMapping
    fun saveVideo(@RequestBody video: VideoMetaData): VideoMetaData = videoService.saveVideo(video)


    @PostMapping("/upload")
    fun getUploadUrl(@RequestBody uploadVideo: UploadVideoDto): Map<String, String> {
        val bucketName = "vetubebucket" // Replace with your S3 bucket name
        val fileName = uploadVideo.fileName
        val key = "videos/$fileName"
        val uploadUrl = s3Service.generateUploadUrl(bucketName, key)
        val videoUrl = s3Service.generateDownloadUrl(bucketName, key)
        val video = VideoMetaData(
            title = uploadVideo.title,
            description = uploadVideo.description,
            fileName = uploadVideo.fileName,
            url = videoUrl.toString(),
            thumbnailUrl = uploadVideo.thumbnailUrl,
            timestamp = System.currentTimeMillis()
        )
        videoService.saveVideo(video)
        return mapOf("uploadUrl" to uploadUrl.toString())
    }

    @GetMapping("/{id}/access-url")
    fun generateAccessUrl(@PathVariable id: String): Map<String, String> {
        val video = videoService.getVideoById(id)
            ?: throw IllegalArgumentException("Video with ID $id not found")
        val bucketName = "vetubebucket"
        val fileName = video.fileName
        val key = "videos/$fileName"
        val accessUrl = s3Service.generateDownloadUrl(bucketName, key)
        return mapOf("accessUrl" to accessUrl.toString())
    }

}