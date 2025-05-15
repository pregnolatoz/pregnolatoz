const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "dist", "stocks-ticker.svg");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100%" height="50" viewBox="0 0 800 50" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #0d1117; }
    .text { fill: #ccc; font-size: 16px; font-family: Arial, sans-serif; }
    .positive { fill: #00ff88; }
    .negative { fill: #ff4455; }
  </style>
  <rect class="bg" width="100%" height="100%" />
  
  <text x="10" y="30" class="text">PETR4: <tspan class="negative">
    <animate attributeName="text" values="2.60%;2.61%;2.59%;2.60%" dur="4s" repeatCount="indefinite" /></tspan></text>

  <text x="150" y="30" class="text">MGLU3: <tspan class="positive">
    <animate attributeName="text" values="2.07%;2.08%;2.06%;2.07%" dur="4s" repeatCount="indefinite" /></tspan></text>

  <text x="300" y="30" class="text">IBOV: <tspan class="negative">
    <animate attributeName="text" values="-0.39%;-0.40%;-0.38%;-0.39%" dur="4s" repeatCount="indefinite" /></tspan></text>

  <text x="450" y="30" class="text">SPX: <tspan class="positive">
    <animate attributeName="text" values="0.10%;0.12%;0.09%;0.10%" dur="4s" repeatCount="indefinite" /></tspan></text>
</svg>`;

fs.writeFileSync(outputPath, svgContent);
console.log("✅ SVG dos tickers gerado em:", outputPath);
