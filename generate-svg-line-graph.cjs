// generate-svg-line-graph.cjs
const fs   = require("fs");
const path = require("path");

// ── Layout ───────────────────────────────────────────────────────────────────
const width       = 800;
const height      = 200;
const margin      = 20;
const marginRight = 43;                       // espaço extra à direita
const drawWidth   = width - 1.15 * margin;    // seu cálculo original
const drawRight   = margin + drawWidth;       // limite efetivo do gráfico
const frames      = 5;
const duration    = 15;                       // duração da animação (s)

// ── Gera dados ────────────────────────────────────────────────────────────────
function generateData(len = 60, start = 100, variance = 2) {
  const pts = [];
  let v = start;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * variance;
    pts.push(v);
  }
  return pts;
}

// ── Escala Y ──────────────────────────────────────────────────────────────────
function scaleY(val, min, max) {
  return height - margin - ((val - min) / (max - min)) * (height - 2 * margin);
}

// ── Monta frames animados (só ponta) ─────────────────────────────────────────
const allFrames = [];
let base = generateData();
const min  = Math.min(...base);
const max  = Math.max(...base);
for (let f = 0; f < frames; f++) {
  base.shift();
  base.push(base[base.length - 1] + (Math.random() - 0.5) * 2);
  allFrames.push([...base]);
}

// ── Constrói atributos values para linha e área ──────────────────────────────
const valuesLine = [];
const valuesArea = [];
const baseY = height - margin;

allFrames.forEach(arr => {
  const pts = arr.map((v, i) => {
    const x = margin + (i * drawWidth) / (arr.length - 1);
    const y = scaleY(v, min, max);
    return { x, y };
  });

  // linha
  valuesLine.push(
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
       .join(" ")
  );

  // área (fecha até a base)
  const areaPath = [
    `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`,
    ...pts.slice(1).map(p => `L${p.x.toFixed(2)},${p.y.toFixed(2)}`),
    `L${pts[pts.length - 1].x.toFixed(2)},${baseY.toFixed(2)}`,
    `L${pts[0].x.toFixed(2)},${baseY.toFixed(2)}`,
    "Z"
  ].join(" ");
  valuesArea.push(areaPath);
});

const values       = valuesLine.join(";");
const valuesFill   = valuesArea.join(";");

// ── Labels X ─────────────────────────────────────────────────────────────────
const xLabels = ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

// ── Monta o SVG ───────────────────────────────────────────────────────────────
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width + marginRight}" height="${height}" viewBox="0 0 ${width + marginRight} ${height}"
     xmlns="http://www.w3.org/2000/svg" style="background:#0d1117">
  <style>
    .grid { stroke:#333;         stroke-width:0.5; }
    .axis { fill:#ccc;           font-size:12px; font-family:Arial; }
    .area { fill:rgba(0,255,255,0.2); }
    .line { fill:none; stroke:#00ffff; stroke-width:2; }
  </style>

  <!-- linhas de grade horizontais -->
  ${[0,0.25,0.5,0.75,1].map(v => {
    const y = margin + v*(height-2*margin);
    return `<line x1="${margin}" y1="${y}" x2="${drawRight}" y2="${y}" class="grid"/>`;
  }).join("\n  ")}

  <!-- labels Y à direita -->
  ${[0,0.25,0.5,0.75,1].map(v => {
    const y   = margin + v*(height-2*margin) + 4;
    const val = (max - v*(max-min)).toFixed(2);
    return `<text x="${width+5}" y="${y}" class="axis" text-anchor="start">${val}</text>`;
  }).join("\n  ")}

  <!-- labels X na base -->
  ${xLabels.map((hour,i) => {
    const px = margin + (i/(xLabels.length-1))*drawWidth;
    return `<text x="${px.toFixed(2)}" y="${height-5}" class="axis" text-anchor="middle">${hour}</text>`;
  }).join("\n  ")}

  <!-- área preenchida sob a curva -->
  <path class="area">
    <animate attributeName="d" dur="${duration}s" repeatCount="indefinite"
      values="${valuesFill}" />
  </path>

  <!-- linha animada -->
  <path class="line">
    <animate attributeName="d" dur="${duration}s" repeatCount="indefinite"
      values="${values}" />
  </path>
</svg>`;

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist", "line-graph.svg"), svg);
console.log("✔ dist/line-graph.svg gerado com sucesso");
