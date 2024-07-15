import { IProject } from "./IProject";

export interface IProjectProps{
    projects : IProject[],
    getProjects : () => void
}