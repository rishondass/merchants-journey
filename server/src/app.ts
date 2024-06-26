import express, {Request, Response} from  'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';



const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/', indexRouter);
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));



export default app;
