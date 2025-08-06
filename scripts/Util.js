import { world, system } from "@minecraft/server";

export function getPostion(location, dimension) {
  const x = location.x.toFixed(2);
  const y = location.y.toFixed(2);
  const z = location.z.toFixed(2);

  return "X: " + x + " Y:" + y + " Z:" + z + " Dimension:" + dimension.id;
}

export function sendToAdmins(message) {
    for (const player of world.getAllPlayers())
      if (player.hasTag("adminPlus") || (player.playerPermissionLevel == 2)) {
        player.sendMessage(message);
      }
}
