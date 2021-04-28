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

// GAME STATE
const state = {
    current : 0, // CURRENT STATE
    welcome : 0, // GAME WELCOME SCREEN
    instruccions: 1, // GAME INSTRUCTIONS
    intro: 2, //INTRO FRAMES
    game : 3, // GAME LOOP
    overWin : 4, // END OF GAME
    overLose : 5 // END OF GAME
}

//BACKGROUND
const backgroundImage = {
    img: backgroundImg,
    draw: function(){
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height)
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
        ctx.font = '28px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`${this.minuteAux}:${this.secondAux}`, 642, 35);
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
            this.bottom() -20 < obstacle.top() ||
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
        if (myGameArea.frames % 100 === 0 && myGameArea.frames > 0) {
            this.yRandom = Math.floor(Math.random() * (canvas.height - this.height - 20) + 10)
        }
        if(this.y < this.yRandom){
            this.y += 1
        } else if(this.y > this.yRandom){
            this.y -= 1
        } else{
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
    }
    updateHomuraBar() {  // GENERATES HOMURA BAR
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 2 + (100 - this.life) * this.multiplier, this.y + 2, this.life * this.multiplier, this.height -4)
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 2, this.y + 2, (100 - this.life) * this.multiplier, this.height -4)
    }
}


    let homura = new Component(10, canvas.height/2 - 100, 166, 190)
    let walpurgis = new Component(canvas.width - 239 -10, canvas.height/2 - 125, 239, 250)
    let allFamiliars = []
    let allMissiles = []
    let barHomura = new Bar(15, 15, 304, 20, 3, '#49DE2B', 100)
    let barWalpurgis = new Bar(canvas.width -604 -15 , 15, 604, 20, 6, '#49DE2B', 100)

// RESET OBJECTS FOR NEW GAME
function resetGame(){
    homura = new Component(10, canvas.height/2 - 100, 166, 190)
    walpurgis = new Component(canvas.width - 239 -10, canvas.height/2 - 125, 239, 250)
    allFamiliars = []
    allMissiles = []
    barHomura = new Bar(15, 15, 304, 20, 3, '#49DE2B', 100)
    barWalpurgis = new Bar(canvas.width -604 -15 , 15, 604, 20, 6, '#49DE2B', 100)
    myGameArea.frames = 0
    myGameArea.minute = 0
    myGameArea.second = 0
    myGameArea.minuteAux = "00"
    myGameArea.secondAux = "00"
}


// FAMILIARS UPDATE
function updateFamiliars() {
    for (let i = 0; i < allFamiliars.length; i++) {
        allFamiliars[i].x -= 2
        allFamiliars[i].updateFamiliar();
    }
    myGameArea.frames += 1
    if (myGameArea.frames % 70 === 0) {
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
    // PUSH MISSILE
    allMissiles.push(new Component(homura.x + 140, homura.y + 17, widthMissile, heightMissile));
}

function updateMissiles() {
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
            barHomura.life -= 100  //Poner a 3
            break
        }
    }
}

//CHECK FOR CRASHED WALPURGIS BY MISSILES
function checkCrashedWalpurgis() {
    for (let i = 0; i < allMissiles.length; i++) {
        if(walpurgis.crashWith(allMissiles[i]) === true){
            allMissiles.splice(i,1)
            barWalpurgis.life -= 100 //Poner a 1
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
                break
            }
        }
    }
}

// GAME OVER
function checkGameOver(id) {
    /*
    const crashed = allFamiliars.some(function (familiar) {
      return homura.crashWithHomura(familiar); // RETURN TRUE OR FALSE
    })
    if (crashed) {
        cancelAnimationFrame(id)
        console.log("Game Over")
    }
    */
   if(barHomura.life <= 0){
        cancelAnimationFrame(id)
        state.current = 4
        ctx.drawImage(youLoseImg, 0, 0, canvas.width, canvas.height)
        ctx.font = '200px "Kaushan Script"';
        ctx.fillStyle = '#F62211';
        ctx.fillText(`You Lose`, canvas.width/2 - 370, 300);
        ctx.drawImage(buttonImg, canvas.width/2 - 120, canvas.height - 180, 240, 130)
        ctx.font = '45px "Kaushan Script"';
        ctx.fillStyle = '#7E3C7D';
        ctx.fillText(`Try Again`, canvas.width/2 - 94, canvas.height - 108);
        state.current = state.overLose

   } else if(barWalpurgis.life <= 0){
        let record = `${myGameArea.minuteAux}:${myGameArea.secondAux}`
        cancelAnimationFrame(id)
        ctx.drawImage(youWinImg, 0, 0, canvas.width, canvas.height)
        ctx.font = '150px "Kaushan Script"';
        ctx.fillStyle = '#7E3C7D';
        ctx.fillText(`You Win`, 0, 280);
        ctx.font = '50px "Kaushan Script"';
        ctx.fillStyle = '#7E3C7D';
        ctx.fillText(`Your record is ${record}`, 55, 360);
        ctx.drawImage(buttonImg, canvas.width/2 + 164, 340, 240, 130)
        ctx.font = '45px "Kaushan Script"';
        ctx.fillStyle = '#7E3C7D';
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
    myGameArea.addSecond()
    myGameArea.updateChronometer()
    let frameId = requestAnimationFrame(updateGameArea)
    checkGameOver(frameId);
  }

//GAME'S INVOKE
window.onload = () =>{
    ctx.drawImage(welcomeImg, 0, 0, canvas.width, canvas.height)
    ctx.font = '120px "Kaushan Script"';
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`Walpurgis Night`, canvas.width/2 - 400, 300);
    ctx.drawImage(buttonImg, canvas.width/2 - 120, 348, 240, 130)
    ctx.font = '39px "Kaushan Script"';
    ctx.fillStyle = '#F0F0F0';
    ctx.fillText(`How to play`, canvas.width/2 - 94, 420);
}

/* 
window.onload = () => {
    updateGameArea()
}
*/

//GAMEPLAY
function gameplay(){
    
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
                state.current = state.game;
                resetGame();
                updateGameArea();
                console.log('button clicked')
            }
        break;
        case state.overWin: // CHECK IF BUTTON WAS CLICKED
            //IF BUTTON WAS CLICKED
            if(clickX >= btnWin.x && clickX <= btnWin.x + btnWin.w && clickY >= btnWin.y && clickY <= btnWin.y + btnWin.h){
                state.current = state.game;
                resetGame();
                updateGameArea();
                console.log('button clicked')
            }
        break;
        case state.overLose: // CHECK IF BUTTON WAS CLICKED
            //IF BUTTON WAS CLICKED
            if(clickX >= btnLose.x && clickX <= btnLose.x + btnLose.w && clickY >= btnLose.y && clickY <= btnLose.y + btnLose.h){
                state.current = state.game;
                resetGame();
                updateGameArea();
                console.log('button clicked')
            }
        break;
    }
})