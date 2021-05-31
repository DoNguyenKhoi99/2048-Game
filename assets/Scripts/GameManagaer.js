
const GAME_CONFIG = {
    ROW: 4,
    COL: 4,
    MARGIN: 16 //results from: (this.mainGame.width - this.block.width * GAME_CONFIG.ROW) / 5;
}
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
    },

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.initObj();
        this.score.node.string = 0;
    },

    initObj() {
        this.createCell();
        this.createBlock();
    },

    createCell() {
        let y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN;
        let x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            this._arrBlockPos[row] = [];
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                this._arrBlockPos[row][col] = {x, y}; //SEVE POSITION VALUE
                this._cell = cc.instantiate(this.cell); //CREATE PREAFAB CELL
                this._cell.setParent(this.mainGame);
                this._cell.setPosition(cc.v2(x, y));
                x += this._cell.width + GAME_CONFIG.MARGIN;
            }
            y -= this._cell.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },

    createBlock() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                let arrBlockPos = this._arrBlockPos[row][col];
                if(!arrBlockPos.status) {
                    this._block = cc.instantiate(this.block);
                    this._block.setParent(this.mainGame);
                    this._block.setPosition(arrBlockPos.x, arrBlockPos.y);
                };   
            }
        };
    },

    onKeyDown(event) {
        switch(event.keyCode) {
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

    checkRow() {
        cc.error("cc");
    },

    checkCol() {
        cc.error("cc");
    },
});
