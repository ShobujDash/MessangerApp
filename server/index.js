const express = require('express');
const cors = require('cors');
require("dotenv").config();
const connectDB = require('./config/connectDB');
const router = require('./routers/index');
const cookieParser = require('cookie-parser');
const {app,server} = require('./socket/index')


// const app = express();
app.use(
  cors({
    origin: "https://shobujdasmessanger.netlify.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    message: "Server runngin at port " + PORT,
    success:true
  })
})



// api endpints
app.use("/api", router);


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running at " + PORT);
  });
});






































