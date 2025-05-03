package com.vetube.vetube.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.io.Serializable

@Document(collection = "videos")
data class VideoMetaData(
    @Id
    val id: String? = null,
    val title: String,
    val description: String,
    val fileName: String,
    val url: String,
    val thumbnailUrl: String,
    val timestamp: Long
) : Serializable