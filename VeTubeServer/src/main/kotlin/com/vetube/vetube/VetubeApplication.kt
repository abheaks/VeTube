package com.vetube.vetube

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class VetubeApplication

fun main(args: Array<String>) {
    runApplication<VetubeApplication>(*args)
}
