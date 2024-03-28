import { world } from "@minecraft/server";
import { getPostion } from "./Util";

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const name = event.player.name;
  const block = event.block;

  console.log("PlayerBreakBlock:" + name + " Block:" + block.typeId + " Position:" + getPostion(block.location, block.dimension));
});

world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const name = event.player.name;
  const block = event.block;

  console.log("PlayerPlaceBlock:" + name + " Block:" + block.typeId + " Position:" + getPostion(block.location, block.dimension));
});

world.afterEvents.playerSpawn.subscribe(
  ({ player, initialSpawn }) => {
    if (initialSpawn) console.log("PlayerJoin:" + player.name);
    console.log("PlayerSpawn:" + player.name);
  },
);

world.afterEvents.playerDimensionChange.subscribe(({ player, fromDimension, fromLocation, toDimension, toLocation }) => {
  // console.log("Z wymiaru: " + fromDimension.id);
  // console.log("Na wymiar: " + toDimension.id);
  // console.log("Lokacja przed zmianą wymiaru: " + fromLocation.x + " " + fromLocation.y + " " + fromLocation.z);
  // console.log("Lokacja po zmianie wymiaru: " + toLocation.x + " " + toLocation.y + " " + toLocation.z);

  console.log("DimensionChangePlayer: " + player.name + " FromDimension:" + fromDimension.id
    + " ToDimension:" + toDimension.id + " FromPosition:" + getPostion(fromLocation, fromDimension) + " ToPosition:" + getPostion(toLocation, toDimension)

  )
});

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const block = event.block;
  const blockID = block.typeId;

  if (blockID.includes("ender")) {
    console.log("PlayerContainerInteract:" + event.player.name + " Block:" + blockID + " Position:" + getPostion(block.location, block.dimension));
  } if (block.getComponent("minecraft:inventory")) {
    console.log("PlayerContainerInteract:" + event.player.name + " Block:" + blockID + " Position:" + getPostion(block.location, block.dimension));
  }
});

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const target = event.target;

  if (target.getComponent("minecraft:inventory")) {
    console.log("PlayerEntityContainerInteract:" + event.player.name + " EntityID:" + target.typeId + " EntityPosition:" + getPostion(target.location, target.dimension));
  }
});

