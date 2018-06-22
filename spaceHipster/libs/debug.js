/**
 * Created by Alexander Kolarov on 1.5.2017 г..
 */
'use strict';
var debug = (function () {

    var game ;
    var contentDiv;
    //var config = {width:1280, height:720, type:Phaser.AUTO, parent:'',scene:{}};
    var config = {
        title:"spaceHipster", width:1280, height:720, type:Phaser.AUTO,
        //scene:[BootScene,PreloadScene,MainMenuScene,GameScene],
        physics:{default:"arcade",arcade:{debug:false}}
    };

    var initMain = function () {
        contentDiv.appendChild(game.canvas);

    };

    var initContentDiv = function () {
        contentDiv = document.createElement("div");
        contentDiv.setAttribute("id", "content");
        document.body.appendChild(contentDiv);
        contentDiv.style.cssText = "width:"+config.width+"px; height:"+config.height+"px; transform: scale(0.3); transform-origin: top left;";

    };
    var init = function () {
        game = new spaceHipster.Main(config);

    };

    var initDebugComponents = function () {
        if (!game) {
            init();
        }
        if (!contentDiv) {
            initContentDiv();
        }
        if (game) {
            initMain();
        }
    };

    return {
        "start": function () {
            initDebugComponents();
        }
    };
}());