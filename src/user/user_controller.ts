import { Router, Request, Response, NextFunction,} from 'express';
import { createUserSchema,validateBody } from '../middleware/validateBody';
// import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interface/controller_interface';
// import authMiddleware from '../middleware/auth.middleware';
// import postModel from '../post/post.model';
import userModel from './user_model';
import { User } from './user_interface';
import { authorizeAdmin, authorizeUser } from '../middleware/authorization';
// import UserNotFoundException from '../exceptions/UserNotFoundException';

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private user = userModel

    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
      // Add Middlewares
        this.router.post(`${this.path}`, authorizeUser, authorizeAdmin, validateBody(createUserSchema), this.createUser)
        this.router.get(`${this.path}`, authorizeUser, authorizeAdmin, this.getAllUsers)
        this.router.get(`${this.path}/get/:id`, authorizeUser, authorizeAdmin, this.getUser)
        this.router.delete(`${this.path}/delete/:id`, authorizeUser, authorizeAdmin, this.deleteUser)
    }

    // @desc    Create a user
    // @route   POST /api/user
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
    // @route   GET /api/user
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
    // @route   GET /api/user/get/:id
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
    // @route   DELETE /api/user/delete/id
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

}

export default UserController;