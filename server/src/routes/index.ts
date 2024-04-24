import express, {type Request, type Response, Router} from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next) {
	//res.render('index', {title: 'Express'});
	console.log('test');
	res.status(200).send({});
});

export default router;
