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

        const areaX1 = 20;
        const areaX2 = -20;

        const areaZ1 = -20;
        const areaZ2 = 20;

        const isInArea = isPlayerInArea(playerX, playerZ, areaX1, areaX2, areaZ1, areaZ2);
        const distanceToSafe = distanceToNearestEdge(playerX, playerZ, areaX1, areaX2, areaZ1, areaZ2);

        if (!isInArea) {
            if (!player.hasTag("border_reah")) {
                player.sendMessage(mcprefix + "§cZnajdujesz się w niebezpiecznym obszarze")

                /*
                let damnageToAply = Math.floor(distanceToSafe / 2) + 1;
                if (Math.floor(damnageToAply.toFixed(0)) == 0) {
                    damnageToAply = Math.floor(Math.random() * 6) + 1;
                }
                player.applyDamage(damnageToAply);
                */


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


                world.sendMessage("z " + teleportZ);
                world.sendMessage("x " + teleportX);
                world.sendMessage("distance " + distanceToSafe)

                player.teleport({
                    x: parseFloat(teleportX),
                    y: player.location.y,
                    z: parseFloat(teleportZ)
                },
                //Mojang to debile i tego nie da się użyć
                    { checkForBlocks: true }
                );
                
                player.addTag("border_outside");
            }
        } else {
            player.removeTag("border_outside");
        }
    }
}

function isPlayerInArea(playerX, playerZ, x1, x2, z1, z2) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);

    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);

    return playerX >= minX && playerX <= maxX && playerZ >= minZ && playerZ <= maxZ;
}

function distanceToNearestEdge(playerX, playerZ, x1, x2, z1, z2) {
    const distances = [
        Math.abs(playerX - x1),
        Math.abs(playerX - x2),
        Math.abs(playerZ - z1),
        Math.abs(playerZ - z2)
    ];

    let nearestDistance = Math.min(...distances);

    if (Math.floor(nearestDistance.toFixed(0)) == 0) {
        nearestDistance = 1;
    }

    return nearestDistance.toFixed(0);
}

