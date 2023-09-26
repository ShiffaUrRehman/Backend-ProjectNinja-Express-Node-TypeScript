import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import projectModel from './project_model';
import { Project } from './project_interface';
import { createProjectSchema, updateProjectStatusSchema, addTeamLeadProjectSchema, addOrRemoveTeamMemberProjectSchema ,validateBody } from '../middleware/validateBody';

class ProjectController implements Controller{
    
    path: string = '/project';
    router: Router = Router();
    private project = projectModel;

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(){
        // Add Middlewares
          this.router.post(`${this.path}`, validateBody(createProjectSchema) ,this.createProject)
          this.router.get(`${this.path}`, this.getAllProjects)
          this.router.put(`${this.path}/status/:id`, validateBody(updateProjectStatusSchema) , this.updateProjectStatus)
          this.router.put(`${this.path}/teamLead/:id`, validateBody(addTeamLeadProjectSchema), this.addTeamLead)
          this.router.put(`${this.path}/teamMember/:id`, validateBody(addOrRemoveTeamMemberProjectSchema), this.addTeamMember)
          this.router.put(`${this.path}/teamMember/remove/:id`, validateBody(addOrRemoveTeamMemberProjectSchema), this.removeTeamMember)
          
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
          } catch (err:any) { // will this stay any?
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Get all projects
    // @route   GET /api/project
    // Private Endpoint
    private getAllProjects = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const projects: Project[] = await this.project.find().populate("projectManager", "fullname").populate("teamLead", "fullname").populate("teamMember", "fullname");
            if(!projects) {return res.status(404).send({message: "Error fetching Projects"});}
            return res.status(200).send(projects);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Change Status of Project
    // @route   PUT /api/project/status/:id
    // Private Endpoint
    private updateProjectStatus = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const project = await this.project.findById(req.params.id);
            if(!project) {return res.status(404).send({message: "Project not found"});}
            project.status = req.body.status;
            const result = await project.save();
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Add/Replace Team Lead to Project
    // @route   PUT /api/project/teamLead/:id
    // Private Endpoint
    private addTeamLead = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            // validate whether the teamLead id being passed is a team lead or not
            const project = await this.project.findById(req.params.id);
            if(!project) {return res.status(404).send({message: "Project not found"});}
            project.teamLead = req.body.teamLead;
            const result = await project.save();
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Add Team Member to Project
    // @route   PUT /api/project/teamMember/:id
    // Private Endpoint
    private addTeamMember = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            // validate whether the teamMember id being passed is a team member or not
            const project = await this.project.findById(req.params.id);
            if(!project) {return res.status(404).send({message: "Project not found"});}
            project.teamMember.push(req.body.teamMember);
            const result = await project.save();
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Remove Team Member from Project
    // @route   PUT /api/project/teamMember/remove/:id
    // Private Endpoint
    private removeTeamMember = async (req: Request, res: Response, next: NextFunction) =>{
        try 
        {
            // validate whether the teamMember id being passed is a team member or not
            const project = await this.project.findById(req.params.id);
            if(!project) {return res.status(404).send({message: "Project not found"});}
            const members = project.teamMember; // remove
            console.log(members);
            const index = members.indexOf(req.body.teamMember);
            if (index === -1) {
               return res.status(404).send({message: "Member not found"});
            }
            else {
            project.teamMember.splice(index, 1);
            const result = await project.save();
            if(!result) {return res.status(400).send({message: "Error while saving document"});}
            return res.status(200).send(result);
        }
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }
}

export default ProjectController;