"use strict";
cc._RF.push(module, '016acPX4gdMY7UAGkEsBhhU', 'GameManagaer');
// Scripts/GameManagaer.js

"use strict";

var GAME_CONFIG = {
    ROW: 4,
    COL: 4,
    MARGIN: 16 //results from: (this.mainGame.width - this.block.width * GAME_CONFIG.ROW) / 5;
};
cc.Class({
    extends: cc.Component,

    properties: {
        mainGame: cc.Node,
        block: cc.Prefab,
        cell: cc.Prefab,
        score: cc.Label,
        recored: cc.Label,
        loseLayout: cc.Node,
        _arrBlockPos: [],
        _arrBlock: []
    },

    onLoad: function onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.initObj();
        this.score.node.string = 0;
    },
    initObj: function initObj() {
        this.initCell();
        this.initBlock(2);
    },
    initCell: function initCell() {
        var y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN,
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        var index = 0;
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            this._arrBlockPos[row] = [];
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                this._arrBlockPos[row][col] = { x: x, y: y, status: false, index: index++ }; //ADD POSITION VALUE
                this.newCell = cc.instantiate(this.cell); //CREATE PREAFAB CELL
                this.newCell.setParent(this.mainGame);
                this.newCell.setPosition(cc.v2(x, y));
                x += this.newCell.width + GAME_CONFIG.MARGIN;
            }
            y -= this.newCell.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },
    initBlock: function initBlock(loop) {
        for (var i = 0; i < loop; i++) {
            var arrPos = this._arrBlockPos[this.getRandomInt(0, 3)][this.getRandomInt(0, 3)];
            if (!arrPos.status) {
                var newBlock = cc.instantiate(this.block);
                newBlock.setParent(this.mainGame);
                newBlock.setPosition(cc.v2(arrPos.x, arrPos.y));
                arrPos.status = true;
                this._arrBlock.push({ block: newBlock, index: arrPos.index });
            } else {
                this.initBlock(1);
            }
        }
        cc.error(this._arrBlock);
    },
    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.checkRow(event.keyCode);
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
                this.checkCol(event.keyCode);
                break;
        };
    },
    checkRow: function checkRow(value) {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (typeof this._arrBlock[col].block == "undefined") {
                    cc.error("cc");
                } else {
                    cc.error(this._arrBlock[col].block);
                }
            }
        }
    },
    checkCol: function checkCol(value) {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                cc.error(this._arrBlockPos[col][row]);
            }
        }
    },
    getRandomInt: function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

cc._RF.pop();