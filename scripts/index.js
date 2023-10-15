import { world, system, EntityDamageCause, Player } from "@minecraft/server";
import "./tps.js";
import { getTps } from "./tps.js";

export const mcprefix = "§7[§aBDS§1 Auto Enable §a]§r ";
export const consoleprefix = "[BDS Auto Enable] ";

world.afterEvents.playerSpawn.subscribe(
  ({ player, initialSpawn }) => {
      if (!initialSpawn) return;
      console.log("PlayerJoin:" + player.name);
  },
);

world.afterEvents.entityDie.subscribe(
  ({ deadEntity: player, damageSource: { cause , damagingEntity} }) => {
    const name = player.name;
    let damageRR;

    if(cause == EntityDamageCause.entityAttack){
      damageRR = damagingEntity?.typeId;
      if(damagingEntity instanceof Player ){
        damageRR = damagingEntity.name;
      }
    } else {
      damageRR = cause;
    }
    console.log("PlayerDeath:" + name +" Casue:" + damageRR );

  },
  { entityTypes: [ "minecraft:player" ] },
);
//TODO: Dodać wsparcja dla 
// PlayerBreakBlockBeforeEvent (https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerbreakblockbeforeevent)
// PlayerPlaceBlockBeforeEvent (https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerplaceblockbeforeevent)
//
//


const cooldowns = new Map();
world.beforeEvents.chatSend.subscribe((data) => {
    if (cooldowns.has(data.sender.name) && (Date.now() - cooldowns.get(data.sender.name)) / 1000 < 2) {
      data.sender.sendMessage(mcprefix + "§cZwolnij troche! (2s)");
      data.cancel = true;
    } else {
      cooldowns.set(data.sender.name, Date.now());
      const name = data.sender.name;
      const message = data.message;

      if(message.startsWith("!tps")){
        getTps();
       data.cancel = true; 
      return;
      }

      console.log("PlayerChat:"+ name + " Message:" + message);
    }
  },
);


world.sendMessage(mcprefix +  '§3Wczytano!');
console.log(consoleprefix + 'Wczytano!');
