@file:Suppress("DEPRECATION")

package com.example.routes

import com.example.imageProcessing.blendImages
import com.example.imageProcessing.deleteDirectory
import com.example.imageProcessing.extractFrames
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
import kotlin.io.path.exists

fun Route.videoProcessRouting() {

    fun createStaticRoutes(){
        val directories = File("/app/data/projects").listFiles()?.map { it.name }
        directories?.forEach{
            staticFiles("/$it", File("/app/data/projects/$it/frames"))
            staticFiles("/$it/video", File("/app/data/projects/$it"))
        }
    }

    createStaticRoutes()

    route("/listImages"){
        /**
         * GET /listImages/{id}
         *
         * Returns a list of all image identifiers
         *
         * parameters:
         *  - in: path
         *    name: id
         *    schema:
         *      type: string
         *    required: true
         *    description: Name of the project
         *
         * responses:
         *    200: OK - Returns a list of all image identifiers
         *    400: Bad Request - Invalid project name given
         */
        get("/{id}"){
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val images = File("/app/data/projects/$projectName/frames").listFiles()?.map { it.name }
            call.respond(status = HttpStatusCode.OK, images!!)
        }
    }

    route("/uploadVideo") {
        get("/{id}") {
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val file = File("/app/data/projects/$projectName/uploadedVideo.mp4")
            if (file.exists()) {
                call.respondFile(file)
            } else {
                call.respondText("Video not found", status = HttpStatusCode.NotFound)
            }
        }

        /**
         * POST /uploadVideo
         *
         * Uploads a video to the given project
         *
         * requestBody:
         *      description: A multipart/form-data object containing the project name and the video file
         *      content:
         *          multipart/form-data:
         *              example:
         *                  projectName: Kreisverkehr
         *                  file: Kreisverkehr.mp4
         * responses:
         *      200: OK - Video uploaded to project
         *      415: Unsupported Media Type - Not a valid video file
         */
        post() {
            val multipart = call.receiveMultipart()

            var projectName = ""

            multipart.forEachPart { part ->
                if (part is PartData.FileItem) {
                    if (part.contentType?.match(ContentType.Video.Any) == true) {
                        val fileBytes = part.streamProvider().readBytes()
                        val destination = File("/app/data/projects/$projectName/uploadedVideo.mp4")
                        destination.writeBytes(fileBytes)
                        call.respondText("File uploaded successfully", status = HttpStatusCode.OK)
                    } else {
                        call.respondText("File could not be uploaded", status = HttpStatusCode.BadRequest)
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
        /**
         * GET /splitFrames/{id}
         *
         * Splits a video into frames
         *
         * parameters:
         *  - in: path
         *    name: id
         *    schema:
         *      type: string
         *    required: true
         *    description: Name of the project
         *
         * responses:
         *    200: OK - Frames are successfully split
         */
        get("/{id}") {
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            var fps = 30
            fps = call.request.queryParameters["fps"]?.toInt() ?: return@get call.respondText(
                "Invalid fps number",
                status = HttpStatusCode.BadRequest
            )
            if(!File("/app/data/projects/$projectName/frames").exists()) {
                Files.createDirectory(Paths.get("/app/data/projects/$projectName/frames"))
            }else{
                deleteDirectory(File("/app/data/projects/$projectName/frames"))
            }
            val file = File("/app/data/projects/$projectName/uploadedVideo.mp4")
            extractFrames(file, projectName, fps)
            call.respondText("Frames sucessfully split", status = HttpStatusCode.OK)
        }

        /**
         * DELETE /listImages/{id}
         *
         * Removes all generated frames
         *
         * parameters:
         *  - in: path
         *    name: id
         *    schema:
         *      type: string
         *    required: true
         *    description: Name of the project
         *
         * responses:
         *    200: OK - Frames successfully removed
         *    400: Bad Request - Invalid project name given
         *    404: Not Found - Given project does not exist
         */
        delete("/{id}") {
            val projectName = call.parameters["id"] ?: return@delete call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val file = File("/app/data/projects/$projectName/frames")
            if (file.exists()) {
                deleteDirectory(file)
                call.respondText("Frames sucessfully deleted", status = HttpStatusCode.OK)
            } else {
                call.respondText("Directory does not exist", status = HttpStatusCode.NotFound)
            }
        }
    }
    route("/blendImages") {
        /**
         * POST /blendImages
         *
         * Blends requested images together
         *
         * parameters:
         *  - in: path
         *    name: id
         *    schema:
         *      type: string
         *    required: true
         *    description: Name of the project
         *
         * requestBody:
         *      description: A multipart/form-data object containing a string containing all frames that are used in the
         *      blending process and a string containing all frames, that are used multiple times to highlight them and
         *      the amount of duplicates
         *      content:
         *          multipart/form-data:
         *              example:
         *                  framesToUse: 12,13,14
         *                  framesToHighlight: 13;10,14;20
         * responses:
         *      200: OK - Frames successfully blended
         *      400: Bad Request - Invalid project name given
         *      404: Not Found - Given project does not exist
         */
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
            println(framesToHighlight);
            if (Paths.get("/app/data/projects/$projectName/frames").exists()) {
                blendImages(projectName, framesToUse, framesToHighlight)
                var result = File("/app/data/projects/$projectName/blendedImage.png")
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
            val blendedImage = File("/app/data/projects/$projectName/blendedImage.png")
            if(blendedImage.exists()) {
                call.respondBytes(Base64.getEncoder().encode(blendedImage.readBytes()))
            }else{
                call.respondText("Image not found", status = HttpStatusCode.NotFound)
            }
        }
    }
}

