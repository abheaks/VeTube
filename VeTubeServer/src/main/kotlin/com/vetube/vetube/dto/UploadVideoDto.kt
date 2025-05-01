package com.vetube.vetube.dto

data class UploadVideoDto(
    val title: String,
    val description: String,
    val fileName: String,
    val thumbnailUrl: String
)
