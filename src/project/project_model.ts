import * as mongoose from 'mongoose';
import {Project, ProjectStatus} from './project_interface';

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 1024,
            required: true,
          },
          description:
          {
            type: String,
            maxlength: 1024,
            // minlength: 255,
            minlength: 5, // for now
            required: true,
          },
          status:{
            type: String, // this should be ProjectStatus?
            enum: ["Onboarding", "In Progress", "Complete"],
            required: true,
            default: "Onboarding",
          },
          projectManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          teamLead: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: []
            },
          ],
          teamMember: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: []
            },
          ],
          task: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Task",
              default: []
            },
          ],

    }
);

const projectModel = mongoose.model<Project & mongoose.Document>('Project', projectSchema); 

export default projectModel;