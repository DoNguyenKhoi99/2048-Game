
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
        this.initCell();
        this.initBlock(2);
    },

    initCell() {
        let y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN;
        let x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            this._arrBlockPos[row] = [];
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                this._arrBlockPos[row][col] = {x, y, status: false}; //ADD POSITION VALUE
                this.newCell = cc.instantiate(this.cell); //CREATE PREAFAB CELL
                this.newCell.setParent(this.mainGame);
                this.newCell.setPosition(cc.v2(x, y));
                x += this.newCell.width + GAME_CONFIG.MARGIN;
            }
            y -= this.newCell.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },
    
    initBlock(value) {
        for(let i = 0; i < value; i++) {
            let arrPos = this._arrBlockPos[this.getRandomInt(0, 3)][this.getRandomInt(0, 3)];
            if(!arrPos.status) {
                this.newBlock = cc.instantiate(this.block);
                this.newBlock.setParent(this.mainGame);
                this.newBlock.setPosition(cc.v2(arrPos.x, arrPos.y));
                arrPos.status = true;
            } else {
                this.initBlock(1);
            }
        }
    },

    onKeyDown(event) {
        switch(event.keyCode) {
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

    checkRow(value) {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                if(this._arrBlockPos[row][col] == this._arrBlockPos[row][col++]) {
                    
                };
            }
        }
    },

    checkCol(value) {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                cc.error(this._arrBlockPos[col][row]);
            }
        }
    },

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, 
});
