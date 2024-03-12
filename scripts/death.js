import { world, EntityDamageCause, Player } from "@minecraft/server";
import { getPostion } from "./Util";

world.afterEvents.entityDie.subscribe(
  ({ deadEntity: player, damageSource: { cause, damagingEntity, damagingProjectile } }) => {
    const name = player.name;
    let killer = "none";
    let deathMessage;
    let usedName = "none";

    switch (cause) {
      case EntityDamageCause.entityAttack:
        if (damagingEntity instanceof Player) {
          const itemName = damagingEntity.getComponent("inventory").container.getSlot(damagingEntity.selectedSlot).getItem().nameTag;

          if (itemName !== undefined) {
            usedName = itemName;
          }

          deathMessage = "zabity przez gracza " + damagingEntity.name;
          killer = damagingEntity.name
        } else {
          const killerNameTag = damagingEntity.nameTag;
          if (killerNameTag !== undefined && killerNameTag !== "") {
            deathMessage = "zabity przez " + killerNameTag;
            killer = killerNameTag;
          } else {
            deathMessage = "zabity przez " + damagingEntity?.typeId;
            killer = damagingEntity?.typeId;
          }
        }
        break;

      case EntityDamageCause.entityExplosion:
      case EntityDamageCause.blockExplosion:
        deathMessage = "wysadzony w powietrze przez " + damagingEntity?.typeId;
        killer = damagingEntity?.typeId;
        break;

      case EntityDamageCause.projectile:
        if (damagingEntity instanceof Player) {
          const itemName = damagingEntity.getComponent("inventory").container.getSlot(damagingEntity.selectedSlot).getItem().nameTag;

          if (itemName !== undefined) {
            usedName = itemName;
          }
          deathMessage = "zastrzelony przez gracza " + damagingEntity.name + " przy użyciu " + damagingProjectile?.typeId;
          killer = damagingEntity?.name;
        } else {
          const killerNameTag = damagingEntity.nameTag;
          if (killerNameTag !== undefined && killerNameTag !== "") {
            deathMessage = "zastrzelony przez " + killerNameTag + " przy użyciu " + damagingProjectile?.typeId;
            killer = killerNameTag;
          } else {
            deathMessage = "zabity przez " + damagingEntity?.typeId;
            killer = damagingEntity?.typeId;
          }
        }
        break;

      case EntityDamageCause.fall:
        deathMessage = "spadł z wysokości";
        break;

      case EntityDamageCause.drowning:
        deathMessage = "utonoł"
        break;

      case EntityDamageCause.fireTick:
        deathMessage = "stanoł w płomieniach"
        break;

      case EntityDamageCause.suffocation:
        deathMessage = "zadusił się w ścianie"
        break;

      case EntityDamageCause.flyIntoWall:
        deathMessage = "wleciał w ściane"
        break;

      case EntityDamageCause.anvil:
        deathMessage = "został zgnieciony przez spadające kowadło"
        break;

      case EntityDamageCause.freezing:
        deathMessage = "zamarzł"
        break;

      case EntityDamageCause.fireworks:
        deathMessage = "eksplodował z hukiem"
        break;

      case EntityDamageCause.stalactite:
        deathMessage = "został przebity przez spadający stalaktyt"
        break;

      case EntityDamageCause.selfDestruct:
        deathMessage = "popełnił samobójstwo"
        break;

      case EntityDamageCause.none:
        deathMessage = "umarł";

        if (!player.hasTag("border_reah")) {
          if (player.hasTag("border_outside")) {
            deathMessage = "zabity przez border";
            killer = "border";
          }
        }
        break;

      default:
        deathMessage = "zabity przez " + cause;
        break;
    }

    console.log("PlayerDeath:" + name + " DeathMessage:" + deathMessage + " Position:" + getPostion(player.location) + " Killer:" + killer + " UsedName:" + usedName);
  },
  { entityTypes: ["minecraft:player"] },
);
