(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/GameManagaer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '016acPX4gdMY7UAGkEsBhhU', 'GameManagaer', __filename);
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
        _arrBlockPos: []
    },

    onLoad: function onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.initObj();
        this.score.node.string = 0;
    },
    initObj: function initObj() {
        this.createCell();
        this.createBlock();
    },
    createCell: function createCell() {
        var y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN;
        var x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            this._arrBlockPos[row] = [];
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                this._arrBlockPos[row][col] = { x: x, y: y }; //SEVE POSITION VALUE
                this._cell = cc.instantiate(this.cell); //CREATE PREAFAB CELL
                this._cell.setParent(this.mainGame);
                this._cell.setPosition(cc.v2(x, y));
                x += this._cell.width + GAME_CONFIG.MARGIN;
            }
            y -= this._cell.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },
    createBlock: function createBlock() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                var arrBlockPos = this._arrBlockPos[row][col];
                if (!arrBlockPos.status) {
                    this._block = cc.instantiate(this.block);
                    this._block.setParent(this.mainGame);
                    this._block.setPosition(arrBlockPos.x, arrBlockPos.y);
                };
            }
        };
    },
    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.checkRow();
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
                this.checkCol();
                break;
        };
    },
    checkRow: function checkRow() {
        cc.error("cc");
    },
    checkCol: function checkCol() {
        cc.error("cc");
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
        