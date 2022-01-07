import { Actor, Color, vec } from "excalibur";
// import { Resources } from "../../resources";
import {Box} from "../objects/box";

import {
  CollisionType,
  Vector,
  PreCollisionEvent,
} from "excalibur";

const leftKnifeSpeed = 200;
const rightKnifeSpeed = 125;


function knifeVelocity(playerPos: Vector, mousePos: Vector): Vector {
  let xVelo = mousePos.x - playerPos.x;
  let yVelo = mousePos.y - playerPos.y;
  let newVec = new Vector(xVelo, yVelo).normalize();

  return newVec;
}

export class Knife extends Actor {
  preCollisonVeloX: number;
  hasCollided: boolean;
  leftKnife: boolean;
  constructor(playerPos: Vector, mousePos: Vector, isLeft: boolean) {
    let knifeVelo = knifeVelocity(playerPos, mousePos);
    super({
      pos: new Vector(playerPos.x, playerPos.y - 21),
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