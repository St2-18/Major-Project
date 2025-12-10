const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string()
        .uri()
        .allow("", null)
        .default(
          "https://i.pinimg.com/originals/03/89/41/038941fb2298e5cae26c3852f211350f.jpg"
        ),
      filename: Joi.string().allow("", null).default("listingImage"), // optional
    }).required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
