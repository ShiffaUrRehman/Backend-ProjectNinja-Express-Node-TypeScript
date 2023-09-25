import * as dotenv from "dotenv";
import App from './app';
import UserController from './user/user_controller';
import AuthenticationController from "./authentication/authentication_controller";
import ProjectController from "./project/project_controller";


dotenv.config()

const app = new App(
  [
    new UserController(),
    new AuthenticationController(),
    new ProjectController()
  ]
  );
  // [
  //   new PostController(),
  //   new AuthenticationController(),
  //   new ReportController(),
  // ],


app.listen();