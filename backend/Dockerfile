# Phase 1: Build stage with JDK 21 and Gradle
FROM gradle:8-jdk21 AS build

# Set the working directory inside the container
WORKDIR /home/gradle/src

# Copy all project files to the container
COPY . .

# Build the Fat Jar
RUN ./gradlew buildFatJar

# Phase 2: Runtime stage with JDK 21 and FFmpeg
FROM openjdk:21-jdk-slim

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set the port number the container should expose
EXPOSE 8080

# Create a directory for the app
RUN mkdir /app

# Copy the Fat Jar from the build stage
COPY --from=build /home/gradle/src/build/libs/*.jar /app/app.jar

# Set the entry point to run the app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
