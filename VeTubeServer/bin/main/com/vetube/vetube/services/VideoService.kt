package com.vetube.vetube.services

import com.vetube.vetube.models.VideoMetaData
import com.vetube.vetube.repositories.VideoRepository
import org.springframework.stereotype.Service

@Service
class VideoService(private val videoRepository: VideoRepository) {
    fun getAllVideos(): List<VideoMetaData> = videoRepository.findAll()
    fun saveVideo(video: VideoMetaData): VideoMetaData = videoRepository.save(video)
    fun getVideoById(id: String): VideoMetaData? {
        return videoRepository.findById(id).orElse(null)
    }

}