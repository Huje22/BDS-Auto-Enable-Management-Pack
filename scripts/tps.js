import { world, system } from '@minecraft/server';
import {mcprefix, consoleprefix } from './index.js';

let tps = 0;
let lastTime = Date.now();

system.runInterval(()=>{
  let times = Date.now() - lastTime;
  tps = 1/(times/1000);
  lastTime = Date.now();

});
    
export function getTps(){
    let tpsMess = mcprefix + `TPS: `;
    if (tps >= 15) {
        tpsMess += `§2${parseInt(tps)}/20`; 
    } else if (tps >= 15) {
        tpsMess += `§e${parseInt(tps)}/20`; 
    } else {
        tpsMess += `§c${parseInt(tps)}/20`; 
    }
    world.sendMessage(tpsMess);
    console.log(consoleprefix +`TPS: ` + parseInt(tps));
    
}

   
system.runInterval(()=>{getTps()} , 6000)