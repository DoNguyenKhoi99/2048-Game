let colors = require("Colors");

cc.Class({
    extends: cc.Component,

    properties: {
        Value :{
            default : null,
            type : cc.Label,
        },
    },


    setColor(){
        let number = parseInt(this.Value.string);
        if(number in colors){
            this.node.color = colors[number];
        }
    }
});
