import { AnimatedSprite, Application, Loader, Sprite, Texture, TilingSprite, TextStyle, Text } from "pixi.js";
import { AScreen } from "./screens/AScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { GameScreen } from "./screens/GameScreen";
import { GameOver } from "./screens/GameOver";
import { gsap, Back } from "gsap";
import "./style.css";

export class Main extends Application {
    public static readonly SCREEN_WIDTH = 400;
    public static readonly SCREEN_HEIGHT = 700;
    // sound
    public static sound = new Audio("/assets/sounds/pokemon.mp3");
    public static homeSound = new Audio("/assets/sounds/homescreen.mp3");
    public static gameOverSound = new Audio("/assets/sounds/gameover.mp3");

    private static _instance: Main;
    public static get instance(): Main {
        return Main._instance;
    }

    private _currentScreen!: AScreen;

    constructor() {
        super({ backgroundColor: 0xffffff, width: Main.SCREEN_WIDTH, height: Main.SCREEN_HEIGHT });
        document.body.appendChild(this.view);
        this.view.style.border = "5px solid #262626";
        Main._instance = this;

        this.start();

        let loader = new Loader();
        loader.add("assets/flappy_bird.json").add("assets/spritesheet.json");
        loader.load(() => {
            const background = Sprite.from("images.jpg");
            background.interactive = true;
            background.buttonMode = true;
            const ground = Sprite.from("ground.png");
            background.width = Main.SCREEN_WIDTH;
            background.height = Main.SCREEN_HEIGHT - ground.height;
            this.stage.addChild(background);
            this.stage.addChild(ground);
            ground.y = Main.SCREEN_HEIGHT - ground.height;

            this.openHomeScreen();

            this.stage.on("GAME_OVER", this.gameOverScreen.bind(this));

            this.ticker.add(this.update.bind(this));
        });

        // const playHitSound = (collision) => {
        //     const impactStrength = collision.contact.getImpactVelocityAlongNormal();
        //     console.log(collision.contact.ni);
        //     if (impactStrength > 1.5) {
        //         hitSound.volume = Math.random();
        //         hitSound.currentTime = 0;
        //         hitSound.play();
        //     }
        // };
        // if (typeof this.playSound() == "undefined") {
        //     this.pauseSound();
        // }
        // const sound = new Audio("assets/pokemon.mp3");
        // sound.play();
    }

    public openHomeScreen() {
        if (this._currentScreen) this.stage.removeChild(this._currentScreen);
        this._currentScreen = new HomeScreen();
        this.stage.addChild(this._currentScreen);
    }

    public launchGame() {
        this.stage.removeChild(this._currentScreen);
        this._currentScreen = new GameScreen();
        this.stage.addChild(this._currentScreen);
    }

    public gameOverScreen(time: number) {
        console.log(time);
        let style = new TextStyle({
            fontFamily: "Verdana",
            fontSize: 23,
            fontWeight: "400",
            fill: ["#ffffff"],
            letterSpacing: 1,
        });

        let text = new Text(`Votre score est de ${Math.floor(time)}`, style);
        text.x = Main.SCREEN_WIDTH * 0.17;
        text.y = Main.SCREEN_HEIGHT * 0.58;
        this.stage.removeChild(this._currentScreen);
        this.stage.addChild(text);

        this._currentScreen = new GameOver();

        /**
         * Sounds
         */
        Main.sound.pause();

        if (typeof this.playGameOverSound() == "undefined") {
            Main.gameOverSound.currentTime = 0;
        }
        this.playGameOverSound();
        // console.log("lose");
        this.stage.addChild(this._currentScreen);
    }

    public playGameOverSound() {
        Main.gameOverSound.play();
        Main.gameOverSound.currentTime = 1;
        Main.sound.loop = false;
    }

    public update() {
        this._currentScreen.update(this.ticker.deltaTime);
    }
}

new Main();
