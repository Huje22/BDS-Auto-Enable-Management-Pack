import { world, system, EntityDamageCause, Player } from "@minecraft/server";

export const mcprefix = "§7[§aBDS§1 Auto Enable §a]§r ";
export const consoleprefix = "[BDS Auto Enable] ";

world.afterEvents.entityDie.subscribe(
  ({ deadEntity: player, damageSource: { cause , damagingEntity} }) => {
    const name = player.name;
    let damageRR;

    if(cause == EntityDamageCause.entityAttack){
      damageRR = damagingEntity?.typeId;
      if(damagingEntity instanceof Player ){
        damageRR = damagingEntity.name;
      }
    } else {ł
      damageRR = cause;
    }
    console.log("PlayerDeath:" + name +" Casue:" + damageRR );

  },
  { entityTypes: [ "minecraft:player" ] },
);

const cooldowns = new Map();
world.beforeEvents.chatSend.subscribe((data) => {
    if (cooldowns.has(data.sender.name) && (Date.now() - cooldowns.get(data.sender.name)) / 1000 < 2) {
      data.sender.sendMessage(mcprefix + "§cZwolnij troche! (2s)");
      data.cancel = true;
    } else {
      cooldowns.set(data.sender.name, Date.now());
      const name = data.sender.name;
      const message = data.message;
      console.log("PlayerChat:"+ name + " Message:" + message);
    }
  },
);


world.sendMessage(mcprefix +  '§3Wczytano!');
console.log(consoleprefix + 'Wczytano!');