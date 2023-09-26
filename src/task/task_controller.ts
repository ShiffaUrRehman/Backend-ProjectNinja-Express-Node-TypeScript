import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import taskModel from './task_model';
import { createTaskSchema, changeStatusTask ,validateBody } from '../middleware/validateBody';
import { Task } from './task_interface';

class TaskController implements Controller {
    
    path: string = "/task";
    router: Router = Router();
    private task = taskModel;

    constructor(){
        this.initialiseRoutes()
    }

    private initialiseRoutes(){
        // Add Middlewares
        this.router.post(`${this.path}`, validateBody(createTaskSchema), this.createTask)
        this.router.get(`${this.path}/getAll/:id`, this.getTasks)
        this.router.put(`${this.path}/add`, this.AddMemberToTask)
        this.router.put(`${this.path}/remove`, this.RemoveMemberFromTask)
        this.router.put(`${this.path}/status`,validateBody(changeStatusTask), this.changeStatusTask)
        
    }

    // @desc    Get Tasks of Project
    // @route   Get /api/task/getAll/:id
    // Private Endpoint
    private getTasks = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const tasks: Task[] = await this.task.find({projectId: req.params.id})
        if(!tasks) {return res.status(401).send({message: "Error while fetching tasks"});}
          return res.status(200).send(tasks);
        } catch (err:any) { // will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Create a Task
    // @route   POST /api/task
    // Private Endpoint
    private createTask = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const taskNew = new this.task({
                description: req.body.description,
                assignedTo: req.body.assignedTo, 
                projectId: req.body.projectId,           
              });
            const result = await taskNew.save();
            if(!result) {return res.status(401).send({message: "Error while saving task"});}
            return res.status(201).send(result);
          } catch (err:any) { // will this stay any?
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Add Member to Task
    // @route   PUT /api/task/remove
    // Private Endpoint
    private AddMemberToTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow = await this.task.findById(req.body.taskId)
        if(!taskNow){return res.status(404).send({message: "Task not found"});}
        const index = taskNow.assignedTo.indexOf(req.body.member);
            if (index !== -1) {
               return res.status(401).send({message: "Member already added to Task"});
            }
          taskNow.assignedTo.push(req.body.member);
          const result = await taskNow.save();
          if(!result) {return res.status(401).send({message: "Error while saving task"});}
          return res.status(201).send(result);
        } catch (err:any) { // will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

  // @desc    Remove Member from Task
    // @route   PUT /api/task/remove
    // Private Endpoint
    private RemoveMemberFromTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow = await this.task.findById(req.body.taskId)
        if(!taskNow){return res.status(404).send({message: "Task not found"});}
        const index = taskNow.assignedTo.indexOf(req.body.member);
            if (index === -1) {
               return res.status(401).send({message: "Member not found"});
            }
            taskNow.assignedTo.splice(index, 1);
            const result = await taskNow.save();
          if(!result) {return res.status(401).send({message: "Error while saving task"});}
          return res.status(201).send(result);
        } catch (err:any) { // will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

  // @desc    Change Status of Task
    // @route   PUT /api/task/status
    // Private Endpoint
    private changeStatusTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow = await this.task.findById(req.body.taskId)
        if(!taskNow){return res.status(404).send({message: "Task not found"});}
        taskNow.status = req.body.status;
        const result = await taskNow.save();
          if(!result) {return res.status(401).send({message: "Error while saving task"});}
          return res.status(201).send(result);
        } catch (err:any) { // will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

}

export default TaskController