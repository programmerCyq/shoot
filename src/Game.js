/**
* name 
*/
var Game=(function (_super) {
        function Game() {
            Game.super(this);
            this.reset();
        }
        Laya.class(Game,"Game",_super);

        
        var _proto = Game.prototype;//变量本地

        //初始化
        _proto.reset = function(){
            this.util = new util();//实例化方法
            this.Ar_cock_ball = [];//待发篮球数组
            this.Ar_sent_ball = [];//已发篮球数组
            this.Ar_hoop = [];
            this.cock_area.zOrder = 2;//待发区框架层级提升
            this.CanShootTime = 0;//投篮节流阀时间
            this.CanShoot = true;//投篮节流阀
            this.addHoopTime = 101;//添加篮框节流事件
            this.on(Laya.Event.MOUSE_DOWN,this,this.StageClick);//点击屏幕事件
            Laya.timer.frameLoop(1,this,this.onLoop);//定时器
            for(var i =0;i<7;i++){//生成七个篮球
                var ball = new Ball();
                this.addChild(ball);
                ball.x=i<4?-ball.width:600;
                this.Ar_cock_ball.push(ball);
            };
            //倒计时
            this.n = 0
            //分数
            this.score_1_n = 0;
            this.score_2_n = 0;
            this.score_3_n = 0;
            this.time_ten.idnex = 3;
            this.resetBallXY();
        }

        //把篮球重置到对应位置
        _proto.resetBallXY = function(){
            for(var i = 0,len = this.Ar_cock_ball.length;i<len;i++){
                Laya.Tween.to(this.Ar_cock_ball[i],{x:91*i},600,Laya.Ease.linearInOut)
            }
        };

        //屏幕点击方法
        _proto.StageClick = function(e){
            if(!this.CanShoot)return;
            var targetX,targetY,ball;
            targetX = e.stageX;
            targetY = e.stageY; 
            this.Ar_cock_ball[3].zOrder = 11;
            var lodBall=this.Ar_cock_ball[3];
            Laya.Tween.to(this.Ar_cock_ball[3],{x:targetX-45,y:targetY-150},100,Laya.Ease.linearInOut,Laya.Handler.create(this,addAr_sentball,[lodBall]),0,true);
            this.Ar_cock_ball.splice(3,1);
            ball=new Ball();
            if(ball.x > 0 ){
                this.Ar_cock_ball.push(ball);
            }else{
                this.Ar_cock_ball.unshift(ball);
            };
            this.addChild(ball);
            this.resetBallXY();
            function addAr_sentball(lodBall){
                //状态1 自由落体   状态2 按角度上升
                lodBall.status=1;
                lodBall.t = 0;//时间
                lodBall.a = 0.3;//重力加速度
                lodBall.bin = false;
                this.Ar_sent_ball.push(lodBall);
            };
            this.CanShoot = false;
        };

        //倒计时
         _proto.conTime = function(){
            if(this.time_unit.index == 0){
                if(this.time_ten.index == 0){
                    this.gameOver();
                    return;
                };
                this.time_unit.index = 9;
                this.time_ten.index--;
                return;
            }
                this.time_unit.index--;
        };


        //游戏结束
        _proto.gameOver = function(){
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            this.GameOver = new GameOverUI()
            this.GameOver.zOrder  = 999;
            this.addChild(this.GameOver);
            this.GameOver.item4.index = this.score_3.index;
            this.GameOver.item3.index =this.score_2.index;
            this.GameOver.item2.index =this.score_1.index;
            this.GameOver.share.on(Laya.Event.MOUSE_DOWN,this,this.Share);
            this.GameOver.again.on(Laya.Event.MOUSE_DOWN,this,this.Again);
            this.GameOver.more.on(Laya.Event.MOUSE_DOWN,this,this.More);
        }

        //点击分享
        _proto.Share = function(){

        };

        //点击更多
        _proto.More =function(){

        };

        //点击再玩一次
        _proto.Again =function(){
            this.removeSelf();
            LayaSample.game = new Game();
            Laya.stage.addChild(LayaSample.game);
        }

        //定时器方法
        _proto.onLoop = function(){
            var _thisBall,_thisHoop;
            //点击节流阀
            var s = this;
            if(this.CanShootTime > 100){
                this.CanShootTime = 0;
                this.CanShoot = true;
            }
            this.CanShootTime++;
            //添加篮框节流
            if(this.addHoopTime > 100 ){
                this.addHoopTime = 0;
                var hoop;
                var index = Math.ceil(Math.random()*10);
                if(index<4){
                    hoop= new Hoop_1UI();
                    hoop.score = 1 ;
                    hoop.isComBo = true;
                }else if(index>=4 && index<6){
                    hoop = new Hoop_2UI();
                    hoop.score = 0;
                    hoop.isComBo = false;
                }else if(index>=6 && index<9){
                    hoop = new Hoop_3UI();
                    hoop.score = 4;
                    hoop.isComBo = true;
                }else{
                    hoop = new Hoop_4UI();
                    hoop.score = 2;
                    hoop.isComBo = true;
                }
                hoop.x = 600;
                hoop.y = 300;
                Laya.Tween.to(hoop,{x:-300},5000,Laya.Ease.linearInOut,Laya.Handler.create(this,removeHoop,[hoop]),0,true);
                this.addChild(hoop);
                this.Ar_hoop.push(hoop)
                function removeHoop(hoop){
                    hoop.removeSelf();
                    this.Ar_hoop.splice(0,1)
                }
            };
            this.addHoopTime++;
            
            if(this.n > 100){
                this.conTime();
                this.n = 0;
            }
            this.n++;
            for(var i = 0 ;i< this.Ar_sent_ball.length;i++){
                    if(this.Ar_sent_ball[i].status == 1){
                        this.Ar_sent_ball[i].t++;
                        this.Ar_sent_ball[i].v = this.Ar_sent_ball[i].t * this.Ar_sent_ball[i].a;//步长
                        this.Ar_sent_ball[i].y +=this.Ar_sent_ball[i].v;
                        if(this.Ar_sent_ball[i].y<112){
                            Laya.Tween.clearAll(this.Ar_sent_ball[i]);
                        }
                        if(this.Ar_sent_ball[i].y >= 750){
                            if(!this.Ar_sent_ball[i].bin){
                                this.combo_1.index = 0;
                                this.combo_2.index = 0;
                            }
                            this.Ar_sent_ball[i].removeSelf();
                            this.Ar_sent_ball.splice(i,1);
                            
                        };
                        
                    }else if(this.Ar_sent_ball[i].status == 2){
                        this.Ar_sent_ball[i].t = 0;
                        this.Ar_sent_ball[i].v -=this.Ar_sent_ball[i].a*1.8;
                        this.Ar_sent_ball[i].y -=this.Ar_sent_ball[i].v;
                        if(this.Ar_sent_ball[i].v < 0){
                            this.Ar_sent_ball[i].status = 1;
                        }
                    }else if(this.Ar_sent_ball[i].status == 3){
                        this.Ar_sent_ball[i].t++;
                        this.Ar_sent_ball[i].v = this.Ar_sent_ball[i].t * this.Ar_sent_ball[i].a;//步长
                        this.Ar_sent_ball[i].y +=this.Ar_sent_ball[i].v;
                        if(this.Ar_sent_ball[i].y >= 750){
                            this.Ar_sent_ball[i].removeSelf();
                            this.Ar_sent_ball.splice(i,1)
                        };
                    }
            };
            for(key in s.Ar_hoop){
                for(var j= 0 ;j< this.Ar_sent_ball.length;j++){
                            _thisBall= this.Ar_sent_ball[j];
                            _thisHoop=s.Ar_hoop[key];
                        if(this.Ar_sent_ball[j].getBounds().intersects(s.Ar_hoop[key].getBounds())){
                            this.score_1.index = this.score_1_n;
                            this.score_2.index = this.score_2_n;
                            this.score_3.index = this.score_3_n;
                            if(this.Ar_sent_ball[j].y>=350 && this.Ar_sent_ball[j].y<=380){
                                if(this.Ar_sent_ball[j].status == 1){
                                    if(s.Ar_hoop[key].x+10<this.Ar_sent_ball[j].x && this.Ar_sent_ball[j].x<s.Ar_hoop[key].x+70){
                                    if(this.Ar_sent_ball[j].status ==1){
                                        this.util.Ball_in(s.Ar_hoop[key],this.Ar_sent_ball[j],this);
                                    }
                                    this.Ar_sent_ball[j].status = 3;
                                }
                                //框的x+20  大于球的x
                                else if(s.Ar_hoop[key].x+20>this.Ar_sent_ball[j].x && this.Ar_sent_ball[j].x > s.Ar_hoop[key].x-40){
                                    this.Ar_sent_ball[j].status = 2;
                                }
                                //球的x 大于框的x加30  
                                else if(this.Ar_sent_ball[j].x >s.Ar_hoop[key].x+30){
                                    this.Ar_sent_ball[j].status = 2;
                                }
                                }
                            }
                        }   
                };
            }
             
        };

         //获取角度方法
        _proto.get_angle=function(e){
        //    if(e.stageY>=Laya.stage.height-100) return;
            //角度计算
            var height =  350 - e.stageX; //获取起点到终点之间的高度 
            var width =   900 - e.stageY;  //获取起点到终点之间的宽度 
            var angle = Math.atan2(height,width); //角度计算
            var _angle = angle * 180 / Math.PI; //计算con值
            return _angle;
       };
        return Game;

})(ui.GameUI);