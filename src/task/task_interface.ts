import { ObjectId } from "mongoose";

export enum TaskStatus { RT = "Ready to Start", IP = "In Progress", WR= "Waiting for Review", C = "Complete" }

export interface Task {
    _id: ObjectId,
    description: string,
    status: TaskStatus,
    assignedTo: ObjectId[],
}

