/**
 * Geocode an address string using OpenStreetMap Nominatim.
 * Returns an object { lat, lng } or null if not found.
 * No API key required – just a User-Agent header per Nominatim's usage policy.
 */
async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "WanderlustApp/1.0",
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data[0]) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

module.exports = { geocode };
