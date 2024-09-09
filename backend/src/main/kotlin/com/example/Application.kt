package com.example

import com.example.models.configureProjects
import com.example.plugins.*
import io.ktor.http.*
import io.ktor.server.application.*

import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.websocket.*
import java.time.Duration


fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureSerialization()
    configureRouting()
    configureProjects()
    configureCORS()
}

fun Application.configureCORS() {
    install(CORS) {
        anyHost() // Allow requests from any host. Use with caution in production.
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
    }
}
