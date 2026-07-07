const Listing = require("../models/listing.js");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested listing does not exist.");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const DEFAULT_URL =
    "https://i.pinimg.com/originals/03/89/41/038941fb2298e5cae26c3852f211350f.jpg";

  // multer-storage-cloudinary v2.2.1 puts raw Cloudinary response on file objects:
  //   f.secure_url / f.url  = image URL
  //   f.public_id           = Cloudinary public ID (used as filename)
  const uploadedImages =
    req.files && req.files.length > 0
      ? req.files.map((f) => ({
          url: f.secure_url || f.url,
          filename: f.public_id,
        }))
      : [{ url: DEFAULT_URL, filename: "listingImage" }];

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.images = uploadedImages;
  // Keep legacy `image` field pointing to the first image for index-page thumbnails
  newListing.image = { url: uploadedImages[0].url, filename: uploadedImages[0].filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist.");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist.");
    return res.redirect("/listings");
  }

  // Update text fields safely
  if (req.body.listing) {
    listing.title = req.body.listing.title || listing.title;
    listing.description = req.body.listing.description || listing.description;
    listing.price = req.body.listing.price !== undefined ? req.body.listing.price : listing.price;
    listing.country = req.body.listing.country || listing.country;
    listing.location = req.body.listing.location || listing.location;
  }

  // Append any newly uploaded images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({
      url: f.secure_url || f.url,
      filename: f.public_id,
    }));

    // If listing.images is empty but legacy listing.image exists, migrate it into images array first
    if (
      (!listing.images || listing.images.length === 0) &&
      listing.image &&
      listing.image.url &&
      listing.image.filename !== "listingImage"
    ) {
      listing.images = [listing.image];
    }

    listing.images.push(...newImages);

    // Update primary thumbnail image for index page
    if (listing.images.length > 0) {
      listing.image = {
        url: listing.images[0].url,
        filename: listing.images[0].filename,
      };
    }
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
