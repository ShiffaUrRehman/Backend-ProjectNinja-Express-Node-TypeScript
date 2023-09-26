import { ObjectId } from "mongoose";

export enum ProjectStatus { OB = "Onboarding", IP = "In Progress", C = "Complete" }

export interface Project {
    _id: ObjectId,
    name: string,
    description: string,
    status: ProjectStatus,
    projectManager: ObjectId,
    teamLead:ObjectId,
    teamMember: ObjectId[],
}

