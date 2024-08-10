import { system, world } from "@minecraft/server";
import { getPostion } from "./Util";

const playersCoords = new Map();

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {
    const coords = {
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y),
      z: Math.floor(player.location.z),
    };

    if (playersCoords.has(player.name)) {
      const coords2 = playersCoords.get(player.name);
      if (
        coords2.x !== coords.x ||
        coords2.y !== coords.y ||
        coords2.z !== coords.z
      ) {
        playersCoords.set(player.name, coords);
        console.log(
          "PlayerMovement:" +
            player.name +
            " Position:" +
            getPostion(player.location, player.dimension)
        );
      }
    } else {
      playersCoords.set(player.name, coords);
      console.log(
        "PlayerMovement:" +
          player.name +
          " Position:" +
          getPostion(player.location, player.dimension)
      );
    }
  });
}, 1);
