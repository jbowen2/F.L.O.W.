const express = require('express');
const app = express();

//middleware
//body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//https
const fs = require('fs');
const https = require('https');
const port = process.env.PORT;
const privateKey = fs.readFileSync('/etc/apache2/ssl/private.key');
const certificate = fs.readFileSync('/etc/apache2/ssl/server.crt')
https.createServer({key: privateKey, cert: certificate}, app).listen(port, () => console.log(`Server is live on port ${port}`));