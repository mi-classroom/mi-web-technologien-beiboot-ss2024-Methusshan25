import { useEffect, useState } from "react";
import { fetchProjects, removeProject, addProject } from "../models/ProjectModel";
import { IProject } from "../interfaces/IProject";

interface ProjectViewModel {
    projects: IProject[];
    useRemoveProject : (projectName : string) => void;
    useAddProject: (newProjectName: string) => void;
}

export function useProjectViewModel() : ProjectViewModel {
    const [projects, setProjects] = useState<IProject[]>([]);

    useEffect(() => {
        loadProjects();
    }, []);

    /**
     * Makes an request to the API to send all projects and saves them 
     * into projects variable 
    */
    async function loadProjects(){
        const data = await fetchProjects();
        setProjects(data);
    }

    /**
     * Makes an request to delete the given project
     * @param projectName Refers to the project which has to be removed
    */
    async function useRemoveProject(projectName : string){
        await removeProject(projectName);
        await loadProjects();
    }

    /**
     * Makes an request to create a project and updates the projects list
     * @param newProjectName Name of the new project
    */
    async function useAddProject(newProjectName: string){
        await addProject(newProjectName);
        await loadProjects();
    }

    return {projects, useRemoveProject, useAddProject}
}