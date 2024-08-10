import { world, system } from "@minecraft/server";
import "./death.js";
import "./player.js";
// import "./borded.js"
import { getTps } from "./tps.js";
import { getPostion } from "./Util.js";
import "./movement.js";

const appHandledMessages = false;
export const mcprefix = "§7[§aBDS§1 Auto Enable§a]§r ";
export const consoleprefix = "[BDS Auto Enable] ";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  // console.log(
  //   "id:", event.id,
  //   "message:", event.message,
  //   "sourceType:", event.sourceType
  // );

  switch (event.id) {
    case "bds:tag_prefix":
      const args = event.message.split("=");
      const playerName = args[0];
      const restOfMessage = args.slice(1).join(" ");

      const [player] = world.getPlayers({
        name: playerName,
      });

      if (player !== undefined && restOfMessage !== "") {
        player.nameTag = restOfMessage + player.name;
      }
      break;

    case "bds:tps":
      getTps();
      break;
  }
});

const cooldowns = new Map();
world.beforeEvents.chatSend.subscribe((data) => {
  const player = data.sender;
  const name = player.name;
  const message = data.message;

  if (cooldowns.has(name) && (Date.now() - cooldowns.get(name)) / 1000 < 2) {
    player.sendMessage(mcprefix + "§cZwolnij troche! (2s)");
    data.cancel = true;
  } else {
    let op = player.isOp();

    if (!player.isOp()) {
      op = player.hasTag("adminPlus");
    }

    if (!op) {
      cooldowns.set(name, Date.now());
    }

    if (message.startsWith("!")) {
      console.log(
        "PlayerCommand:" +
          name +
          " Command:" +
          message +
          " Position:" +
          getPostion(player.location, player.dimension) +
          " Op:" +
          op
      );
      data.cancel = true;
      return;
    }

    console.log(
      "PlayerChat:" +
        name +
        " Message:" +
        message +
        " Position:" +
        getPostion(player.location, player.dimension)
    );
    data.cancel = appHandledMessages;
  }
});

world.sendMessage(mcprefix + "§3Wczytano!");
console.log(consoleprefix + "Wczytano!");
system.runTimeout(() => getTps(), 40);
