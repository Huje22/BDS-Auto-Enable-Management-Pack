import { world, system } from '@minecraft/server';
import { mcprefix, consoleprefix } from './index.js';

function getCurrentTPS() {
    const start = Date.now();
    let tps = 0;
    return new Promise((resolve) => {
        const run = system.runInterval(() => {
            if (Date.now() - start < 1000) {
                tps += 1;
            } else {
                system.clearRun(run);
                resolve(tps);
            }
        });
    });
}

export function getTps() {
    getCurrentTPS().then((tps) => {
        //Narazie TPS są jako int ale kiedyś możliwe że będą jako double dlatego przystosowuje je pod to
        let tpsMess = mcprefix + `TPS: `;
        if (tps >= 17) {
            tpsMess += `§2${tps.toFixed(2)}/20.00`;
        } else if (tps >= 10) {
            tpsMess += `§e${tps.toFixed(2)}/20.00`;
        } else {
            tpsMess += `§c${tps.toFixed(2)}/20.00`;
        }
        world.sendMessage(tpsMess);
        console.log(consoleprefix + `TPS: ` + parseInt(tps));

    }).catch((error) => {
        world.sendMessage(mcprefix
            + 'Nie udało się pozyskać ilości TPS servera' +
            error);
        console.error(`An error occurred: ${error}`);
    });
}

system.runInterval(() => { getTps() }, 20 * 150);
system.runInterval(() => { getTps() }, 20 * 150 - 15);
system.runInterval(() => { getTps() }, 20 * 150 - 25);