import {
  Actor,
  Color,
  CollisionType,
  Vector,
} from "excalibur";

export class Floor extends Actor {
  constructor(drawWidth: number, ground: number) {
    super({
      pos: new Vector(drawWidth / 2, ground),
      width: 800,
      height: 5,
    });
    this.body.collider.type = CollisionType.Fixed;
  }
}

export class Ceiling extends Actor {
  constructor(drawWidth: number) {
    super({
      pos: new Vector(drawWidth / 2, 0),
      width: 800,
      height: 1,
      color: Color.Transparent,
    });
    this.body.collider.type = CollisionType.Fixed;
  }
}

export class Wall extends Actor {
  constructor(xPosition: number, drawHeight: number) {
    super({
      pos: new Vector(xPosition, drawHeight / 2),
      width: 1,
      height: drawHeight,
      color: Color.Transparent,
    });
    this.body.collider.type = CollisionType.Fixed;
  }
}