import { NextFunction, Request, Response } from 'express';
import * as jwt from "jsonwebtoken"
import userModel from '../user/user_model';
import { RequestWithUser } from '../interface/requestWithUser';

export const authorizeUser = async (req: RequestWithUser, res: Response, next:NextFunction) => {
    try {
      // We get token from header
      const authHeader = req.headers["authorization"];
      if (!authHeader)
        return res.status(404).send({ message: "Token not found in Header" });
  
      const token = authHeader.split(" ")[1];
      if (!token)
        return res.status(401).send({ message: "Token not found in Header" });
      // We verify the token
      const result = process.env.ACCESS_TOKEN_SECRET && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ) as jwt.JwtPayload;
      if (!result) return res.status(403).send({ message: "Token not verified" });
      // We get the user id from token and fetch the user
      
      const user = await userModel.findById(result?._id);
      // We set the user obj in the req so the next call can use our user object.
      if(user)
        {req.user = user}
      // If all good, we move to the next function
      return next();
    } catch (err: any) {
      return res.status(400).send({ type: err.name, message: err.message });
    }
  };

  export const authorizeAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Check if the role is Admin or Not
    // To authenticate Admin access only
    if (req.user.role === "Admin") {
      next();
    }
    else 
    {return res.status(403).send({
      message: "Not Authorized, Only Admin can access this route",}
    );
  }
};

export const authorizeProjectManager = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  // Check if the role is Admin or Not
  // To authenticate Admin access only
  if (req.user.role === "Admin" || req.user.role === "Project Manager") {
    next();
  }
  else 
  {return res.status(403).send({
    message: "Not Authorized, Only Admin/Project Manager can access this route",}
  );
}
}