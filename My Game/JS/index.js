"use strict"

function querySelector(selector) { // easy define selectors
    return document.querySelector(selector);
}

const main = querySelector("main")
const button = querySelector("button");
const player1_name = querySelector("#name1");
const player2_name = querySelector("#name2");
const hero1 = querySelector("#hero1");
const hero2 = querySelector("#hero2");
const form = querySelector(".form");
const score_1 = querySelector(".score-1");
const score_2 = querySelector(".score-2");
const article = querySelector(".article");
const portal = querySelector("#portal");
const fruit = querySelector("#fruit");
const bomb = querySelector("#bomb");
const winnerBox = querySelector("#winner");
const confetti = querySelector("#confetti");
const winnerName = querySelector(".winner__name");
const newGameBtn = querySelector("#start-btn");

article.addEventListener("click", reload); // reload page
newGameBtn.addEventListener("click", reload); // start new game

function reload() { // reload the game
    location.reload();
}

function hideItem(selector) { // use to hide elements
    selector.style.display = "none";
}

function showItem(selector) { // use to show elements
    selector.style.display = "block";
}

hideItem(winnerBox);
hideItem(confetti);
hideItem(hero1);
hideItem(hero2);
hideItem(portal);
hideItem(bomb);
hideItem(fruit);

const field = {
    height: main.clientHeight,
    width: main.clientWidth,
}

function startGame(event) { // game start after form fill
    event.preventDefault()

    let firstNameValue = player1_name.value;
    let secondNameValue = player2_name.value;

    const regexp = /[0-9]/g;

    if (!firstNameValue || !secondNameValue) {
        return;
    }

    if (Array.from(firstNameValue.matchAll(regexp)).length > 0 ||
        Array.from(secondNameValue.matchAll(regexp)).length > 0) {
        alert("Name can't include a number");
        return;
    }

    if (firstNameValue.length > 7 || secondNameValue.length > 7) {
        alert("Name is too long");
        return;
    }

    hideItem(form);
    showItem(hero1);
    showItem(hero2);
    showItem(portal);
    showItem(bomb);
    showItem(fruit);
}

button.addEventListener("click", startGame); // start game;

class Player {
    constructor(elem, height, scoreBox, degree) {
        this.elem = elem;
        this.bottom = 0;
        this.left = 0;
        this.right = 0;
        this.speed = 10;
        this.score = 0;
        this.height = height;
        this.scoreBox = scoreBox;
        this.degree = degree;
    }

    showPlayerScore() {
        this.scoreBox.textContent = this.score;
    }

    changeSpeed() {
        this.speed--;
    }

    changeHeight() {
        this.height += 10;
        this.elem.style.height = this.height + "px";
    }

    update() {  // update player data
        this.score = 0;
        this.height = 70;
        this.bottom = 0;
        this.speed = 10;
        this.showPlayerScore();
        this.changeSpeed();
        this.changeHeight();
    }
// when two players meet and the score of one player 3 time bigger then other's
// player with big cscore can eat other one

    eatOpponent(opponent) {
        const crd1 = this.elem.getBoundingClientRect();
        const crd2 = opponent.elem.getBoundingClientRect();

        let overlap = (crd1.right >= (crd2.left + (crd1.height / 4)) // calculating overlap coordinates
            && crd1.top <= (crd2.bottom - (crd1.height / 4))
            && crd1.bottom > crd2.top
            && crd1.left <= (crd2.right - (crd1.height / 4)));

        if (overlap && (this.height % opponent.height === 30)) {
            opponent.playerLost();
        }
    }

    playerLost() {
        let interval = setInterval(() => {
            this.elem.style.opacity = "0.5";
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            this.elem.style.opacity = "1";
        }, 2000);
        this.update();
    }

    elementsClash(target) {
        const crd1 = this.elem.getBoundingClientRect();
        const crd2 = target.getBoundingClientRect();

        let overlap = (crd1.right >= (crd2.left + (crd1.height / 3)) // calculating overlap coordinates
            && crd1.top <= (crd2.bottom - (crd1.height / 3))
            && crd1.bottom > crd2.top
            && crd1.left <= (crd2.right - (crd1.height / 3)));

        if (overlap) {
            target.hideElem();
            target.appendElements();
            this.score++;
            this.showPlayerScore();
            this.changeSpeed();
            this.changeHeight();
        }
    }

    explosion(target) {
        const crd1 = this.elem.getBoundingClientRect();
        const crd2 = target.getBoundingClientRect();

        let overlap = (crd1.right >= (crd2.left + (crd1.height / 2)) && crd1.top <= (crd2.bottom - (crd1.height / 2))
            && crd1.bottom > crd2.top && crd1.left <= (crd2.right - (crd1.height / 2)));

        if (overlap) {
            target.hideElem()
            setTimeout(() => target.appendElements(), Math.random() * 7000);
            this.playerLost()
        }
    }

    getInPortal(target) {
        const crd1 = this.elem.getBoundingClientRect();
        const crd2 = target.getBoundingClientRect();

        let overlap = (crd1.right >= (crd2.left + (crd1.height / 3)) && crd1.top <= (crd2.bottom - (crd1.height / 3))
            && crd1.bottom > crd2.top && crd1.left <= (crd2.right - (crd1.height / 3)));

        if (overlap) {
            this.playerLost();
            hideItem(this.elem);
            target.hideElem()
            setTimeout(() => showItem(this.elem), 2000);
            setTimeout(() => target.appendElements(), Math.random() * 10000);
        }
    }

    playerWins(box) {
        let playerName = box.value;

        if (this.score === 5) {
            hideItem(hero1);
            hideItem(hero2);
            hideItem(portal);
            hideItem(bomb);
            hideItem(fruit);
            showItem(confetti);
            winnerName.textContent = playerName;
            winnerBox.style.display = "flex";
        }
    }
}

const player1 = new Player(hero1, 70, score_1, 0);
const player2 = new Player(hero2, 70, score_2, 180);

player2.playerLost()
player1.playerLost()

class Element {
    #elem;

    constructor(elem) {
        this.#elem = elem;
    }

    get y() {
        return this.#elem.style.bottom = Math.round(Math.random() * (field.height - this.#elem.offsetHeight)) + "px";
    }

    get x() {
        return this.#elem.style.left = Math.round(Math.random() * (field.width - this.#elem.offsetWidth)) + "px";
    }

    appendElements() {
        this.#elem.hidden = false;
        this.#elem.style.left = this.x;
        this.#elem.style.bottom = this.y;
    }

    hideElem() {
        this.#elem.hidden = true;
    }

    getBoundingClientRect() {
        return this.#elem.getBoundingClientRect();
    }
}

const fieldPortal = new Element(portal);
const cherry = new Element(fruit);
const trap = new Element(bomb);

fieldPortal.appendElements()
cherry.appendElements();
trap.appendElements();
// fieldPortal.hideElem(); //todo hide and add setTimeout to show
// trap.hideElem()

let keysPressed = {}; // object for saving even.keys

document.addEventListener('keyup', removeKeyCodes);
document.addEventListener('keydown', moveHeroes); // move heroes by pressing keys


function moveHeroes(event) {
    keysPressed[event.key] = true;   // collecting pressed keys

    if (keysPressed["w"]) { // move player 1
        player1.bottom += player1.speed;
        player1.degree = -90;
    }
    if (keysPressed["s"]) {
        player1.bottom -= player1.speed;
        player1.degree = 90;
    }
    if (keysPressed["a"]) {
        player1.left -= player1.speed;
        player1.degree = 180;
    }
    if (keysPressed["d"]) {
        player1.left += player1.speed;
        player1.degree = 0;
    }
    if (keysPressed["ArrowUp"]) {   // move player 2
        player2.bottom += 10;
        player2.degree = 90;
    }
    if (keysPressed["ArrowDown"]) {
        player2.bottom -= player2.speed;
        player2.degree = -90;
    }
    if (keysPressed["ArrowLeft"]) {
        player2.right += player2.speed;
        player2.degree = 0;
    }
    if (keysPressed["ArrowRight"]) {
        player2.right -= player2.speed;
        player2.degree = 180;
    }

    // don't allow hero1 to pass borders of field
    if (player1.bottom > (field.height - player1.height)) {
        player1.bottom = field.height - player1.height
    }
    if (player1.bottom < 0) {
        player1.bottom = 0;
    }
    if (player1.left > (field.width - player1.height)) {
        player1.left = field.width - player1.height;
    }
    if (player1.left < 0) {
        player1.left = 0;
    }
    // don't allow hero2 to pass borders of field
    if (player2.bottom > (field.height - player2.height)) {
        player2.bottom = field.height - player2.height
    }
    if (player2.bottom < 0) {
        player2.bottom = 0;
    }
    if (player2.right > (field.width - player2.height)) {
        player2.right = field.width - player2.height;
    }
    if (player2.right < 0) {
        player2.right = 0;
    }

    hero1.style.bottom = player1.bottom + "px";
    hero1.style.left = player1.left + "px";
    hero2.style.bottom = player2.bottom + "px";
    hero2.style.right = player2.right + "px";
    hero1.style.transform = `rotate(${player1.degree}deg)`;
    hero2.style.transform = `rotate(${player2.degree}deg)`;

    player1.elementsClash(cherry);
    player2.elementsClash(cherry);
    player1.explosion(trap);
    player2.explosion(trap);
    player1.getInPortal(fieldPortal);
    player2.getInPortal(fieldPortal);
    player1.eatOpponent(player2);
    player2.eatOpponent(player1);
    player1.playerWins(player1_name);
    player2.playerWins(player2_name);
}

function removeKeyCodes(event) {  // removing unpressed keys
    delete keysPressed[event.key];
}

