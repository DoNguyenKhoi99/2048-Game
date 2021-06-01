"use strict";
cc._RF.push(module, 'e74a8E4HD5K97D/9d6IOq3s', 'BlockController');
// Scripts/BlockController.js

"use strict";

var colors = require("Colors");

cc.Class({
    extends: cc.Component,

    properties: {
        Value: {
            default: null,
            type: cc.Label
        }
    },

    setColor: function setColor() {
        var number = parseInt(this.Value.string);
        if (number in colors) {
            this.node.color = colors[number];
        }
    }
});

cc._RF.pop();