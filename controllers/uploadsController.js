const path = require("path");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs"); // To remove Temp Files

const {
  BadRequestError,
  NotFoundError,
  CustomAPIError,
  UnauthenticatedError,
} = require("../errors");

//--------------------------- Function For Local Image Upload
const uploadProductImageLocal = async (req, res) => {
  // 1) check if file exists

  // console.log(req.files);
  if (!req.files) {
    throw new BadRequestError("No File Uploaded");
  }

  const productImage = req.files.image;

  // 2) check format
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload Image");
  }

  // 3) check size: upto 1Mb: It can be setup as an env variable if I want
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please Upload Image smaller than 1Mb");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

//--------------------------- Function For Cloudinary Image Upload
const uploadProductImage = async (req, res) => {
  // console.log(req.files.image);
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "07-file-upload",
    }
  );
  // console.log(result);
  fs.unlinkSync(req.files.image.tempFilePath); // To Clear Temp Files and Not Storing them locally anymore
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

// Exporting
module.exports = { uploadProductImage };
