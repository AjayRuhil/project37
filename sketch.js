var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, restart, gameOverImg, restartImg;

var checkPointmp3, diemp3, jumpmp3;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  checkPointmp3 = loadSound("checkPoint.mp3");
  diemp3 = loadSound("die.mp3");
  jumpmp3 = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);

  gameOver = createSprite(300, 100, 20, 20);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300, 130);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(180);

  text("Score: " + score, camera.x + 200, 50);
  invisibleGround.x = camera.x - 100;
  restart.x = camera.x;
  gameOver.x = camera.x;

  if (gameState === PLAY) {
    camera.x = camera.x + (6 + 3*score/100);
    trex.x = camera.x - 250;

    score = score + Math.round(getFrameRate() / 60);

    if (keyDown("space") && (trex.y === 161.75||trex.y === 161.5|| trex.y === 162.3||trex.y === 162.8||trex.y === 162)) {
      trex.velocityY = -12;
      jumpmp3.play();
    }

    if (score > 0 && score % 100 === 0) {            
      checkPointmp3.play();
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < camera.x - 900) {
      ground.x = camera.x - 100 / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      jumpmp3.play();
      gameState = END;
      diemp3.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    trex.velocityY = 0;

    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }

  if (mousePressedOver(restart)) {
    reset();
  }

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x + 300, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;

    cloud.lifetime = 200;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x + 600, 165, 10, 40);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
        
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;

}