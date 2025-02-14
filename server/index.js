const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const {createClient} = require("redis")
const authRouter = require("./routes/auth.route");
const paymentRouter = require("./routes/payment.route");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const instructorRouter = require("./routes/instructor.route");
const errorHandler = require("./middlewares/errorHandler");
const ErrorHandler = require("./utils/error");
const passport = require("passport");
require("./config/passport");
const {
  verifyToken,
  verifyInstructorToken,
  verifyAdminToken,
} = require("./utils/jwt");
const cookieparser = require("cookie-parser");
const upload = require("./config/upload");
const { imageUploadHandler, paymentHandler } = require("./controller/course.controller");
const { connectRedisCache } = require("./config/redis-cache");



dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
}));
app.use(cookieparser());

app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", 
    httpOnly: true, 
    sameSite: "None", 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`); 
  res.setHeader("Access-Control-Allow-Credentials", "true"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); 
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
  next();
});


app.use(passport.initialize());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message) => {
    console.log(message);
    socket.emit("resp", `Message received: ${message}`);
  });
});

app.get("/", (req, res) => {
  res.send("ACQUEL LMS BACKEND");
});

// authentication
app.use("/api/v1/auth/user", authRouter);

//user data
app.use("/api/v1/user", verifyToken, userRouter);

// admin

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/admin", verifyAdminToken, adminRouter);

//instructor
app.use("/api/v1/auth/instructor", instructorRouter);
app.use("/api/v1/instructor", verifyInstructorToken, instructorRouter);

// image uploader

app.post("/api/v1/admin/image", upload.single("file"), imageUploadHandler);
// image uploader

app.post("/api/v1/instructor/image", upload.single("file"), imageUploadHandler);


//payments 
app.post("/api/v1/payment",verifyToken,paymentRouter)


// video uploader


server.listen(process.env.PORT, async() => {
  connectDB();
  console.log(`Listening on ${process.env.PORT}`);
  

  
  
});


