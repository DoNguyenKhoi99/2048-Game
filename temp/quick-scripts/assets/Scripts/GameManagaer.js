(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/GameManagaer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '016acPX4gdMY7UAGkEsBhhU', 'GameManagaer', __filename);
// Scripts/GameManagaer.js

"use strict";

var ROWS = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        bestScoreLabel: cc.Label,
        blockPrefab: cc.Prefab,
        bgBox: cc.Node,
        cellPrefab: cc.Prefab,
        loseLayOut: cc.Node,
        winLayOut: cc.Node,
        _gap: {
            default: 10,
            serializable: false
        },
        _blockSize: null,
        _data: [],
        _arrBlock: [],
        _posisions: [],
        _score: null,
        _canMove: true
    },

    onLoad: function onLoad() {
        this._canMove = true;
        this.loseLayOut.active = false;
    },
    start: function start() {
        this._blockSize = (this.bgBox.width - this._gap * 5) / 4;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.blockInit();
        this.init();
    },
    arrInit: function arrInit(x, y) {
        var blockArr = new Array();
        for (var i = 0; i < x; i++) {
            blockArr[i] = new Array();
            for (var j = 0; j < y; j++) {
                blockArr[i][j] = 0;
            }
        }
        return blockArr;
    },
    init: function init() {
        this.updateScore(0);
        this._data = this.arrInit(ROWS, ROWS);
        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < ROWS; col++) {
                this._arrBlock[row][col].getComponent("BlockController").setNumber(0);
                this._data[row][col] = 0;
            }
        };
        this.addBlock();
        this.addBlock();
    },
    blockInit: function blockInit() {
        this._arrBlock = this.arrInit(ROWS, ROWS);

        for (var i = 0; i < ROWS; i++) {
            this._posisions.push([0, 0, 0, 0]);
            for (var j = 0; j < ROWS; j++) {
                var x = -(this.bgBox.width / 2) + (this._gap * (j + 1) + this._blockSize / 2 * (2 * j + 1));
                var y = this.bgBox.height / 2 - (this._gap * (i + 1) + this._blockSize / 2 * (2 * i + 1));
                var block = cc.instantiate(this.blockPrefab);
                block.parent = this.bgBox;
                block.width = this._blockSize;
                block.height = this._blockSize;
                block.setPosition(cc.v2(x, y));
                this._posisions[i][j] = cc.v2(x, y);
                block.getComponent("BlockController").setNumber(0);
                this._arrBlock[i][j] = block;
            }
        }
    },
    getEmptyLocations: function getEmptyLocations() {
        var locations = [];
        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < ROWS; col++) {
                if (this._data[row][col] === 0) {
                    locations.push({
                        x: row,
                        y: col
                    });
                }
            }
        }
        return locations;
    },
    addBlock: function addBlock() {
        var locations = this.getEmptyLocations();
        if (locations.length === 0) return false;

        var location = locations[Math.floor(Math.random() * locations.length)];
        var x = location.x;
        var y = location.y;
        var position = this._posisions[x][y];
        var block = cc.instantiate(this.blockPrefab);
        block.width = this._blockSize;
        block.height = this._blockSize;
        block.parent = this.bgBox;
        block.setPosition(position);

        var number = Math.random() <= 0.95 ? 2 : 4;
        block.getComponent("BlockController").setNumber(number);
        this._arrBlock[x][y] = block;
        this._data[x][y] = number;

        return true;
    },
    updateScore: function updateScore(num) {
        this._score = num;
        this.scoreLabel.string = num;
    },
    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                if (this._canMove) {
                    this._canMove = false;
                    this.blockMoveRight();
                }
                break;
            case cc.macro.KEY.left:
                if (this._canMove) {
                    this._canMove = false;
                    this.blockMoveLeft();
                }
                break;
            case cc.macro.KEY.up:
                if (this._canMove) {
                    this._canMove = false;
                    this.blockMoveUp();
                }
                break;
            case cc.macro.KEY.down:
                if (this._canMove) {
                    this._canMove = false;
                    this.blockMoveDown();
                }
                break;
        }
    },


    // updateBlockNum: function () {
    //     for (let row = 0; row < ROWS; row++) {
    //         for (let col = 0; col < ROWS; col++) {
    //             this._arrBlock[row][col].getComponent("BlockController").setNumber(this._data[row][col]);
    //         }
    //     }
    // },

    afterMove: function afterMove(hasMoved) {
        this._canMove = true;
        if (hasMoved) {
            this.updateScore(this._score + 1);
            this.addBlock();
        } else if (this.checkGameOver()) {
            this.gameOver();
        }
    },
    moveBlock: function moveBlock(block, position, callback) {
        var action = cc.moveTo(.05, position);
        var finish = cc.callFunc(function () {
            callback && callback();
        });
        block.runAction(cc.sequence(action, finish));
    },
    combineBlock: function combineBlock(b1, b2, num, callback) {
        b1.destroy();
        var scale1 = cc.scaleTo(0.1, 1.1);
        var scale2 = cc.scaleTo(0.1, 1);
        var mid = cc.callFunc(function () {
            b2.getComponent("BlockController").setNumber(num);
        });
        var finish = cc.callFunc(function () {
            callback && callback();
        });
        b2.runAction(cc.sequence(scale1, mid, scale2, finish));
    },
    checkGameOver: function checkGameOver() {
        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < ROWS; j++) {
                var n = this._data[i][j];
                if (n === 0) return false;
                if (j > 0 && this._data[i][j - 1] == n) return false;
                if (j < ROWS - 1 && this._data[i][j + 1] == n) return false;
                if (i > 0 && this._data[i - 1][j] == n) return false;
                if (i < ROWS - 1 && this._data[i + 1][j] == n) return false;
            }
        }
        return true;
    },
    blockMoveRight: function blockMoveRight() {
        var _this = this;

        var hasMoved = false;
        var move = function move(x, y, callback) {
            if (y == ROWS + 1 || _this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (_this._data[x][y + 1] == 0) {
                var block = _this._arrBlock[x][y];
                var position = _this._posisions[x][y + 1];
                _this._arrBlock[x][y + 1] = block;
                _this._data[x][y + 1] = _this._data[x][y];
                _this._data[x][y] = 0;
                _this._arrBlock[x][y] = null;
                _this.moveBlock(block, position, function () {
                    move(x, y + 1, callback);
                });
                hasMoved = true;
            } else if (_this._data[x][y + 1] == _this._data[x][y]) {
                var _block = _this._arrBlock[x][y];
                var _position = _this._posisions[x][y + 1];

                _this._data[x][y + 1] *= 2;
                _this._data[x][y] = 0;
                _this._arrBlock[x][y] = null;
                _this.moveBlock(_block, _position, function () {
                    _this.combineBlock(_block, _this._arrBlock[x][y + 1], _this._data[x][y + 1], function () {
                        callback && callback();
                    });
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        };

        var toMove = [];
        for (var i = 0; i < ROWS; i++) {
            for (var j = ROWS - 1; j >= 0; j--) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        var count = 0;
        for (var _i = 0; _i < toMove.length; _i++) {
            move(toMove[_i].x, toMove[_i].y, function () {
                count++;
                if (count == toMove.length) {
                    _this.afterMove(hasMoved);
                }
            });
        }
    },
    blockMoveLeft: function blockMoveLeft() {
        var _this2 = this;

        var hasMoved = false;
        var move = function move(x, y, callback) {
            if (y == 0 || _this2._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (_this2._data[x][y - 1] == 0) {
                var block = _this2._arrBlock[x][y];
                var position = _this2._posisions[x][y - 1];
                _this2._arrBlock[x][y - 1] = block;
                _this2._data[x][y - 1] = _this2._data[x][y];
                _this2._data[x][y] = 0;
                _this2._arrBlock[x][y] = null;
                _this2.moveBlock(block, position, function () {
                    move(x, y - 1, callback);
                });
                hasMoved = true;
            } else if (_this2._data[x][y - 1] == _this2._data[x][y]) {
                var _block2 = _this2._arrBlock[x][y];
                var _position2 = _this2._posisions[x][y - 1];

                _this2._data[x][y - 1] *= 2;
                _this2._data[x][y] = 0;
                _this2._arrBlock[x][y] = null;
                _this2.moveBlock(_block2, _position2, function () {
                    _this2.combineBlock(_block2, _this2._arrBlock[x][y - 1], _this2._data[x][y - 1], function () {
                        callback && callback();
                    });
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        var count = 0;
        for (var _i2 = 0; _i2 < toMove.length; _i2++) {
            move(toMove[_i2].x, toMove[_i2].y, function () {
                count++;
                if (count == toMove.length) {
                    _this2.afterMove(hasMoved);
                }
            });
        }
    },
    blockMoveDown: function blockMoveDown() {
        var _this3 = this;

        var hasMoved = false;
        var move = function move(x, y, callback) {
            if (x == ROWS - 1 || _this3._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (_this3._data[x + 1][y] == 0) {
                var block = _this3._arrBlock[x][y];
                var position = _this3._posisions[x + 1][y];
                _this3._arrBlock[x + 1][y] = block;
                _this3._data[x + 1][y] = _this3._data[x][y];
                _this3._data[x][y] = 0;
                _this3._arrBlock[x][y] = null;
                _this3.moveBlock(block, position, function () {
                    move(x + 1, y, callback);
                });
                hasMoved = true;
            } else if (_this3._data[x + 1][y] == _this3._data[x][y]) {
                var _block3 = _this3._arrBlock[x][y];
                var _position3 = _this3._posisions[x + 1][y];

                _this3._data[x + 1][y] *= 2;
                _this3._data[x][y] = 0;
                _this3._arrBlock[x][y] = null;
                _this3.moveBlock(_block3, _position3, function () {
                    _this3.combineBlock(_block3, _this3._arrBlock[x + 1][y], _this3._data[x + 1][y], function () {
                        callback && callback();
                    });
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        };
        var toMove = [];
        for (var i = ROWS - 1; i >= 0; i--) {
            for (var j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
        var count = 0;
        for (var _i3 = 0; _i3 < toMove.length; _i3++) {
            move(toMove[_i3].x, toMove[_i3].y, function () {
                count++;
                if (count == toMove.length) {
                    _this3.afterMove(hasMoved);
                }
            });
        }
    },
    blockMoveUp: function blockMoveUp() {
        var _this4 = this;

        var hasMoved = false;
        var move = function move(x, y, callback) {
            if (x == 0 || _this4._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (_this4._data[x - 1][y] == 0) {
                var block = _this4._arrBlock[x][y];
                var position = _this4._posisions[x - 1][y];
                _this4._arrBlock[x - 1][y] = block;
                _this4._data[x - 1][y] = _this4._data[x][y];
                _this4._data[x][y] = 0;
                _this4._arrBlock[x][y] = null;
                _this4.moveBlock(block, position, function () {
                    move(x - 1, y, callback);
                });
                hasMoved = true;
            } else if (_this4._data[x - 1][y] == _this4._data[x][y]) {
                var _block4 = _this4._arrBlock[x][y];
                var _position4 = _this4._posisions[x - 1][y];

                _this4._data[x - 1][y] *= 2;
                _this4._data[x][y] = 0;
                _this4._arrBlock[x][y] = null;
                _this4.moveBlock(_block4, _position4, function () {
                    _this4.combineBlock(_block4, _this4._arrBlock[x - 1][y], _this4._data[x - 1][y], function () {
                        callback && callback();
                    });
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        };
        var toMove = [];
        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
        var count = 0;
        for (var _i4 = 0; _i4 < toMove.length; _i4++) {
            move(toMove[_i4].x, toMove[_i4].y, function () {
                count++;
                if (count == toMove.length) {
                    _this4.afterMove(hasMoved);
                }
            });
        }
    },
    gameOver: function gameOver() {
        cc.tween(this.node).to(.5, { opacity: 150 }).start();
        this.loseLayOut.active = true;
    },
    gameWin: function gameWin() {
        this._canMove = false;
        cc.tween(this.node).to(.5, { opacity: 150 }).start();
        this.winLayOut.active = true;
    },
    onRestartClick: function onRestartClick() {
        this._canMove = true;
        this.blockInit();
        this.init();
        this.node.opacity = 255;
        this.loseLayOut.active = false;
        this.winLayOut.active = false;
    },
    onContinueClick: function onContinueClick() {
        this._canMove = true;
        this.node.opacity = 255;
        this.winLayOut.active = false;
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
        