const express = require("express");
const { connectDB } = require("./config/database")
const { User } = require("./models/user");
const validator = require('validator');
const { validateSignUpData, validateloginData } = require('./utils/validation')
const bcrypt = require('bcrypt');

// const { adminAuth } = require("./middlewares/admin.js")
// const { userAuth } = require("./middlewares/user.js")

const app = express();
app.use(express.json());

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
    const user = await User.findOne({ emailId }, 'password').exec();
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
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

app.get("/user", async (req, res) => {
  const id = req.body.userId;

  try {
    const user = await User.findById(id, "firstName emailId password").exec();
    if (user === null) {
      return res.status(404).send("User not found.");
    }
    else {
      return res.json({ user });
    }
  }

  catch (err) {
    console.log(err.message);
    return res.status(500).send("Somethinig bad happened.");
  }

})

app.delete("/user", async (req, res) => {
  const id = req.body.userId;

  try {
    const isDeleted = await User.findByIdAndDelete(id).exec();
    if (!isDeleted) {
      return res.status(404).send("User not found.");
    }
    else {
      return res.send("User is deleted.");
    }
  }

  catch (err) {
    console.log(err.message);
    return res.status(500).send("Somethinig bad happened.");
  }

})

app.patch("/user/:id", async (req, res) => {
  const id = req.params?.id;
  const data = req.body;
  try {

    if (data.skills.length > 15) {
      throw new Error("Skills cannot be more than 15.");
    }

    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ]

    const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }

    const isUpdated = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
      returnDocument: 'after'
    }).exec();
    if (!isUpdated) {
      return res.status(404).send("User not found.");
    }
    else {
      return res.send("Updated successfully");
    }
  }
  catch (err) {
    console.log(err.message);
    return res.status(400).send("UPDATE FAILED : " + err.message);
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    if (users.length === 0) {
      return res.status(404).send("User not found.");
    }
    else {
      return res.json({ users });
    }
  }

  catch (err) {
    console.log(err.message);
    return res.status(500).send("Somethinig bad happened.");
  }

})

connectDB().then(() => {
  console.log("Database connection established successfully.");

  app.listen(3000, () => {
    console.log("Server is successfully listening on 3000 port.");
  });
}).catch((err) => {
  console.error("Cannot connect to databaase");
});


// const users = [
//   {
//     id: 1,
//     firstName: "Aman",
//     lastName: "Negi",
//     email: "aman.negi01@gmail.com",
//     age: 21,
//     gender: "Male"
//   },
//   {
//     id: 2,
//     firstName: "Priya",
//     lastName: "Sharma",
//     email: "priya.sharma02@gmail.com",
//     age: 22,
//     gender: "Female"
//   },
//   {
//     id: 3,
//     firstName: "Rahul",
//     lastName: "Verma",
//     email: "rahul.verma03@gmail.com",
//     age: 24,
//     gender: "Male"
//   },
//   {
//     id: 4,
//     firstName: "Sneha",
//     lastName: "Gupta",
//     email: "sneha.gupta04@gmail.com",
//     age: 20,
//     gender: "Female"
//   },
//   {
//     id: 5,
//     firstName: "Arjun",
//     lastName: "Singh",
//     email: "arjun.singh05@gmail.com",
//     age: 26,
//     gender: "Male"
//   },
//   {
//     id: 6,
//     firstName: "Neha",
//     lastName: "Yadav",
//     email: "neha.yadav06@gmail.com",
//     age: 23,
//     gender: "Female"
//   },
//   {
//     id: 7,
//     firstName: "Rohan",
//     lastName: "Mehta",
//     email: "rohan.mehta07@gmail.com",
//     age: 27,
//     gender: "Male"
//   },
//   {
//     id: 8,
//     firstName: "Kavya",
//     lastName: "Patel",
//     email: "kavya.patel08@gmail.com",
//     age: 19,
//     gender: "Female"
//   },
//   {
//     id: 9,
//     firstName: "Vikram",
//     lastName: "Joshi",
//     email: "vikram.joshi09@gmail.com",
//     age: 29,
//     gender: "Male"
//   },
//   {
//     id: 10,
//     firstName: "Ananya",
//     lastName: "Mishra",
//     email: "ananya.mishra10@gmail.com",
//     age: 25,
//     gender: "Female"
//   },
//   {
//     id: 11,
//     firstName: "Karan",
//     lastName: "Malhotra",
//     email: "karan.malhotra11@gmail.com",
//     age: 28,
//     gender: "Male"
//   },
//   {
//     id: 12,
//     firstName: "Pooja",
//     lastName: "Rana",
//     email: "pooja.rana12@gmail.com",
//     age: 22,
//     gender: "Female"
//   },
//   {
//     id: 13,
//     firstName: "Aditya",
//     lastName: "Kapoor",
//     email: "aditya.kapoor13@gmail.com",
//     age: 30,
//     gender: "Male"
//   },
//   {
//     id: 14,
//     firstName: "Meera",
//     lastName: "Nair",
//     email: "meera.nair14@gmail.com",
//     age: 24,
//     gender: "Female"
//   },
//   {
//     id: 15,
//     firstName: "Siddharth",
//     lastName: "Chauhan",
//     email: "siddharth.chauhan15@gmail.com",
//     age: 27,
//     gender: "Male"
//   }
// ];

