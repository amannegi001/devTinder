const express = require("express");
const { connectDB } = require("./config/database.js")
const { User } = require("./models/user.js");
const validator = require('validator');
const { validateSignUpData, validateloginData } = require('./utils/validation.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth.js")


const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

  const data = req.body;

  const { firstName, lastName, emailId, password } = data;

  try {
    // Validation
    validateSignUpData(data);

    // Encryption
    const hashPassword = await bcrypt.hash(password, 10);

    // Crating an instance of the User model
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword
    })

    await newUser.save();
    return res.send("The user created successfully.")
  }
  catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }

})

app.post("/login", async (req, res) => {
  const data = req.body;

  const { emailId, password } = data;

  try {

    validateloginData(data);
    const user = await User.findOne({ emailId }).exec();
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      
      res.cookie("token", token,{
        expires : new Date(Date.now() + 8* 3600000)
      });
      return res.send("Logged in successfully.");
    }
    else {
      throw new Error("Invalid credentials");
    }
  }
  catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
  
    return res.send(user);
  }
  catch (err) {
    console.log("ERROR: " + err);
  }
})

app.post("/sendConnectionRequest", userAuth,async (req, res)=>{

  console.log(req.user.firstName,"is sending connection request");
  
  res.send(req.user.firstName+" is sending connection request");
})

connectDB().then(() => {
  console.log("Database connection established successfully.");

  app.listen(3000, () => {
    console.log("Server is successfully listening on 3000 port.");
  });
}).catch((err) => {
  console.error("Cannot connect to databaase");
});

