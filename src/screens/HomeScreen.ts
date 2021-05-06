import { gsap, Back } from "gsap";
import { Sprite, Text, TextStyle } from "pixi.js";
import { Main } from "../index";
import { AScreen } from "./AScreen";

export class HomeScreen extends AScreen {
    private _homescreen = Sprite.from("homescreen.jpg");
    private _style = new TextStyle({
        fontFamily: "Verdana",
        fontSize: 15,
        fontWeight: "400",
        fill: ["#ffffff"],
        letterSpacing: 1.5,
    });
    private _text = new Text("Click to throw balls over ennemies", this._style);
    private _timeline = gsap.timeline();

    constructor() {
        super();

        /**
         * Basic setting
         */

        // set homescreen
        this._homescreen.width = Main.SCREEN_WIDTH;
        this._homescreen.x = (Main.SCREEN_WIDTH - this._homescreen.width) / 2;
        // this._homescreen.y = -this._homescreen.height;
        this.addChild(this._homescreen);

        this._homescreen.interactive = true;
        this._homescreen.buttonMode = true;
        this._homescreen.once("pointerdown", this._play.bind(this));

        /**
         * Sound
         */
        Main.sound.pause();
        Main.gameOverSound.pause();
        if (typeof this.playHomeSound() == "undefined") {
            Main.homeSound.currentTime = 0;
        }
        this.playHomeSound();

        /**
         * Text
         */

        this._text.x = Main.SCREEN_WIDTH * 0.1;
        this._text.y = Main.SCREEN_HEIGHT * 0.6;

        this.addChild(this._text);

        this._timeline.to(this._text, { alpha: 0.4, duration: 0.5, yoyo: true, repeat: -1 });
    }

    public playHomeSound() {
        Main.homeSound.play();
        Main.homeSound.loop = true;
        Main.homeSound.volume = 0.3;
    }

    private _play() {
        this._timeline.kill();
        this._homescreen.alpha = 1;
        gsap.to(this._homescreen, {
            alpha: 0,
            onComplete: () => Main.instance.launchGame(),
        });
        gsap.to(this._text, {
            alpha: 0,
            onComplete: () => Main.instance.launchGame(),
        });
    }
}
