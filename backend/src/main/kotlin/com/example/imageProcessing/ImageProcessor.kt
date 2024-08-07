@file:OptIn(DelicateCoroutinesApi::class)

package com.example.imageProcessing

import kotlinx.coroutines.DelicateCoroutinesApi
import org.bytedeco.opencv.global.opencv_core.addWeighted
import org.bytedeco.opencv.global.opencv_imgcodecs.imread
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite
import org.bytedeco.opencv.opencv_core.Mat
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

fun deleteDirectory(directory: File) {
    val result = directory.listFiles()?.forEach {
        if (it.isDirectory) {
            deleteDirectory(it)
        } else
            it.delete()
    }
}

fun extractFrames(videoFile: File, project : String, fps : Int = 30): Boolean {
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

        val outputThread = Thread{
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

fun blendImages(project: String, framesToUse : String = "", framesToHighlight: String) {

    val framesToUse = framesToUse.split(",").toMutableList()
    val framesToHighlightList = mutableListOf<ArrayList<String>>()
    framesToHighlight.split(",").toMutableList().forEach {
        val split = it.split(";").toMutableList()
        println(split)
        if(split.size > 1){
            framesToHighlightList.add(arrayListOf(split[0], split[1]))
        }
    }


    var image = imread("/app/data/projects/$project/frames/frame${framesToUse[0]}.png")

    framesToUse.removeFirst()
    if(framesToUse.isNotEmpty()){
        framesToUse.removeLast()
    }

    println(framesToUse)
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
    var gamma = 0.0 // Scalar added to each sum
    addWeighted(image, alpha, image, beta, gamma, blendedImage)

    framesToUse.forEach{
        image = imread("/app/data/projects/$project/frames/frame$it.png")
        if(!image.empty()){
            addWeighted(blendedImage, alpha, image, beta, gamma, blendedImage)
            println("image $it blended")
        }
    }
    alpha = 1 - 0.01
    beta = 1 - alpha

    framesToHighlightList.forEach {
        image = imread("/app/data/projects/$project/frames/frame${it[0]}.png")
        if (!image.empty()) {
            for (i in 1..10 * it[1].toInt()) {
                addWeighted(blendedImage, alpha, image, beta, gamma, blendedImage)
            }
            println("image ${it[0]} highlighted with strength ${it[1]}")
        }
    }
    // Save the result
    imwrite("/app/data/projects/$project/blendedImage.png", blendedImage)
}

