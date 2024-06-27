@file:Suppress("DEPRECATION")

package com.example.routes

import com.example.imageProcessing.blendImages
import com.example.imageProcessing.deleteDirectory
import com.example.imageProcessing.splitVideo
import com.example.models.Project
import com.example.models.configureProjects
import com.example.models.projects
import com.example.models.updateProjects
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import kotlin.io.path.exists
import kotlin.math.round
import kotlin.reflect.typeOf


fun Route.videoProcessRouting() {

    fun createStaticRoutes(){
        val directories = File("projects").listFiles().map { it.name }
        directories.forEach{
            staticFiles("/$it", File("projects/$it/frames"))
            staticFiles("/$it/video", File("projects/$it"))
        }
    }

    createStaticRoutes()

    route("/listImages"){
        get("/{id}"){
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val images = File("/app/data/projects/$projectName/frames").listFiles()?.map { it.name }
            call.respond(images!!)
        }
    }

    route("/uploadVideo") {
        get("/{id}") {
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val file = File("projects/$projectName/uploadedVideo.mp4")
            if (file.exists()) {
                call.respondFile(file)
            } else {
                call.respondText("Video not found", status = HttpStatusCode.NotFound)
            }
        }
        post() {
            val multipart = call.receiveMultipart()

            var projectName = ""

            multipart.forEachPart { part ->
                if (part is PartData.FileItem) {
                    if (part.contentType?.match(ContentType.Video.Any) == true) {
                        val fileBytes = part.streamProvider().readBytes()
                        val destination = File("projects/$projectName/uploadedVideo.mp4")
                        destination.writeBytes(fileBytes)
                        call.respondText("File uploaded successfully", status = HttpStatusCode.OK)
                    } else {
                        call.respondText("File not uploaded yet", status = HttpStatusCode.BadRequest)
                    }
                }
                if (part is PartData.FormItem) {
                    projectName = part.value
                }
            }
            createStaticRoutes()
        }
    }
    route("/splitFrames") {
        get("/{id}") {

            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
<<<<<<< Updated upstream
            if(!File("projects/$projectName/frames").exists()) {
                Files.createDirectory(Paths.get("projects/$projectName/frames"))
            }
            val file = File("projects/$projectName/uploadedVideo.mp4")
=======
            var projectDirectory = File("/app/data/projects/$projectName/frames")
            if(!projectDirectory.exists()) {
                Files.createDirectory(Paths.get("/app/data/projects/$projectName/frames"))
            }
            else{
                deleteDirectory(projectDirectory)
            }
            val file = File("/app/data/projects/$projectName/uploadedVideo.mp4")
>>>>>>> Stashed changes
            val executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors())
            splitVideo(file.absolutePath, executor, projectName)
            executor.shutdown()
            try {
                executor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
            call.respondText("Frames sucessfully split", status = HttpStatusCode.BadRequest)
        }
        delete("/{id}") {
            val projectName = call.parameters["id"] ?: return@delete call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val file = File("projects/$projectName/frames")
            if (file.exists()) {
                deleteDirectory(file)
                call.respondText("Frames sucessfully deleted", status = HttpStatusCode.OK)
            } else {
                call.respondText("Directory does not exist", status = HttpStatusCode.NotFound)
            }
        }
    }
    route("/blendImages") {
        post("/{id}") {
            val projectName = call.parameters["id"] ?: return@post call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val multipartPart = call.receiveMultipart()
            var framesToUse: String = ""
            var framesToHighlight = ""
            multipartPart.forEachPart { part ->
                if (part is PartData.FormItem && part.name == "framesToUse") {
                    framesToUse = part.value
                }
                if (part is PartData.FormItem && part.name == "framesToHighlight") {
                    framesToHighlight = part.value
                }
            }
<<<<<<< Updated upstream
            if (Paths.get("projects/$projectName/frames").exists()) {
                blendImages(projectName, framesToUse)
                var result = File("projects/$projectName/blendedImage.jpg")
                //Base64.getEncoder().encode(result.readBytes())
=======
            if (Paths.get("/app/data/projects/$projectName/frames").exists()) {
                blendImages(projectName, framesToUse, framesToHighlight)
                var result = File("/app/data/projects/$projectName/blendedImage.jpg")
>>>>>>> Stashed changes
                call.respondBytes(Base64.getEncoder().encode(result.readBytes()))
            } else {
                call.respondText("Images not found", status = HttpStatusCode.NotFound)
            }
        }
    }
    route("/blendedImage"){
        get("/{id}"){
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val blendedImage = File("projects/$projectName/blendedImage.jpg")
            if(blendedImage.exists()) {
                call.respondBytes(Base64.getEncoder().encode(blendedImage.readBytes()))
            }else{
                call.respondText("Image not found", status = HttpStatusCode.NotFound)
            }
        }
    }
    /*
    route("/images") {
        get("/{id}") {
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val imageDirectory = File("projects/$projectName/frames")
            if (imageDirectory.exists() && imageDirectory.isDirectory) {
                val imageFiles = imageDirectory.listFiles { file -> file.isFile() } ?: arrayOf()
                val imagesJsonArray = imageFiles.map { file ->
                    val base64Image = "data:image/jpg;base64, " + Base64.getEncoder().encodeToString(file.readBytes())
                    mapOf("name" to file.name, "data" to base64Image)
                }
                call.respond(mapOf("images" to imagesJsonArray))
            } else {
                call.respond(HttpStatusCode.InternalServerError, "Images directory not found")
            }
        }
    }
    */
}

