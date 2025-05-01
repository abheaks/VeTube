package com.vetube.vetube.repositories

import com.vetube.vetube.models.VideoMetaData
import org.springframework.data.mongodb.repository.MongoRepository

interface VideoRepository :MongoRepository<VideoMetaData,String>