
const { number } = require('@hapi/joi');
const joi = require('@hapi/joi');


function validateRegister(user){

    const schema = joi.object({

        firstname:joi.string()
        .required()
        .max(255),

        lastname: joi.string()
        .required()
        .max(255),

        email: joi.string()
        .email()
        .required()
        .max(255),

        jobTitle:joi.string()
        .required()
        .max(255),

        age: joi.string()
        .required()
        .max(3),

        password:joi.string()
        .required()
        .max(255),

        birth_date:joi.string()
        .required(),

        access_level_id:joi.number()
        .required()
        
    });

    return schema.validate(user);

}


module.exports = validateRegister;