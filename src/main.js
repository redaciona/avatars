const express = require("express");
const cors = require("cors"); // Added cors import
const { generateAvatar } = require("./avatarGenerator");
const { config } = require("dotenv");
const sharp = require("sharp"); // Import sharp

config(); // Load environment variables

const app = express();

app.use(cors({
  origin: "*",
  methods: "*",
  credentials: true,
  allowedHeaders: "*",
  exposeHeaders: "*",
  preflightContinue: true,
  exposedHeaders: "*",
  optionsSuccessStatus: 204,
})); // Accept ALL domains (development only)

const port = process.env.PORT || "10000";

app.get("/", (_, res) => res.redirect(302, "https://www.redaciona.com.br/"));

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

/**
 * GET /api/random
 * Generate one or more random avatars
 * @param {number} count - Number of avatars to generate (1-10)
 * @returns {Object} JSON with base64 encoded PNG avatars
 */
app.get("/api/random", async (req, res) => {
  try {
    let count = parseInt(req.query.count) || 1;
    count = Math.min(Math.max(count, 1), 10); // Limit between 1 and 10

    console.time("generateRandomAvatars");
    const avatarPromises = Array(count).fill().map(async (_, index) => {
      console.time(`avatar_${index + 1}`);
      const avatarSvg = await generateAvatar(req.query, res); // Passando req.query aqui
      console.timeEnd(`avatar_${index + 1}`);
      
      console.time(`render_${index + 1}`);
      const pngBuffer = await renderSvgToPng(avatarSvg, { width: 128 });
      console.timeEnd(`render_${index + 1}`);
      
      return {
        id: index + 1,
        base64: `data:image/png;base64,${pngBuffer.toString('base64')}`
      };
    });

    const avatars = await Promise.all(avatarPromises);
    console.timeEnd("generateRandomAvatars");

    if (count === 1) {
      res.json(avatars[0]); // Para um único avatar, retorna objeto direto
      return;
    }

    res.json({
      count: avatars.length,
      avatars: avatars
    });
  } catch (error) {
    console.error("Error in /api/random:", error);
    res.status(500).send("Error generating avatars");
  }
});

app.listen(port, () => console.log(`App listening on port localhost:${port}`));

module.exports = app; // For testing, if needed

async function renderSvgToPng(svgString, queryParams) {
  try {
    // Get width from query parameters, default to 640 if not provided or invalid
    let width = parseInt(queryParams.width) || 128;
    if (isNaN(width) || width <= 0) {
      width = 128; // Default value
    }

    if (width > 640) width = 8;

    let height = parseInt(queryParams.height); //we try to get height
    //If height is provided use it, otherwise sharp will calculate height preserving the aspect ratio
    if (isNaN(height) || height <= 0) {
      height = null;
    }

    const pngBuffer = await sharp(Buffer.from(svgString), {})
      .resize({ width: width, height: height, fit: "inside" }) // Resize, preserving aspect ratio, fitting within dimensions
      .png({
        progressive: false,
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
