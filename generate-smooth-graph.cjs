// File: generate-smooth-graph.js

const fs = require("fs");

// Função para gerar valores suaves
function generateSmoothPoints(length = 50, start = 100, variance = 10) {
  const points = [];
  let value = start;
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * variance;
    points.push(value);
  }
  return points;
}

// Função para criar path SVG com curva suave
function createSmoothPath(points, width = 800, height = 200) {
  const stepX = width / (points.length - 1);
  let d = `M0,${height - points[0]}`;
  for (let i = 1; i < points.length; i++) {
    const x = i * stepX;
    const y = height - points[i];
    const cx = x - stepX / 2;
    const cy = height - (points[i - 1] + points[i]) / 2;
    d += ` Q${cx},${cy} ${x},${y}`;
  }
  return d;
}

// Gerar múltiplas curvas para animação
function buildSVGAnimation(frames = 10) {
  const width = 800;
  const height = 200;
  const duration = 5; // segundos
  const values = [];

  for (let i = 0; i < frames; i++) {
    const points = generateSmoothPoints();
    const d = createSmoothPath(points, width, height);
    values.push(d);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#0d1117">
  <path d="${values[0]}" fill="none" stroke="#1e90ff" stroke-width="2">
    <animate attributeName="d" dur="${duration}s" repeatCount="indefinite"
      values="${values.join(";\n")}" />
  </path>
</svg>`;
}

// Salvar SVG
const svgContent = buildSVGAnimation();
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/smooth-graph.svg", svgContent);
console.log("✔ SVG animado gerado com sucesso em dist/smooth-graph.svg");
