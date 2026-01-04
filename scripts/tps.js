import { world, system } from "@minecraft/server";
import { mcprefix, consoleprefix } from "./index.js";
import { sendActionBarToAdmins } from "./Util.js";

let lastTimestamp = Date.now();
let tps = 20.00;
const SAMPLE_SIZE = 20;
const timeSamples = [];

// Używamy runInterval(..., 1), co odpowiada wykonaniu w każdym ticku
system.runInterval(() => {
    const now = Date.now();
    const delta = now - lastTimestamp;
    lastTimestamp = now;

    // Ignorujemy nienaturalnie długie przerwy (np. przy ładowaniu świata)
    if (delta > 0) {
        timeSamples.push(delta);
    }
    
    if (timeSamples.length > SAMPLE_SIZE) {
        timeSamples.shift();
    }

    if (timeSamples.length > 0) {
        const averageDelta = timeSamples.reduce((a, b) => a + b) / timeSamples.length;
        // Obliczamy TPS: 1000ms / średni czas trwania ticku
        tps = Math.min(20, 1000 / averageDelta);
    }
}, 1);

export function getTpsValue() {
    return tps;
}

export function getTps() {
  const tps = getTpsValue();
  //Narazie TPS są jako int ale kiedyś możliwe że będą jako double dlatego przystosowuje je pod to
  let tpsMess = mcprefix + `TPS: `;
  if (tps >= 17) {
    tpsMess += `§2${tps.toFixed(2)}/20.00`;
  } else if (tps >= 10) {
    tpsMess += `§e${tps.toFixed(2)}/20.00`;
  } else {
    tpsMess += `§c${tps.toFixed(2)}/20.00`;
  }

  sendActionBarToAdmins(tpsMess);

  if (tps < 17) {
    world.sendMessage(tpsMess);
    console.log(consoleprefix + `TPS: ` + tps.toFixed(2));
  }
}

system.runInterval(() => {
  getTps();
}, 20 * 150);


// system.runInterval(() => {
//   getTps();
// }, 20 * 150 - 15);
//
// system.runInterval(() => {
//   getTps();
// }, 20 * 150 - 25);
