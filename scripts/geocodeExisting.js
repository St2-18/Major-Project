/**
 * One-time migration script to geocode existing listings
 * that don't have lat/lng coordinates yet.
 *
 * Usage:  node scripts/geocodeExisting.js
 */
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { geocode } = require("../utils/geocode");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

(async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB.");

  const listings = await Listing.find({
    $or: [{ lat: { $exists: false } }, { lat: null }],
  });

  console.log(`Found ${listings.length} listings without coordinates.\n`);

  let success = 0;
  let failed = 0;

  for (const listing of listings) {
    if (!listing.location) {
      console.warn(`  SKIP  ${listing._id} — no location string`);
      failed++;
      continue;
    }

    const coords = await geocode(listing.location);
    if (coords) {
      listing.lat = coords.lat;
      listing.lng = coords.lng;
      await listing.save();
      console.log(
        `  OK    ${listing._id}: "${listing.location}" → [${coords.lng}, ${coords.lat}]`
      );
      success++;
    } else {
      console.warn(
        `  FAIL  ${listing._id}: "${listing.location}" — no result from Nominatim`
      );
      failed++;
    }

    // Respect Nominatim's rate limit: max 1 request per second
    await new Promise((r) => setTimeout(r, 1100));
  }

  console.log(`\nDone. ${success} geocoded, ${failed} failed/skipped.`);
  process.exit(0);
})();
