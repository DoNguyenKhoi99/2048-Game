
const GAME_CONFIG = {
    ROW: 4,
    COL: 4,
    MARGIN: 16 //results from: (this.mainGame.width - this.block.width * GAME_CONFIG.ROW) / 5;
};

const ARR_BLOCK = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

cc.Class({
    extends: cc.Component,

    properties: {
        mainGame: cc.Node,
        block: cc.Prefab,
        score: cc.Label,
        recored: cc.Label,
        loseLayout: cc.Node, 
        winGame: cc.Node,
        loseGame: cc.Node,
        _isChange: false
    },

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.initObj();
        this.score.node.string = 0;
    },

    initObj() {
        this.initBlock();
        this.addNum();
        this.addNum();
    },

    initBlock() {
        let y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN,
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                this.newBlock = cc.instantiate(this.block); 
                this.newBlock.setParent(this.mainGame);
                this.newBlock.setPosition(cc.v2(x, y));
                x += this.newBlock.width + GAME_CONFIG.MARGIN;
                if(ARR_BLOCK[row][col] != 0) {
                    let label = this.newBlock.getChildByName("Value")
                    label.getComponent(cc.Label).string = ARR_BLOCK[row][col];
                    this.newBlock.getComponent("BlockController").setColor();
                }
            }
            y -= this.newBlock.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },

    slideLeftOrUp(array) {
        let newArray = [];
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(array[row] != 0) newArray.push(array[row]);
        };
        for(let col = newArray.length; col < GAME_CONFIG.COL; col++){
            newArray.push(0);
        }
        return newArray;
    },

    slideRightOrDown(array) {
        let newArray = [];
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(array[row] == 0) newArray.push(array[row]);
        };
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(array[row] != 0) newArray.push(array[row]);
        };
        return newArray;
    },

    addNum() {
        this.updateScore();
        let newArr = [];
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) { 
                if(ARR_BLOCK[row][col] == 0) {
                    newArr.push({x: row, y: col});
                }
            }
        }
        if(newArr.length > 0) {
            let randomXY = newArr[Math.random() * newArr.length >> 0];
            let number = Math.floor(Math.random() * 4);
            number < 3 ? ARR_BLOCK[randomXY.x][randomXY.y] = 2 : ARR_BLOCK[randomXY.x][randomXY.y] = 4;   
        }
        this.initBlock();
    },

    hasChangeArray(arr1, arr2) {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(arr1[row] != arr2[row]) {
                this._isChange = true;
            }
        }
    },

    checkWin() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col =0; col < GAME_CONFIG.COL; col++) {
                if(ARR_BLOCK[row][col] === 2048) {
                    this.winGame.active = true;
                }
            }
        }
    },

    updateScore() {
        let total = 0;
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                if(ARR_BLOCK[row][col] > 2) {
                    total += ARR_BLOCK[row][col];
                    this.score.string = total;
                }
            }
        }
    },

    clickRestart() {

    },

    checkLeft() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            let arr = ARR_BLOCK[row];
            ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
            for(let col = 0; col < GAME_CONFIG.COL - 1; col++) {
                if(ARR_BLOCK[row][col] == ARR_BLOCK[row][col + 1]) {
                    ARR_BLOCK[row][col] += ARR_BLOCK[row][col + 1];
                    ARR_BLOCK[row][col + 1] = 0;
                }
            }
            ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
            this.hasChangeArray(arr, ARR_BLOCK[row]);
        }
        if(this._isChange) {
            this.addNum();
        }
    },

    checkRight() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            let arr = ARR_BLOCK[row];
            ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
            for(let col = 3; col > 0; col--) {
                if(ARR_BLOCK[row][col] == ARR_BLOCK[row][col - 1]) {
                    ARR_BLOCK[row][col] += ARR_BLOCK[row][col - 1];
                    ARR_BLOCK[row][col - 1] = 0;
                }
            }
            ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
            this.hasChangeArray(arr, ARR_BLOCK[row]);
        }
        if(this._isChange) {
            this.addNum();
        }
    },

    checkUp() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            let newArr = [];
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                newArr.push(ARR_BLOCK[col][row]);    
            }
            let arr  = newArr;
            newArr = this.slideLeftOrUp(newArr);
            for(let m = 0; m < 3; m++) {
                if(newArr[m] == newArr[m + 1]) {
                    newArr[m] += newArr[m + 1];
                    newArr[m + 1] = 0;
                }
            }
            newArr = this.slideLeftOrUp(newArr);
            for(let i = 0; i < 4; i++) {
                ARR_BLOCK[i][row] = newArr[i];
            }
            this.hasChangeArray(arr, newArr);
        }
        if(this._isChange) {
            this.addNum();
        }
    },

    checkDown() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            let newArr = [];
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                newArr.push(ARR_BLOCK[col][row]);
            }
            let arr  = newArr;
            newArr = this.slideRightOrDown(newArr);
            for(let m = 3; m > 0; m--) {
                if(newArr[m] == newArr[m - 1]) {
                    newArr[m] += newArr[m - 1];
                    newArr[m - 1] = 0;
                }
            }
            newArr = this.slideRightOrDown(newArr);
            for(let i = 0; i < 4; i++) {
                ARR_BLOCK[i][row] = newArr[i];
            }
            this.hasChangeArray(arr, newArr);
        }
        if(this._isChange) {
            this.addNum();
        }
    },

    onKeyDown(event) {
        this._isChange = false;
        switch(event.keyCode) {
            case 37:
                this.checkLeft();  
                break;
            case 39:
                this.checkRight();
                break;
            case 38: 
                this.checkUp();
                break;
            case 40:
                this.checkDown();
        }
    },

    update() {
        this.checkWin();
    },
});
