const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Shuvaisavery$goodcoder'; 

const fetchuser = async (req, res, next)=>{
    //get token from user body and verify that in db and return the user in req.user=data.user 
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send({error:  "Invalid token!!"});
    }try {
        const data = await jwt.verify(token, JWT_SECRET)  //verify ongoing🧐
        req.user = data.user;
        next();  //after completing the task of the function it's very imp to call next(): so that the next function is called 
        
    } catch (error) {
        return res.status(401).send({error:  "Invalid token!!"});
    }
}

module.exports = fetchuser;