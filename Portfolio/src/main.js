import { dialogueData, scaleFactor } from "./constants";
import {k} from "./kaboomCtx";
import { displayDialogue, setCamScale, stopAnimation } from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 936,
        "walk-down": {from: 936, to: 939, loop: true, speed: 8},
        "idle-right-side": 975,
        "walk-right-side": {from: 975, to: 978, loop: true, speed: 8},
        "idle-left-side": 1053,
        "walk-left-side": {from: 1053, to: 1056, loop: true, speed: 8},
        "idle-up": 1014,
        "walk-up": {from: 1014, to: 1017, loop: true, speed: 8}
    }
});

k.loadSprite("boy","./boy-sprite.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
        "idle-down": 8,
        "walk-down": {from: 8, to: 11, loop: true, speed: 8},
        "idle-right-side": 12,
        "walk-right-side": {from: 12, to: 15, loop: true, speed: 8},
        "idle-left-side": 0,
        "walk-left-side": {from: 0, to: 3, loop: true, speed: 8},
        "idle-up": 4,
        "walk-up": {from: 4, to: 7, loop: true, speed: 8}
    }
})
// TODO: create map
k.loadSprite("map", "./map.png");
// TODO: put color
k.setBackground(k.Color.fromHex("#A1662F"));

k.scene("main", async () => {
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;
    // create scene with make
    const map = k.make([
        k.sprite("map"),
        k.pos(0),
        k.scale(scaleFactor)
    ]);
    const player = k.make([
        k.sprite("boy", {anim: "idle-down"}),
        k.area({
            shape: new k.Rect(k.vec2(0, 3), 16, 16)
        }),
        k.body(),
        k.anchor("center"),
        k.pos(), //spawn point
        k.scale(1),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player"
    ]);

    for (const layer of layers) {
        if(layer.name === "boundaries") {
          for(const boundary of layer.objects) {
            map.add([
               k.area({
                shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
               }),
               k.body({ isStatic: true}),
               k.pos(boundary.x, boundary.y),
               boundary.name 
            ])

            if(boundary.name) {
                player.onCollide(boundary.name, () => {
                    player.isInDialogue = true;
                    stopAnimation(player);
                    displayDialogue(dialogueData[boundary.name], () => player.isInDialogue = false)
                });
            }
          }
          continue;  
        }

        if(layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    )
                }
            }
        }
    }
    setCamScale(k);
    k.onResize(() => setCamScale(k));

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y + 100);
    })

    k.onMouseDown((mouseBtn) => {
        if(mouseBtn !== "left" || player.isInDialogue) return;
        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if(
            mouseAngle > lowerBound && 
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up"
        ) {
            player.play("walk-up");
            player.direction = "up";
            return;
        } else if(
            mouseAngle < -lowerBound && 
            mouseAngle > -upperBound &&
            player.curAnim() !== "walk-down"
        ) {
            player.play("walk-down");
            player.direction = "down";
            return;
        } else if(
            Math.abs(mouseAngle) > upperBound &&
            player.curAnim() !== "walk-right-side"
        ) {
            player.play("walk-right-side");
            player.direction = "right";
            return;
        } else if(
            Math.abs(mouseAngle) < lowerBound &&
            player.curAnim() !== "walk-left-side"
        ) {
            player.play("walk-left-side");
            player.direction = "left";
            return;
        }
    })

    k.onMouseRelease(() => stopAnimation(player));
    // render scene with add
    k.add(map);
    k.add(player);
});
k.go("main");