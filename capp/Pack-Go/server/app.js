// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://satyamaheshkolli03:z6qmIvFRmgm5JjZs@cluster0.f3zud.mongodb.net/?retryWrites=true&w=majority&appName=cluster0").then(()=>{
//     console.log("DB connected Successfully");
// }).catch((err)=>{
//     console.log(err);
// })

// const user = new mongoose.Schema({
//     username:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// },{timestamps:true});

// const Users = mongoose.model("Users",user);


// app.post("/")



// app.listen(8000,console.log("server started at 8000"));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authenticateUser = require("./middleware/authenticateUser");

dotenv.config(); // Load environment variables

const app = express();
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON requests


app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend domain
    credentials: true, // Allow cookies and Authorization headers
  })
); // Enable CORS for frontend requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB connected Successfully");
}).catch((err) => {
  console.log("DB Connection Error: ", err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// **SIGNUP Route**
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// **LOGIN Route**
// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     console.log(email,password);
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT Token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({ message: "Login successful", token });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      console.log(email, password);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      // Set token as HTTP-only cookie
      console.log("token",token);

      res.cookie("token", token, {
        httpOnly: true, // Prevent access from JavaScript (more secure)
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Prevent CSRF attacks
        maxAge: 3600000, // 1 hour
      });
      console.log("cookies",req.cookies);
  
      res.status(200).json({ message: "Login successful",token });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
// **Start Server**



app.get("/api/wishlist", authenticateUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id }); // Get wishlist for the user
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));