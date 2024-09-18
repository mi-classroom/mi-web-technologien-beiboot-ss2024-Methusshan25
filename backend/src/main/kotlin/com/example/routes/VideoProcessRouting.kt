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
}

