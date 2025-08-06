import { world, system } from "@minecraft/server";
import { mcprefix } from "./index.js";

/*
WAŻNE

Nie zmienjaj tych tagów używając tego kodu aby Aplikacja BDS-Auto-Enable mogła określić czy gracz umarł przez border

Kod użyty z:
https://github.com/Huje22/BDS-Auto-Enable-Management-Pack
*/

const areaX1 = 100;
const areaX2 = -100;

const areaZ1 = -100;
const areaZ2 = 100;

system.runInterval(() => checkAllPlayers(), 1);

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    if (player.hasTag("border_outside")) {
      player.sendMessage(
        mcprefix + "§cZnajdujesz się w niebezpiecznym obszarze"
      );
    }
  }
}, 20 * 10);

function checkAllPlayers() {
  for (const player of world.getAllPlayers()) {
    const playerX = player.location.x;
    const playerZ = player.location.z;

    const safeX = (areaX1 + areaX2) / 2;
    const safeZ = (areaZ1 + areaZ2) / 2;

    const isInArea = isPlayerInArea(playerX, playerZ);
    const distanceToSafe = distanceToNearestEdge(playerX, playerZ, safeX, safeZ);

    if (!isInArea) {
      if (!player.hasTag("border_reah")) {
        // console.log(player.name + " " + playerX + " " + playerZ);

        let teleportX;
        let teleportZ;

        if (playerX < 0) {
          teleportX = playerX + Math.abs(distanceToSafe);
        } else {
          teleportX = playerX - Math.abs(distanceToSafe);
        }

        if (playerZ < 0) {
          teleportZ = playerZ + Math.abs(distanceToSafe);
        } else {
          teleportZ = playerZ - Math.abs(distanceToSafe);
        }

        // world.sendMessage("z " + teleportZ);
        // world.sendMessage("x " + teleportX);

        teleport(teleportX, teleportZ, player);

        player.addTag("border_outside");
        player.onScreenDisplay.setActionBar(
          mcprefix +
            `§aDo bezpiecznego obszaru zostało ci:§b ` +
            distanceToSafe +
            "§a bloków"
        );
      }
    } else {
      if (distanceToSafe <= 50) {
        const coords = nearestEdgeCoordinates(playerX, playerZ);

        player.onScreenDisplay.setActionBar(
          mcprefix +
            `§aDo borderu zostało ci:§b ` +
            distanceToSafe +
            "§a bloków"
        );

        for (let i = 0; i < coords.length; i++) {
          const distanceInfo = coords[i];
          spawnParticle(player, "minecraft:totem_particle", distanceInfo);
        }
      }

      player.removeTag("border_outside");
    }
  }
}

function spawnParticle(player, particleName, location) {
  try {
    player.spawnParticle(particleName, {
      x: location.x,
      y: player.location.y + 1,
      z: location.z,
    });
  } catch (error) {}
}

function teleport(teleportX, teleportZ, player) {
  const damage = 2;
  try {
    const targetBlockLocation = {
      x: parseFloat(teleportX),
      y: player.location.y,
      z: parseFloat(teleportZ),
    };
    
    const targetBlock = player.dimension.getBlock(targetBlockLocation);
    if (!targetBlock) {
      player.applyDamage(damage);
      return;
    }

    if (targetBlock.isAir) {
      player.teleport(targetBlockLocation);
    } else {
      player.applyDamage(damage);
    }
  } catch (error) {
    player.applyDamage(damage);
  }
}

function isPlayerInArea(playerX, playerZ) {
  const minX = Math.min(areaX1, areaX2);
  const maxX = Math.max(areaX1, areaX2);

  const minZ = Math.min(areaZ1, areaZ2);
  const maxZ = Math.max(areaZ1, areaZ2);

  return (
    playerX >= minX && playerX <= maxX && playerZ >= minZ && playerZ <= maxZ
  );
}

function distanceToNearestEdge(playerX, playerZ, safeX, safeZ) {
  const distances = [
    Math.abs(playerX - areaX1),
    Math.abs(playerX - areaX2),
    Math.abs(playerZ - areaZ1),
    Math.abs(playerZ - areaZ2),
  ];

  let nearestDistance = Math.min(...distances);

  if (
    playerX < Math.min(areaX1, areaX2) ||
    playerX > Math.max(areaX1, areaX2) ||
    playerZ < Math.min(areaZ1, areaZ2) ||
    playerZ > Math.max(areaZ1, areaZ2)
  ) {
    const distanceToSafe = Math.sqrt(
      Math.pow(playerX - safeX, 2) + Math.pow(playerZ - safeZ, 2)
    );
    nearestDistance = Math.min(nearestDistance, distanceToSafe);
  }

  return Math.ceil(nearestDistance);
}

function nearestEdgeCoordinates(playerX, playerZ) {
  const distances = [
    { distance: Math.abs(playerX - areaX1), x: areaX1, z: playerZ },
    { distance: Math.abs(playerX - areaX2), x: areaX2, z: playerZ },
    { distance: Math.abs(playerZ - areaZ1), x: playerX, z: areaZ1 },
    { distance: Math.abs(playerZ - areaZ2), x: playerX, z: areaZ2 },
  ];

  distances.sort((a, b) => a.distance - b.distance);

  return distances;
}
