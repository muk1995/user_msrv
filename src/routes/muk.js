const express = require('express');
const router = express();


router.get('/mu',(req,res)=>{
    console.log(req.headers['X-Refresh-Token']);
    res.json(req.headers['X-Refresh-Token'])
   /* res.json({
         method: req.method,
        baseUrl: req.baseUrl,
        cookies: req.cookies,
        signedCookies: req.signedCookies,
        fresh: req.fresh,
        ip: req.ip,
        ips: req.ips,
        secure: req.secure,
        subdomains: req.subdomains,
        xhr: req.xhr,
        hostname: req.hostname,
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        route: req.route
       })
    res.send("muk")*/
}); 
module.exports = router