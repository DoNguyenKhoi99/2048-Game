(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/GameManagaer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '016acPX4gdMY7UAGkEsBhhU', 'GameManagaer', __filename);
// Scripts/GameManagaer.js

"use strict";

var GAME_CONFIG = {
    ROW: 4,
    COL: 4,
    MARGIN: 16 //results from: (this.mainGame.width - this.block.width * GAME_CONFIG.ROW) / 5;
};

var ARR_BLOCK = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

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

    onLoad: function onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.initObj();
        this.score.node.string = 0;
    },
    initObj: function initObj() {
        this.initBlock();
        this.addNum();
        this.addNum();
    },
    initBlock: function initBlock() {
        var y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN,
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                this.newBlock = cc.instantiate(this.block);
                this.newBlock.setParent(this.mainGame);
                this.newBlock.setPosition(cc.v2(x, y));
                x += this.newBlock.width + GAME_CONFIG.MARGIN;
                if (ARR_BLOCK[row][col] != 0) {
                    var label = this.newBlock.getChildByName("Value");
                    label.getComponent(cc.Label).string = ARR_BLOCK[row][col];
                    this.newBlock.getComponent("BlockController").setColor();
                }
            }
            y -= this.newBlock.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },
    slideLeftOrUp: function slideLeftOrUp(array) {
        var newArray = [];
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            if (array[row] != 0) newArray.push(array[row]);
        };
        for (var col = newArray.length; col < GAME_CONFIG.COL; col++) {
            newArray.push(0);
        }
        return newArray;
    },
    slideRightOrDown: function slideRightOrDown(array) {
        var newArray = [];
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            if (array[row] == 0) newArray.push(array[row]);
        };
        for (var _row = 0; _row < GAME_CONFIG.ROW; _row++) {
            if (array[_row] != 0) newArray.push(array[_row]);
        };
        return newArray;
    },
    addNum: function addNum() {
        this.updateScore();
        var newArr = [];
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (ARR_BLOCK[row][col] == 0) {
                    newArr.push({ x: row, y: col });
                }
            }
        }
        if (newArr.length > 0) {
            var randomXY = newArr[Math.random() * newArr.length >> 0];
            var number = Math.floor(Math.random() * 4);
            number < 3 ? ARR_BLOCK[randomXY.x][randomXY.y] = 2 : ARR_BLOCK[randomXY.x][randomXY.y] = 4;
        }
        this.initBlock();
    },
    hasChangeArray: function hasChangeArray(arr1, arr2) {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            if (arr1[row] != arr2[row]) {
                this._isChange = true;
            }
        }
    },
    checkWin: function checkWin() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (ARR_BLOCK[row][col] === 2048) {
                    this.winGame.active = true;
                }
            }
        }
    },
    updateScore: function updateScore() {
        var total = 0;
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (ARR_BLOCK[row][col] > 2) {
                    total += ARR_BLOCK[row][col];
                    this.score.string = total;
                }
            }
        }
    },
    clickRestart: function clickRestart() {},
    checkLeft: function checkLeft() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            var arr = ARR_BLOCK[row];
            ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
            for (var col = 0; col < GAME_CONFIG.COL - 1; col++) {
                if (ARR_BLOCK[row][col] == ARR_BLOCK[row][col + 1]) {
                    ARR_BLOCK[row][col] += ARR_BLOCK[row][col + 1];
                    ARR_BLOCK[row][col + 1] = 0;
                }
            }
            ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
            this.hasChangeArray(arr, ARR_BLOCK[row]);
        }
        if (this._isChange) {
            this.addNum();
        }
    },
    checkRight: function checkRight() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            var arr = ARR_BLOCK[row];
            ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
            for (var col = 3; col > 0; col--) {
                if (ARR_BLOCK[row][col] == ARR_BLOCK[row][col - 1]) {
                    ARR_BLOCK[row][col] += ARR_BLOCK[row][col - 1];
                    ARR_BLOCK[row][col - 1] = 0;
                }
            }
            ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
            this.hasChangeArray(arr, ARR_BLOCK[row]);
        }
        if (this._isChange) {
            this.addNum();
        }
    },
    checkUp: function checkUp() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            var newArr = [];
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                newArr.push(ARR_BLOCK[col][row]);
            }
            var arr = newArr;
            newArr = this.slideLeftOrUp(newArr);
            for (var m = 0; m < 3; m++) {
                if (newArr[m] == newArr[m + 1]) {
                    newArr[m] += newArr[m + 1];
                    newArr[m + 1] = 0;
                }
            }
            newArr = this.slideLeftOrUp(newArr);
            for (var i = 0; i < 4; i++) {
                ARR_BLOCK[i][row] = newArr[i];
            }
            this.hasChangeArray(arr, newArr);
        }
        if (this._isChange) {
            this.addNum();
        }
    },
    checkDown: function checkDown() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            var newArr = [];
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                newArr.push(ARR_BLOCK[col][row]);
            }
            var arr = newArr;
            newArr = this.slideRightOrDown(newArr);
            for (var m = 3; m > 0; m--) {
                if (newArr[m] == newArr[m - 1]) {
                    newArr[m] += newArr[m - 1];
                    newArr[m - 1] = 0;
                }
            }
            newArr = this.slideRightOrDown(newArr);
            for (var i = 0; i < 4; i++) {
                ARR_BLOCK[i][row] = newArr[i];
            }
            this.hasChangeArray(arr, newArr);
        }
        if (this._isChange) {
            this.addNum();
        }
    },
    onKeyDown: function onKeyDown(event) {
        this._isChange = false;
        switch (event.keyCode) {
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
    update: function update() {
        this.checkWin();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameManagaer.js.map
        