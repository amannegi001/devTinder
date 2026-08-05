const express = require("express");
const { connectDB } = require("./config/database.js")
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/requests.js');
const userRouter = require('./routes/user.js');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB().then(() => {
  console.log("Database connection established successfully.");

  app.listen(3000, () => {
    console.log("Server is successfully listening on 3000 port.");
  });
}).catch((err) => {
  console.error("Cannot connect to databaase");
});

