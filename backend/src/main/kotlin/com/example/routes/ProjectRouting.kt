package com.example.routes

import com.example.models.Project
import com.example.models.projects
import com.example.models.updateProjects
import io.ktor.http.*
import io.ktor.http.ContentDisposition.Companion.File
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths

fun Route.projectRouting() {

    fun createNewRoute(projectName : String){
        staticFiles("/$projectName", File("/app/data/projects/$projectName/frames"))
        staticFiles("/$projectName/video", File("/app/data/projects/$projectName"))
    }

    route("/projects") {
        get{
            if(projects.isNotEmpty()) {
                updateProjects()
                call.respond(projects)
            }else
            {
                call.respondText("No projects found", status = HttpStatusCode.OK)
            }
        }
        get("/{id}") {
            val id = call.parameters["id"] ?: return@get call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val project = projects.find{it.projectName == id } ?: return@get call.respondText(
                "No project found",
                status = HttpStatusCode.NotFound
            )
            call.respond(project)
        }
        post {
            val multipartPart = call.receiveMultipart()
            var project : Project? = null
            multipartPart.forEachPart { part ->
                if(part is PartData.FormItem){
                    project = Project(part.value)
                }
            }
            project?.let { it -> projects.add(it) }
            val directory = File("/app/data/projects/${project?.projectName}")
            if(!directory.exists()){
                directory.mkdirs()
            }
            createNewRoute(project!!.projectName)
            call.respondText("${directory.exists()}", status = HttpStatusCode.Created)
        }
        delete("/{id}") {
            val id = call.parameters["id"] ?: return@delete call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            if(projects.removeIf{it.projectName == id }){
                call.respondText("Project removed correctly", status = HttpStatusCode.Accepted)
            }else{
                call.respondText("Project not found", status = HttpStatusCode.NotFound)
            }
        }
    }
}