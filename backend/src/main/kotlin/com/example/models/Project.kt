package com.example.models

import kotlinx.serialization.Serializable
import java.io.File


@Serializable
data class Project(var projectName : String, var frameCount : Int = 0, var videoExists : Boolean = false, var blendedImageExists : Boolean = false)

var projects = mutableListOf<Project>()

fun configureProjects(){
    File("projects").listFiles()?.forEach {
        val imageDirectory = File("projects/${it.name}/frames")
        val imageFiles = imageDirectory.listFiles { file -> file.isFile() } ?: arrayOf()
        var videoFile = File("projects/${it.name}/uploadedVideo.mp4")
        var blendedImage = File("projects/${it.name}/blendedImage.jpg")
        projects.add(Project(it.name, imageFiles.size, videoFile.exists(), blendedImage.exists()))
    }
}

fun updateProjects(){
    projects.forEach {
        val imageDirectory = File("projects/${it.projectName}/frames")
        it.frameCount = imageDirectory.listFiles { file -> file.isFile() }?.size ?: 0
        println(it.frameCount)
        it.videoExists = File("projects/${it.projectName}/uploadedVideo.mp4").exists()
        it.blendedImageExists = File("projects/${it.projectName}/blendedImage.jpg").exists()
    }
}