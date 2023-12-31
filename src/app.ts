
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interface/controller_interface';
import errorMiddleware from './middleware/errorMiddleware';


class App {
    public app: express.Application;

    constructor(controllers: Controller[]){
        
        this.app = express()
        this.connectToDataBase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
          })
    }

    public getServer() {
        return this.app;
    }

    private connectToDataBase() {
        const {
            DB_URL_LOCAL,
          } = process.env;
        mongoose.connect(DB_URL_LOCAL)
        .then(() => console.log("Connected to DB successfully"))
        .catch((err) => {throw new Error(`Error while connecting to DB ${err.message}`);});
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private initializeErrorHandling() {
      this.app.use(errorMiddleware);
    }

      private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
          this.app.use('/api', controller.router);
        });
    }

}


export default App;