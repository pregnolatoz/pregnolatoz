// Arquivo: generate-line-graph.cjs
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

const width = 700;
const height = 250;

const canvasRenderService = new ChartJSNodeCanvas({ width, height, backgroundColour: "#0d1117" });

// Gera uma série de dados simulando flutuações com leve animação na ponta
function generateData(points = 60) {
  let data = [];
  let value = 100;
  for (let i = 0; i < points; i++) {
    value += Math.random() * 4 - 2;
    data.push(parseFloat(value.toFixed(2)));
  }
  return data;
}

(async () => {
  const data = generateData();

  const config = {
    type: "line",
    data: {
      labels: data.map((_, i) => i.toString()),
      datasets: [
        {
          label: "Preço Simulado",
          data,
          borderColor: "#00bcd4",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: {
            color: "#cccccc"
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        },
        y: {
          position: "right",
          ticks: {
            color: "#cccccc"
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        }
      }
    }
  };

  const imageBuffer = await canvasRenderService.renderToBuffer(config);
  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("line-graph.svg", imageBuffer);
  console.log("✔ SVG animado gerado com sucesso em line-graph.svg");
})();
