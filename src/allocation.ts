export {};

type ShiftResults = {
  assignedCrew: number;
  production: number;
  consumption: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>(
  "#allocation-canvas",
)!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assigned = 2;

// Calculate shift results without depending on the DOM or canvas.
function calShift(assignedCrew: number): ShiftResults {
  const production = assignedCrew * 3;
  const consumption = 6;

  return {
    assignedCrew,
    production,
    consumption,
    balance: production - consumption,
  };
}

// Draw the crew assignments and supply bars using calculated results.
function renderChart(results: ShiftResults): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.assignedCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.assignedCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.assignedCrew} / 6`, 18, 76);
  ctx.fillText(`Production: ${results.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.production * 14, 20);

  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumption * 14, 20);
}

// Format the numerical shift report using the same calculated results.
function renderReadout(results: ShiftResults): void {
  const balance = `${results.balance > 0 ? "+" : ""}${results.balance}`;

  readout.textContent =
    `Assigned: ${results.assignedCrew}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${balance}`;
}

function updateDisplay(): void {
  const results = calShift(assigned);
  renderChart(results);
  renderReadout(results);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assigned = Math.max(0, assigned - 1);
  updateDisplay();
};

document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assigned = Math.min(6, assigned + 1);
  updateDisplay();
};

document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assigned = 2;
    updateDisplay();
  };

updateDisplay();
