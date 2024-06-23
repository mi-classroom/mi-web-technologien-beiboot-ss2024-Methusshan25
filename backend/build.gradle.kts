import io.ktor.plugin.features.*
import org.jetbrains.kotlin.gradle.plugin.mpp.pm20.util.archivesName

val ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    kotlin("jvm") version "1.9.23"
    id("io.ktor.plugin") version "2.3.11"
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.23"
}

group = "com.example"
version = "0.0.1"

application {
    mainClass.set("com.example.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("org.openpnp:opencv:4.9.0-0")
    implementation("org.bytedeco:javacv-platform:1.5.5")
    implementation("io.ktor:ktor-server-cors:2.0.0")
    testImplementation("io.ktor:ktor-server-tests-jvm")
    implementation("io.ktor:ktor-server-websockets:$ktor_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

tasks.withType<JavaExec> {
    // Replace "/path/to/opencv/library" with the actual path to the OpenCV native library
    systemProperty("java.library.path", "C:\\Users\\elank\\OneDrive\\Dokumente\\Studium\\MI_Master\\Web Technologien\\opencv\\build\\java")
}

ktor {
    fatJar {
        archiveFileName.set("fat.jar")
    }
}



