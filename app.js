// ENV Setup
require("dotenv").config();
require("express-async-errors");

// Express
const express = require("express");
const app = express();

// express-fileupload Package
const fileUpload = require("express-fileupload");

// import cloudinary and configuration: Please use Version 2
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// connect DB
const connectDB = require("./db/connect");

// import product router
const productRouter = require("./routes/productRoutes");

// import error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.static("./public")); // Static Assets making public
app.use(express.json()); // to access req.body in the POST Route

// app.use(fileUpload()); // invoking fileupload for Local Image Upload Function Only
app.use(fileUpload({ useTempFiles: true })); // invoking fileupload for cloudinary image upload with TempFiles from this server itself

// Testing Route
app.get("/", (req, res) => {
  res.send("<h1>File Upload Starter</h1>");
});

// Mounting the router: Properly with default Root Route
app.use("/api/v1/products", productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(
        `Connected to the Database: Server is listening on port ${port}...`
      )
    );
  } catch (error) {
    console.log(error);
  }
};
start();
