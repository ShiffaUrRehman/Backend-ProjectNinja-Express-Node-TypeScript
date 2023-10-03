import * as dotenv from "dotenv";
import App from './app';
import UserController from './user/user_controller';
import AuthenticationController from "./authentication/authentication_controller";
import ProjectController from "./project/project_controller";
import TaskController from "./task/task_controller";

dotenv.config()

const app = new App(
  [
    new AuthenticationController(),
    new UserController(),
    new ProjectController(),
    new TaskController()
  ]
  );


app.listen();