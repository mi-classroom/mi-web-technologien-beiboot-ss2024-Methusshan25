package com.example.imageProcessing

import io.ktor.http.*
import kotlinx.coroutines.DelicateCoroutinesApi
import org.bytedeco.opencv.global.opencv_core.addWeighted
import org.bytedeco.opencv.global.opencv_imgcodecs.imread
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite
import org.bytedeco.opencv.opencv_core.Mat
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

/**
 * Deletes the given directory and all files within
 * @param directory A file with the path to the directory to be removed
 */
fun deleteDirectory(directory: File) {
    directory.listFiles()?.forEach {
        if (it.isDirectory) {
            deleteDirectory(it)
        } else
            it.delete()
    }
}

/**
 * Converts a given video file into a mp4 video file
 * @param videoFile Video file which will be converted
 * @param projectName Name of the project where converted video will be saved
 */
fun convertVideo(videoFile: File, projectName: String){
    val processBuilder = ProcessBuilder(
        "ffmpeg",
        "-i", videoFile.absolutePath,
        "/app/data/projects/$projectName/uploadedVideo.mp4"
    )
    processBuilder.redirectErrorStream(true)
    val process = processBuilder.start()

    val outputThread = Thread {
        val reader = BufferedReader(InputStreamReader(process.inputStream))
        reader.forEachLine { println(it) }
    }

    outputThread.start()
    val result = process.waitFor()
    outputThread.join()
}

/**
 * Generates frames from given videofile
 * @param videoFile Videofile to be split into frames
 * @param project Projectname of the project where the frames will be saved
 * @param fps Framerate at which the frames are split
 * @return Success of the frame splitting
 *
 */
fun extractFrames(videoFile: File, project: String, fps: Int = 30): Boolean {
    try {
        val processBuilder = ProcessBuilder(
            "ffmpeg",
            "-i", videoFile.absolutePath,
            "-vf", "fps=$fps", // Extract 1 frame per second
            "-threads", "8",
            "/app/data/projects/$project/frames/frame%d.png"
        )
        processBuilder.redirectErrorStream(true)
        val process = processBuilder.start()

        val outputThread = Thread {
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            reader.forEachLine { println(it) }
        }

        outputThread.start()
        val result = process.waitFor()
        outputThread.join()

        println("Frames sucessfully splitted")
        return result == 0
    } catch (e: Exception) {
        e.printStackTrace()
        return false
    }
}

/**
 * Saves a video in the given project
 * @param bytes Bytes of the video to be saved
 * @param projectName Name of the project where video will be saved
 * @param type Content type of the video
 */
fun saveVideoInProject(bytes: ByteArray, projectName: String, type: ContentType){
    if(type.match(ContentType.Video.QuickTime)){
        val videoFile = File("/app/data/projects/$projectName/uploadedVideo.mov")
        videoFile.writeBytes(bytes)
        convertVideo(videoFile, projectName)
    } else {
        val videoFile = File("/app/data/projects/$projectName/uploadedVideo.mp4")
        videoFile.writeBytes(bytes)
    }
}

/**
 * Generates a list out of a string. Type of list depending on listType
 * @param listType Determines if the generated list contains selected or highlighted frames
 * @param frameList String containing the frames to be inserted into list
 */
fun generateFrameList(listType : FrameListType, frameList : String) : Any?{
    if(listType == FrameListType.BLENDLIST){
        return frameList.split(",").toMutableList()
    }
    else if(listType == FrameListType.HIGHLIGHTLIST){
        val framesToHighlightList = mutableListOf<ArrayList<String>>()
        frameList.split(",").toMutableList().forEach {
            val split = it.split(";").toMutableList()
            println(split)
            if (split.size > 1) {
                framesToHighlightList.add(arrayListOf(split[0], split[1]))
            }
        }
        return framesToHighlightList
    }
    else{
        return null
    }
}

/**
 * Blends images to one image together
 * @param project The project containing the frames to be blended together
 * @param framesToUse Frames that are used to blend the image together
 * @param framesToHighlight Frames that are added multiple times to highlight them
 */
fun blendImages(project: String, framesToUse: String = "", framesToHighlight: String) {

    val framesToUseList = generateFrameList(FrameListType.BLENDLIST, framesToUse) as MutableList<String>
    val framesToHighlightList = generateFrameList(FrameListType.HIGHLIGHTLIST, framesToHighlight) as MutableList<ArrayList<String>>

    var image = imread("/app/data/projects/$project/frames/frame${framesToUseList[0]}.png")

    framesToUseList.removeFirst()
    if (framesToUseList.isNotEmpty()) {
        framesToUseList.removeLast()
    }

    println(framesToUseList)
    println(framesToHighlight)

    // Check if images are loaded properly
    if (image.empty()) {
        println("Error: Could not load images.")
        return
    }

    // Create a destination matrix
    val blendedImage = Mat()

    // Blend images with a given weight (alpha and beta)
    var alpha = 1 - 0.1// Weight for the first image
    var beta = 1 - alpha // Weight for the second image
    val gamma = 0.0 // Scalar added to each sum
    addWeighted(image, alpha, image, beta, gamma, blendedImage)

    framesToUseList.forEach {
        image = imread("/app/data/projects/$project/frames/frame$it.png")
        blendImage(blendedImage, alpha, beta, gamma, image)
        println("image $it blended")
    }

    alpha = 1 - 0.01
    beta = 1 - alpha

    framesToHighlightList.forEach {
        image = imread("/app/data/projects/$project/frames/frame${it[0]}.png")
        for (i in 1..10 * it[1].toInt()) {
            blendImage(blendedImage, alpha, beta, gamma, image)
            println("image ${it[0]} highlighted with strength ${it[1]}")
        }
    }
    // Save the result
    imwrite("/app/data/projects/$project/blendedImage.png", blendedImage)
}

/**
 * Blends image with another image together using given parameters
 * @param blendedImage Source image used as base
 * @param alpha Weight of the source image
 * @param beta Weight of the added image
 * @param gamma Scalar added to each sum
 * @param image Image added to the source image
 */
fun blendImage(blendedImage: Mat, alpha: Double, beta: Double, gamma: Double, image: Mat) {
    if (!image.empty()) {
        addWeighted(blendedImage, alpha, image, beta, gamma, blendedImage)
    }
}

