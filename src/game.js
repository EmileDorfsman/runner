import Phaser from 'phaser';
import sprite1 from "./assets/walkspritesheet.png";
import platform1 from "./assets/platform.png";
import sprite2 from "./assets/oldguyenemy.png";
import sprite3 from "./assets/door.png";

const gameWidth = 795;
const gameHeight = 600;
const gameState = {};


function preload() {

  this.load.spritesheet('boy', sprite1, { frameWidth: 196, frameHeight: 475 })
  this.load.image('grass', platform1, { frameWidth: 795, frameHeight: 85 })
  this.load.spritesheet('boxer', sprite2, { frameWidth: 114.5, frameHeight: 144 })
  this.load.spritesheet('door', sprite3, { frameWidth: 190, frameHeight: 200})
}


function create() {

  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(397, gameHeight, 'grass');

  gameState.active = true;
  gameState.player = this.physics.add.sprite(30, 300, 'boy').setScale(0.38);

  this.physics.add.collider(gameState.player, this.platforms);
  gameState.player.setCollideWorldBounds(true);

  gameState.cursors = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('boy', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  })

  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('boy', { start: 2, end: 2 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('boy', { start: 1, end: 1 }),
    frameRate: 5,
    repeat: -1
  })

  gameState.enemy = this.physics.add.sprite(400, 470, 'boxer').setScale(0.75);

  this.physics.add.collider(gameState.enemy, this.platforms);
  gameState.enemy.setCollideWorldBounds(true);

  this.anims.create({
    key: 'enemy idle',
    frames: this.anims.generateFrameNumbers('boxer', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1
  });

  this.physics.add.overlap(gameState.player, gameState.enemy, () => {
    this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      this.input.on('pointerup', () => {
        this.scene.restart();
      })
  })


  gameState.exitdoor = this.physics.add.sprite(900, 450, 'door').setScale(0.75);
  
  this.physics.add.collider(gameState.exitdoor, this.platforms);
  gameState.exitdoor.setCollideWorldBounds(true);

  this.anims.create({
    key: 'door idle',
    frames: this.anims.generateFrameNumbers('door', { start:0, end: 1}),
    frameRate: 1,
    repeat: -1
  });

  this.physics.add.overlap(gameState.player, gameState.exitdoor, () => {
    this.add.text(150, 50, 'You Win!\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    this.physics.pause();
    gameState.active = false;
    this.anims.pauseAll();
    gameState.enemy.move.stop();
      
      this.input.on('pointerup', () => {
        this.anims.resumeAll();
        this.scene.restart();
      })
    })

    gameState.enemy.move = this.tweens.add({
      targets: gameState.enemy,
      x: 320,
      ease: 'Linear',
      duration: 1800,
      repeat: -1,
      yoyo: true
    });


}

function update() {
  if (gameState.active) {
    gameState.enemy.anims.play('enemy idle', true);
    gameState.exitdoor.anims.play('door idle', true);
    if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(150);
      gameState.player.anims.play('walk', true);
      gameState.player.flipX = false
    } else if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-150)
      gameState.player.anims.play('walk', true)
      gameState.player.flipX = true
    } else {
      gameState.player.setVelocityX(0);
      if (gameState.player.body.touching.down) { gameState.player.anims.play('idle', true); }
    }
  }
  if ((gameState.cursors.space.isDown || gameState.cursors.up.isDown) && gameState.player.body.touching.down) {
    gameState.jumping = true;
    gameState.player.anims.play('jump', true);
    gameState.player.setVelocityY(-300);
  }
}


let config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  backgroundColor: "a8d8ff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    }

  },

  scene: {
    preload,
    create,
    update
  }

};

const game = new Phaser.Game(config);
