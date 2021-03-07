import {
  Engine,
  Actor,
  Color,
  CollisionType,
  Input,
  Vector,
  CollisionStartEvent,
  PreCollisionEvent,
} from "excalibur";
import * as ex from "excalibur";

const game = new Engine({
  width: 800,
  height: 600,
  backgroundColor: Color.fromRGB(7, 118, 148),
});

document.oncontextmenu = () => {
  return false;
};
const ground: number = game.drawHeight - 50;
const leftKnifeSpeed = 200;
const rightKnifeSpeed = 125;

class Box extends Actor {
  constructor(x: number, y: number, type: string) {
    super({
      pos: new ex.Vector(x, y),
      width: 60,
      height: 60,
      color: Color.fromRGB(186, 159, 112),
    });
    this.body.collider.type = CollisionType.Passive;
  }

  onInitialize(engine: ex.Engine) {
    this.on("precollision", this.onCollision);
  }

  //need to adjust velocity after collision, both should move at the maximum speed of the two.
  onCollision(evt: PreCollisionEvent) {
    if (evt.other instanceof Knife) {
      console.log(this.vel);

      console.log("box reading knife collision");
      console.log(this.vel);
      this.color = Color.fromRGB(51, 186, 6);
    }
  }
}

let bBox = new Box(100, 100, "regular");
let cBox = new Box(700, 100, "regular");
game.add(cBox);
game.add(bBox);

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

  public update(engine, delta) {
    if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
      if (this.pos.y == 517.5) {
        //need to get rid of this magic number!
        this.vel.y -= 400;
      }
    }
    if (engine.input.keyboard.isHeld(ex.Input.Keys.D)) {
      if (this.vel.x < 0) {
        this.vel.x += 5;
      }
      this.vel.x += 5;
    } else if (engine.input.keyboard.isHeld(ex.Input.Keys.A)) {
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

function knifeVelocity(playerPos: Vector, mousePos: Vector): Vector {
  let xVelo = mousePos.x - playerPos.x;
  let yVelo = mousePos.y - playerPos.y;
  let newVec = new ex.Vector(xVelo, yVelo).normalize();

  return newVec;
}

class Knife extends Actor {
  preCollisonVeloX: number;
  hasCollided: boolean;
  leftKnife: boolean;
  constructor(playerPos: Vector, mousePos: Vector, isLeft: boolean) {
    let knifeVelo = knifeVelocity(playerPos, mousePos);
    super({
      pos: new ex.Vector(playerPos.x, playerPos.y - 21),
      width: 12,
      height: 25,
      color: Color.White,
    });

    this.leftKnife = isLeft;

    if (this.leftKnife) {
      this.vel.x = knifeVelo.x * leftKnifeSpeed;
      this.vel.y = knifeVelo.y * leftKnifeSpeed;
    } else {
      this.vel.x = knifeVelo.x * rightKnifeSpeed;
      this.vel.y = knifeVelo.y * rightKnifeSpeed;
    }

    this.body.collider.type = CollisionType.Passive;
    this.preCollisonVeloX = 0;
    this.hasCollided = false;
  }

  onInitialize(engine: ex.Engine) {
    this.on("precollision", this.onCollision);
  }

  //need to adjust velocity after collision, both should move at the maximum speed of the two.
  onCollision(evt: PreCollisionEvent) {
    if (evt.other instanceof Knife) {
      console.log(this.vel);
      if (this.hasCollided == false) {
        let maximum: number = Math.max(this.vel.x, evt.other.vel.x);
        this.hasCollided = true;
        this.preCollisonVeloX = this.vel.x * -1;
      }
      console.log("knife collide");
      console.log(this.vel);
    }

    if (evt.other instanceof Box) {
      this.kill();
    }
  }

  public update(engine, delta) {
    if (this.isOffScreen) {
      this.kill();
      return;
    }
    if (
      this.pos.x < 20 ||
      this.pos.y < 20 ||
      this.pos.y > 360 ||
      this.pos.x > 780
    ) {
      this.body.collider.type = CollisionType.Passive;
    } else {
      this.body.collider.type = CollisionType.Active;
    }

    this.vel.x =
      this.preCollisonVeloX == 0 ? this.vel.x : this.preCollisonVeloX;

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
