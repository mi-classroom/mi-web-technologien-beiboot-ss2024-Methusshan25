package com.example.models

import kotlinx.serialization.Serializable
import java.io.File


@Serializable
data class Project(var projectName : String, var frameCount : Int = 0, var videoExists : Boolean = false, var blendedImageExists : Boolean = false)

var projects = mutableListOf<Project>()

/**
 * Adds all existing projects into the projects-list
 */
fun configureProjects(){
    File("/app/data/projects").listFiles()?.forEach {
        val imageDirectory = File("/app/data/projects/${it.name}/frames")
        val imageFiles = imageDirectory.listFiles { file -> file.isFile() } ?: arrayOf()
        var videoFile = File("/app/data/projects/${it.name}/uploadedVideo.mp4")
        var blendedImage = File("/app/data/projects/${it.name}/blendedImage.png")
        projects.add(Project(it.name, imageFiles.size, videoFile.exists(), blendedImage.exists()))
    }
}

/**
 * Creates a new Project
 * @param projectName Name of the new Project
 */
fun createNewProject(projectName: String){
    val project = Project(projectName)
    project.let { it -> projects.add(it) }
    val directory = File("/app/data/projects/${project.projectName}")
    if(!directory.exists()){
        directory.mkdirs()
    }
}

/**
 * Updates all projects in the projects-list
 */
fun updateProjects(){
    projects.forEach {
        val imageDirectory = File("/app/data/projects/${it.projectName}/frames")
        it.frameCount = imageDirectory.listFiles { file -> file.isFile() }?.size ?: 0
        println(it.frameCount)
        it.videoExists = File("/app/data/projects/${it.projectName}/uploadedVideo.mp4").exists()
        it.blendedImageExists = File("/app/data/projects/${it.projectName}/blendedImage.png").exists()
    }
}