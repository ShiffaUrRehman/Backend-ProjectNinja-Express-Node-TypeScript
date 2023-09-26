import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import { Task } from './task_interface';
import taskModel from './task_model';

class TaskController implements Controller {
    
    path: string = "/task";
    router: Router = Router();
    private task = taskModel;

    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes(){
        // Add Middlewares
        this.router.post(`${this.path}`,this.createTask)
        
    }

    // @desc    Create a Task
    // @route   POST /api/task
    // Private Endpoint
    private createTask = async (req: Request, res: Response, next: NextFunction)=>{
        // try {
        //     // Do I update the Project document over here?
        //     const taskNew = new this.task({
        //         description: req.body.description,
        //         assignedTo: req.body.assignedTo,                
        //       });
        //     const result = await taskNew.save();
        //     return res.status(201).send(result);
        //   } catch (err:any) { // will this stay any?
        //     return res.status(500).send({ message: err.message });
        //   }
    }

}

export default TaskController