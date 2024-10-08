package com.example.plugins

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.netty.handler.codec.DefaultHeaders
import java.net.http.WebSocket

/**
 * Configures the serialization settings of the application
 */
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }
}
