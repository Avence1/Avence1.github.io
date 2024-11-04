import Phaser from "phaser";
import { KEYBOARD_MAP } from "./const";

class GameSene extends Phaser.Scene {
  constructor() {
    super();
    this.score = 0;
    this.gameOver = false;
    this.gameDone = false;
  }
  preload() {
    this.load.image("sky", "./sky.png");
    this.load.image("ground", "./platform.png");
    this.load.image("star", "./star.png");
    this.load.image("bomb", "./bomb.png");
    this.load.spritesheet("dude", "./dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }
  create() {
    this.add.image(400, 300, "sky");

    //score
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#2ac5bb",
    });

    //ground
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    //player
    const player = this.physics.add.sprite(100, 300, "dude");
    this.player = player;

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    player.body.setGravityY(300);
    this.physics.add.collider(player, platforms);

    //star
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    //bombs
    const bombs = this.physics.add.group();

    const pauseGame = () => {
      this.physics.pause();
    };

    stars.children.iterate(function (child) {
      //弹跳系数
      child.setBounceY(0);
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(
      player,
      stars,
      (player, star) => {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        const bomb = bombs.create(star.x, 16, "bomb");
        bomb.setBounce(0.5);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        if (stars.countActive(true) === 0) {
          this.gameDone = true;
          pauseGame();
        } else {
          this.gameDone = false;
        }
      },
      null,
      this
    );

    this.physics.add.collider(
      player,
      bombs,
      (player, bombs) => {
        pauseGame();
        player.setTint(0xff0000);

        player.anims.play("turn");

        this.gameOver = true;
      },
      null,
      this
    );

    //Key Map
    this.controller = Object.keys(KEYBOARD_MAP).reduce((pre, curKey) => {
      pre[curKey] = this.input.keyboard.addKey(KEYBOARD_MAP[curKey]);
      return pre;
    }, {});
  }
  update() {
    //controller
    const player = this.player;
    if (this.controller.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (this.controller.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (this.controller.up.isDown && player.body.touching.down) {
      player.setVelocityY(-500);
    }

    if (this.gameOver) {
      this.gameOverText = this.add.text(200, 260, "Game Over !", {
        fontSize: "50px",
        fill: "#000",
      });
    } else {
      if (this.gameOverText) {
        this.gameOverText.destroy();
      }
    }

    if (this.gameDone) {
      this.gameDoneText = this.add.text(200, 260, "Congratulations !", {
        fontSize: "50px",
        fill: "#000",
      });
    } else {
      this.gameDoneText ? this.gameDoneText.destroy() : null;
    }
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: GameSene,
});
