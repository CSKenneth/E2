export {};

type Command = {
  label: string;
  execute(): void;
};

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];
const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const queueDisplay = document.querySelector<HTMLOListElement>(
  "#rover-pending",
)!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

const forwardButton = document.querySelector<HTMLButtonElement>(
  "#rover-forward",
)!;
const rightButton = document.querySelector<HTMLButtonElement>("#rover-right")!;
const resetButton = document.querySelector<HTMLButtonElement>("#rover-reset")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;
let x = 2;
let y = 2;
let directionIndex = 0;
const commandQueue: Command[] = [];

function drawRover(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(directionIndex * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[directionIndex].name
  }`;
}

function renderQueue(): void {
  queueDisplay.replaceChildren();

  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    queueDisplay.appendChild(item);
  }

  queueStatus.textContent = commandQueue.length === 0
    ? "Queue is empty"
    : `${commandQueue.length} command(s) pending`;

  runButton.disabled = commandQueue.length === 0;
  clearButton.disabled = commandQueue.length === 0;
}

function enqueueCommand(command: Command): void {
  commandQueue.push(command);
  renderQueue();
}

const forwardCommand: Command = {
  label: "Forward",
  execute(): void {
    const direction = directions[directionIndex];

    x = Math.max(0, Math.min(4, x + direction.dx));
    y = Math.max(0, Math.min(4, y + direction.dy));
  },
};

const rightCommand: Command = {
  label: "Right",
  execute(): void {
    directionIndex = (directionIndex + 1) % directions.length;
  },
};

forwardButton.onclick = () => {
  enqueueCommand(forwardCommand);
};

rightButton.onclick = () => {
  enqueueCommand(rightCommand);
};

runButton.onclick = () => {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    command.execute();
  }

  renderQueue();
  drawRover();
};

clearButton.onclick = () => {
  commandQueue.length = 0;
  renderQueue();
};

resetButton.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  commandQueue.length = 0;
  renderQueue();
  drawRover();
};

drawRover();
renderQueue();
