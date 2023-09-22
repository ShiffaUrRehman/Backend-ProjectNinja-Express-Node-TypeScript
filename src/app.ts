import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
// import Controller from './interfaces/controller.interface';


class App {
    public app: express.Application;

    constructor(){
        this.app = express()
        this.connectToDataBase();
        this.initializeMiddlewares();
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
        .catch((err) => console.log("Error while connecting to DB", err.message));
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
      }

}


export default App;