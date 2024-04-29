package com.example.routes
import com.example.imageProcessing.blendImages
import com.example.imageProcessing.frameSplit
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

fun Route.fileRouting(){
    var fileName = ""

    route("/upload"){
        post(){
                val contentType = call.request.contentType()
                if (contentType == ContentType.Video.MP4) {
                    val inputStream = call.receive<ByteArray>()
                    fileName = "video_${System.currentTimeMillis()}.mp4" // Generate a unique file name or use UUID
                    val file = File("uploads/$fileName") // Specify the path where you want to save the file
                    file.writeBytes(inputStream)
                    val filePath = file.absolutePath

                    var imageNumber = frameSplit(filePath)
                    blendImages(imageNumber)

                    var result = File("output/blendedImage.jpg")
                    println(result)

                    if (result.exists() && result.isFile) {
                        call.respondFile(result)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }

                    println("Video uploaded successfully. Path: $filePath")
                } else {
                    call.respondText("Unsupported content type. Only video uploads are allowed.", status = HttpStatusCode.BadRequest)
                }
        }
    }
}

