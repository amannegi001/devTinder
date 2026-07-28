const express = require("express");

const app = express();

app.use(express.json());

const users = [
    {
        id: 1,
        firstName: "Aman",
        lastName: "Negi",
        email: "aman.negi01@gmail.com",
        age: 21,
        gender: "Male"
    },
    {
        id: 2,
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma02@gmail.com",
        age: 22,
        gender: "Female"
    },
    {
        id: 3,
        firstName: "Rahul",
        lastName: "Verma",
        email: "rahul.verma03@gmail.com",
        age: 24,
        gender: "Male"
    },
    {
        id: 4,
        firstName: "Sneha",
        lastName: "Gupta",
        email: "sneha.gupta04@gmail.com",
        age: 20,
        gender: "Female"
    },
    {
        id: 5,
        firstName: "Arjun",
        lastName: "Singh",
        email: "arjun.singh05@gmail.com",
        age: 26,
        gender: "Male"
    },
    {
        id: 6,
        firstName: "Neha",
        lastName: "Yadav",
        email: "neha.yadav06@gmail.com",
        age: 23,
        gender: "Female"
    },
    {
        id: 7,
        firstName: "Rohan",
        lastName: "Mehta",
        email: "rohan.mehta07@gmail.com",
        age: 27,
        gender: "Male"
    },
    {
        id: 8,
        firstName: "Kavya",
        lastName: "Patel",
        email: "kavya.patel08@gmail.com",
        age: 19,
        gender: "Female"
    },
    {
        id: 9,
        firstName: "Vikram",
        lastName: "Joshi",
        email: "vikram.joshi09@gmail.com",
        age: 29,
        gender: "Male"
    },
    {
        id: 10,
        firstName: "Ananya",
        lastName: "Mishra",
        email: "ananya.mishra10@gmail.com",
        age: 25,
        gender: "Female"
    },
    {
        id: 11,
        firstName: "Karan",
        lastName: "Malhotra",
        email: "karan.malhotra11@gmail.com",
        age: 28,
        gender: "Male"
    },
    {
        id: 12,
        firstName: "Pooja",
        lastName: "Rana",
        email: "pooja.rana12@gmail.com",
        age: 22,
        gender: "Female"
    },
    {
        id: 13,
        firstName: "Aditya",
        lastName: "Kapoor",
        email: "aditya.kapoor13@gmail.com",
        age: 30,
        gender: "Male"
    },
    {
        id: 14,
        firstName: "Meera",
        lastName: "Nair",
        email: "meera.nair14@gmail.com",
        age: 24,
        gender: "Female"
    },
    {
        id: 15,
        firstName: "Siddharth",
        lastName: "Chauhan",
        email: "siddharth.chauhan15@gmail.com",
        age: 27,
        gender: "Male"
    }
];

app.use("/admin", (req, res, next)=>{
    const token = "32d.3k2.k36";
    const pass = "32d.3k2.k36";
    const auth = token === pass;
    if(!auth){
        return res.status(401).json({
            message : "Unauthorized Access"
        })
    }
    else next();
})

app.get("/users", (req, res, next) => {
    // res.status(200).json({ message: "1st route handler." });
    next();
});

app.get("/users", (req, res) => {
    res.status(200).json({ message: "2nd route handler." });
});

app.get("/user/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => {
        return user.id === id;
    });
    res.status(200).json({ user });
});

app.delete("/user/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    users.splice(index, 1);
    return res.status(200).json({
        message: "User deleted successfully."
    })


})

app.listen(3000);