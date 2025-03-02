const express = require("express");
const { generateAvatar } = require("./avatarGenerator");
const { config } = require("dotenv");
const sharp = require("sharp"); // Import sharp

config(); // Load environment variables

const app = express();
const port = process.env.PORT || "10000";

app.get("/", (_, res) => res.redirect(302, "https://www.avatartion.com/"));

app.get("/api", async (req, res) => {
  try {
    console.time("generateAvatar");
    const avatarSvg = await generateAvatar(req.query, res); // Generate the SVG string
    console.timeEnd("generateAvatar");
    console.time("render");
    const pngBuffer = await renderSvgToPng(avatarSvg, req.query); // Render to PNG, pass query parameters
    console.timeEnd("render");
    res.set("Content-Type", "image/png");
    res.send(pngBuffer);
  } catch (error) {
    console.error("Error in /api:", error);
    res.status(500).send("Error generating avatar");
  }
});

app.listen(port, () => console.log(`App listening on port localhost:${port}`));

module.exports = app; // For testing, if needed

async function renderSvgToPng(svgString, queryParams) {
  try {
    // Get width from query parameters, default to 640 if not provided or invalid
    let width = parseInt(queryParams.width) || 320;
    if (isNaN(width) || width <= 0) {
      width = 320; // Default value
    }

    if (width > 640) width = 8;

    let height = parseInt(queryParams.height); //we try to get height
    //If height is provided use it, otherwise sharp will calculate height preserving the aspect ratio
    if (isNaN(height) || height <= 0) {
      height = null;
    }

    const pngBuffer = await sharp(Buffer.from(svgString), {})
      .resize({ width: width, height: height, fit: "inside" }) // Resize, preserving aspect ratio, fitting within dimensions
      .jpeg({
        progressive: true,
      }) // Convert to PNG
      .toBuffer(); // Get the buffer

    return pngBuffer;
  } catch (error) {
    console.error("ERROR RENDERING", error); // Log the actual error for debugging
    throw new Error("Error rendering SVG to PNG: " + error.message, {
      cause: error,
    });
  }
}
