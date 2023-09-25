import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import projectModel from './project_model';
import { Project } from './project_interface';

class ProjectController implements Controller{
    
    path: string = '/project';
    router: Router = Router();
    private project = projectModel;

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(){
        // Add Middlewares
          this.router.post(`${this.path}`,this.createProject)
          this.router.get(`${this.path}`,this.getAllProjects)
        //   this.router.get(`${this.path}/:id`,this.getUser)
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
            return res.status(200).send(projects);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }
}

export default ProjectController;