import * as mongoose from 'mongoose';
import {User, Role} from './user_interface';
import { NextFunction } from 'express';
import * as bcrypt from "bcrypt";


const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    fullname: {
        type: String,
        maxlength: 1024,
        required: true,
      },
      username: {
        type: String,
        maxlength: 1024,
        required: true,
      },
      password: {
        type: String,
        maxlength: 1024,
        minlength: 8,
        required: true,
      },
      role: {
        type: String, // comment: this should be role?
        enum: ["Project Manager", "Team Lead", "Team Member"],
        maxlength: 1024,
        required: true,
      }
  },
);

userSchema.pre("save", function (next: NextFunction) {
    let user = this; // comment: what would be the type here
  
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();
  
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);
  
      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
  
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;