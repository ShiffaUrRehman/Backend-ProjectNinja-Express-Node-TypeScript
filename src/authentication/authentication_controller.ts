import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import Controller from '../interface/controller_interface';
import userModel from './../user/user_model';
import { User } from 'user/user_interface';
import TokenData from '../interface/tokenData_interface';
import DataStoredInToken from '../interface/dataStoredInToken';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import { loginUserSchema, validateBody } from '../middleware/validateBody';


class AuthenticationController implements Controller{
    public path: string = '/auth';
    public router = Router();
    private User = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/login`, validateBody(loginUserSchema) , this.login)
    }

    // @desc    Login a User
    // @route   POST /api/auth/login
    // Public Endpoint
    private login = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const user = await this.User.findOne({ username: req.body.username });
            if (!user) {
              next(new WrongCredentialsException());
            }
            else {
              const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
              if (!isPasswordCorrect) {
                next(new WrongCredentialsException());
              } else {
                const token = this.createToken(user)
                res.status(200).send({ user, token });
              }
            }
          } catch (err: any) {
            res.status(500).send({ message: err.message });
          }
    }

    private createToken(user: User): TokenData {
      const expiresIn = "1d"
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const dataStoredInToken: DataStoredInToken = {
        _id: user._id,
      };
      return {
        expiresIn,
        token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
      };
    }
}

export default AuthenticationController;