import { world, system, EntityDamageCause, Player } from "@minecraft/server";
import "./tps.js";
import { getTps } from "./tps.js";

const appHandledMessages = false;
export const mcprefix = "§7[§aBDS§1 Auto Enable §a]§r ";
export const consoleprefix = "[BDS Auto Enable] ";

world.afterEvents.playerSpawn.subscribe(
  ({ player, initialSpawn }) => {
    if (initialSpawn) console.log("PlayerJoin:" + player.name);
    console.log("PlayerSpawn:" + player.name);
  },
);

world.afterEvents.playerDimensionChange.subscribe(({ player, fromDimension, fromLocation, toDimension, toLocation }) => {
  // console.log("Z wymiaru: " + fromDimension.id);
  // console.log("Na wymiar: " + toDimension.id);
  // console.log("Lokacja przed zmianą wymiaru: " + fromLocation.x + " " + fromLocation.y + " " + fromLocation.z);
  // console.log("Lokacja po zmianie wymiaru: " + toLocation.x + " " + toLocation.y + " " + toLocation.z);

  console.log("DimensionChangePlayer: " + player.name + " From:" + fromDimension.id + " To:" + toDimension.id)
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
    // console.log(
    //   "id:", event.id,
    //   "message:", event.message,
    //   "sourceType:", event.sourceType
    // );
    
    if(event.id == "bds:tps"){
      getTps();;
    }

});

/**
 * Używam §lCOS§l§r aby w BDS-Auto-Enable podmienic §l na ** i wiadomość na discord byłą wybrubiona
 */

world.afterEvents.entityDie.subscribe(
  ({ deadEntity: player, damageSource: { cause, damagingEntity, damagingProjectile } }) => {
    const name = player.name;
    let deathMessage;

    switch (cause) {
      case EntityDamageCause.entityAttack:
        if (damagingEntity instanceof Player) {
          deathMessage = "zabity przez §l" + damagingEntity.name + "§l";
        } else {
          deathMessage = "zabity przez §l" + damagingEntity?.typeId + "§l";
        }
        break;

      case EntityDamageCause.entityExplosion:
      case EntityDamageCause.blockExplosio:
        deathMessage = "wysadzony w powietrze przez §l" + damagingEntity?.typeId + "§l";
        break;

      case EntityDamageCause.projectile:
        deathMessage = "zastrzelony przez §l" + damagingEntity?.typeId + "§l§r przy użyciu §l" + damagingProjectile?.typeId + "§l";
        break;

      case EntityDamageCause.fall:
        deathMessage = "§lspadł z wysokości§l";
        break;

      case EntityDamageCause.drowning:
        deathMessage = "§lutonoł§l"
        break;

      case EntityDamageCause.fireTick:
        deathMessage = "§lstanoł w płomieniach§l"
        break;

      case EntityDamageCause.suffocation:
        deathMessage = "§lzadusił się w ścianie§l"
        break;

      case EntityDamageCause.flyIntoWall:
        deathMessage = "§lwleciał w ściane§l"
        break;

      case EntityDamageCause.anvil:
        deathMessage = "został zgnieciony przez spadające §lkowadło§l"
        break;

      case EntityDamageCause.freezing:
        deathMessage = "§lzamarzł§l"
        break;

      case EntityDamageCause.fireworks:
        deathMessage = "§leksplodował z hukiem§l"
        break;

      case EntityDamageCause.stalactite:
        deathMessage = "został przebity przez spadający §lstalaktyt§l"
        break;

      case EntityDamageCause.suicide:
        deathMessage = "popełnił §lsamobójstwo§l"
        break;

      default:
        deathMessage = "zabity przez §l" + cause + "§l";
        break;
    }

    console.log("PlayerDeath:" + name + " DeathMessage:" + deathMessage);
  },
  { entityTypes: ["minecraft:player"] },
);


const cooldowns = new Map();
world.beforeEvents.chatSend.subscribe((data) => {
  const player = data.sender;
  const name = player.name;
  const message = data.message;

  if (cooldowns.has(name) && (Date.now() - cooldowns.get(name)) / 1000 < 2) {
    data.sender.sendMessage(mcprefix + "§cZwolnij troche! (2s)");
    data.cancel = true;
  } else {
    if (message.startsWith("!")) {
      console.log("PlayerCommand:" + name + " Command:" + message + " Op:" + player.isOp());
      data.cancel = true;
      return;
    }

    if (!player.isOp()) {
      cooldowns.set(name, Date.now());
    }

    console.log("PlayerChat:" + name + " Message:" + message);
    data.cancel = appHandledMessages;
  }
},
);


world.sendMessage(mcprefix + '§3Wczytano!');
console.log(consoleprefix + 'Wczytano!');
