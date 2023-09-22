import * as dotenv from "dotenv";
import App from './app';
import UserController from './user/user_controller';
// import AuthenticationController from './authentication/authentication.controller';
// import PostController from './post/post.controller';
// import ReportController from './report/report.controller';


dotenv.config()

const app = new App(
  [
    new UserController()
  ]
  );
  // [
  //   new PostController(),
  //   new AuthenticationController(),
  //   new ReportController(),
  // ],


app.listen();