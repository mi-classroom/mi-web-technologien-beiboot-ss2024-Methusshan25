package com.example.routes

import com.example.imageProcessing.convertVideo
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

fun Route.videoAccessRouting(){

    /**
     * Creates static routes for accessing frames or the video source
     */
    fun createStaticRoutes(){
        val directories = File("/app/data/projects").listFiles()?.map { it.name }
        directories?.forEach{
            /**
             * Static route to access a single frame from a project
             * Example: /{projectName}/frame1.png
             */
            staticFiles("/$it", File("/app/data/projects/$it/frames"))
            /**
             * Static route to access a single frame from a project
             * Example: /{projectName}/video/uploadedVideo.png
             */
            staticFiles("/$it/video", File("/app/data/projects/$it"))
        }
    }

    createStaticRoutes()

    route("/uploadVideo") {
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
                        if(part.contentType?.match(ContentType.Video.QuickTime) == true){
                            println("Quicktime detected")
                            val videoFile = File("/app/data/projects/$projectName/uploadedVideo.mov")
                            videoFile.writeBytes(fileBytes)
                            convertVideo(videoFile, projectName)
                        }else{
                            println("Not Quicktime detected")
                            val destination = File("/app/data/projects/$projectName/uploadedVideo.mp4")
                            destination.writeBytes(fileBytes)
                        }

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
}