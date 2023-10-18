import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import projectModel from './project_model';
import { Project } from './project_interface';
import { createProjectSchema, updateProjectStatusSchema, addTeamLeadProjectSchema, addOrRemoveTeamMemberProjectSchema ,validateBody } from '../middleware/validateBody';
import { authorizeAdmin, authorizeProjectManager, authorizeTeamLead, authorizeUser } from '../middleware/authorization';
import { RequestWithUser } from 'interface/requestWithUser';

class ProjectController implements Controller{
    
    path: string = '/project';
    router: Router = Router();
    private project = projectModel;

    constructor() {
        this.initializeRoutes()
        this.router.use(authorizeUser);
    }

    private initializeRoutes(){
          this.router.post(`${this.path}`, authorizeAdmin, validateBody(createProjectSchema) ,this.createProject)
          this.router.delete(`${this.path}/delete/:projectId`, authorizeAdmin ,this.deleteProject)
          this.router.get(`${this.path}/get/admin`, authorizeAdmin, this.getAllProjects)
          this.router.get(`${this.path}/get/projectManager`, authorizeProjectManager, this.getProjectsProjectManager)
          this.router.get(`${this.path}/get/teamLead`, authorizeTeamLead, this.getProjectsTeamLead)
          this.router.get(`${this.path}/get/teamMember`, this.getProjectsTeamMembers)
          this.router.put(`${this.path}/add/teamLead/:projectId`, authorizeProjectManager, validateBody(addTeamLeadProjectSchema), this.addTeamLead)
          this.router.put(`${this.path}/teamMember/:projectId`, authorizeProjectManager, validateBody(addOrRemoveTeamMemberProjectSchema), this.addTeamMember)
          this.router.put(`${this.path}/teamMember/remove/:projectId`, authorizeProjectManager, validateBody(addOrRemoveTeamMemberProjectSchema), this.removeTeamMember)
          this.router.put(`${this.path}/status/:projectId`, authorizeProjectManager, validateBody(updateProjectStatusSchema) , this.updateProjectStatus)
          this.router.get(`${this.path}/members/:projectId` , this.getAllMembers)
          this.router.get(`${this.path}/get/project/:projectId`, this.getProject)
      }

    // @desc    Create a project
    // @route   POST /api/project
    // Private Endpoint
    private createProject = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const projectNew = new this.project({
                name: req.body.name,
                description: req.body.description,
                projectManager: req.body.projectManager,
              });
            const result = await projectNew.save();
            return res.status(201).send(result);
          } catch (err:any) { // comment: will this stay any?
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Delete a project
    // @route   DELETE /api/project/delete/:projectId
    // Private Endpoint
    private deleteProject = async (req: Request, res: Response, next: NextFunction)=>{
      
        try {
          const projectNow: Project = await this.project.findByIdAndDelete(req.params.projectId);
          if(!projectNow) {return res.status(404).send({message: "Error while deleting Project"});}
          return res.status(200).send(projectNow);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }  
  }

    // @desc    Get all projects for Admin
    // @route   GET /api/project/get/admin
    // Private Endpoint
    private getAllProjects = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const projects: Project[] = await this.project.find().populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname"); // comment: see if we need to populate all these or not
            if(!projects) {return res.status(404).send({message: "Error fetching Projects"});}
            return res.status(200).send(projects);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Get projects to which respective Project Manager is assigned
    // @route   GET /api/project/get/projectManager
    // Private Endpoint
    private getProjectsProjectManager = async (req: RequestWithUser, res: Response, next: NextFunction) =>{
      try {
          const projects: Project[] = await this.project.find({projectManager:req.user._id}).populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname"); // comment: see if we need to populate all these or not
          if(!projects) {return res.status(404).send({message: "Error fetching Projects"});}
          return res.status(200).send(projects);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get projects to which respective Team Lead is assigned
    // @route   GET /api/project/get/teamLead
    // Private Endpoint
    private getProjectsTeamLead = async (req: RequestWithUser, res: Response, next: NextFunction) =>{
      try {
          const projects: Project[] = await this.project.find({teamLead:req.user._id, status: "In Progress"}).populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname"); // comment: see if we need to populate all these or not
          if(!projects) {return res.status(404).send({message: "Error fetching Projects"});}
          return res.status(200).send(projects);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get projects to which respective Team Member is assigned
    // @route   GET /api/project/get/teamMember
    // Private Endpoint
    private getProjectsTeamMembers = async (req: RequestWithUser, res: Response, next: NextFunction) =>{
      try {
          const projects: Project[] = await this.project.find({teamMember:req.user._id, status: "In Progress"}).populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname"); // comment: see if we need to populate all these or not
          if(!projects) {return res.status(404).send({message: "Error fetching Projects"});}
          return res.status(200).send(projects);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Add/Replace Team Lead to Project
    // @route   PUT /api/project/add/teamLead/:projectId
    // Private Endpoint
    private addTeamLead = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const projectNow = await this.project.findById(req.params.projectId);
            if(!projectNow) {return res.status(404).send({message: "Project not found"});}
            projectNow.teamLead = req.body.teamLead;
            const result = await projectNow.save();
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
          } catch (err:any) { // comment: how to use custom error handler created by me
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Add Team Member to Project
    // @route   PUT /api/project/teamMember/:projectId
    // Private Endpoint
    private addTeamMember = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const projectNow = await this.project.findById(req.params.projectId);
            if(!projectNow) {return res.status(404).send({message: "Project not found"});}
            const index = projectNow.teamMember.indexOf(req.body.teamMember);
            if (index !== -1) {
               return res.status(401).send({message: "Member already added to Project"});
            }
            const result = await this.project.updateOne({_id:req.params.projectId}, {$push:{"teamMember":req.body.teamMember}})
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Remove Team Member from Project
    // @route   PUT /api/project/teamMember/remove/:projectId
    // Private Endpoint
    private removeTeamMember = async (req: Request, res: Response, next: NextFunction) =>{
        try 
        {
            const projectNow = await this.project.findById(req.params.projectId);
            if(!projectNow) {return res.status(404).send({message: "Project not found"});} 
            const index = projectNow.teamMember.indexOf(req.body.teamMember);
            if (index === -1) {
               return res.status(404).send({message: "Member not found"});
            }
            else {
            const result = await this.project.updateOne({_id:req.params.projectId},{$pull:{"teamMember":req.body.teamMember}})
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
        }
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Change Status of Project
    // @route   PUT /api/project/status/:projectId
    // Private Endpoint
    private updateProjectStatus = async (req: Request, res: Response, next: NextFunction) =>{
      try {
          const projectNow = await this.project.findById(req.params.projectId);
          if(!projectNow) {return res.status(404).send({message: "Project not found"});}
          projectNow.status = req.body.status;
          const result = await projectNow.save();
          if(!result) {return res.status(400).send({message: "Error while saving document"});}
          return res.status(200).send(result);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get All Members of Project
    // @route   GET /api/project/members/:projectId
    // Private Endpoint
    private getAllMembers = async (req: Request, res: Response, next: NextFunction) =>{
      try {
          const projectNow = await this.project.findById( req.params.projectId).populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname");;
          if(!projectNow) {return res.status(404).send({message: "Project not found"});}
          const members = projectNow.teamMember;
          members.push(projectNow.teamLead)
          members.push(projectNow.projectManager)
          return res.status(200).send(members);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get project by id
    // @route   GET /api/project/get/project/:projectId
    // Private Endpoint
    private getProject = async (req: Request, res: Response, next: NextFunction) =>{
      try {
          const project: Project = await this.project.findById(req.params.projectId).populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname"); // comment: see if we need to populate all these or not
          if(!project) {return res.status(404).send({message: "Error fetching Project"});}
          return res.status(200).send(project);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

}

export default ProjectController;