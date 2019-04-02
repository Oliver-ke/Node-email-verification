const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const server = express();

const PORT = 5000 || process.env.PORT;

//db config
const db = require('./config/dev.config').MongoURI;

//connect to mongo
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDb connected..'))
	.catch((err) => console.log(err));

//Setup our ejs templete engine
server.use(expressLayout);
server.set('view engine', 'ejs');
server.set('layout', 'layouts/authlayout');
server.use('/static', express.static(__dirname + '/static'));

//bodyparser-> this is now built into express
server.use(express.urlencoded({ extended: false }));

//route request to our route file
server.use('/users', require('./routes/users'));

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
