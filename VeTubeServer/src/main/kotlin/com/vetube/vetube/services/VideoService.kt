package com.vetube.vetube.services

import com.vetube.vetube.models.VideoMetaData
import com.vetube.vetube.repositories.VideoRepository
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
class VideoService(private val videoRepository: VideoRepository) {

    @Cacheable("videos")
    fun getAllVideos(): List<VideoMetaData> = videoRepository.findAll()

    @CachePut(value = ["videos"], key = "#result.id")
    fun saveVideo(video: VideoMetaData): VideoMetaData {
        val savedVideo = videoRepository.save(video)
        return savedVideo
    }

    @Cacheable(value = ["videos"], key = "#id")
    fun getVideoById(id: String): VideoMetaData? {
        return videoRepository.findById(id).orElse(null)
    }

    @CacheEvict(value = ["videos"], allEntries = true)
    fun clearCache() {
        // This method can be used to clear the cache manually
    }
}