[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/gQyBcnrC)
# Web Technologies // Project 2024
This is the accompanying project for the module Web Technologies. We will successively develop a project from issue to issue, look at the progress and do code reviews as well as present and discuss development steps.

We will use GitHub Classroom as the organizational framework for the project. In terms of content, we are looking at developing a small web service for recreating longterm exposures out out videofiles. A video will be split into single frames and blended together to create the effect. The focus lies on exploring new technologies and using them in a practical project. 

## Team:
Author: Methusshan Elankumaran
Reviewer: Dennis Wäckerle

## Quickstart:
1. Clone the repository
2. Run the application with `docker compose up -d`
  - Backend runs under URL: http://localhost:8080
  - Frontend runs under URL: http://localhost:5173
3. Shutdown application with `docker compose down`

## Run locally:

### Backend

[JDK21](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) required to run backend locally

Go into the `\backend`-folder and enter following command:

`./gradlew run`  

### Frontend

To run the frontend the [node version >= 20.11](https://nodejs.org/en/download/package-manager) is required

Go into the `\frontend`-folder and enter following commands:

First `npm install` and then `npm run dev`

## Deployments:
Application runs on: https://les-frontend.onrender.com/
