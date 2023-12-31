import * as mongoose from 'mongoose';
import {Task, TaskStatus} from './task_interface';

const taskSchema = new mongoose.Schema(
    {
          description:
          {
            type: String,
            maxlength: 1024,
            // minlength: 255,
            minlength: 5,
            required: true,
          },
          status:{
            type: String, // comment: this should be ProjectStatus?
            enum: ["Ready to Start", "In Progress", "Waiting for Review", "Complete"],
            required: true,
            default: "Ready to Start",
          },
          assignedTo: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: undefined
            },
          ],
          projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
          },

    }
);

const taskModel = mongoose.model<Task & mongoose.Document>('Task', taskSchema); 

export default taskModel;