import { world, system } from "@minecraft/server";
import { mcprefix, consoleprefix } from "./index.js";

let lastTick = Date.now();
const tickLengths = [];
let tickTotals = 0;

system.runInterval(() => tick());

function tick() {
  const now = Date.now();
  const deltaTime = (now - lastTick) / 1000;
  tickLengths.unshift(deltaTime);
  tickTotals += deltaTime;
  while (tickTotals > 1) {
    tickTotals -= tickLengths.pop();
  }

  lastTick = now;
}

export function getTps() {
  const tps = tickLengths.length;
  //Narazie TPS są jako int ale kiedyś możliwe że będą jako double dlatego przystosowuje je pod to
  let tpsMess = mcprefix + `TPS: `;
  if (tps >= 17) {
    tpsMess += `§2${tps.toFixed(2)}/20.00`;
  } else if (tps >= 10) {
    tpsMess += `§e${tps.toFixed(2)}/20.00`;
  } else {
    tpsMess += `§c${tps.toFixed(2)}/20.00`;
  }

  if (tps < 19) {
    world.sendMessage(tpsMess);
  }

  console.log(consoleprefix + `TPS: ` + parseInt(tps));
}

system.runInterval(() => {
  getTps();
}, 20 * 150);
system.runInterval(() => {
  getTps();
}, 20 * 150 - 15);
system.runInterval(() => {
  getTps();
}, 20 * 150 - 25);
