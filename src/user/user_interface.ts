import { ObjectId } from "mongoose";

export enum Role { A = "Admin", PM = "Project Manager", TL = "Team Lead", TM = "Team Member" }

export interface User {
    _id: ObjectId,
    fullname: string,
    username: string,
    password: string,
    role: Role,
}

