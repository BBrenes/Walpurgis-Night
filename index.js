const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const backgroundImg = new Image()
backgroundImg.src = "./images/background.png"
const homuraImg = new Image()
homuraImg.src = "./images/homura.png"
const missileImg = new Image()
missileImg.src = "./images/missile.png"
const walpurgisImg = new Image()
walpurgisImg.src = "./images/walpurgis.png"
const familiarImg = new Image()
familiarImg.src = "./images/familiar.png"
const youWinImg = new Image()
youWinImg.src = "./images/youwin.png"
const youLoseImg = new Image()
youLoseImg.src = "./images/youlose.png"
const buttonImg = new Image()
buttonImg.src = "./images/button.png"
const welcomeImg = new Image()
welcomeImg.src = "./images/welcome.png"
const zeroImg = new Image()
zeroImg.src = "./images/zero.png"
const arrowsImg = new Image()
arrowsImg.src = "./images/arrows.png"
const keyImg = new Image()
keyImg.src = "./images/key.png"
const carnivalImg = new Image()
carnivalImg.src = "./images/carnival.png"
const fiveImg = new Image()
fiveImg.src = "./images/five.png"
const fourImg = new Image()
fourImg.src = "./images/four.png"
const threeImg = new Image()
threeImg.src = "./images/three.png"
const twoImg = new Image()
twoImg.src = "./images/two.png"
const oneImg = new Image()
oneImg.src = "./images/one.png"
const openShieldImg = new Image()
openShieldImg.src = "./images/open-shield.png"
const closeShieldImg = new Image()
closeShieldImg.src = "./images/close-shield.png"
const bgmagentaImg = new Image()
bgmagentaImg.src = "./images/backgroundmagenta.png"
//AUDIO
const SISPUELLA = new Audio();
SISPUELLA.src = "./audio/sis-puella-magica.mp3";
SISPUELLA.volume = 0.1
SISPUELLA.loop = true
const WALPURGISTHEME = new Audio();
WALPURGISTHEME.src = "./audio/walpurgis-night-theme.mp3";
WALPURGISTHEME.volume = 0.1
WALPURGISTHEME.loop = true
const SHOOTSOUND= new Audio();
SHOOTSOUND.src = "./audio/shoot.flac";
SHOOTSOUND.volume = 0.1
const HITFAMILIAR= new Audio();
HITFAMILIAR.src = "./audio/HitFamiliar.wav";
HITFAMILIAR.volume = 0.1
const HITHOMURA= new Audio();
HITHOMURA.src = "./audio/HitHomura.flac";
HITHOMURA.volume = 0.1
const HITWALPURGIS= new Audio();
HITWALPURGIS.src = "./audio/HitWalpurgis.flac";
HITWALPURGIS.volume = 0.1
const SHIELDSOUND= new Audio();
SHIELDSOUND.src = "./audio/shield.wav";
SHIELDSOUND.volume = 0.3
const LAUGH= new Audio();
LAUGH.src = "./audio/laugh.wav";
LAUGH.volume = 0.1



// GAME STATE
const state = {
    current : 0, // CURRENT STATE
    welcome : 0, // GAME WELCOME SCREEN
    gameplay: 1, // GAME INSTRUCTIONS
    intro: 2, //INTRO FRAMES
    game : 3, // GAME LOOP
    overWin : 4, // END OF GAME
    overLose : 5 // END OF GAME
}

//BACKGROUND
const backgroundImage = {
    img: backgroundImg,
    imgmagenta: bgmagentaImg,
    draw: function(){
        if(barMagic.magicActive == false){
            ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height)
        } else{
            ctx.drawImage(this.imgmagenta, 0, 0, canvas.width, canvas.height)
        }
    }
}

function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

// CANVAS AREA
const myGameArea = {
    frames: 0,
    minute : 0,
    second: 0,
    minuteAux : "00",
    secondAux : "00",
    addSecond(){
        if(myGameArea.frames % 60 === 0 && myGameArea.frames > 0){
            this.second++;
            if (this.second>59){this.minute++;this.second=0;}
            if (this.second<10){this.secondAux="0"+this.second;}else{this.secondAux=this.second;}
            if (this.minute<10){this.minuteAux="0"+this.minute;}else{this.minuteAux=this.minute;}
        }
    },
    updateChronometer(){        
        ctx.font = '28px "Kaushan Script"';
        ctx.shadowColor="black";
        ctx.shadowBlur=10;
        ctx.lineWidth=1;
        ctx.strokeText(`${this.minuteAux}:${this.secondAux}`, 642, 35);
        ctx.fillStyle = 'white';
        ctx.fillText(`${this.minuteAux}:${this.secondAux}`, 642, 35);
        ctx.shadowBlur=0;
        ctx.lineWidth=0;
    }
}

// HOMURA, MISSILES, WALPURGIS, FAMILIARS
class Component {
    constructor(x, y, width, height) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.yRandom = canvas.height/2 - 125;
        this.canShoot = true
        this.counterShoot = 20
    }
    left() {
        return this.x;
    }
    right() {
        return this.x + this.width;
    }
    top() {
        return this.y;
    }
    bottom() {
        return this.y + this.height;
    }
    crashWith(obstacle) {    
        return !(
            this.bottom() < obstacle.top() ||
            this.top() > obstacle.bottom() || 
            this.right() < obstacle.left() || 
            this.left() > obstacle.right());
    }
    crashWithHomura(obstacle) {    
        return !(
            this.bottom() -80 < obstacle.top() ||
            this.top()  + 10 > obstacle.bottom() || 
            this.right() -90 < obstacle.left() || 
            this.left() + 30 > obstacle.right());
    }
    updateHomura() {  // GENERATES HOMURA
        ctx.drawImage(homuraImg, this.x, this.y, this.width, this.height)
    }
    updateMissile() {  // GENERATES MISSILE
        ctx.drawImage(missileImg, this.x, this.y, this.width, this.height)
    }
    updateWalpurgis() {  // GENERATES WALPURGIS
        ctx.drawImage(walpurgisImg, this.x, this.y, this.width, this.height)
    }
    updateFamiliar() {  // GENERATE HOMURA
        ctx.drawImage(familiarImg, this.x, this.y, this.width, this.height)
    }
    newPos() { // NEW OBJECT'S POSITION
        this.x += this.speedX;
        this.y += this.speedY;
    }
    detectBorders(){ //DETECT BORDERS FOR HOMURA
        let borderLeft = 10
        let borderRight = 100
        let borderUp = 10
        let borderDown = 10
        if(this.x < borderLeft){
            this.x = borderLeft
        }
        if(this.x + this.width > canvas.width - borderRight){
            this.x = canvas.width - homura.width - borderRight
        }
        if(this.y < borderUp){
            this.y = borderUp
        }
        if(this.y + this.height > canvas.height - borderDown){
            this.y = canvas.height - homura.height - borderDown
        }
    }
    moveWalpurgis(){
        if(barMagic.magicActive == false){
            if (myGameArea.frames % 100 === 0 && myGameArea.frames > 0) {
                this.yRandom = Math.floor(Math.random() * (canvas.height - this.height - 20) + 10)
                if(this.yRandom % 2 == 0){
                    this.yRandom += 1
                }
            }
            if(this.y < this.yRandom){
                this.y += 2
            } else if(this.y > this.yRandom){
                this.y -= 2
            } else{
            }
        }
    }

}

// BARS
class Bar {
    constructor(x, y, width, height, multiplier, color, life) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.multiplier = multiplier;
        this.color = color;
        this.life = life;
        this.counterMagic = 0
        this.magicActive = false
    }
    updateHomuraBar() {  // GENERATES HOMURA BAR
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height)
        if(this.life <= 50 && this.life >= 25){
            this.color = 'yellow'
        }
        if(this.life < 25 && this.life >= 0){
            this.color = 'red'
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 2, this.y + 2, this.life * this.multiplier, this.height -4)
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 2 + this.life * this.multiplier, this.y + 2, (100 - this.life) * this.multiplier, this.height -4)
    }
    updateMagicBar() {  // GENERATES MAGIC BAR
        this.counterMagic += 1
        if(this.magicActive == false){
            if(this.counterMagic % 12 === 0 && this.life < 100){
                this.life += 1
            }
        }else {
            if(this.life <= 0){
                this.magicActive = false
                closeShield.shieldMoving = true //APPEAR CLOSED SHIELD
                SHIELDSOUND.pause();
                SHIELDSOUND.currentTime = 0;
                SHIELDSOUND.play()
            }else if(this.counterMagic % 6 === 0 && this.life > 0){
                this.life -= 2
            }
        }
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 2, this.y + 2, this.life * this.multiplier, this.height -4)
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 2 + this.life * this.multiplier, this.y + 2, (100 - this.life) * this.multiplier, this.height -4)
    }
    updateWalpurgisBar() {  // GENERATES WALPURGIS BAR
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height)
        if(this.life <= 50 && this.life >= 25){
            this.color = 'yellow'
        }
        if(this.life < 25 && this.life >= 0){
            this.color = 'red'
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 2 + (100 - this.life) * this.multiplier, this.y + 2, this.life * this.multiplier, this.height -4)
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 2, this.y + 2, (100 - this.life) * this.multiplier, this.height -4)
    }
}

//SHIELDS
class Shield {
    constructor(x, y, width, height, image) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = image;
        this.counterShield = 0;
        this.shieldMoving = false
    }
    updateShield() {  // GENERATES SHIELD
        if(this.shieldMoving == true){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }
    moveShield(){
        if(this.shieldMoving == true){
            this.counterShield +=1
            if (this.counterShield % 1 === 0 && this.counterShield <= 10) {
                this.y += 40
            } else if(this.counterShield % 1 === 0 && this.counterShield > 10 && this.counterShield <= 40){
                this.y += 0
            } else if(this.counterShield % 1 === 0 && this.counterShield > 40 && this.counterShield <= 50){
                this.y += 40
            }else if(this.counterShield % 1 === 0 && this.counterShield > 50){
                this.y = -300;
                this.counterShield = 0;
                this.shieldMoving = false
            }
        }
    }
}

//FIRST DECLARATION OF OBJECTS
    let homura = new Component(10, canvas.height/2 - 100, 166, 190)
    let walpurgis = new Component(canvas.width - 239 -10, canvas.height/2 - 125, 239, 250)
    let allFamiliars = []
    let allMissiles = []
    let barHomura = new Bar(15, 15, 304, 20, 3, '#49DE2B', 100)
    let barWalpurgis = new Bar(canvas.width -604 -15 , 15, 604, 20, 6, '#49DE2B', 100)
    let barMagic = new Bar(15 , 45, 204, 20, 2, '#D920DB', 0)
    let openShield = new Shield(canvas.width/2 - 250, -300, 500, 500, openShieldImg)
    let closeShield = new Shield(canvas.width/2 - 250, -300, 500, 500, closeShieldImg)

// RESET OBJECTS FOR NEW GAME
function resetGame(){
    homura = new Component(10, canvas.height/2 - 100, 166, 190)
    walpurgis = new Component(canvas.width - 239 -10, canvas.height/2 - 125, 239, 250)
    allFamiliars = []
    allMissiles = []
    barHomura = new Bar(15, 15, 304, 20, 3, '#49DE2B', 100)
    barWalpurgis = new Bar(canvas.width -604 -15 , 15, 604, 20, 6, '#49DE2B', 100)
    barMagic = new Bar(15 , 45, 204, 20, 2, '#D920DB', 0)
    myGameArea.frames = 0
    myGameArea.minute = 0
    myGameArea.second = 0
    myGameArea.minuteAux = "00"
    myGameArea.secondAux = "00"
}

// FAMILIARS UPDATE
function updateFamiliars() {
    for (let i = 0; i < allFamiliars.length; i++) {
        if(barMagic.magicActive == false){
            allFamiliars[i].x -= 3
        }
        allFamiliars[i].updateFamiliar();
    }
    myGameArea.frames += 1
    if (myGameArea.frames % 25 === 0 && barMagic.magicActive == false) {
        let widthFamiliar = 70
        let heightFamiliar = 100
        let yRandom = Math.floor(Math.random() * 510 + 50);
        // PUSH FAMILIAR
        allFamiliars.push(new Component(1100, yRandom, widthFamiliar, heightFamiliar))
    }
}
 //MISSILES CREATE AND UPDATE
function createMissile() {
    let widthMissile = 50
    let heightMissile = 20
    if(homura.counterShoot >= 20){
    // PUSH MISSILE
    allMissiles.push(new Component(homura.x + 140, homura.y + 17, widthMissile, heightMissile));
    SHOOTSOUND.pause();
    SHOOTSOUND.currentTime = 0;
    SHOOTSOUND.play()
    homura.counterShoot = 0;
    }
}

function updateMissiles() {
    homura.counterShoot += 1
    for (let i = 0; i < allMissiles.length; i++) {
        allMissiles[i].x += 5
        allMissiles[i].updateMissile()
    }
}

//CHECK FOR CRASHED HOMURA BY FAMILIARS
function checkCrashedHomura() {
    for (let i = 0; i < allFamiliars.length; i++) {
        if(homura.crashWithHomura(allFamiliars[i]) === true){
            allFamiliars.splice(i,1)
            barHomura.life -= 3  //Poner a 3
            HITHOMURA.pause();
            HITHOMURA.currentTime = 0;
            HITHOMURA.play()
            break
        }
    }
}

//CHECK FOR CRASHED WALPURGIS BY MISSILES
function checkCrashedWalpurgis() {
    for (let i = 0; i < allMissiles.length; i++) {
        if(walpurgis.crashWith(allMissiles[i]) === true){
            allMissiles.splice(i,1)
            barWalpurgis.life -= 1 //Poner a 1
            HITWALPURGIS.pause();
            HITWALPURGIS.currentTime = 0;
            HITWALPURGIS.play()
            break
        }
    }
}

//CHECK FOR CRASHED FAMILIARS BY MISSILES
function checkCrashedFamiliars() {
    for (let i = 0; i < allFamiliars.length; i++) {
        for (let j = 0; j < allMissiles.length; j++) {
            if(allFamiliars[i].crashWith(allMissiles[j]) === true){
                allFamiliars.splice(i,1)
                allMissiles.splice(j,1)
                HITFAMILIAR.pause();
                HITFAMILIAR.currentTime = 0;
                HITFAMILIAR.play()
                break
            }
        }
    }
}

// GAME OVER
function checkGameOver(id) {
   if(barHomura.life <= 0){
        cancelAnimationFrame(id)
        state.current = 4
        ctx.drawImage(youLoseImg, 0, 0, canvas.width, canvas.height)
        LAUGH.play()
        ctx.font = '200px "Kaushan Script"';
        ctx.shadowColor="black";
        ctx.shadowBlur=10;
        ctx.lineWidth=2;
        ctx.strokeText(`You Lose`, canvas.width/2 - 370, 300);
        ctx.fillStyle = '#F62211';
        ctx.fillText(`You Lose`, canvas.width/2 - 370, 300);
        ctx.drawImage(buttonImg, canvas.width/2 - 120, canvas.height - 180, 240, 130)
        ctx.font = '45px "Kaushan Script"';
        ctx.shadowColor="black";
        ctx.shadowBlur=10;
        ctx.lineWidth=1;
        ctx.strokeText(`Try Again`, canvas.width/2 - 94, canvas.height - 108);
        ctx.fillStyle = '#F0F0F0';
        ctx.fillText(`Try Again`, canvas.width/2 - 94, canvas.height - 108);
        state.current = state.overLose

   } else if(barWalpurgis.life <= 0){
        let record = `${myGameArea.minuteAux}:${myGameArea.secondAux}`
        cancelAnimationFrame(id)
        ctx.drawImage(youWinImg, 0, 0, canvas.width, canvas.height)
        ctx.font = '150px "Kaushan Script"';
        ctx.shadowColor="black";
        ctx.shadowBlur=10;
        ctx.lineWidth=2;
        ctx.strokeText(`You Win`, 0, 280);
        ctx.fillStyle = '#7E3C7D';
        ctx.fillText(`You Win`, 0, 280);
        ctx.font = '50px "Kaushan Script"';
        ctx.shadowColor="black";
        ctx.shadowBlur=10;
        ctx.lineWidth=2;
        ctx.strokeText(`Your record is ${record}`, 55, 360);
        ctx.fillStyle = '#F0F0F0';
        ctx.fillText(`Your record is ${record}`, 55, 360);
        ctx.drawImage(buttonImg, canvas.width/2 + 164, 340, 240, 130)
        ctx.font = '45px "Kaushan Script"';
        ctx.shadowColor="black";
        ctx.shadowBlur=10;
        ctx.lineWidth=1;
        ctx.strokeText(`Try Again`, canvas.width/2 + 190, 415);
        ctx.fillStyle = '#F0F0F0';
        ctx.fillText(`Try Again`, canvas.width/2 + 190, 415);
        state.current = state.overWin
   }
}

// MOTOR
function updateGameArea() {
    clear()
    backgroundImage.draw()
    homura.newPos()
    homura.detectBorders()
    homura.updateHomura()
    walpurgis.moveWalpurgis()
    walpurgis.newPos()
    walpurgis.updateWalpurgis()
    updateMissiles()
    updateFamiliars()
    checkCrashedHomura()
    checkCrashedWalpurgis()
    checkCrashedFamiliars()
    barHomura.updateHomuraBar()
    barWalpurgis.updateWalpurgisBar()
    barMagic.updateMagicBar()
    openShield.moveShield()
    openShield.updateShield()
    closeShield.moveShield()
    closeShield.updateShield()
    myGameArea.addSecond()
    myGameArea.updateChronometer()
    let frameId = requestAnimationFrame(updateGameArea)
    checkGameOver(frameId);
  }

//GAME'S INVOKE
window.onload = () =>{
    welcome()
}

//WELCOME GAME
function welcome(){
    ctx.drawImage(welcomeImg, 0, 0, canvas.width, canvas.height)
    ctx.font = '120px "Kaushan Script"';
    ctx.shadowColor="black";
    ctx.shadowBlur=7;
    ctx.lineWidth=2;
    ctx.strokeText(`Walpurgis Night`, canvas.width/2 - 400, 300);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`Walpurgis Night`, canvas.width/2 - 400, 300);
    ctx.drawImage(buttonImg, canvas.width/2 - 120, 348, 240, 130)
    ctx.font = '39px "Kaushan Script"';
    ctx.shadowColor="black";
    ctx.shadowBlur=10;
    ctx.lineWidth=1;
    ctx.strokeText(`How to play`, canvas.width/2 - 94, 420);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`How to play`, canvas.width/2 - 94, 420);
    ctx.font = '20px "Kaushan Script"';
    ctx.shadowColor="black";
    ctx.shadowBlur=10;
    ctx.lineWidth=1;
    ctx.strokeText(`By Brian Brenes`, canvas.width/2 - 70, canvas.height - 20);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`By Brian Brenes`,  canvas.width/2 - 70, canvas.height - 20);
    WALPURGISTHEME.pause();
    WALPURGISTHEME.currentTime = 0;
    
}

//GAMEPLAY
function gameplay(){
    ctx.drawImage(welcomeImg, 0, 0, canvas.width, canvas.height)
    ctx.font = '35px "Kaushan Script"';
    ctx.shadowColor="black";
    ctx.shadowBlur=10;
    ctx.lineWidth=1;
    ctx.strokeText(`Walpurgis Night has arrived to destroy everything in its path.`, canvas.width/2 - 430, 120);
    ctx.strokeText(`Defeat Walpurgis so Madoka does not have to turn into a magical girl.`, canvas.width/2 - 485, 180);
    ctx.strokeText(`Use           to move, press        to shoot missiles,`, canvas.width/2 - 326, 240);
    ctx.strokeText(`and press         to use your shield to stop time.`, canvas.width/2 - 316, 300);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`Walpurgis Night has arrived to destroy everything in its path.`, canvas.width/2 - 430, 120);
    ctx.fillText(`Defeat Walpurgis so Madoka does not have to turn into a magical girl.`, canvas.width/2 - 485, 180);
    ctx.fillText(`Use           to move, press        to shoot missiles,`, canvas.width/2 - 326, 240);
    ctx.fillText(`and press         to use your shield to stop time.`, canvas.width/2 - 316, 300);
    ctx.drawImage(arrowsImg, 442, 200, 62, 46)
    ctx.drawImage(keyImg, canvas.width/2 + 29, 209, 40, 40)
    ctx.font = '22px arial';
    ctx.shadowBlur=0;
    ctx.lineWidth=0;
    ctx.fillStyle = 'black';
    ctx.fillText(`A`, canvas.width/2 + 42, 234);
    ctx.drawImage(keyImg, canvas.width/2 - 164, 268, 40, 40)
    ctx.font = '22px arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`S`, canvas.width/2 - 151, 294);
    ctx.drawImage(buttonImg, canvas.width/2 - 120, 348, 240, 130)
    ctx.font = '39px "Kaushan Script"';
    ctx.shadowColor="black";
    ctx.shadowBlur=10;
    ctx.lineWidth=1;
    ctx.strokeText(`Start`, canvas.width/2 - 50, 420);
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`Start`, canvas.width/2 - 50, 420);
    SISPUELLA.play();
}

//INTRO GAME
function intro(){
    SISPUELLA.pause();
    SISPUELLA.currentTime = 0;
    WALPURGISTHEME.play();
    ctx.drawImage(carnivalImg, 0, 0, canvas.width, canvas.height)
    setTimeout(function(){ ctx.drawImage(fiveImg, 0, 0, canvas.width, canvas.height) }, 1000);
    setTimeout(function(){ ctx.drawImage(fourImg, 0, 0, canvas.width, canvas.height) }, 2000);
    setTimeout(function(){ ctx.drawImage(threeImg, 0, 0, canvas.width, canvas.height) }, 3000);
    setTimeout(function(){ ctx.drawImage(twoImg, 0, 0, canvas.width, canvas.height) }, 4000);
    setTimeout(function(){ ctx.drawImage(oneImg, 0, 0, canvas.width, canvas.height) }, 5000);
    setTimeout(function(){ ctx.drawImage(zeroImg, 0, 0, canvas.width, canvas.height) }, 6000);
    setTimeout(function(){ 
        ctx.shadowBlur=0;
        ctx.lineWidth=0;
        state.current = state.game
        resetGame()
        updateGameArea()
    }, 7000);
}

// EVENTS
document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 37: // left arrow
            homura.speedX -= 10
        break;
        case 39: // right arrow
            homura.speedX += 10
        break;
        case 38: // up arrow
            homura.speedY -= 10
        break;
        case 40: // right arrow
            homura.speedY += 10
        break;
        case 65: // letter A
            createMissile()
        break;
        case 83: // letter S
            if(barMagic.magicActive == false && barMagic.life >= 100){
                barMagic.magicActive = true
                openShield.shieldMoving = true
                SHIELDSOUND.play()
            }
        break;
        case 79: // letter O
            //barHomura.life = 5
        break;
        case 80: // letter P
            //barWalpurgis.life = 4
        break;
        case 73: // letter I
            //barMagic.life = 100
        break;
    }
  })
document.addEventListener('keyup', (e) => {
    homura.speedX = 0
    homura.speedY = 0
})

const btnWelcome = {
    x : canvas.width/2 - 120,
    y : 348,
    w : 240,
    h : 130
}
const btnWin = { 
    x : canvas.width/2 + 164,
    y : 340,
    w : 240,
    h : 130
}
const btnLose = {
    x : canvas.width/2 - 120,
    y : canvas.height - 180,
    w : 240,
    h : 130
}

document.addEventListener("click", function(evt){ // CLICK EVENT BY STATE
    let rect = canvas.getBoundingClientRect(); 
    let clickX = evt.clientX - rect.left;
    let clickY = evt.clientY - rect.top;
    switch(state.current){ 
        case state.welcome: // CHECK IF BUTTON WAS CLICKED
            //IF BUTTON WAS CLICKED
            if(clickX >= btnWelcome.x && clickX <= btnWelcome.x + btnWelcome.w && clickY >= btnWelcome.y && clickY <= btnWelcome.y + btnWelcome.h){
                state.current = state.gameplay;
                gameplay()
            }
        break;
        case state.gameplay: // CHECK IF BUTTON WAS CLICKED
            //IF BUTTON WAS CLICKED
            if(clickX >= btnWelcome.x && clickX <= btnWelcome.x + btnWelcome.w && clickY >= btnWelcome.y && clickY <= btnWelcome.y + btnWelcome.h){
                state.current = state.intro;
                intro()
            }
        break;
        case state.overWin: // CHECK IF BUTTON WAS CLICKED
            //IF BUTTON WAS CLICKED
            if(clickX >= btnWin.x && clickX <= btnWin.x + btnWin.w && clickY >= btnWin.y && clickY <= btnWin.y + btnWin.h){
                state.current = state.welcome;
                welcome()
            }
        break;
        case state.overLose: // CHECK IF BUTTON WAS CLICKED
            //IF BUTTON WAS CLICKED
            if(clickX >= btnLose.x && clickX <= btnLose.x + btnLose.w && clickY >= btnLose.y && clickY <= btnLose.y + btnLose.h){
                state.current = state.welcome;
                welcome()
            }
        break;
    }
})