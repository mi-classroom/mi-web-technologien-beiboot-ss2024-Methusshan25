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

    async function loadProjects(){
        const data = await fetchProjects();
        setProjects(data);
    }

    async function useRemoveProject(projectName : string){
        await removeProject(projectName);
        await loadProjects();
    }

    async function useAddProject(newProjectName: string){
        await addProject(newProjectName);
        await loadProjects();
    }

    return {projects, useRemoveProject, useAddProject}
}