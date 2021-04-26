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
    frames: 0
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
        if (myGameArea.frames % 500 === 0 && myGameArea.frames > 0) {
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

// HOMURA, MISSILES, WALPURGIS, FAMILIARS
class Bar {
    constructor(x, y, width, height) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.multiplier = 0;
    }
    updateBar() {  // GENERATES BAR
        ctx.drawImage(homuraImg, this.x, this.y, this.width, this.height)
    }
}

const homura = new Component(10, canvas.height/2 - 100, 166, 190)
const walpurgis = new Component(canvas.width - 239 -10, canvas.height/2 - 125, 239, 250)
const allFamiliars = []
const allMissiles = []

// FAMILIARS UPDATE
function updateFamiliars() {
    for (let i = 0; i < allFamiliars.length; i++) {
        allFamiliars[i].x -= 1
        allFamiliars[i].updateFamiliar();
    }
    myGameArea.frames += 1
    if (myGameArea.frames % 150 === 0) {
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
            break
        }
    }
}

//CHECK FOR CRASHED WALPURGIS BY MISSILES
function checkCrashedWalpurgis() {
    for (let i = 0; i < allMissiles.length; i++) {
        if(walpurgis.crashWith(allMissiles[i]) === true){
            allMissiles.splice(i,1)
            console.log('Walpurgis Crashed')
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
    let frameId = requestAnimationFrame(updateGameArea)
    checkGameOver(frameId);
  }

//GAME'S INVOKE
window.onload = () => {
      updateGameArea()
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