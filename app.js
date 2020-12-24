const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysqlConnection = require('./_routes/connection');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


//Routes for api
const apiRoutes = require('./_routes/api');
app.use('/api', apiRoutes);


app.use('/', (req,res) =>{

    res.send('You are on the mainpage');

});



const port = process.env.PORT || 3000;
app.listen(port , () => console.log('Listening to port ' + port));

