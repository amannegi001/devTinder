const express = require("express");
const { connectDB } = require("./config/database")
const { User } = require("./models/user");
// const { adminAuth } = require("./utils/admin.js")
// const { userAuth } = require("./utils/user.js")

const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {
  const info = req.body.user;

  // Crating an instance of the User model
  const newUser = new User(info)
  console.log("New user created");
  try {
    await newUser.save();
    return res.send("The user created successfully.")
  }
  catch (err) {
    return res.status(400).send("Somethng bad happened!");
  }

})

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).exec();
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

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const isDeleted = await User.findByIdAndDelete( id ).exec();
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

app.patch("/user/", async (req, res)=>{
  const id = req.body.userId;
  const data = req.body;
  try{
    const isUpdated = await User.findByIdAndUpdate(id, data).exec();
    if(!isUpdated){
      return res.status(404).send("User not found.");
    }
    else{
      return res.send("Updated successfully");
    }
  }
  catch(err){
    console.log(err.message);
    return res.status(400).send("Something went wrong.");
  }
})

app.get("/users", async (req, res) => {
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

// app.use("/admin", adminAuth);
// app.use("/user", userAuth);

// app.get("/users", (req, res) => {
//   try{
//     return res.status(200).json({ users });
//   }
//   catch(err){
//     res.status(500).json({
//       message : "Something went wrong."
//     })
//   }
// });

// app.use("/", (err, req, res, next)=>{
//   console.log(err);
//   return res.status(500).json({
//     error : err.message
//   })
// })

// app.get("/user/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => {
//     return user.id === id;
//   });
//   res.status(200).json({ user });
// });

// app.delete("/user/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const index = users.findIndex(user => user.id === id);

//   if (index === -1) {
//     return res.status(404).json({
//       message: "User not found."
//     });
//   }

//   users.splice(index, 1);
//   return res.status(200).json({
//     message: "User deleted successfully."
//   })


// })