// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const UserRouter = require("./routes/UserRouter")


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/excel-charts', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// app.use(cors({
//   origin: 'http://localhost:3000', // Allow only your frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   credentials: true, // Allow cookies (if needed)
// }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
app.use("/api",UserRouter);
const upload = multer({ storage });

// Data model
const DataSchema = new mongoose.Schema({
  filename: String,
  data: Array,
  createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', DataSchema);
// Routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    console.log("sheetName"+sheetName);
    const worksheet = workbook.Sheets[sheetName];
    console.log("workSheet"+worksheet);
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const savedData = await Data.create({
      filename: req.file.originalname,
      data: jsonData
    });

    res.status(201).json(savedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/data/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const path = require('path');
// const fs = require('fs');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/excel-charts', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // File Upload Configuration
// const uploadDir = './uploads';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// // Data Model
// const DataSchema = new mongoose.Schema({
//   filename: String,
//   data: Array,
//   createdAt: { type: Date, default: Date.now }
// });

// const Data = mongoose.model('Data', DataSchema);

// // Routes
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(worksheet);

//     // Clean up - delete the uploaded file after processing
//     fs.unlinkSync(req.file.path);

//     const savedData = await Data.create({
//       filename: req.file.originalname,
//       data: jsonData
//     });

//     res.status(201).json(savedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// app.get('/api/data/:id', async (req, res) => {
//   try {
//     const data = await Data.findById(req.params.id);
//     if (!data) {
//       return res.status(404).json({ message: 'Data not found' });
//     }
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));