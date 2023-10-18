import { Router, Request, Response, NextFunction,} from 'express';
import Controller from '../interface/controller_interface';
import taskModel from './task_model';
import { createTaskSchema, changeStatusTask ,validateBody, addOrRemoveMemberTask } from '../middleware/validateBody';
import { Task } from './task_interface';
import { authorizeTeamLead, authorizeUser } from '../middleware/authorization';

class TaskController implements Controller {
    
    path: string = "/task";
    router: Router = Router();
    private task = taskModel;

    constructor(){
        this.initialiseRoutes()
        this.router.use(authorizeUser);
    }

    private initialiseRoutes(){
        // Add Middlewares
        this.router.post(`${this.path}`, authorizeTeamLead, validateBody(createTaskSchema), this.createTask)
        this.router.get(`${this.path}/getAll/:projectId`, this.getTasks)
        this.router.delete(`${this.path}/delete/:taskId`, authorizeTeamLead, this.deleteTask)
        this.router.put(`${this.path}/addMember/:taskId`, authorizeTeamLead, validateBody(addOrRemoveMemberTask), this.addMemberToTask)
        this.router.put(`${this.path}/removeMember/:taskId`, authorizeTeamLead, validateBody(addOrRemoveMemberTask), this.removeMemberFromTask)
        this.router.put(`${this.path}/status/:taskId`, validateBody(changeStatusTask), this.changeStatusTask)
        this.router.get(`${this.path}/get/:taskId`, this.getTask)
        
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

    // @desc    Get Tasks of Project
    // @route   Get /api/task/getAll/:projectId
    // Private Endpoint
    private getTasks = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const tasks: Task[] = await this.task.find({projectId: req.params.projectId}).populate('assignedTo','fullname')
        if(!tasks) {return res.status(401).send({message: "Error while fetching tasks"});}
          return res.status(200).send(tasks);
        } catch (err:any) { // comment: will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get Tasks of Project
    // @route   DELETE /api/task/delete/:taskId
    // Private Endpoint
    private deleteTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow: Task= await this.task.findOneAndDelete({_id:req.params.taskId})
        if(!taskNow) {return res.status(401).send({message: "Error while deleting tasks"});}
          return res.status(200).send(taskNow);
        } catch (err:any) { // comment: will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }
    // @desc    Add Member to Task
    // @route   PUT /api/task/addMember/:taskId
    // Private Endpoint
    private addMemberToTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow = await this.task.findById(req.params.taskId)
        if(!taskNow){return res.status(404).send({message: "Task not found"});}
        const index = taskNow.assignedTo.indexOf(req.body.member);
            if (index !== -1) {
               return res.status(401).send({message: "Member already added to Task"});
            }
          const result = await this.task.updateOne({_id:req.params.taskId}, {$push:{"assignedTo":req.body.member}})
          if(!result) {return res.status(401).send({message: "Error while saving task"});}
          return res.status(201).send(result);
        } catch (err:any) { // comment: will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Remove Member from Task
    // @route   PUT /api/task/removeMember/:taskId
    // Private Endpoint
    private removeMemberFromTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow = await this.task.findById(req.params.taskId)
        if(!taskNow){return res.status(404).send({message: "Task not found"});}
        const index = taskNow.assignedTo.indexOf(req.body.member);
            if (index === -1) {
               return res.status(401).send({message: "Member not found"});
            }
            const result = await this.task.updateOne({_id:req.params.taskId},{$pull:{"assignedTo":req.body.member}})
          if(!result) {return res.status(401).send({message: "Error while saving task"});}
          return res.status(201).send(result);
        } catch (err:any) { // comment: will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Change Status of Task
    // @route   PUT /api/task/status/:taskId
    // Private Endpoint
    private changeStatusTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const taskNow = await this.task.findById(req.params.taskId)
        if(!taskNow){return res.status(404).send({message: "Task not found"});}
        taskNow.status = req.body.status;
        const result = await taskNow.save();
          if(!result) {return res.status(401).send({message: "Error while saving task"});}
          return res.status(201).send(result);
        } catch (err:any) { // comment: will this stay any?
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get a single Task of Project
    // @route   Get /api/task/get/:taskId
    // Private Endpoint
    private getTask = async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const task: Task = await this.task.findById(req.params.taskId).populate('assignedTo','fullname')
        if(!task) {return res.status(401).send({message: "Error while fetching task"});}
          return res.status(200).send(task);
        } catch (err:any) { 
          return res.status(500).send({ message: err.message });
        }
  }

}

export default TaskController