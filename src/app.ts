import express, { NextFunction, Request, Response }  from "express";
import cors from "cors";
import  HttpStatus  from "http-status";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
 
 

// middlewares 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Movie server is running");
});

 

app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction)=>{

  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error:{
      path: req.originalUrl,
      message: "Your request path is not found"
    }
  })
})

export default app;  
