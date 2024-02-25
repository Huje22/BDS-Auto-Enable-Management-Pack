import { world, system, Player } from "@minecraft/server";

function checkAllPlayers(){
    for (const player of world.getAllPlayers()) {
        const areaX1 = 100;
        const areaX2 = -100;

        const areaZ1 = 100;
        const areaZ2 = -100;
    
        const isInArea = isPlayerInArea(player.location.x, player.location.z, areaX1, areaX2, areaZ1, areaZ2);
    
        if (!isInArea) {
            player.sendMessage(player.name + " nie jesteś w obsarze")
            player.tag
            player.applyDamage(1);
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

system.runInterval(() => checkAllPlayers() , 20 * 2);