const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysqlConnection = require('./connection');
const validateRegister = require('../_validations/registerUser');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) =>{

    res.send("Hello World");
});

router.post('/getCertainEmployee', (req, res)=>{

    var sqlQuery = "Select * from employees where email = '" + req.body.email + "'";
    mysqlConnection.query(sqlQuery, (error , result ) =>{
        if(error){
            return res.status(400).send({message : "Error"});
        }else{
            return res.status(200).send(result);
        }
    });

});

router.patch('/edit-employee', (req,res)=>{

    var sqlQuery = "Update employees set firstname= '" + req.body.firstname + "' , lastname = '" + req.body.lastname + "' where email ='" + req.body.email + "'";
    mysqlConnection.query(sqlQuery , (error , result) =>{
        if(error){
            return res.status(400).send({message : error});
        }else{
            return res.status(200).send({message: result});
        }

    });

});


router.post('/getEmployees', (req, res) =>{

    var sqlQuery = "Select * from employees";
    mysqlConnection.query(sqlQuery, [true],(error , result , fields) =>{

        if(error){
            return res.status(400).send({message: Error});
        }else{
            return res.send(result);
        }
    });

});

router.post('/login', async (req,res) =>{

    console.log(req.body);

    const email = req.body.email;
    const bodyPass = req.body.password;

    if(email == null || bodyPass ==  null){
        return res.status(400).send({message: "Bad request"});
    }
    let pass = "";
    let emailSaved ="";
    let firstname ="";
    let lastname = "";
    let access_level_id = "";
    let jobTitle = "";


    var sqlQuery = "Select * from employees where email='" + email + "'";
    mysqlConnection.query(sqlQuery,(error, results) =>{
        if(error){
            return res.status(400).send({message : "Email doesn't exists!"});
        }

        for(i in results){
            pass = results[i].password;
            emailSaved = results[i].email;
            firstname = results[i].firstname;
            lastname = results[i].lastname;
            access_level_id = results[i].access_level_id;
            jobTitle = results[i].jobTitle;
        }

        const validPass =  bcrypt.compare(req.body.password , pass, (err, results) => {
            if(results){
                const token = jwt.sign({password : pass}, 'aosdj812u30ajlsddsad',{
                    expiresIn:68000
                });

                res.status(200).json({
                    email: emailSaved,
                    firstname :firstname,
                    lastname: lastname,
                    access_level_id : access_level_id,
                    jobTitle :jobTitle,
                    token: token
    
                });
            }else{

                return res.status(400).send({message: "Email or Password not found!"});
            }
        });


    });

});

router.post('/delete-employee',(req,res)=>{

    console.log(req.body.email);

    var sqlQuery = "Delete from employees where email ='" + req.body.email + "'";
    mysqlConnection.query(sqlQuery,(error , result)=>{
        if(error){
            res.status(400).send({message: "Error deleting employee"});
        }else{
            res.status(200).send({message: "Success"}); 
        }
    });

});

router.post('/add-employee', async (req, res)=>{

   
    const {error} = validateRegister(req.body);
    if(error) return res.send({ message: error.details[0].message});

    let dateToday = new Date();
    let day = ("0" + dateToday.getDate()).slice(-2);
    let month = ("0" + (dateToday.getMonth() +1)).slice(-2);
    let year = dateToday.getFullYear();

    let dateNow = year +"-"+ month + "-" + day;

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const age = req.body.age;
    const job_title = req.body.jobTitle;
    const access_level_id = req.body.access_level_id;
    const password = req.body.password;
    const birth_date = req.body.birth_date;
    const date_created = dateNow;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    var sqlFirstQuery = "Select * from employees where email ='" + email +"'";
    mysqlConnection.query(sqlFirstQuery , (error , result) => {
       if(result != 0){
        res.status(400).send({message: "Email Exists"});
        return;
       }else{

            var sqlQuery = "Insert into employees (firstname, lastname, email, age, job_title, access_level_id, password, birth_date, date_created, date_modified) Values ('"+ 
            firstname +"','" + lastname + "','" + email +"','"  + age + "','" + job_title +"','" + access_level_id + "','" + hashedPassword + "','" + birth_date + "','" + date_created + "','" + dateNow + "')";
        
            mysqlConnection.query(sqlQuery , (error, response) =>{
                if(error) res.send({message: "Error Saving!"});
                res.status(200).send({message: "Success"});
            });
       }
    });
});




module.exports = router;