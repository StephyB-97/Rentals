//Define schema for validation of data type before it is attempted to be input to mongo
const BaseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

/*Sanitazion of XSS for security reasons and not accept html from the user input*/
const extension= (joi)=>({
    type: 'string',
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value)
                    return helpers.error('string.escapeHTML', {value});
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

 module.exports.locationSchema = Joi.object({
    rental: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
       /* image: Joi.string().required(),*/
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
     deleteImages: Joi.array()
});

 module.exports.reviewSchema = Joi.object({
     review: Joi.object({
         rating: Joi.number().required(),
         body: Joi.string().required().escapeHTML()
     }).required()
 })