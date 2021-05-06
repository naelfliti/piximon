import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { Main } from "../index";
import { AObjectAnimated } from "./AObjectAnimated";
import { IObject } from "./IObject";

export class Ennemy extends AObjectAnimated {
    constructor(textures: AnimatedSprite[]) {
        super();

        this.x = Main.SCREEN_WIDTH;
        this.scale.set(2.5);
        this.y = Main.SCREEN_HEIGHT - 200 - this.height + 5;
    }

    public update(timeDelta: number) {
        super.update(timeDelta);
        this.x -= 3;
    }
}
