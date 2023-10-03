import { Router, Request, Response, NextFunction,} from 'express';
import { createUserSchema,validateBody } from '../middleware/validateBody';
import Controller from '../interface/controller_interface';
import userModel from './user_model';
import { User } from './user_interface';
import { authorizeAdmin, authorizeProjectManager, authorizeUser } from '../middleware/authorization';


class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private user = userModel

    constructor(){
        this.initializeRoutes()
        this.router.use(authorizeUser);
    }

    private initializeRoutes(){
        this.router.post(`${this.path}`, authorizeAdmin, validateBody(createUserSchema), this.createUser)
        this.router.get(`${this.path}`, authorizeAdmin, this.getAllUsers)
        this.router.get(`${this.path}/getOne/:id`, authorizeAdmin, this.getUser)
        this.router.delete(`${this.path}/delete/:id`, authorizeAdmin, this.deleteUser)
        this.router.get(`${this.path}/get/teamLeads`, this.getTeamLeads) // comment: Who would be able to access this?
        this.router.get(`${this.path}/get/teamMembers`, this.getTeamMembers) // comment: Who would be able to access this?
        
    }

    // @desc    Create a user
    // @route   POST /api/users
    // Private Endpoint
    private createUser = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const userNew = new this.user({
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
              });
            const result = await userNew.save();
            return res.status(201).send(result);
          } catch (err:any) { // will this stay any?
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Get all users
    // @route   GET /api/users
    // Private Endpoint
    private getAllUsers = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const users: User[] = await this.user.find();
            if(!users) {return res.status(404).send({message: "Error fetching Users"});}
            return res.status(200).send(users);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Get single user
    // @route   GET /api/users/getOne/:id
    // Private Endpoint
    private getUser =  async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const user: User = await this.user.findById(req.params.id);
            if(!user) {return res.status(404).send({message: "Error fetching User"});}
            return res.status(200).send(user);
          } catch (err:any) {
            return res.status(500).send({ message: err.message });
          }
    }

    // @desc    Delete all users
    // @route   DELETE /api/users/delete/:id
    // Private Endpoint
    private deleteUser =  async(req: Request, res: Response, next: NextFunction)=>{
      try {
          const user: User = await this.user.findByIdAndDelete(req.params.id);
          if(!user) {return res.status(404).send({message: "Error while deleting User"});}
          return res.status(200).send(user);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

    // @desc    Get all Team Leads
    // @route   GET /api/users/get/teamLeads
    // Private Endpoint
    private getTeamLeads = async (req: Request, res: Response, next: NextFunction) =>{
      try {
          const users: User[] = await this.user.find({role:"Team Lead"});
          if(!users) {return res.status(404).send({message: "Error fetching Team Leads"});}
          return res.status(200).send(users);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

  // @desc    Get all Team Members
    // @route   GET /api/user/get/teamMembers
    // Private Endpoint
    private getTeamMembers = async (req: Request, res: Response, next: NextFunction) =>{
      try {
          const users: User[] = await this.user.find({role:"Team Member"});
          if(!users) {return res.status(404).send({message: "Error fetching Team Leads"});}
          return res.status(200).send(users);
        } catch (err:any) {
          return res.status(500).send({ message: err.message });
        }
  }

}

export default UserController;