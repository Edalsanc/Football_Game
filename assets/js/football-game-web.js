var backgroud;

//sounds
var soundBall;
var soundReferee;
var soundEnviroment;
var soundWin;
var soundPositive;
var soundGool;
var soundFail;

//scores
var scoreText;
var currentScore = 3;

//pointers
var punterox;
var punteroy;

var tweenGoalkeeper;
var x, y;
var bx, by;

//bollean
var goles = 0;
var isGoal = false;
var isShot = false;
var isRunning = true;
var colisionGoalkeper = false;
var colisionG = false;
var finalScore;
var tryAgain;
var promo;

//style score
var style = {
  font: "70px calculator",
  fill: "#ffb500",
  align: "center",
};

class Game extends Phaser.Scene {
  constructor() {
    super();
  }

  init() {}

  preload() {
    //resource preloading
    this.load.image("background", "assets/img/football-mini-game.webp");
    this.load.image("goal", "assets/img/Gool.webp");
    this.load.image("point", "assets/img/point.webp");
    this.load.image("ballSmall", "assets/img/ball-small.webp");
    this.load.image("tope", "assets/img/tope.webp");
    this.load.spritesheet("sprite", "assets/img/sprite1.webp", {
      frameWidth: 170,
      frameHeight: 163,
    });
    this.load.spritesheet("alert", "assets/img/alert.webp", {
      frameWidth: 240,
      frameHeight: 136,
    });

    this.load.audio("sound1", "./assets/sounds/football.mp3");
    this.load.audio("sound2", "./assets/sounds/referee.mp3");
    this.load.audio("sound3", "./assets/sounds/ambiente.mp3");
    this.load.audio("soundGool", "./assets/sounds/gool.mp3");
    this.load.audio("soundFail", "./assets/sounds/fail.mp3");
    this.load.audio("soundWin", "./assets/sounds/win_all_rows.mp3");
    this.load.audio("soundPositive", "./assets/sounds/positive.mp3");
  }

  create() {
    soundWin = this.sound.add("soundWin");
    soundPositive = this.sound.add("soundPositive");
    soundBall = this.sound.add("sound1");
    soundReferee = this.sound.add("sound2");
    soundEnviroment = this.sound.add("sound3");
    soundGool = this.sound.add("soundGool");
    soundFail = this.sound.add("soundFail");
    soundEnviroment.volume = 0.5;
    soundReferee.volume = 0.4;
    soundEnviroment.loop = true;

    tryAgain = this.add.dom(300, 300, "button", "", "Nuevo Intento!");
    tryAgain.addListener("click");
    tryAgain.on("click", () => {
      window.location.reload();
    });

    tryAgain.node.id = "tryAgain";
    tryAgain.setVisible(false);

    promo = this.add.dom(0, 0, "button", "", "");
    promo.addListener("click");
    promo.on("click", () => {
      window.open("https://www.wplay.co/apuestas/registro?product=sport&page=sport-registration&back_url=https://apuestas.wplay.co/", "_blank");
    });

    promo.node.id = "promo";
    promo.node.classList.add("promo");
    promo.node.classList.add("tada");
    promo.node.classList.add("animated");
    promo.setVisible(false);

    //game screen collision
    this.physics.world.setBoundsCollision(false, false, false, true);
    backgroud = this.add.image(360, 290, "background");

    this.tope = this.add.image(360, 420, "tope");
    this.tope = this.physics.add.sprite(360, 420, "tope").setImmovable();
    this.tope.body.allowGravity = false;
    this.tope.alpha = 0.8;

    

    this.goal = this.add.image(380, 190, "goal");
    this.goal.setVisible(false);

    scoreText = this.add.text(49, 460, currentScore, style);

    finalScore = this.add.text(500, 70, "Goles " + goles, {
      font: "40px Arial",
      fill: "#ffb500",
      align: "center",
    });
    finalScore.setVisible(false);

    this.ballSmall = this.physics.add.image(372, 500, "ballSmall");
    this.ballSmall.setBounce(0.5);
    this.ballSmall.setCollideWorldBounds(true);

    this.goalkeeper = this.physics.add
      .sprite(220, 334, "sprite")
      .setImmovable()
      .setScale(1.1);

    this.point = this.add.image(400, 300, "point");

    this.alert = this.physics.add
      .sprite(600, 110, "alert")
      .setImmovable()
      .setVisible(false);

    this.alert.body.allowGravity = false;

    this.goalkeeper.body.allowGravity = false;

    //goalkeeper walk animation sprite
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("sprite", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    //goalkeeper catched animation sprite
    this.anims.create({
      key: "catched",
      frames: this.anims.generateFrameNumbers("sprite", { frames: [4] }),
      frameRate: 10,
    });

    //goalkeeper annotation animation sprite
    this.anims.create({
      key: "annotation",
      frames: this.anims.generateFrameNumbers("sprite", { frames: [5] }),
      frameRate: 10,
    });

    //message tutorial animation
    this.anims.create({
      key: "message",
      frames: this.anims.generateFrameNumbers("alert", { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1,
    });

    //collision ballSmall and goalkeeper
    this.physics.add.collider(
      this.ballSmall,
      this.goalkeeper,
      this.runCollision,
      null,
      this
    );

    //collision ballSmall and tope
    this.physics.add.collider(
      this.ballSmall,
      this.tope,
      this.runCollision2,
      null,
      this
    );

    tweenGoalkeeper = this.tweens.add({
      targets: this.goalkeeper,
      props: {
        x: {
          value: 505,
          duration: 1800,
        },
      },
      repeat: -1,
      yoyo: true,
      onStart: () => {
        soundEnviroment.play();
        this.goalkeeper.anims.play("walk", true);
      },
      onUpdate: () => {
        if (isShot) {
         
          if (colisionG) {
            if (this.goalkeeper.x > 365) {
              this.goalkeeper.x = this.goalkeeper.x + 60;
            } else {
              this.goalkeeper.x = this.goalkeeper.x - 60;
            }
          }
          if (colisionGoalkeper) {
            this.goalkeeper.x = this.ballSmall.x;
            //tweenGoalkeeper.pause();
          }
        }
      },
    });

    this.input.on("pointerdown", this.animateObject, this);
  }

  update() {
    this.point.x = this.input.mousePointer.x;
    this.point.y = this.input.mousePointer.y;
  }

  runCollision() {
    if (currentScore == 1) {
      colisionG = true;
    } else {
      colisionGoalkeper = true;
    }
  }

  animateObject(pointer) {
    punterox = pointer.x;
    punteroy = pointer.y;
    isShot = true;

    let tween1 = this.tweens.add({
      targets: this.ballSmall,
      props: {
        scaleX: { value: bx },
        scaleY: { value: by },
        y: {
          value: pointer.y,
          duration: 800,
        },
        x: {
          value: pointer.x,
          duration: 800,
        },
      },
      paused: true,
      hold: 2000,
      onStart: () => {
        soundBall.play();
        isRunning = false;
      },
      onUpdate: () => {
        if (this.ballSmall.y < 420) {
          bx = 0.9;
          by = 0.9;
        }

        this.ballSmall.angle += 1; //Rotate ball

        if (
          pointer.x > 150 &&
          pointer.x < 560 &&
          pointer.y > 220 &&
          pointer.y < 410
        ) {
          if (
            this.ballSmall.x > 150 &&
            this.ballSmall.x < 560 &&
            this.ballSmall.y > 220 &&
            this.ballSmall.y < 410
          ) {
            if (colisionGoalkeper) {
              soundFail.play();
              this.ballSmall.setVisible(false);
              this.goalkeeper.anims.play("catched", true);
            } else {
              tweenGoalkeeper.pause();
              soundGool.play();
              isGoal = true;
              this.goal.setVisible(true);
              this.goalkeeper.anims.play("annotation", true);
            }
          }
        } 
      },
      onComplete: () => {
        isRunning = true;
        this.ballSmall.setVelocityX(0);
        this.ballSmall.setVelocityY(0);
        this.ballSmall.x = 365;
        this.ballSmall.y = 500;

        currentScore--;
        scoreText.text = currentScore;
        this.goal.setVisible(false);
        colisionGoalkeper = false;
        this.ballSmall.angle = 0;

        if (currentScore <= 0) {
          tween1.pause();
          this.ballSmall.setVisible(false);
          tweenGoalkeeper.pause();
          this.goalkeeper.anims.pause();
          backgroud.alpha = 0.2;
          scoreText.alpha = 0.2;
          this.scene.pause();
          soundEnviroment.pause();
          promo.setVisible(true);
          soundWin.play();
          soundPositive.play();
        } else {
          soundReferee.play();
        }

        if (isGoal) {
          goles++;
        }

        isGoal = false;

        finalScore.text = "Goles " + goles;
        this.ballSmall.setScale(1);
        isShot = false;
        this.goalkeeper.anims.play("walk", true);
        this.ballSmall.setVisible(true);
        tweenGoalkeeper.resume();
        this.alert.setVisible(false);
      },
    });

    // Validate tween1
    if (isRunning) {
      if (
        punterox > 150 &&
        punterox < 560 &&
        punteroy > 220 &&
        punteroy < 410
      ) {
        this.alert.setVisible(false);
        tween1.play();
      } else {
        this.alert.setVisible(true);
        this.alert.anims.play("message", true);
      }
    }
  }

  goles() {
    return (goles = goles + 1);
  }

  runCollision2() {
    console.log("run collision2");
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-game",
  width: 720,
  height: 580,
  dom: {
    createContainer: true,
  },
  font: {
    family: "calculator",
  },
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 580,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  scene: [Game],
};

const game = new Phaser.Game(config);
