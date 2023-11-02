import { world, system } from '@minecraft/server';
import {mcprefix, consoleprefix } from './index.js';


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
    
export function getTps(){
    getCurrentTPS().then((tps) => {
        let tpsMess = mcprefix + `TPS: `;
        if (tps >= 17) {
            tpsMess += `§2${parseInt(tps)}/20`; 
        } else if (tps >= 10) {
            tpsMess += `§e${parseInt(tps)}/20`; 
        } else {
            tpsMess += `§c${parseInt(tps)}/20`; 
        }
        world.sendMessage(tpsMess);
        console.log(consoleprefix +`TPS: ` + parseInt(tps));

      }).catch((error) => {
        console.error(`An error occurred: ${error}`);
      });
}

system.runInterval(()=>{getTps()} , 3000);
system.runInterval(()=>{getTps()} , 2999);
system.runInterval(()=>{getTps()} , 2998);

