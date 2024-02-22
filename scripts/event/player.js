import { world, system, EntityDamageCause, Player } from "@minecraft/server";

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const name = event.player.name;
  const block = event.block;

  const x = block.location.x.toFixed(2);
  const y = block.location.y.toFixed(2);
  const z = block.location.z.toFixed(2);

  const position = "X: " + x + " Y:" + y + " Z:" + z;

  console.log("PlayerBreakBlock:" + name + " Block:" + block.typeId + " Position:" + position);
});

world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const name = event.player.name;
  const block = event.block;

  const x = block.location.x.toFixed(2);
  const y = block.location.y.toFixed(2);
  const z = block.location.z.toFixed(2);

  const position = "X: " + x + " Y:" + y + " Z:" + z;

  console.log("PlayerPlaceBlock:" + name + " Block:" + block.typeId + " Position:" + position);
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

  console.log("DimensionChangePlayer: " + player.name + " From:" + fromDimension.id + " To:" + toDimension.id)
});
