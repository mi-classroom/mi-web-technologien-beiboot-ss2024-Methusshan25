package com.example.plugins

import com.example.routes.videoProcessRouting
import com.example.routes.projectRouting
import io.ktor.http.ContentDisposition.Companion.File
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
        videoProcessRouting()
        projectRouting()
    }
}
