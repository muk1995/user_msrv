const db = require('../models/db');
module.exports = function (req, res, next) {
    db.raw("SELECT 1").then(() => {
        next();
    })
    .catch((e) => {
        console.log("mySQL not connected");
        return res.status(400).send({
            success: false,
            message: 'MySQL not running.'
        });
    })
}