import { Texture } from "pixi.js";
import { Main } from "..";
import { AObject } from "./AObject";

export class Ball extends AObject {
    constructor(texture: Texture) {
        super(texture);
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        this.rotation -= Math.PI / 9;
        this.x += 3;

        if (this.y < 0) this.kill = true;
    }
}
