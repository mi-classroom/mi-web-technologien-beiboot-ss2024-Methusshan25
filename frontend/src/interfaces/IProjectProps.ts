import { IProject } from "./IProject";

export interface IProjectProps{
    projects : IProject[],
    useRemoveProject : (projectName : string) => void
    useAddProject : (newProjectName : string) => void
}