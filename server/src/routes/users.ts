import express, {type Request, type Response} from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next) {
	res.send('respond with a resource');
});

module.exports = router;
