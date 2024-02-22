import {mcprefix, consoleprefix } from './index.js';
import { world, system, EntityDamageCause, Player } from "@minecraft/server";

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
        if (damagingEntity instanceof Player) {
          deathMessage = "zastrzelony przez §l" + damagingEntity.name + "§l§r przy użyciu §l" + damagingProjectile?.typeId + "§l";
        } else {
          deathMessage = "zastrzelony przez §l" + damagingEntity?.typeId + "§l§r przy użyciu §l" + damagingProjectile?.typeId + "§l";
        }


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
