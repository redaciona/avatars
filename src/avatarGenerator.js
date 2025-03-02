const { getParts } = require('./getParts');

const avatarGenerator = async (params, response) => {
    try {
        const { bg, body, hair, eyes, mouth, face, outfit, accessory } = params;

        const background = bg || 'rgb(252 165 165)'; // Default background

        const svgParts = [
            getParts('bg', null, undefined, response), // Background
            getParts('body', body, undefined, response),      // Body
            getParts('outfits', outfit, 25, response),      // Outfit
            getParts('faces', face, 8, response),        // Face
            getParts('hairs', hair, 32, response),       // Hair
            getParts('eyes', eyes, 6, response),           // Eyes
            getParts('mouths', mouth, 10, response),        // Mouth
            getParts('accessories', accessory, 18, response),    // Accessories
        ];

        // Filter out any undefined parts (e.g., if an error occurred in getParts)
        const validSvgParts = svgParts.filter(part => part !== undefined);


        const svg = `
    <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${background}"/>
      ${validSvgParts.join('\n')}
    </svg>
  `;

        return svg;
    } catch (error) {
        console.error("Error in avatarGenerator:", error);
        throw new Error("Error generating avatar SVG: " + error.message, {cause: error}); // Re-throw for handling in main.js
    }
};

module.exports = { generateAvatar: avatarGenerator };