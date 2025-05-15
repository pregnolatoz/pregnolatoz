const fs = require("fs");

const tickers = [
  { name: "PETR4", color: "#007bff" },
  { name: "MGLU3", color: "#28a745" },
  { name: "IBOV", color: "#dc3545" },
  { name: "SPX", color: "#17a2b8" }
];

function generateRandomPercentage(base = 0, variance = 1) {
  return (base + (Math.random() - 0.5) * variance).toFixed(2);
}

function getColor(value) {
  return value > 0 ? "#00ff90" : value < 0 ? "#ff4d4d" : "#cccccc";
}

const width = 600;
const height = 120;
const boxWidth = 120;
const boxHeight = 30;
const spacing = 20;

let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:#0d1117" font-family="Arial, sans-serif">
`;

tickers.forEach((ticker, i) => {
  const x = i * (boxWidth + spacing) + spacing;
  const y = 40;

  const keyframes = Array.from({ length: 10 }, () => generateRandomPercentage());
  const animationDur = 6; // segundos

  let animatedValue = ``;
  keyframes.forEach((val, idx) => {
    const begin = (idx * animationDur) / keyframes.length;
    animatedValue += `
      <tspan fill="${getColor(val)}" visibility="hidden">
        <set attributeName="visibility" to="visible" begin="${begin}s" dur="${animationDur / keyframes.length}s" repeatCount="indefinite" />
        ${val}%
      </tspan>`;
  });

  svgContent += `
  <g>
    <rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="8" ry="8"
      fill="#111" stroke="${ticker.color}" stroke-width="2"/>
    <text x="${x + 10}" y="${y + 20}" fill="#fff" font-size="14">${ticker.name}</text>
    <text x="${x + 70}" y="${y + 20}" font-size="14" text-anchor="start">
      ${animatedValue}
    </text>
  </g>
  `;
});

svgContent += `</svg>`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/stocks-ticker.svg", svgContent);
console.log("✔ SVG de ações animado com valores visíveis gerado!");
