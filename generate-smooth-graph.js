// File: generate-line-graph.js

const fs = require("fs");

const width = 1920;
const height = 400;
const graphHeight = 300;
const marginLeft = 80;
const marginBottom = 40;
const frames = 10;
const duration = 5;

function generateData(length = 60, start = 100, variance = 5) {
  const points = [];
  let value = start;
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * variance;
    points.push(value);
  }
  return points;
}

function normalizePoints(data, min, max) {
  return data.map((v) => ((v - min) / (max - min)) * graphHeight);
}

function buildPath(points) {
  const stepX = (width - marginLeft) / (points.length - 1);
  let d = `M${marginLeft},${height - marginBottom - points[0]}`;
  for (let i = 1; i < points.length; i++) {
    const x = marginLeft + i * stepX;
    const y = height - marginBottom - points[i];
    d += ` L${x},${y}`;
  }
  return d;
}

function buildArea(points) {
  const stepX = (width - marginLeft) / (points.length - 1);
  let d = `M${marginLeft},${height - marginBottom}`;
  for (let i = 0; i < points.length; i++) {
    const x = marginLeft + i * stepX;
    const y = height - marginBottom - points[i];
    d += ` L${x},${y}`;
  }
  d += ` L${width},${height - marginBottom} Z`;
  return d;
}

function buildYLabels(min, max) {
  const labels = [];
  for (let i = 0; i <= 4; i++) {
    const value = max - ((max - min) / 4) * i;
    const y = marginBottom + (graphHeight / 4) * i;
    labels.push(`<text x="10" y="${y + 5}" fill="#ccc" font-size="24">${value.toFixed(2)}</text>`);
  }
  return labels.join("\n");
}

function buildSVGAnimation() {
  const values = [];
  const areas = [];
  let globalMin = Infinity;
  let globalMax = -Infinity;

  const datasets = Array.from({ length: frames }, () => {
    const raw = generateData();
    const min = Math.min(...raw);
    const max = Math.max(...raw);
    if (min < globalMin) globalMin = min;
    if (max > globalMax) globalMax = max;
    return raw;
  });

  for (const raw of datasets) {
    const normalized = normalizePoints(raw, globalMin, globalMax);
    values.push(buildPath(normalized));
    areas.push(buildArea(normalized));
  }

  const yLabels = buildYLabels(globalMin, globalMax);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#0d1117;font-family:sans-serif">
  ${yLabels}
  <path fill="rgba(30,144,255,0.2)">
    <animate attributeName="d" dur="${duration}s" repeatCount="indefinite"
      values="${areas.join(";\n")}" />
  </path>
  <path stroke="#1e90ff" stroke-width="3" fill="none">
    <animate attributeName="d" dur="${duration}s" repeatCount="indefinite"
      values="${values.join(";\n")}" />
  </path>
</svg>`;
}

// Salvar
const svgContent = buildSVGAnimation();
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/smooth-graph.svg", svgContent);
console.log("✔ SVG animado gerado com sucesso!");

