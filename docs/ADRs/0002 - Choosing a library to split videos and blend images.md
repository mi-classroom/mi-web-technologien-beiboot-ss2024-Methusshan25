# 0002 - Choosing a library to split videos and blend images

Besitzer/-in: Methusshan Elankumaran

- Status: accepted
- Workload: 2h
- Decider: Methusshan Elankumaran
- Technical Story: [Issue](https://github.com/mi-classroom/mi-master-wt-beiboot-2024/issues/1)
- Date 2024-04-29

# Context and Problem Statement

A library had to be chosen to split the videos and blend images together.

# Decision Drivers

- Java/Kotlin support
- Speed

# Considered Options

- OpenCV
- FFMPEG / JavaCV

# Decision Outcome

To split the images, native FFMPEG was used, because it delivers the best performance in Kotlin. To blend the images, native OpenGL for Kotlin is used because it includes a lot of image editing functions. This makes expanding the application easy. 

# Pros and Cons of the Options

## OpenCV

- Good, because it’s opensource
- Good, because of large number of filters
- Good, because of good documentation
- Bad, because of low speed dealing with large numbers
- Bad, because of steep learning curve

## FFMPEG

- Good, because of high performance
- Good, because of cross plattform support
- Good, because of wide range of features
- Good, because of large community
- Bad, because of command-line interface
- Bad, because of need of a wrapper
- Bad, because of steep learning curve.