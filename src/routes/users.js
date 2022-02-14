const express = require('express');
const router = express.Router();
const user = require("../controllers/users")

/* Middlewares */
const  formatRequest   = require('../middlewares/formatRequest');
router.use(formatRequest);
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
module.exports = router;