@file:OptIn(DelicateCoroutinesApi::class)

package com.example.imageProcessing

import kotlinx.coroutines.*
import org.bytedeco.opencv.opencv_core.Mat;
import org.opencv.core.Core
import java.io.File
import org.bytedeco.javacv.*
import org.opencv.core.CvType
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite;
import org.opencv.imgcodecs.Imgcodecs
import java.awt.image.DataBufferByte
import java.util.concurrent.ExecutorService

import javax.imageio.ImageIO

val TOTAL_SEGMENTS = 5

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

        for (i in startTime until endTime) {
            grabber.setVideoFrameNumber(i)
            val frame = grabber.grabFrame()
            val converter = OpenCVFrameConverter.ToMat()

            if (frame != null) {
                try {

                    val mat : Mat = converter.convert(frame)
                    imwrite("projects/$project/frames/frame$i.jpg", mat)
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
    System.loadLibrary(Core.NATIVE_LIBRARY_NAME)
    val fileCount = File("projects/$project/frames").listFiles()?.size

    var image = ImageIO.read(File("projects/$project/frames/frame0.jpg"))
    var mat = org.opencv.core.Mat(image.height, image.width, CvType.CV_8UC3)
    mat.put(0, 0, (image.raster.dataBuffer as DataBufferByte).data)

    var framesToUseList = framesToUse.split(",")

    var alpha = 1 - 0.05
    var beta = 1 - alpha
    val blendedImage = mat

    for (i in 1 until fileCount!!) {
        if(framesToUseList.contains("$i")){
            image = ImageIO.read(File("projects/$project/frames/frame$i.jpg"))
            mat = org.opencv.core.Mat(image.height, image.width, CvType.CV_8UC3)
            mat.put(0, 0, (image.raster.dataBuffer as DataBufferByte).data)
            if(!mat.empty()){
                Core.addWeighted(blendedImage, alpha, mat, beta, 0.0, blendedImage)
                println("image $i blended")
            }
        }
        else{
            println("Skipped Frame $i")
        }
    }

    alpha = 1 - 0.3
    beta = 1 - alpha
    Core.addWeighted(blendedImage, alpha, mat, beta, 0.0, blendedImage)
    // Save blended image
    Imgcodecs.imwrite("projects/$project/blendedImage.jpg", blendedImage)
}

