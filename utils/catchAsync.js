/*Function to catch the error input by the user*/
module.exports = func =>{
    return(req, res,next)=>{
        func(req,res,next).catch(next);
    }

}