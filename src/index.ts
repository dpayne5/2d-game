import {
  Engine,
  Actor,
  Color,
  Vector,
  CollisionType,
  Input
} from "excalibur";

import {Box} from "../src/actors/objects/box"
import {Knife} from "../src/actors/knife/knife"
import {Wall, Ceiling, Floor} from "../src/actors/objects/boundaries"

const game = new Engine({
  width: 800,
  height: 600,
  backgroundColor: Color.fromRGB(7, 118, 148),
});

document.oncontextmenu = () => {
  return false;
};
const ground: number = game.drawHeight - 50;

//test boxes in upper left and right corners
let bBox = new Box(100, 100, "regular");
let cBox = new Box(700, 100, "regular");
game.add(cBox);
game.add(bBox);


const leftWall = new Wall(0, game.drawHeight);
const rightWall = new Wall(game.drawWidth, game.drawHeight);
game.add(leftWall);
game.add(rightWall);

const ceil = new Ceiling(game.drawWidth);
game.add(ceil);


class Paddle extends Actor {
  constructor() {
    super({
      pos: new Vector(150, ground - 2),
      width: 20,
      height: 60,
    });
    this.body.collider.type = CollisionType.Active;
  }

  public update(engine: Engine, delta) {
    if (engine.input.keyboard.wasPressed(Input.Keys.Space)) {
      if (this.pos.y == 517.5) {
        //need to get rid of this magic number!
        this.vel.y -= 400;
      }
    }
    if (engine.input.keyboard.isHeld(Input.Keys.D)) {
      if (this.vel.x < 0) {
        this.vel.x += 5;
      }
      this.vel.x += 5;
    } else if (engine.input.keyboard.isHeld(Input.Keys.A)) {
      if (this.vel.x > 0) {
        this.vel.x -= 5;
      }
      this.vel.x -= 5;
    } else {
      this.vel.x = Math.abs(this.vel.x) < 1 ? 0 : this.vel.x * 0.9;
    }
    this.vel.y += 10;
    super.update(engine, delta);
  }
}

const floor = new Floor(game.drawWidth, ground);
floor.color = Color.White;
game.add(floor);

const paddle = new Paddle();

paddle.color = Color.LightGray;
paddle.body.collider.type = CollisionType.Active;
game.add(paddle);

game.input.pointers.primary.on("down", function (evt) {
  if (evt.button == "Left") {
    let knife = new Knife(paddle.pos, evt.pos, true);
    game.add(knife);
  } else {
    let knife = new Knife(paddle.pos, evt.pos, false);
    game.add(knife);
  }
});

// Start the engine to begin the game.
game.start();
