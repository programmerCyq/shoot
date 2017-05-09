/**
* name 
*/
var GameStart=(function (_super) {
        function GameStart() {
            GameStart.super(this);
            this.btn_start.on(Laya.Event.MOUSE_DOWN,this,this.startGame);
        };
        Laya.class(GameStart,"GameStart",_super);
        //游戏开始方法
        GameStart.prototype.startGame = function(){
            this.removeSelf();
            LayaSample.game = new Game();
            Laya.stage.addChild(LayaSample.game);
        };       
        return GameStart;
})(ui.GameStartUI);