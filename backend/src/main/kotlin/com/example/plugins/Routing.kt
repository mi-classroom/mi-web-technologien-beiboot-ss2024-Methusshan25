package com.example.plugins

import com.example.routes.videoProcessRouting
import com.example.routes.projectRouting
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Welcome to the LES-API, a api to create long exposure images using videos")
        }
        videoProcessRouting()
        projectRouting()
    }
}
