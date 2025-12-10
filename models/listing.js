const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: {
      filename: { type: String, default: "listingImage" },
      url: {
        type: String,
        default:
          "https://i.pinimg.com/originals/03/89/41/038941fb2298e5cae26c3852f211350f.jpg",
      },
    },
    default: {
      filename: "listingImage",
      url: "https://i.pinimg.com/originals/03/89/41/038941fb2298e5cae26c3852f211350f.jpg",
    },
  },

  price: {
    type: Number,
    required: true,
    default: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
