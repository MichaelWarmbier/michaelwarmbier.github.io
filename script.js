document.body.onload = menuSetup;
document.cookie = "expires=Thu, 01 Jan 2040 00:00:00 UTC";

////////// Variables

const gameContainer = document.getElementById("GameContainer");
const sprite = document.getElementsByClassName("GameSprite");
let fallSound = new sound("Audio/fall.wav", .2);
let blipSound = new sound("Audio/blip.wav", .1);
let gameoverSound = new sound("Audio/gameover.wav", .6);
let musicSound = new sound("Audio/music.wav", .6);

const WIDTH = 17;
const HEIGHT = 25;
let gameState = "MainMenu";  // MainMenu OR Gameplay
const FPS = 60;

let soundON = true;
let musicON = true;
let menuCursor = 1;

let topLeft = [4,1];
let fallingTetro = -1;
let fallingSpeed = 800;
let activePause = false;
let tetroRotation = 1;
let solidBlocks = -1;
let isPaused = false;
let level = 001;
let lines = 000;

let totals = [00,00,00,00,00,00,00];

////////// Setup Functions

function menuSetup() {

  for (y = 0; y < HEIGHT; y++) {
    for (x = 0; x < WIDTH; x++) {
      newElem = document.createElement("div");
      newElem.className = "GameSprite";
      gameContainer.appendChild(newElem);
    }
  }

}

function gameSetup() {

  topLeft = [4,1];
  level = 001;
  lines = 000;
  tetroRotation = 1;
  solidBlocks = -1;

  totals = [00,00,00,00,00,00,00];

  gameState = "Gameplay";
  fallingTetro = getRandomTetro();
  nextTetro = getRandomTetro();
  clearBoard();

  totals[fallingTetro]++;
  if (totals[fallingTetro] > 99)
    totals[fallingTetro] = 99;

}

////////// Sound object

function sound(src, vol) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.volume = vol;
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

setInterval( function() {
  if (musicON)
    musicSound.play();
  else
    musicSound.stop();
}, 0)

////////// Cookie Functions

function getCookie(cname) {

  let cookieData;
  cookieData = document.cookie.split(';').map(cookie => cookie.split('='));
  for (i = 0; i < cookieData.length; i++)
    if (cookieData[i][0] == " " + cname)
      return cookieData[i][1];
  return "error";

}

////////// Main Routines

///// DRAW()
setInterval(
function draw() {

  for (y = 0; y < HEIGHT; y++) {
    for (x = 0; x < WIDTH; x++) {
      sprite[y * WIDTH + x].style.backgroundImage = "url(" + sprites[spriteValues[y][x]] + ")";
    }
  }

  let j = 0;
  for (i = 7; i < 20; i = i += 2) {
    spriteValues[i][14] = Math.floor(totals[j] / 10);
    spriteValues[i][15] = totals[j] % 10;
    j++;
  }

  for (x = 8; x < 11; x++)

  spriteValues[22][8] = Math.floor(level / 100);
  spriteValues[22][9] = Math.floor((level - (Math.floor(level / 100) * 100)) / 10);
  spriteValues[22][10] = level % 10;

  spriteValues[23][8] = Math.floor(lines / 100);
  spriteValues[23][9] = Math.floor((lines - (Math.floor(lines / 100) * 100)) / 10);
  spriteValues[23][10] = lines % 10;


}, (1000 / FPS));

///// INPUT()
document.addEventListener("keydown",
function input(event) {

  if (event.defaultPrevented) {
    return;
  }

  fallingSpeed = 1;

  switch (event.key) {
    case "s":
        switch (gameState) {
          case "MainMenu":
            if (soundON) blipSound.play();
            menuCursor++;
          break;
          case "Gameplay":
            manualDecrement();
          break;
        }
      break;
    case "w":
        switch (gameState) {
          case "MainMenu":
            menuCursor--;
            if (soundON) blipSound.play();
          break;
          case "Gameplay":
          break;
        }
      break;
    case "a":
        switch (gameState) {
          case "MainMenu":
          break;
          case "Gameplay":
            if (!checkHorizontalMotion("LEFT") && !isPaused) {
              clearBoard();
              topLeft[0]--;
            }
          break;
        }
      break;
    case "d":
        switch (gameState) {
          case "MainMenu":
          break;
          case "Gameplay":
            if (!checkHorizontalMotion("RIGHT") && !isPaused) {
              clearBoard();
              topLeft[0]++;
            }
          break;
        }
      break;
    case "q":
      if (gameState == "Gameplay") {
        if (fallingTetro != 0 && !checkRotation("LEFT") && !isPaused) {
          clearBoard();
          tetroRotation--;
        }
      }
    break;
    case "e":
      if (gameState == "Gameplay") {
        if (fallingTetro != 0 && !checkRotation("RIGHT") && !isPaused) {
          clearBoard();
          tetroRotation++;
        }
      }
    break;
    case "Enter":
      switch (gameState) {
        case "MainMenu":
          if (menuCursor == 1)
            gameSetup();
          if (menuCursor == 2) {
            soundON = !soundON;
            document.cookie= "sound=" + soundON;
            if (soundON) blipSound.play();
          }
          if (menuCursor == 3) {
            musicON = !musicON;
            document.cookie= "music=" + musicON;
            if (soundON) blipSound.play();
          }
       break;
        case "Gameplay":
          isPaused = !isPaused;
          if (soundON) blipSound.play();
          clearBoard();
        break;
      }
      break;
      case " ":
        event.preventDefault();
        if (gameState == "Gameplay") {
          let success = false
          while (!success)
            success = manualDecrement();
        }
      break;
    default:
      return;
  }

}, true)

///// LOGIC()
setInterval(
function logic() {

 if (gameState == "MainMenu" && !isPaused) {
   if (menuCursor < 1)
    menuCursor = 1;
   if (menuCursor > 3)
    menuCursor = 3;
    spriteValues[6][7] = 43; spriteValues[8][9] = 43; spriteValues[10][9] = 43;
   if (menuCursor == 1)
    spriteValues[6][7] = 59;
   else if (menuCursor == 2)
    spriteValues[8][9] = 59;
   else if (menuCursor == 3)
    spriteValues[10][9] = 59;
   if (soundON)
    spriteValues[8][8] = 47;
   else
    spriteValues[8][8] = 50;
    if (musicON)
     spriteValues[10][8] = 47;
    else
     spriteValues[10][8] = 50;

  }

  if (gameState == "Gameplay" && !isPaused) {

    drawNext();
    drawTetro();
    applyRotationBounds();

  }

  if (isPaused) {
    spriteValues[5][3] = 25;
    spriteValues[5][4] = 10;
    spriteValues[5][5] = 30;
    spriteValues[5][6] = 28;
    spriteValues[5][7] = 14;
    spriteValues[5][8] = 13;
  }

  if (gameState == "Gameover") {

    musicON = false;

    if (solidBlocks < 190 && solidBlocks >= 0)
      spriteValues[20 - Math.floor(solidBlocks / 10)][1 + solidBlocks % 10] = 46;
    else if (solidBlocks >= 190) {

      for (y = 2; y < 21; y++)
        for (x = 1; x < 11; x++)
          spriteValues[y][x] = 46;

      spriteValues[9][4] = 16;
      spriteValues[9][5] = 10;
      spriteValues[9][6] = 22;
      spriteValues[9][7] = 14;

      spriteValues[10][4] = 24;
      spriteValues[10][5] = 31;
      spriteValues[10][6] = 14;
      spriteValues[10][7] = 27;

      if (soundON) gameoverSound.play();
      gameState = "None";

      setTimeout(function() {

        location.reload();

      }, 5000)

    }

  }

  if (level > 999)
    level = 999;
  if (lines > 999)
    lines = 999;

  level = Math.floor(lines / 10) + 1;

}, (1000 / FPS));

////////// Game Functions

setInterval(function drawEnding() {
    if (gameState == "Gameover" && solidBlocks <= 190)
      solidBlocks++;
  }, 20)

function getRandomTetro() {

  return Math.floor(Math.random() * Math.floor(7));

}

function drawNext() {

  if (fallingTetro >= 0)
    spriteValues[3][13] = 36 + nextTetro;
  else
    spriteValues[3][13] = 56;

}

function applyRotationBounds() {

  if (tetroRotation > 4)
      tetroRotation = 1;
    if (tetroRotation < 1)
      tetroRotation = 4;

}

function clearBoard() {

  for (y = 2; y < 21; y++) {
    for (x = 1; x < 11; x++) {
      spriteValues[y][x] = 43;
      if (collisionValues[y][x] == 46)
        spriteValues[y][x] = 46
    }
  }

}

function drawTetro() {

  if (fallingTetro >= 0 && gameState != "Gameover")

    for (y = 0; y < 4; y++) {
      for (x = 0; x < 4; x++) {

          if (tetros[y + (fallingTetro * 4)][x + ((tetroRotation - 1) * 4)] > 0 && topLeft[1] + y > 1)
            spriteValues[topLeft[1] + y][topLeft[0] + x] = tetros[y + (fallingTetro * 4)][x + ((tetroRotation - 1) * 4)];

      }
   }

}

function compareArrays(value) {

  for (y = 0; y < HEIGHT; y++)
    for (x = 0; x < WIDTH; x++)
      if (spriteValues[y][x] == value && collisionValues[y][x] > 0)
        return true;

  return false;

}

function resetBorder() {

  for (y = 0; y < 22; y++) {
    for (x = 0; x < 13; x++) {
      if (y == 0 || x == 0 || y == 21 || x == 11)
        spriteValues[y][x] = 51;
      if (x == 12)
        spriteValues[y][x] = collisionValues[y][x]
    }
  }

}

function checkHorizontalMotion(dir) {

  let willCollide = false;

  if (dir == "LEFT") {
    topLeft[0]--;
    drawTetro();
    if (compareArrays(getSpriteID()))
      willCollide = true;
    topLeft[0]++;
  }

  if (dir == "RIGHT") {
    topLeft[0]++;
    drawTetro();
    if (compareArrays(getSpriteID()))
      willCollide = true;
    topLeft[0]--;
  }

  clearBoard();
  resetBorder();
  return willCollide;

}

function checkVerticalMotion() {

  let willCollide = false;

  topLeft[1]++;
  drawTetro();
  if (compareArrays(getSpriteID()))
    willCollide = true;
  topLeft[1]--;

  clearBoard();
  resetBorder();

  if (willCollide)
    resetTetro();

  return willCollide;

}

function resetTetro() {

  if (!isPaused) {
    drawTetro();

    for (y = 0; y < 4; y++)
      for (x = 0; x < 4; x++)
        if (spriteValues[topLeft[1] + y][topLeft[0] + x] == getSpriteID())
        collisionValues[topLeft[1] + y][topLeft[0] + x] = 46;

    lineClearCheck();
    if (soundON) fallSound.play();

    topLeft = [4,1];
    clearBoard();

    fallingTetro = nextTetro;
    nextTetro = getRandomTetro();
    totals[fallingTetro]++;
    if (totals[fallingTetro] > 99)
      totals[fallingTetro] = 99;

    drawTetro();
    if (compareArrays(getSpriteID())) {
      gameState = "Gameover";
      console.log("GAME OVER!");
    }
  }
}

function checkRotation(dir) {

  let willCollide = false

  if (dir == "RIGHT") {
    tetroRotation++;
    applyRotationBounds();
    drawTetro();
    if (compareArrays(getSpriteID()))
      willCollide = true;
    tetroRotation--;
    applyRotationBounds();
  }

  if (dir == "LEFT") {
    tetroRotation--;
    applyRotationBounds();
    drawTetro();
    if (compareArrays(getSpriteID()))
      willCollide = true;
    tetroRotation++;
    applyRotationBounds();
  }

  clearBoard();
  resetBorder();
  return willCollide;

}

function getSpriteID() {
  switch (fallingTetro) {
    case 0:
      return 52;
    case 1:
      return 45;
    case 2:
      return 49;
    case 3:
      return 48;
    case 4:
      return 44;
    case 5:
      return 47;
    case 6:
      return 50;
    default:
      return 43;
  }
}

function lineClearCheck() {


  for (y = 2; y < 21; y++) {
    let foundBlocks = 0;

    for (x = 1; x < 11; x++) {
      if (collisionValues[y][x] == 46)
        foundBlocks++
    }

    if (foundBlocks == 10) {
      foundBlocks = 0;
      lines++;

      for (x = 1; x < 11; x++)
        collisionValues[y][x] = 0;

      for (i = y; i > 1; i--)
        for (j = 1; j < 11; j++) {
          if (i != 2)
            collisionValues[i][j] = collisionValues[i - 1][j];
          else
            collisionValues[i][j] = 0;
        }

    }

  }

  for (y = 2; y < 21; y++) {
    for (x = 1; x < 11; x++) {
      spriteValues[y][x] = collisionValues[y][x];
    }
  }

}

function manualDecrement() {

  if (!checkVerticalMotion()) {
    clearBoard();
    resetBorder();
    topLeft[1]++;
  }
  else
    return true;

}

setInterval( function decrementTetro() {

    if (gameState == "Gameplay" && !checkVerticalMotion() && !isPaused) {
      clearBoard();
      resetBorder();
      topLeft[1]++;
    }

    activePause = false;

}, fallingSpeed)

////////// DATA

sprites = [
  /* Letters and Numbers                            */
  "https://i.imgur.com/YzrFjO2.png", // 0 -------- 00
  "https://i.imgur.com/FQcOM7y.png", // 1 -------- 01
  "https://i.imgur.com/mKs2Pzt.png", // 2 -------- 02
  "https://i.imgur.com/eWK6Q0n.png", // 3 -------- 03
  "https://i.imgur.com/WoUNaMs.png", // 4 -------- 04
  "https://i.imgur.com/9vIMyzH.png", // 5 -------- 05
  "https://i.imgur.com/bTMDEJu.png", // 6 -------- 06
  "https://i.imgur.com/tWYH59j.png", // 7 -------- 07
  "https://i.imgur.com/aVIyTIk.png", // 8 -------- 08
  "https://i.imgur.com/9ZgUiXK.png", // 9 -------- 09
  "https://i.imgur.com/0ZRPLqa.png", // A -------- 10
  "https://i.imgur.com/QPw0wh9.png", // B -------- 11
  "https://i.imgur.com/rHIoOGf.png", // C -------- 12
  "https://i.imgur.com/Fg9Pnah.png", // D -------- 13
  "https://i.imgur.com/ea42snT.png", // E -------- 14
  "https://i.imgur.com/aMnKHsG.png", // F -------- 15
  "https://i.imgur.com/5W69s8Z.png", // G -------- 16
  "https://i.imgur.com/uQCs94o.png", // H -------- 17
  "https://i.imgur.com/jVRk766.png", // I -------- 18
  "https://i.imgur.com/V7jBbBf.png", // J -------- 19
  "https://i.imgur.com/fip8CyL.png", // K -------- 20
  "https://i.imgur.com/Hi65w1y.png", // L -------- 21
  "https://i.imgur.com/MYuu1ZX.png", // M -------- 22
  "https://i.imgur.com/QmbZIN9.png", // N -------- 23
  "https://i.imgur.com/BOVyi7x.png", // O -------- 24
  "https://i.imgur.com/L2VOogh.png", // P -------- 25
  "https://i.imgur.com/6veg9xu.png", // Q -------- 26
  "https://i.imgur.com/A5rdN1a.png", // R -------- 27
  "https://i.imgur.com/eY69UDW.png", // S -------- 28
  "https://i.imgur.com/E2PtWZi.png", // T -------- 29
  "https://i.imgur.com/Skr0Rvx.png", // U -------- 30
  "https://i.imgur.com/Sxbptgs.png", // V -------- 31
  "https://i.imgur.com/eW1i0kh.png", // W -------- 32
  "https://i.imgur.com/XdCGOXJ.png", // X -------- 33
  "https://i.imgur.com/dQUEvgc.png", // Y -------- 34
  "https://i.imgur.com/Vq2AI70.png", // Z -------- 35
  /* Tetrominoes                                   */
  "https://i.imgur.com/49Je8uT.png", // O -------- 36
  "https://i.imgur.com/nVgdz4R.png", // I -------- 37
  "https://i.imgur.com/QHcKQDM.png", // T -------- 38
  "https://i.imgur.com/oQoOn7s.png", // L -------- 39
  "https://i.imgur.com/IEmSk5Q.png", // J -------- 40
  "https://i.imgur.com/yXgNeO6.png", // S -------- 41
  "https://i.imgur.com/jSQ5R9L.png", // Z -------- 42
  /* Blocks                                        */
  "https://i.imgur.com/YItSQ7y.png", // Trsprnt -- 43
  "https://i.imgur.com/qmrseng.png", // Blue ----- 44
  "https://i.imgur.com/Y6bZASR.png", // Cyan ----- 45
  "https://i.imgur.com/yLNAnPt.png", // Gray ----- 46
  "https://i.imgur.com/BGERQCa.png", // Green ---- 47
  "https://i.imgur.com/fGN6BUC.png", // Orange --- 48
  "https://i.imgur.com/cAd00Ui.png", // Pink ----- 49
  "https://i.imgur.com/zYO3T8V.png", // Red ------ 50
  "https://i.imgur.com/6WRbNBg.png", // Silver --- 51
  "https://i.imgur.com/LtNpce8.png", // Yellow --- 52
  /* Symbols                                       */
  "https://i.imgur.com/qDLaZZj.png", // Equals --- 53
  "https://i.imgur.com/QjKrzyd.png", // Quotes --- 54
  "https://i.imgur.com/E5RZ7w9.png", // Period --- 55
  "https://i.imgur.com/OIKwgB0.png", // Question - 56
  "https://i.imgur.com/UKKsc6g.png", // Dash ----- 57
  "https://i.imgur.com/CZkZKql.png", // Colon ---- 58
  "https://i.imgur.com/E34KVuT.png", // Exclaim -- 59
  /* Other                                         */
  "https://i.imgur.com/Sa51qW9.png", // FlippedR - 60
  "https://i.imgur.com/ZlonEI6.png", // NE ------- 61
  "https://i.imgur.com/wdNrwRj.png", // XT ------- 62
];

const defaultValues = [
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51],
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,61,62,58,51,51],
  [51,43,43,29,14,29,60,18,28,43,43,51,43,56,43,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,43,43,43,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,51,51,51,51,51],
  [51,43,25,21,10,34,43,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,36,51,00,00,51],
  [51,43,28,24,30,23,13,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,37,51,00,00,51],
  [51,43,22,30,28,18,12,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,38,51,00,00,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,39,51,00,00,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,40,51,00,00,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,41,51,00,00,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,51,51,51,51,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,42,51,00,00,51],
  [51,43,43,43,43,43,43,43,43,43,43,51,51,51,51,51,51],
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51],
  [51,21,14,31,14,21,58,51,00,00,01,51,51,51,51,51,51],
  [51,21,18,23,14,28,58,51,00,00,00,51,51,51,51,51,51],
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51]
];

spriteValues = defaultValues;

collisionValues = [
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51],
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,61,62,58,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,43,56,43,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,43,43,43,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,36,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,37,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,38,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,39,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,40,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,41,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,42,51,00,00,51],
  [51,00,00,00,00,00,00,00,00,00,00,51,51,51,51,51,51],
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51],
  [51,21,14,31,14,21,58,51,00,00,01,51,51,51,51,51,51],
  [51,21,18,23,14,28,58,51,00,00,00,51,51,51,51,51,51],
  [51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51,51]
];

const tetros = [
  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00],
  [00,52,52,00,  00,52,52,00,  00,52,52,00,  00,52,52,00],
  [00,52,52,00,  00,52,52,00,  00,52,52,00,  00,52,52,00],
  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00],

  [00,00,00,00,  00,00,45,00,  00,00,00,00,  00,45,00,00],
  [45,45,45,45,  00,00,45,00,  00,00,00,00,  00,45,00,00],
  [00,00,00,00,  00,00,45,00,  45,45,45,45,  00,45,00,00],
  [00,00,00,00,  00,00,45,00,  00,00,00,00,  00,45,00,00],

  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00],
  [00,49,00,00,  00,49,00,00,  00,00,00,00,  00,49,00,00],
  [49,49,49,00,  00,49,49,00,  49,49,49,00,  49,49,00,00],
  [00,00,00,00,  00,49,00,00,  00,49,00,00,  00,49,00,00],

  [00,00,48,00,  00,48,00,00,  00,00,00,00,  48,48,00,00],
  [48,48,48,00,  00,48,00,00,  48,48,48,00,  00,48,00,00],
  [00,00,00,00,  00,48,48,00,  48,00,00,00,  00,48,00,00],
  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00],

  [44,00,00,00,  00,44,44,00,  00,00,00,00,  00,44,00,00],
  [44,44,44,00,  00,44,00,00,  44,44,44,00,  00,44,00,00],
  [00,00,00,00,  00,44,00,00,  00,00,44,00,  44,44,00,00],
  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00],

  [00,47,47,00,  00,47,00,00,  00,00,00,00,  47,00,00,00],
  [47,47,00,00,  00,47,47,00,  00,47,47,00,  47,47,00,00],
  [00,00,00,00,  00,00,47,00,  47,47,00,00,  00,47,00,00],
  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00],

  [50,50,00,00,  00,00,50,00,  00,00,00,00,  00,50,00,00],
  [00,50,50,00,  00,50,50,00,  50,50,00,00,  50,50,00,00],
  [00,00,00,00,  00,50,00,00,  00,50,50,00,  50,00,00,00],
  [00,00,00,00,  00,00,00,00,  00,00,00,00,  00,00,00,00]
]
