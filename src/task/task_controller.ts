import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import taskModel from './task_model';
import projectModel from '../project/project_model';
import { createTaskSchema ,validateBody } from 'middleware/validateBody';

class TaskController implements Controller {
    
    path: string = "/task";
    router: Router = Router();
    private task = taskModel;
    private project = projectModel;

    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes(){
        // Add Middlewares
        this.router.post(`${this.path}`, validateBody(createTaskSchema), this.createTask)
        
    }

    // @desc    Create a Task
    // @route   POST /api/task
    // Private Endpoint
    private createTask = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const taskNew = new this.task({
                description: req.body.description,
                assignedTo: req.body.assignedTo,                
              });
            const result = await taskNew.save();
            if(!result) {return res.status(401).send({message: "Error while saving task"});}
            const projectNow = await this.project.findById(req.body.projectId);
            projectNow.task.push(result._id);
            const result2 = await projectNow.save();
            if(!result2) {return res.status(401).send({message: "Error while saving id to task array"});}
            return res.status(201).send(result);
          } catch (err:any) { // will this stay any?
            return res.status(500).send({ message: err.message });
          }
    }

}

export default TaskController