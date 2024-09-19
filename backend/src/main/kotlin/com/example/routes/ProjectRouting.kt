package com.example.routes

import com.example.imageProcessing.extractFrames
import com.example.imageProcessing.saveVideoInProject
import com.example.models.Project
import com.example.models.createNewProject
import com.example.models.projects
import com.example.models.updateProjects
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

fun Route.projectRouting() {

    fun createNewRoute(projectName : String){
        staticFiles("/$projectName", File("/app/data/projects/$projectName/frames"))
        staticFiles("/$projectName/video", File("/app/data/projects/$projectName"))
    }

    route("/projects") {
        /**
         * GET /projects
         *
         * Retrieves a list of all projects
         *
         * Responses:
         *      200: Success - Returns a list of projects
         *      404: Not Found - No projects available
         */
        get{
            if(projects.isNotEmpty()) {
                updateProjects()
                call.respond(projects)
            }else
            {
                call.respondText("No projects found", status = HttpStatusCode.NotFound)
            }
        }
        /**
         * GET /projects/{id}
         *
         * Retrieves the requested project
         *
         * Parameters:
         * - in: path
         *   name: id
         *   schema:
         *      type: string
         *   required: true
         *   description: Name of the project
         *
         * Responses:
         *      200: Success - Returns the requested project
         *      400: Bad request - Invalid project name given
         *      404: Not Found - Requested Project does not exist
         */
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

        /**
         * POST /project
         *
         * Creates a new project
         *
         * requestBody:
         *      description: A multipart/form-data object containing project information
         *      content:
         *          multipart/form-data:
         *              example:
         *                  projectName: Kreisverkehr
         * responses:
         *      201: Created - A new project was created
         */
        post {
            val multipartPart = call.receiveMultipart()
            var projectName : String = ""
            multipartPart.forEachPart { part ->
                if(part is PartData.FormItem){
                    projectName = part.value
                }
            }
            createNewProject(projectName)
            createNewRoute(projectName)
            call.respondText("Project ${projectName} sucessfully created!", status = HttpStatusCode.Created)
        }

        /**
         * POST /project/{id}
         *
         * Copies a existing project with different fps
         *
         * requestBody:
         *      description: A multipart/form-data object containing project information
         *      content:
         *          multipart/form-data:
         *              example:
         *                  projectName: Kreisverkehr
         * responses:
         *      201: Created - A new project was created
         *      400: Bad request - Invalid project id given
         *      404: Not Found - Project with given project id does not exist
         *      500: Internal Server Error - An error occurred during frame extraction
         */
        post("/{id}"){
            val id = call.parameters["id"] ?: return@post call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            val originalProject = projects.find{it.projectName == id } ?: return@post call.respondText(
                "No project found",
                status = HttpStatusCode.NotFound
            )
            val multipartPart = call.receiveMultipart()
            var newProjectName : String = ""
            var fps : Int = 0
            multipartPart.forEachPart { part ->
                if(part is PartData.FormItem  && part.name == "newProjectName") {
                    newProjectName = part.value
                }
                if(part is PartData.FormItem  && part.name == "fps") {
                    fps = part.value.toInt()
                }
            }
            createNewProject(newProjectName)
            createNewRoute(newProjectName)
            val video = File("/app/data/projects/${originalProject.projectName}/uploadedVideo.mp4")
            val videoBytes = video.readBytes()
            saveVideoInProject(videoBytes, newProjectName, ContentType.Video.MP4)
            Files.createDirectory(Paths.get("/app/data/projects/$newProjectName/frames"))
            val res = extractFrames(video, newProjectName, fps)
            if(res){
                call.respondText("Project successfully copied", status = HttpStatusCode.Created)
            }
            else{
                call.respondText("Project copying failed", status = HttpStatusCode.InternalServerError)
            }
        }

        /**
         * DELETE /project/{id}
         *
         * Deletes the requested project
         *
         * Parameters:
         *  - in: path
         *    name: id
         *    schema:
         *      type: string
         *    required: true
         *    description: Name of the project
         *
         * Responses:
         *      200: OK - Project removed
         *      400: Bad Request - Invalid project name given
         *      404: Not Found - Requested Project does not exist
         */
        delete("/{id}") {
            val id = call.parameters["id"] ?: return@delete call.respondText(
                "Missing id",
                status = HttpStatusCode.BadRequest
            )
            if(projects.removeIf{it.projectName == id }){
                val directory = File("/app/data/projects/${id}")
                directory.deleteRecursively()
                call.respondText("Project removed correctly", status = HttpStatusCode.OK)
            }else{
                call.respondText("Project not found", status = HttpStatusCode.NotFound)
            }
        }
    }
}