package com.example.routes

import com.example.imageProcessing.deleteDirectory
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.util.*

fun Route.imageRouting(){

    route("/frames"){
        /**
         * GET /images/{id}
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

        /**
         * DELETE /frames/{id}
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

    route("/blendedImage"){
        /**
         * GET /blendedImage/{id}
         *
         * Returns the blended image
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
         *    200: OK - Returns the requested blended image
         *    400: Bad Request - Invalid project name given
         *    404: Not Found - Requested image does not exist
         */
        get("/{id}"){
            val projectName = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val blendedImage = File("/app/data/projects/$projectName/blendedImage.png")
            if(blendedImage.exists()) {
                call.respondBytes(Base64.getEncoder().encode(blendedImage.readBytes()), status = HttpStatusCode.OK)
            }else{
                call.respondText("Image not found", status = HttpStatusCode.NotFound)
            }
        }
    }
}