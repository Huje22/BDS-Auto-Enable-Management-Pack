import { world, Player } from "@minecraft/server";
import { getPostion, sendToAdmins } from "./Util";
import { mcprefix } from "./index.js";

// world.afterEvents.playerInputModeChange.subscribe((event) => {
//   const player = event.player;

//   console.log(player.name);
//   console.log(event.newInputModeUsed);
// });

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const player = event.player;
  const name = player.name;
  const block = event.block;
  const blockId = block.typeId;

  if (
    blockId == "minecraft:diamond_ore" ||
    blockId == "minecraft:deepslate_diamond_ore"
  ) {
    sendToAdmins(mcprefix + "§aGracz§b " + name + "§a wykopał§b diament§f x1 ");
  } else if (blockId == "minecraft:ancient_debris") {
    sendToAdmins(
      mcprefix + "§aGracz§b " + name + "§a wykopał§c pradawne szczątki§f x1 "
    );
  } else if (blockId.includes("ore") && !blockId.includes("minecraft")) {
    sendToAdmins(
      mcprefix + "§aGracz§b " + name + `§a wykopał§b ${blockId} §fx1 `
    );
  }

  console.log(
    "PlayerBreakBlock:" +
      name +
      " Block:" +
      blockId +
      " Position:" +
      getPostion(block.location, block.dimension)
  );
});

world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const name = event.player.name;
  const block = event.block;

  console.log(
    "PlayerPlaceBlock:" +
      name +
      " Block:" +
      block.typeId +
      " Position:" +
      getPostion(block.location, block.dimension)
  );
});

world.afterEvents.playerInputModeChange.subscribe((event) => {
  console.log(
    "PlayerInput:" +
      event.player.name +
      " NewInputMode:" +
      event.newInputModeUsed +
      " OldInputMode:" +
      event.previousInputModeUsed
  );
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (initialSpawn) {
    const memoryTiers = {
      0: "Max 1,5GB",
      1: "Max 2GB",
      2: "Max 4GB",
      3: "Max 8GB",
      4: "Więcej niż 8GB",
    };

    const memory =
      memoryTiers[player.clientSystemInfo.memoryTier] || "Niewiadomo";

    sendToAdmins(
      mcprefix +
        "§aGracz:§b " +
        player.name +
        "§a dołączył używając §b" +
        player.clientSystemInfo.platformType +
        "§4:§b" +
        player.inputInfo.lastInputModeUsed +
        "§a posiadając§b " +
        memory +
        "§a pamięci ram, maksymalne chunki gracza to:§b " +
        player.clientSystemInfo.maxRenderDistance + 
        " §aUżywa trybu graficznego:§b " +
        player.graphicsMode
    );

    console.log(
      "PlayerJoin:" +
        player.name +
        " PlayerPlatform:" +
        player.clientSystemInfo.platformType +
        " PlayerInput:" +
        player.inputInfo.lastInputModeUsed +
        " MemoryTier:" +
        player.clientSystemInfo.memoryTier +
        " MaxRenderDistance:" +
        player.clientSystemInfo.maxRenderDistance +
        " GraphicMode:" +
        player.graphicsMode
    );
  }
  console.log("PlayerSpawn:" + player.name);
});

world.afterEvents.playerDimensionChange.subscribe(
  ({ player, fromDimension, fromLocation, toDimension, toLocation }) => {
    // console.log("Z wymiaru: " + fromDimension.id);
    // console.log("Na wymiar: " + toDimension.id);
    // console.log("Lokacja przed zmianą wymiaru: " + fromLocation.x + " " + fromLocation.y + " " + fromLocation.z);
    // console.log("Lokacja po zmianie wymiaru: " + toLocation.x + " " + toLocation.y + " " + toLocation.z);

    console.log(
      "DimensionChangePlayer:" +
        player.name +
        " FromDimension:" +
        fromDimension.id +
        " ToDimension:" +
        toDimension.id +
        " FromPosition:" +
        getPostion(fromLocation, fromDimension) +
        " ToPosition:" +
        getPostion(toLocation, toDimension)
    );
  }
);

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const player = event.player;
  const block = event.block;
  const blockID = block.typeId;

  if (player.isSneaking && event.itemStack !== undefined) return;

  if (blockID.includes("ender")) {
    console.log(
      "PlayerContainerInteract:" +
        player.name +
        " Block:" +
        blockID +
        " Position:" +
        getPostion(block.location, block.dimension)
    );
  }
  if (block.getComponent("minecraft:inventory")) {
    console.log(
      "PlayerContainerInteract:" +
        player.name +
        " Block:" +
        blockID +
        " Position:" +
        getPostion(block.location, block.dimension)
    );
  }
});

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const target = event.target;

  if (
    !(target instanceof Player) &&
    target.getComponent("minecraft:inventory")
  ) {
    console.log(
      "PlayerEntityContainerInteract:" +
        event.player.name +
        " EntityID:" +
        target.typeId +
        " EntityPosition:" +
        getPostion(target.location, target.dimension)
    );
  }
});
