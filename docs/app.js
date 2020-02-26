"use strict";

class GameOfLife {

    constructor(sizeX, sizeY, liveFactor, boardElement) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.boardElement = boardElement;
        this.currentBoard = new Board(this.sizeX, this.sizeY);
        this.currentBoard.generateRandomCells(liveFactor);
        this.generateHtmlTable();
        this.printCurrentBoard();
    }

    generateHtmlTable() {
        let newTBodyElement = document.createElement("tbody");
        for (let y = 0; y < this.sizeY; y++) {
            let trElement = newTBodyElement.insertRow();
            for (let x = 0; x < this.sizeX; x++) {
                let cellElement = trElement.insertCell();
            }
        }

        let oldTBodyElement = this.boardElement.firstElementChild;
        this.boardElement.replaceChild(newTBodyElement, oldTBodyElement);
    }

    printCurrentBoard() {
        for (let y = 0; y < this.sizeY; y++) {
            let trElement = this.boardElement.rows[y];
            for (let x = 0; x < this.sizeX; x++) {
                let cellElement = trElement.cells[x];
                if (this.currentBoard.isCellAlive(x, y)) {
                    // cellElement.textContent = "X";
                    cellElement.classList.add("alive-cell");
                } else {
                    // cellElement.textContent = "-";
                    cellElement.classList.remove("alive-cell");
                }
            }
        }
    }

    switchToNextGeneration() {
        this.currentBoard = this.currentBoard.generateNextGenerationBoard();
        this.printCurrentBoard();
    }
}

class Board {

    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.generateEmptyCells();
    }

    generateEmptyCells() {
        this.cells = new Array(this.sizeY);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Array(this.sizeX);
        }
    }

    generateRandomCells(liveFactor) {
        for (let y = 1; y < this.sizeY - 1; y++) {
            for (let x = 1; x < this.sizeX - 1; x++) {
                if (Math.random() < liveFactor) {
                    this.spawnCell(x, y);
                }
            }
        }
    }

    spawnCell(x, y) {
        this.cells[y][x] = true;
    }

    generateNextGenerationBoard() {
        let nextGenerationBoard = new Board(this.sizeX, this.sizeY);
        for (let y = 1; y < this.sizeY - 1; y++) {
            for (let x = 1; x < this.sizeX - 1; x++) {
                if (this.shouldCellSurvive(x, y)) {
                    nextGenerationBoard.spawnCell(x, y);
                }
            }
        }
        return nextGenerationBoard;
    }

    shouldCellSurvive(x, y) {
        let count = this.countNeighbours(x, y);
        if (this.isCellAlive(x, y)) {
            if (count < 2) return false;
            else if (count === 2 || count === 3) return true;
            else return false;
        } else {
            if (count === 3) return true;
            else return false;
        }
    }

    countNeighbours(x, y) {
        let count = 0;
        for (let j = y - 1; j <= y + 1; j++) {
            for (let i = x - 1; i <= x + 1; i++) {
                if (!(x === i && y === j) && this.isCellAlive(i, j)) {
                    count++;
                }
            }
        }
        return count;
    }

    isCellAlive(x, y) {
        return this.cells[y][x];
    }
}


let btnStart = document.querySelector("#btnStart");
let editWidth = document.querySelector("#editWidth");
let editHeight = document.querySelector("#editHeight");
let tabBoard = document.querySelector("#tabBoard");
let btnNextGeneration = document.querySelector("#btnNextGeneration");
let startScreen = document.querySelector("#startScreen");
let playScreen = document.querySelector("#playScreen");

btnStart.addEventListener("click", () => {
    let width = parseInt(editWidth.value);
    let height = parseInt(editHeight.value);
    let liveFactor = 0.2;
    let game = new GameOfLife(width, height, liveFactor, tabBoard);
    btnNextGeneration.addEventListener("click", () => game.switchToNextGeneration());
    startScreen.classList.add("hidden");
    playScreen.classList.remove("hidden");
    btnNextGeneration.focus();
});
