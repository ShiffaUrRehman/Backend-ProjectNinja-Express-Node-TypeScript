import * as yup from "yup";
import { NextFunction, Response, Request } from "express";


export const createUserSchema = yup.object({
    fullname: yup.string().required().max(1024),
    username: yup.string().required().max(1024),
    password: yup.string().required().min(8),
    role: yup.string().required()
    .oneOf(["Project Manager", "Team Lead", "Team Member"]),
});

export const loginUserSchema = yup.object({
  username: yup.string().required().max(1024),
  password: yup.string().required().min(8),
});

export const createProjectSchema = yup.object({
  name: yup.string().required().max(1024),
  description: yup.string().notRequired().min(255),
  projectManager: yup.string().required().max(1024),
});

export const updateProjectStatusSchema = yup.object({
    status: yup.string().required()
    .oneOf(["Onboarding", "In Progress", "Complete"]),
  });

export const addTeamLeadProjectSchema = yup.object({
    teamLead: yup.string().required().max(1024),
  });

  export const addOrRemoveTeamMemberProjectSchema = yup.object({
    teamMember: yup.string().required().max(1024),
  });

  export const createTaskSchema = yup.object({
    description: yup.string().required().max(1024),
    assignedTo: yup.string().required().max(1024),
    projectId: yup.string().required().max(1024),
  });



export const validateBody = (schema: (typeof createUserSchema) | (typeof loginUserSchema) | (typeof createProjectSchema)|(typeof updateProjectStatusSchema)|(typeof addTeamLeadProjectSchema)|(typeof addOrRemoveTeamMemberProjectSchema)|(typeof createTaskSchema)) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { strict: true });
    return next();
  } catch (err: any) {
    return res.status(400).send({ type: err.name, message: err.message });
  }
};
