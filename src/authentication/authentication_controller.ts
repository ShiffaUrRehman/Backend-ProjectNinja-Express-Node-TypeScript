import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import Controller from '../interfaces/controller_interface';
import userModel from './../user/user_model';



class AuthenticationController implements Controller{
    public path: string = '/auth';
    public router = Router();
    private User = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/login`, this.login)
    }

    // @desc    Login a User
    // @route   POST /api/auth/login
    // Public Endpoint
    private login = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const user = await this.User.findOne({ username: req.body.username });
            if (!user) return res.status(404).send({ message: "User not found" });
            else {
              const isValid = await bcrypt.compare(req.body.password, user.password);
              if (!isValid) {
                return res.status(404).send({ message: "Provided password is incorrect" });
              } else {
                const obj = { id: user._id };
                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn: "1d",
                });
                res.status(200).send({ user, token: token });
              }
            }
          } catch (err: any) {
            res.status(500).send({ message: err.message });
          }
    }
}

export default AuthenticationController;