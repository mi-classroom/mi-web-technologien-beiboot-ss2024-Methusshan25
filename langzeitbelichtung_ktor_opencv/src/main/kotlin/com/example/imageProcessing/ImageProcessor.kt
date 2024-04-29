package com.example.imageProcessing

import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.videoio.VideoCapture;
import org.opencv.core.Core
import org.opencv.videoio.Videoio
import java.io.File



fun deleteDirectory(directory: File) {
    val result = directory.listFiles()?.forEach {
        if (it.isDirectory) {
            deleteDirectory(it)
        }
        else
            it.delete()
    }
}

fun frameSplit(videoPath : String) : Int{

    System.loadLibrary(Core.NATIVE_LIBRARY_NAME)
    val directoryPath = "output"

    val directory = File(directoryPath)

    deleteDirectory(directory)

    val videoCapture = VideoCapture(videoPath)

    if(!videoCapture.isOpened){
        println("Error: Unable to open the video file");
        return -1
    }

    var frameCounter = 0
    var imageCounter = 0;
    val fps = videoCapture.get(Videoio.CAP_PROP_FPS)
    val totalFrameNumber = videoCapture.get(Videoio.CAP_PROP_FRAME_COUNT)
    val duration = totalFrameNumber / fps;
    val frame = Mat()
    println(duration)

    while(videoCapture.read((frame))){


        if(frameCounter % fps.toInt() / 8  == 0){
            val outputPath = "output/frame$imageCounter.jpg"
            Imgcodecs.imwrite(outputPath, frame)
            imageCounter++;
            println("Frame written to $outputPath")
        }

        frameCounter++;
    }
    videoCapture.release()

    return imageCounter
}

fun blendImages(pCount : Int){
    var images = mutableListOf<Mat>()

    for(i in 0 until pCount){
        val image : Mat = Imgcodecs.imread("output/frame$i.jpg")
        images.add(image)
    }

    val alpha = 1 - 0.1
    val beta = 1 - alpha
    val blendedImage = images[0]
    for(i in 1 until images.size - 1 ){
        Core.addWeighted(blendedImage, alpha, images[i], beta, 0.0, blendedImage)
    }

    // Save blended image
    Imgcodecs.imwrite("output/blendedImage.jpg", blendedImage)
}

