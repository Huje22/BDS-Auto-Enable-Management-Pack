import { world, system } from "@minecraft/server";
import { mcprefix } from "./index.js";

/*
WAŻNE

Nie zmienjaj tych tagów używając tego kodu aby Aplikacja BDS-Auto-Enable mogła określić czy gracz umarł przez border

Kod użyty z:
https://github.com/Huje22/BDS-Auto-Enable-Management-Pack
*/

system.runInterval(() => checkAllPlayers(), 20 * 2);

function checkAllPlayers() {
    for (const player of world.getAllPlayers()) {

        const areaX1 = 20;
        const areaX2 = -100;

        const areaZ1 = -20;
        const areaZ2 = 20;

        const isInArea = isPlayerInArea(player.location.x, player.location.z, areaX1, areaX2, areaZ1, areaZ2);
        const distanceToSafe = distanceToNearestEdge(player.location.x, player.location.z, areaX1, areaX2, areaZ1, areaZ2);

        if (!isInArea) {
            if (!player.hasTag("border_reah")) {
                player.sendMessage(mcprefix + "§cZnajdujesz się w niebezpiecznym obszarze")

                let damnageToAply = Math.floor(distanceToSafe / 2);

                if (Math.floor(damnageToAply.toFixed(0)) == 0) {
                    damnageToAply = Math.floor(Math.random() * 6) + 1;
                }

                player.addTag("border_outside");
                player.applyDamage(damnageToAply);
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

    return nearestDistance;
}
