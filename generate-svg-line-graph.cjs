// generate-svg-line-graph.cjs
const fs = require("fs");
const path = require("path");

const width = 800;
const height = 200;
const margin = 20;
const frames = 5;
const duration = 5; // segundos

function generateData(len = 60, start = 100, variance = 2) {
  const pts = [];
  let v = start;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * variance;
    pts.push(v);
  }
  return pts;
}

function scaleY(val, min, max) {
  return height - margin - ((val - min) / (max - min)) * (height - 2 * margin);
}

const allFrames = [];
let base = generateData();
const min = Math.min(...base);
const max = Math.max(...base);

// preenche os frames animados (apenas variando a ponta)
for (let f = 0; f < frames; f++) {
  base.shift();
  base.push(base[base.length - 1] + (Math.random() - 0.5) * 2);
  allFrames.push([...base]);
}

// monta o atributo values do <animate>
const values = allFrames.map(arr => {
  return arr.map((v, i) => {
    const x = margin + (i * (width - 2 * margin)) / (arr.length - 1);
    const y = scaleY(v, min, max);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}).join(";");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg" style="background:#0d1117">
  <style>
    .grid { stroke:#333; stroke-width:0.5; }
    .axis { fill:#ccc; font-size:12px; font-family:Arial; }
    .line { fill:none; stroke:#00bcd4; stroke-width:2; }
  </style>

  <!-- horizontais -->
  ${[0,0.25,0.5,0.75,1].map(v=>{
    const y = margin + v*(height-2*margin);
    return `<line x1="${margin}" y1="${y}" x2="${width-margin}" y2="${y}" class="grid"/>`;
  }).join("\n  ")}

  <!-- labels Y -->
  ${[0,0.25,0.5,0.75,1].map(v=>{
    const y = margin + v*(height-2*margin) + 4;
    const val = (max - v*(max-min)).toFixed(2);
    return `<text x="${width-margin+5}" y="${y}" class="axis" text-anchor="start">${val}</text>`;
  }).join("\n  ")}

  <path class="line">
    <animate attributeName="d" dur="${duration}s" repeatCount="indefinite"
      values="${values}" />
  </path>
</svg>`;

fs.mkdirSync(path.join(__dirname,"dist"), {recursive:true});
fs.writeFileSync(path.join(__dirname,"dist","line-graph.svg"), svg);
console.log("✔ dist/line-graph.svg gerado");
