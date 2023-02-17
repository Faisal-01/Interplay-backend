const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/connection");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const multer = require("multer");
const path = require("path");

const cors = require("cors");
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  //   optionSuccessStatus: 200,
};


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send("hello this is route")
})

app.use('/images', express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },

  filename: (req, file, cb) => {
    cb(null, req.body.name);
  }
})

const upload = multer({storage});

app.post('/api/v1/upload', upload.single("file"), (req, res) => {
  try {
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    res.status(500).json(error);
  }
})

app.use('/api/v1/', authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
          console.log("server is listening on port " + PORT);
        });
    } catch (error) {
        console.log(error);
    }
}

start();