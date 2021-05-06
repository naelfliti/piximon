import { AnimatedSprite, Texture, TilingSprite, Sprite, TextStyle, Text } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Main } from "..";
import { AScreen } from "./AScreen";

export class GameScreen extends AScreen {
    private _dresseur = AnimatedSprite.fromFrames([
        "1528782_orig-8.png",
        "1528782_orig-9.png",
        "1528782_orig-10.png",
        "1528782_orig-11.png",
    ]);

    private _style = new TextStyle({
        fontFamily: "Verdana",
        fontSize: 35,
        fontWeight: "400",
        fill: ["#ffffff"],
        letterSpacing: 1.5,
    });
    private _timetext = new Text("0 s", this._style);
    private _time = 0;

    // private _dialga = AnimatedSprite.fromFrames([
    //     "d2rsb9v-15b1227b-03bf-434b-9c81-0565fcef2ffc-1 14-0.png",
    //     "d2rsb9v-15b1227b-03bf-434b-9c81-0565fcef2ffc-1 14-1.png",
    // ]);

    private _ground: TilingSprite;
    private _background: Sprite;

    private _dialga: AnimatedSprite[] = [];

    // balls
    private _ballTexture = Texture.from("assets/poke-ball.png");
    private _ball = new Ball(this._ballTexture);
    private _balls: Sprite[] = [];
    private _ballSpeed = 5;
    constructor() {
        super();
        /**
         * Setup
         */

        // ground setup
        this._ground = new TilingSprite(Texture.from("ground.png"), 681, 83);
        this._ground.y = Main.SCREEN_HEIGHT - this._ground.height;
        this.addChild(this._ground);

        // background
        this._background = Sprite.from("images.jpg");
        this._background.width = Main.SCREEN_WIDTH;
        this._background.height = Main.SCREEN_HEIGHT - this._ground.height;
        this.addChild(this._background);

        // dresseur setup
        this._dresseur.x = 20;
        this._dresseur.y = Main.SCREEN_HEIGHT - this._ground.height - this._dresseur.height + 10;
        this.addChild(this._dresseur);
        this._dresseur.animationSpeed = 0.2;
        this._dresseur.play();

        /**
         * Sound
         */
        Main.homeSound.pause();

        if (typeof this.playSound() == "undefined") {
            Main.sound.currentTime = 0;
        }
        this.playSound();

        this.setEnemy();

        // shoot

        this.interactive = true;
        this.buttonMode = true;
        // disable spam click
        let lastShot = 0;
        this.on("mousedown", () => {
            if (Date.now() - lastShot > 2000) {
                this.shoot();
                console.log("shoot");
                lastShot = Date.now();
            }
        });

        /**
         * Text
         */

        this._timetext.x = Main.SCREEN_WIDTH * 0.4;
        this._timetext.y = 20;

        this.addChild(this._timetext);
    }

    public playSound() {
        Main.sound.play();
        Main.sound.loop = true;
        Main.sound.volume = 0.3;
    }

    public setEnemy() {
        setInterval(() => {
            let dialga = AnimatedSprite.fromFrames([
                "d2rsb9v-15b1227b-03bf-434b-9c81-0565fcef2ffc-1 14-0.png",
                "d2rsb9v-15b1227b-03bf-434b-9c81-0565fcef2ffc-1 14-1.png",
            ]);
            dialga.x = Main.SCREEN_WIDTH;
            dialga.scale.set(2.5);
            dialga.y = Main.SCREEN_HEIGHT - this._ground.height - dialga.height + 5;
            dialga.animationSpeed = 0.1;
            dialga.play();
            this.addChild(dialga);
            this._dialga.push(dialga);
        }, 2000);
    }

    public shoot() {
        const throwSound = new Audio("/assets/sounds/throw.mp3");
        throwSound.play();
        throwSound.volume = 0.2;

        this._ball.pivot.set(this._ball.width / 2, this._ball.height / 2);
        this._ball.position.x = this._dresseur.x + 50;
        this._ball.position.y = this._dresseur.y - this._dresseur.height + 90;
        this._ball.scale.set(0.8);
        // this._ball.rotation = Math.cos(2);
        this.addChild(this._ball);
        this._balls.push(this._ball);
    }

    public update(timeDelta: number) {
        super.update(timeDelta);
        this._ball.update(timeDelta);
        // timer
        this._time += timeDelta / 100;
        this._timetext.text = `${Math.floor(this._time)} s`;
        // update ground
        this._ground.tilePosition.x -= 1.5;
        // update ennemy
        this._dialga.forEach((ennemy) => {
            const id = this._dialga.indexOf(ennemy);
            ennemy.x -= 3;
            this._dialga.slice(id, 1);
            // collision
            if (ennemy.x <= this._dresseur.x) Main.instance.stage.emit("GAME_OVER", this._time);
        });
        // update pokeballs
        this._balls.forEach((ball) => {
            const id = this._balls.indexOf(ball);

            this._balls.slice(id, 1);
            for (const ennemy of this._dialga) {
            }
        });
    }
}
