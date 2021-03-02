import { Engine, Actor, Color, CollisionType, Input } from "excalibur";
import * as ex from "excalibur";

const game = new Engine({
  width: 800,
  height: 600,
});
// todo build awesome game here
const ground: number = game.drawHeight - 50;
console.log(game.drawHeight);

class Wall extends Actor {
  constructor(xPosition) {
    super({
      pos: new ex.Vector(xPosition, game.drawHeight / 2),
      width: 1,
      height: game.drawHeight,
      color: Color.Transparent,
    });
    this.body.collider.type = CollisionType.Fixed;
  }
}

const leftWall = new Wall(0);
const rightWall = new Wall(game.drawWidth);
game.add(leftWall);
game.add(rightWall);

//this should just be Floor with args but doing a quick dirty that ill refactor later
class Ceiling extends Actor {
  constructor() {
    super({
      pos: new ex.Vector(game.drawWidth / 2, 0),
      width: 800,
      height: 1,
      color: Color.Transparent,
    });
    this.body.collider.type = CollisionType.Fixed;
  }
}
const ceil = new Ceiling();
game.add(ceil);

class Floor extends Actor {
  constructor() {
    super({
      pos: new ex.Vector(game.drawWidth / 2, ground),
      width: 800,
      height: 5,
    });
    this.body.collider.type = CollisionType.Fixed;
  }
}

class Paddle extends Actor {
  constructor() {
    super({
      pos: new ex.Vector(150, ground - 2),
      width: 20,
      height: 60,
    });
    this.body.collider.type = ex.CollisionType.Active;
  }

  private jump() {}

  public update(engine, delta) {
    if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
      if (this.pos.y == 517.5) {
        //need to get rid of this magic number!
        this.vel.y -= 400;
      }
    }
    if (engine.input.keyboard.isHeld(ex.Input.Keys.D)) {
      this.vel.x += 5;
    } else if (engine.input.keyboard.isHeld(ex.Input.Keys.A)) {
      this.vel.x -= 5;
    }
    //handle decelarate
    else {
      //some default option
      let a: number = 1;
      this.vel.x = Math.abs(this.vel.x) < 1 ? 0 : this.vel.x * 0.9;
    }
    this.vel.y += 10;
    super.update(engine, delta);
  }
}

const floor = new Floor();
floor.color = Color.White;
game.add(floor);

const paddle = new Paddle();

paddle.color = Color.LightGray;
paddle.body.collider.type = CollisionType.Active;
game.add(paddle);

// Start the engine to begin the game.
game.start();
console.log(paddle);
