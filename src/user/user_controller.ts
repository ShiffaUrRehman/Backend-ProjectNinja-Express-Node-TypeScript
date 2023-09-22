import { Router, Request, Response, NextFunction,} from 'express';
// import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller_interface';
// import authMiddleware from '../middleware/auth.middleware';
// import postModel from '../post/post.model';
import userModel from './user_model';
import { User } from './user_interface';
// import UserNotFoundException from '../exceptions/UserNotFoundException';

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private user = userModel

    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.post(`${this.path}`,this.createUser)
        this.router.get(`${this.path}`,this.getAllUsers)
        this.router.get(`${this.path}/:id`,this.getUser)
    }

    // @desc    Create a user
    // @route   POST /api/user
    // Public Endpoint
    private  createUser = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const userNew = new this.user({
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
              });
            const result = await userNew.save();
            res.status(201).send(result);
          } catch (err:any) { // will this stay any?
            res.status(500).send({ message: err.message });
          }
    }

    // @desc    Get all users
    // @route   GET /api/user
    // Public Endpoint
    private  getAllUsers = async (req: Request, res: Response) =>{
        try {
            const users: User[] = await this.user.find();
            res.status(200).send(users);
          } catch (err:any) {
            res.status(500).send({ message: err.message });
          }
    }

    // @desc    Get all users
    // @route   GET /api/user/id
    // Public Endpoint
    private  getUser =  async(req: Request, res: Response)=>{
        try {
            const user: User = await this.user.findById(req.params.id);
            res.status(200).send(user);
          } catch (err:any) {
            res.status(500).send({ message: err.message });
          }
    }

}

export default UserController;