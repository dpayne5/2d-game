
// import { Resources } from "../../resources";
import {Knife} from "../knife/knife";
import {
  CollisionType,
  Actor,
  Color,
  Vector,
  PreCollisionEvent,
} from "excalibur";

export class Box extends Actor {
  constructor(x: number, y: number, type: string) {
    super({
      pos: new Vector(x, y),
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