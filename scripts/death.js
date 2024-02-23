import { world, EntityDamageCause, Player } from "@minecraft/server";

world.afterEvents.entityDie.subscribe(
  ({ deadEntity: player, damageSource: { cause, damagingEntity, damagingProjectile } }) => {
    const name = player.name;
    let usedName = "none";
    let deathMessage;

    switch (cause) {
      case EntityDamageCause.entityAttack:
        if (damagingEntity instanceof Player) {
          const itemName = damagingEntity.getComponent("inventory").container.getSlot(damagingEntity.selectedSlot).getItem().nameTag;

          if (itemName !== undefined) {
            usedName = itemName;
          }

          deathMessage = "zabity przez " + damagingEntity.name + ""
        } else {
          deathMessage = "zabity przez " + damagingEntity?.typeId + "";
        }
        break;

      case EntityDamageCause.entityExplosion:
      case EntityDamageCause.blockExplosion:
        deathMessage = "wysadzony w powietrze przez " + damagingEntity?.typeId + "";
        break;

      case EntityDamageCause.projectile:
        if (damagingEntity instanceof Player) {
          const itemName = damagingEntity.getComponent("inventory").container.getSlot(damagingEntity.selectedSlot).getItem().nameTag;

          if (itemName !== undefined) {
            usedName = itemName;
          }

          deathMessage = "zastrzelony przez " + damagingEntity.name + " przy użyciu " + damagingProjectile?.typeId + "";
        } else {
          deathMessage = "zastrzelony przez " + damagingEntity?.typeId + " przy użyciu " + damagingProjectile?.typeId + "";
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

      case EntityDamageCause.suicide:
        deathMessage = "popełnił samobójstwo"
        break;

      case EntityDamageCause.none:
        deathMessage = "umarł";
        break;

      default:
        deathMessage = "zabity przez " + cause + "";
        break;
    }

    console.log("PlayerDeath:" + name + " DeathMessage:" + deathMessage + " UsedName:" + usedName);
  },
  { entityTypes: ["minecraft:player"] },
);
