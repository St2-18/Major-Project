const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //index
  .get(wrapAsync(listingController.index))
  //create
  .post(
    isLoggedIn,
    upload.array("listing[images]", 10),
    validateListing,
    wrapAsync(listingController.createListing),
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //show
  .get(wrapAsync(listingController.showListing))
  //update
  .put(
    isLoggedIn,
    isOwner,
    upload.array("listing[images]", 10),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  //delete
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
