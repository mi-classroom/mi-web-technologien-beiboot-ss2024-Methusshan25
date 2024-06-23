@file:OptIn(DelicateCoroutinesApi::class)

package com.example.imageProcessing

import kotlinx.coroutines.DelicateCoroutinesApi
import org.bytedeco.javacv.FFmpegFrameGrabber
import org.bytedeco.javacv.OpenCVFrameConverter
import org.bytedeco.opencv.global.opencv_core.addWeighted
import org.bytedeco.opencv.global.opencv_cudawarping.resize
import org.bytedeco.opencv.global.opencv_imgcodecs.imread
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite
import org.bytedeco.opencv.opencv_core.Mat
import org.bytedeco.opencv.opencv_core.Size
import java.io.File
import java.util.concurrent.ExecutorService
import kotlin.math.max


val TOTAL_SEGMENTS = 10

fun deleteDirectory(directory: File) {
    val result = directory.listFiles()?.forEach {
        if (it.isDirectory) {
            deleteDirectory(it)
        } else
            it.delete()
    }
}

fun splitVideo(videoPath: String, executor: ExecutorService, project: String) {

    try {
        val grabber = FFmpegFrameGrabber(videoPath)
        grabber.start()

        val totalDuration = grabber.lengthInFrames;
        val segmentDuration = totalDuration / TOTAL_SEGMENTS

        for (i in 0 until TOTAL_SEGMENTS) {
            val startFrame = i * segmentDuration
            var endFrame = (i + 1) * segmentDuration

            if (i == TOTAL_SEGMENTS - 1) {
                endFrame = totalDuration
            }

            executor.submit {
                try {
                    processSegment(videoPath, i, startFrame, endFrame, project)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
        grabber.stop()
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun processSegment(videoPath: String, segment: Int, startTime: Int, endTime: Int, project: String) {
    var counter = 0
    try {
        val grabber = FFmpegFrameGrabber(videoPath)
        grabber.start()

        grabber.frameRate = 1.0;

        for (i in startTime until endTime) {
            grabber.setVideoFrameNumber(i)
            val frame = grabber.grabFrame()
            val converter = OpenCVFrameConverter.ToMat()

            if (frame != null) {
                try {

                    val mat : Mat = converter.convert(frame)
                    imwrite("/app/data/projects/$project/frames/frame$i.jpg", mat)
                    println("Saved Frame$i.jpg")
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            } else {
                println("Skipped Frame $i")
            }
            frame.close()
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun blendImages(project: String, framesToUse : String = "") {

    val fileCount = File("/app/data/projects/$project/frames").listFiles()?.size
    var framesToUse = framesToUse.split(",").toMutableList()

    var image = imread("/app/data/projects/$project/frames/frame${framesToUse[0]}.jpg")

    framesToUse.removeFirst()
    if(framesToUse.isNotEmpty()){
        framesToUse.removeLast()
    }

    // Check if images are loaded properly
    if (image.empty()) {
        println("Error: Could not load images.")
        return
    }


    // Create a destination matrix
    val blendedImage = Mat()

    // Blend images with a given weight (alpha and beta)
    var alpha = 1 - 0.05// Weight for the first image
    var beta = 1 - alpha // Weight for the second image
    var gamma = 0.0 // Scalar added to each sum
    addWeighted(image, alpha, image, beta, gamma, blendedImage)

    framesToUse.forEach{
        image = imread("/app/data/projects/$project/frames/frame$it.jpg")
        if(!image.empty()){
            addWeighted(blendedImage, alpha, image, beta, gamma, blendedImage)
            println("image $it blended")
        }
    }
    alpha = 1 - 0.3
    beta = 1 - alpha
    addWeighted(blendedImage, alpha, image, beta, gamma, blendedImage)

    // Save the result
    imwrite("/app/data/projects/$project/blendedImage.jpg", blendedImage)
}

