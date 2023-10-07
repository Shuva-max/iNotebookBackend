const express = require ('express');   //import experss🚄
const router = express.Router();
const User = require('../models/User');  //import UserSchema from our models repository🧩
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');   //import middleware fatchuser

const JWT_SECRET = 'Shuvaisavery$goodcoder';   // my secret sign string 🔐

/**** Route 1 : Create a User using:
 *  POST- "/api/auth/createuser" , 
 * No login require🛴🔛 ********/ 

router.post('/createuser', [   //condition validation and errors msg using expersss-validator
    body('name', "Name must contain atleast 3 charactors").isLength({min: 3}),
    body('email', "Enter a valid email id").isEmail(),
    body('password', "password must contain atleast 5 charactors").isLength({min: 5})
], async (req, res)=>{  // It is a async function
    //check the validation and if errors occured📍 then send bad request with error msg📧
    const errors = validationResult(req);
    let status = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({status, errors: errors.array() });  //send errors array🧰🛠
    }

    try {
        //Check wheather the user with the email is exists already❗❓ 
        let user = await User.findOne({email: req.body.email}); //searching in our db🧐🌐
        if (user){
            // Its very very important to write return otherwise our app will crase☢ whenever user post a bad request🔰
            return res.status(400).json({status, error:"Sorry a user with this email is already exists" });
        }

        //adding salt🧪 by creating bcrypt.genSalt() and create a hash text🈲 that's store in a variable called 'secPass' which is actually store in our db🌐
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Create a User and store it to our db🌐
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass  //store hash in our db🌐
          })
        
        //creating a token🎫 to new register user😇 and give the token with my sign as response📤📬
        const data = {
            id: user.id
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        status = true
        res.status(201).json({status, authToken});
        
    } catch (err) {
        console.error(err.massage);
        res.status(500).send("Internal server errors!!");
    }
})


/**** Route 2 : compaire a user email and password : 
* POST- "/api/auth/login" , 
* No login require🛴🔛    ******/

router.post('/login', [   //condition validation and errors msg
    body('email').isEmail(),
    body('password',"Enter your password").isLength(1)
], async(req, res)=>{   // It is a async function
    //check the validation and if errors occured then send bad request with error msg📧
    const errors = validationResult(req);
    let status = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({status, errors: errors.array() });
    }

    const {email, password} = req.body;  //Destructuring from our request body to email, password
    try {
        //searching user in db with the help off email🧐🌐
        let user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({status, error: "Please put the right credential!"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);  //compare login password to our hash pass which is store in our db
        if(!passwordCompare){
            return res.status(400).json({status, error: "Please put the right credential!"});
        }

        const data = {
                user:{
                    id:user.id
                }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        status = true;
        res.json({status, authToken});
    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Internal server errors!!");
    }

})

/**** Route 3 : Fetch a User using authToken and add user id : 
* POST- "/api/auth/getuser" , 
* login require🛴🔛    ******/

router.post('/getuser', fetchuser, async (req, res)=>{  //fatchuser is middleware (nothing but a function)🎭
    try {
        const userid = req.user.id; //getting from fetchuser middleware🛒
        const user = await User.findById(userid).select('-password');  
        res.send(user);
    
    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Internal server errors!!");
    }
})

module.exports = router ;