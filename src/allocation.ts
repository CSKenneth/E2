export {};

type ShiftResults = {
  assignedCrew: number;
  production: number;
  consumption: number;
  balance: number;
};

type SupplyBarRecord = {
  label: string;
  value: number;
  color: string;
};

const canvas = document.querySelector<HTMLCanvasElement>(
  "#allocation-canvas",
)!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let assigned = 2;

// Calculate shift results independently of the DOM and canvas.
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

// Draw the crew assignments.
function drawCrewAssignments(assignedCrew: number): void {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < assignedCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);

    ctx.fillStyle = i < assignedCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedCrew} / 6`, 18, 76);
}

// Render production and consumption from typed display records.
function drawSupplyBars(results: ShiftResults): void {
  const supplyBars: SupplyBarRecord[] = [
    {
      label: "Production",
      value: results.production,
      color: "#27766b",
    },
    {
      label: "Consumption",
      value: results.consumption,
      color: "#a44d23",
    },
  ];

  for (const [index, bar] of supplyBars.entries()) {
    const labelY = 102 + index * 52;
    const barY = labelY + 8;

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${bar.label}: ${bar.value}`, 18, labelY);

    ctx.fillStyle = bar.color;
    ctx.fillRect(18, barY, bar.value * 14, 20);
  }
}

// Render the numerical shift report from the same calculated results.
function renderReadout(results: ShiftResults): void {
  const formattedBalance = `${
    results.balance > 0 ? "+" : ""
  }${results.balance}`;

  readout.textContent =
    `Assigned: ${results.assignedCrew}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${formattedBalance}`;
}

// Update both presentations using the same shift results.
function updateDisplay(): void {
  const results = calShift(assigned);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCrewAssignments(results.assignedCrew);
  drawSupplyBars(results);
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
