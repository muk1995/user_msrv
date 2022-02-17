const express = require('express');
const router = express.Router();
const user = require("../controllers/users")
const options = require("../helper/cookies");
/* Middlewares */
const  formatRequest   = require('../middlewares/formatRequest');
router.use(formatRequest);
const health = require("../middlewares/health");
router.use(health);
const schemas = require('../validations/user');
const joiValidator = require('../middlewares/joiValidator');


/*  Routes */

const signupValidator = joiValidator(schemas.signup, 'body', 'users');
router.post(
	'/v1/user',
	signupValidator,
	(req, res) => {let data = { ...req.combined_body, ...req.params } || {};
    data.req = req.data;
    data.req.path = req.path;
    user.signup_user(data, function (err, response) {
        var status = 0;
        if (err) {
            status = err.status;
            return res.status(status).send(err);
        }
        status = response.status;
        return res.status(status).send(response);
    }); 
}
); 
const loginValidator = joiValidator(schemas.login, 'body', 'users');
router.post(
	'/v1/user/login',
	loginValidator,
	(req, res) => {
	let data = { ...req.combined_body, ...req.params } || {};
	data.req = req.data;
	data.req.path = req.path;
	user.login(data, function (err, response) {
		var status = 0;
		if (err) {
			status = err.status;
			return res.status(status).send(err);
		}
		status = response.status;
		return res.cookie('token',response.data.session_token, options).status(status).send(response);
			
		});
		
	}
);
router.post('/v1/user/logout',(req, res) => {
	res.cookie('token',null,{expires : new Date(Date.now()),httpOnly:true,});
	return res.status(200).json("logout");
});
router.get(
	'/v1/user',
	(req, res) => {
	let data = { ...req.combined_body, ...req.params } || {};
	data.req = req.data;
	data.req.path = req.path;
	user.user_profile(data, function (err, response) {
		var status = 0;
		if (err) {
			status = err.status;
			return res.status(status).send(err);
		}
		status = response.status;
        return res.status(status).send(response);		
		});	
	}
);
router.get(
	'/v1/user/:id',
	(req, res) => {
	let data = { ...req.combined_body, ...req.params } || {};
	data.req = req.data;
	data.req.path = req.path;
	user.other_profile(data, function (err, response) {
		var status = 0;
		if (err) {
			status = err.status;
			return res.status(status).send(err);
		}
		status = response.status;
        return res.status(status).send(response);
			
		});
		
	}
);		
module.exports = router;
