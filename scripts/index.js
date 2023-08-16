import { world, system, EntityDamageCause, Player } from "@minecraft/server";

export const mcprefix = "§7[§aBDS§1 Auto Enable §a]§r ";
export const consoleprefix = "[BDS Auto Enable] ";



//world.afterEvents.entityDie.subscribe(
//  ({ deadEntity: player, damageSource: { cause , damagingEntity} }) => {
//    const name = player.name;
//    let message;
//
//    if(cause == EntityDamageCause.entityAttack){
//      message = "umarł przez " +  damagingEntity?.typeId;
//      if(damagingEntity instanceof Player ){
//        message = "umarł przez " +  damagingEntity.name;
//      }
//    } else {
//      message = "umarł przez " +  cause;
//    }
//
//  },
//  { entityTypes: [ "minecraft:player" ] },
//);

const cooldowns = new Map();
world.beforeEvents.chatSend.subscribe((data) => {
    if (cooldowns.has(data.sender.name) && (Date.now() - cooldowns.get(data.sender.name)) / 1000 < 2) {
      data.sender.sendMessage("§cZwolnij troche! (2s)");
      data.cancel = true;
    } else {
      cooldowns.set(data.sender.name, Date.now());
      const name = data.sender.name;
      const message = data.message;
      if(message.startsWith("!tps")){
          getTps(false);
          data.cancel = true;
      }
      console.log("[Chat] PlayerChat:"+ name + " Message:" + message)
      system.run(() => sendRequest(chatMessage(name, message)));
    }
  },
);

world.sendMessage(mcprefix +  '§3Wczytano!');
console.log(consoleprefix + 'Wczytano!');