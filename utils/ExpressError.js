/*Class that handles the errors when the user enters information in an invalid format*/

class ExpressError extends Error{
    constructor(message, statusCode){
         super();
         this.message = message;
         this.statusCode = statusCode;
    }
}
module.exports = ExpressError;