import { world, system } from "@minecraft/server";
import { mcprefix } from "./index.js";

/*
WAŻNE

Nie zmienjaj tych tagów używając tego kodu aby Aplikacja BDS-Auto-Enable mogła określić czy gracz umarł przez border

Kod użyty z:
https://github.com/Huje22/BDS-Auto-Enable-Management-Pack
*/

system.runInterval(() => checkAllPlayers(), 1);

function checkAllPlayers() {
  for (const player of world.getAllPlayers()) {
    const playerX = player.location.x;
    const playerZ = player.location.z;

    const areaX1 = 100;
    const areaX2 = -100;

    const areaZ1 = -100;
    const areaZ2 = 100;

    const safeX = (areaX1 + areaX2) / 2;
    const safeZ = (areaZ1 + areaZ2) / 2;

    const isInArea = isPlayerInArea(
      playerX,
      playerZ,
      areaX1,
      areaX2,
      areaZ1,
      areaZ2
    );
    const distanceToSafe = distanceToNearestEdge(
      playerX,
      playerZ,
      areaX1,
      areaX2,
      areaZ1,
      areaZ2,
      safeX,
      safeZ
    );

    if (!isInArea) {
      if (!player.hasTag("border_reah")) {
        player.sendMessage(
          mcprefix + "§cZnajdujesz się w niebezpiecznym obszarze"
        );
        console.log(player.name + " " + playerX + " " + playerZ);

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
        const coords = nearestEdgeCoordinates(
          playerX,
          playerZ,
          areaX1,
          areaX2,
          areaZ1,
          areaZ2
        );

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

function isPlayerInArea(playerX, playerZ, x1, x2, z1, z2) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);

  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);

  return (
    playerX >= minX && playerX <= maxX && playerZ >= minZ && playerZ <= maxZ
  );
}

function distanceToNearestEdge(playerX, playerZ, x1, x2, z1, z2, safeX, safeZ) {
  const distances = [
    Math.abs(playerX - x1),
    Math.abs(playerX - x2),
    Math.abs(playerZ - z1),
    Math.abs(playerZ - z2),
  ];

  let nearestDistance = Math.min(...distances);

  if (
    playerX < Math.min(x1, x2) ||
    playerX > Math.max(x1, x2) ||
    playerZ < Math.min(z1, z2) ||
    playerZ > Math.max(z1, z2)
  ) {
    const distanceToSafe = Math.sqrt(
      Math.pow(playerX - safeX, 2) + Math.pow(playerZ - safeZ, 2)
    );
    nearestDistance = Math.min(nearestDistance, distanceToSafe);
  }

  return Math.ceil(nearestDistance);
}

function nearestEdgeCoordinates(playerX, playerZ, x1, x2, z1, z2) {
  const distances = [
    { distance: Math.abs(playerX - x1), x: x1, z: playerZ },
    { distance: Math.abs(playerX - x2), x: x2, z: playerZ },
    { distance: Math.abs(playerZ - z1), x: playerX, z: z1 },
    { distance: Math.abs(playerZ - z2), x: playerX, z: z2 },
  ];

  distances.sort((a, b) => a.distance - b.distance);

  return distances;
}
