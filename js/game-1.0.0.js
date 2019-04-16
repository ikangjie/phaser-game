/* javascript Document */
;
(function(){
	var Dom = function(args){
		return new tools(args);
	};
    /*===========================
    tools
    ===========================*/	
	function tools(args){
	   'use strict';
	    this.elements = [];
	    if (typeof args == 'string') {
	        if (args.indexOf(' ') != -1) {
	            var elements = args.split(' ');
	            var childElements = [];
	            var node = [];
	            for (var i = 0; i < elements.length; i ++) {
	                if (node.length == 0) node.push(document);
	                switch (elements[i].charAt(0)) {
	                    case '#' :
	                        childElements = [];
	                        childElements.push(this.getId(elements[i].substring(1)));
	                        node = childElements;
	                        break;
	                    case '.' : 
	                        childElements = [];
	                        for (var j = 0; j < node.length; j ++) {
	                            var temps = this.getClass(elements[i].substring(1), node[j]);
	                            for (var k = 0; k < temps.length; k ++) {
	                                childElements.push(temps[k]);
	                            }
	                        }
	                        node = childElements;
	                        break;
	                    default : 
	                        childElements = [];
	                        for (var j = 0; j < node.length; j ++) {
	                            var temps = this.getTagName(elements[i], node[j]);
	                            for (var k = 0; k < temps.length; k ++) {
	                                childElements.push(temps[k]);
	                            }
	                        }
	                        node = childElements;
	                }
	            }
	            this.elements = childElements;
	        } else {
	            switch (args.charAt(0)) {
	                case '#' :
	                    this.elements.push(this.getId(args.substring(1)));
	                    break;
	                case '.' : 
	                    this.elements = this.getClass(args.substring(1));
	                    break;
	                default : 
	                    this.elements = this.getTagName(args);
	            }
	        }
	    } else if (typeof args == 'object') {
	        if (args != undefined) {
	            this.elements[0] = args;
	        }
	    } else if (typeof args == 'function') {
	        this.ready(args);
	    }
	};
	tools.prototype.getId = function (id) {
		return document.getElementById(id);
	};
	tools.prototype.getClass = function (className,parentNode) {
		var node = null,
		    temps = [];
		parentNode != undefined ? (node = parentNode) : node = document;
		var all = node.getElementsByTagName('*');
		for (var i = 0; i < all.length; i ++) {
			if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
				temps.push(all[i]);
			}
		}
		return temps;
	};
	tools.prototype.getTag = function (tag,parentNode) {
		var node = null,
		    temps = [];
		parentNode != undefined ? (node = parentNode) : node = document;
		var tags = node.getElementsByTagName(tag);
		for (var i = 0; i < tags.length; i ++) {
			temps.push(tags[i]);
		}
		return temps;
	};
	tools.prototype.length = function () {
		return this.elements.length;
	};
	tools.prototype.attr = function (attr, value) {
		for (var i = 0; i < this.elements.length; i ++) {
			if (arguments.length == 1) {
				return this.elements[i].getAttribute(attr);
			} else if (arguments.length == 2) {
				this.elements[i].setAttribute(attr, value);
			}
		}
		return this;
	};
	tools.prototype.index = function () {
		var children = this.elements[0].parentNode.children;
		for (var i = 0; i < children.length; i ++) {
			if (this.elements[0] == children[i]) return i;
		}
	};
	tools.prototype.eq = function (num) {
		var element = this.elements[num];
		this.elements = [];
		this.elements[0] = element;
		return this;
	};
	tools.prototype.find = function (str) {
		var childElements = [];
		for (var i = 0; i < this.elements.length; i ++) {
			switch (str.charAt(0)) {
				case '#' :
					childElements.push(this.getId(str.substring(1)));
					break;
				case '.' : 
					var temps = this.getClass(str.substring(1), this.elements[i]);
					for (var j = 0; j < temps.length; j ++) {
						childElements.push(temps[j]);
					}
					break;
				default : 
					var temps = this.getTag(str, this.elements[i]);
					for (var j = 0; j < temps.length; j ++) {
						childElements.push(temps[j]);
					}
			}
		}
		this.elements = childElements;
		return this;
	}	
	tools.prototype.css = function (attr, value) {
		for (var i = 0; i < this.elements.length; i ++) {
			if (arguments.length == 1) {
				return getStyle(this.elements[i], attr);
			}
			this.elements[i].style[attr] = value;
		}
		return this;
	};
	tools.prototype.addClass = function (className) {
		for (var i = 0; i < this.elements.length; i ++) {
			if (!hasClass(this.elements[i], className)) {
				this.elements[i].className += ' ' + className;
			}
		}
		return this;
	}
	tools.prototype.removeClass = function (className) {
		for (var i = 0; i < this.elements.length; i ++) {
			if (hasClass(this.elements[i], className)) {
				this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' +className +'(\\s|$)'), ' ');
			}
		}
		return this;
	}	
	tools.prototype.addCss = function(css){
		var style = document.createElement('style'),
		    head = document.head || document.getElementsByTagName('head')[0];
		style.type = 'text/css';
		/**ie*/
		if(style.styleSheet){
	        var func = function(){
	            try{
	                style.styleSheet.cssText = cssText;
	            }catch(e){}
	        }
	        if(style.styleSheet.disabled){
	        	setTimeout(func,10);
	        }else{
	        	func();
	        }
		}else{
			var textNode = document.createTextNode(cssText);
			style.appendChild(textNode);
		}
		head.appendChild(style);
	};
	tools.prototype.bind = function (event, fn) {
		for (var i = 0; i < this.elements.length; i ++) {
			addEvent(this.elements[i], event, fn);
		}
		return this;
	};
	tools.prototype.html = function (str) {
		for (var i = 0; i < this.elements.length; i ++) {
			if (arguments.length == 0) {
				return this.elements[i].innerHTML;
			}
			this.elements[i].innerHTML = str;
		}
		return this;
	};
	tools.prototype.remove = function () {
		for (var i = 0; i < this.elements.length; i ++) {
			var _parentElement = this.elements[i].parentNode;
			if(_parentElement){_parentElement.removeChild(this.elements[i]);}
		}
		return this;
	}		
	tools.prototype.show = function () {
		for (var i = 0; i < this.elements.length; i ++) {
			this.elements[i].style.display = 'block';
		}
		return this;
	};
	tools.prototype.hide = function () {
		for (var i = 0; i < this.elements.length; i ++) {
			this.elements[i].style.display = 'none';
		}
		return this;
	};
	tools.prototype.animate = function (obj) {
		for (var i = 0; i < this.elements.length; i ++) {
			var element = this.elements[i];
			var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : 
						   obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' : 
						   obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';

			
			var start = obj['start'] != undefined ? obj['start'] : 
							attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 : 
													   parseInt(getStyle(element, attr));
			var t = obj['t'] != undefined ? obj['t'] : 10;
			var step = obj['step'] != undefined ? obj['step'] : 20;
			var alter = obj['alter'];
			var target = obj['target'];
			var mul = obj['mul'];
			
			var speed = obj['speed'] != undefined ? obj['speed'] : 6;
			var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';
			
			
			if (alter != undefined && target == undefined) {
				target = alter + start;
			} else if (alter == undefined && target == undefined && mul == undefined) {
				throw new Error('alter增量或target目标量必须传一个！');
			}
			
			if (start > target) step = -step;
			
			if (attr == 'opacity') {
				element.style.opacity = parseInt(start) / 100;
				element.style.filter = 'alpha(opacity=' + parseInt(start) +')';
			}
			
			if (mul == undefined) {
				mul = {};
				mul[attr] = target;
			} 
			
			clearInterval(element.timer);
			element.timer = setInterval(function () {
			
				//创建一个布尔值，这个值可以了解多个动画是否全部执行完毕
				var flag = true; //表示都执行完毕了
				
				for (var i in mul) {
					attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' : i != undefined ? i : 'left';
					target = mul[i];
						
					if (type == 'buffer') {
						step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed :
															 (target - parseInt(getStyle(element, attr))) / speed;
						step = step > 0 ? Math.ceil(step) : Math.floor(step);
					}
				
					if (attr == 'opacity') {
						if (step == 0) {
							setOpacity();
						} else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
							setOpacity();
						} else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
							setOpacity();
						} else {
							var temp = parseFloat(getStyle(element, attr)) * 100;
							element.style.opacity = parseInt(temp + step) / 100;
							element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
						}
						
						if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;

					} else {
						if (step == 0) {
							setTarget();
						} else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
							setTarget();
						} else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
							setTarget();
						} else {
							element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
						}
						
						if (parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
					}
				}
				if (flag) {
					clearInterval(element.timer);
					if (obj.fn != undefined) obj.fn();
				}
			}, t);
			
			function setTarget() {
				element.style[attr] = target + 'px';
			}
			function setOpacity() {
				element.style.opacity = parseInt(target) / 100;
				element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
			}
		}
		return this;
	};

	tools.prototype.hash5 = function(params){
		var t = this,
		defaults = {
			hasNode : [
              'canvas',
              'touch',
              'css3'
			],
			callBack : new Function()
		};
		params = params || {}; 
	    for (var prop in defaults) {
	        if (prop in params && typeof params[prop] === 'object') {
	            for (var subProp in defaults[prop]) {
	                if (! (subProp in params[prop])) {
	                    params[prop][subProp] = defaults[prop][subProp];
	                }
	            }
	        }
	        else if (! (prop in params)) {
	            params[prop] = defaults[prop];
	        }
	    }
	    t.params = params;
	    for(var i = 0;i<defaults.hasNode.length;i++){
	    	 if(inArray(defaults.hasNode,t.params.hasNode[i]) === true){
	    	 	continue;
	    	 }else{
	    	 	t.params.hasNode.splice(i,1);//delete element
	    	 }
	    }
        for(i in t.params.hasNode){
        	if(t.params.hasNode[i] == ""){t.params.hasNode.splice(i,i+1);}	
        }

	    var returnBoolean = {
	    	canvas : (function(){
		    		if(inArray(t.params.hasNode,t.params.hasNode[0]) === true){
		    			var ele = document.createElement('canvas');
		    			return !!(ele.getContext && ele.getContext('2d'));
		    		}	    		
	    	})(),
	    	touch : (function(){
	    		return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
	    	})(),
	    	css3 : (function(){
			    var div = document.createElement('div'),
			        vendors = 'ms o moz webkit'.split(' '),
			        len = vendors.length;
					return function(prop){
					      if (prop in div.style ) return true;
					      prop = prop.replace(/^[a-z]/, function(val) {
					         return val.toUpperCase();
					      });
					      while(len--) {
					         if ( vendors[len] + prop in div.style ) {
					            return true;
					         }
					      }
					      return false;
					   };
	    	})()
	    };

	    function inArray(arr,val){
			var testStr = ','+arr.join(",")+",";
			return testStr.indexOf(","+val+",")!=-1;	    	
	    }
	    return t.params.callBack(returnBoolean);
	}

    tools.prototype.ajax = function(obj){
	    var xhr = createXHR();
		obj.url = obj.url + "?rand="+Math.random();
		obj.data = params(obj.data);
	 if(obj.method === "get"){obj.url = obj.url.indexOf("?") == -1 ? obj.url +" ?"+obj.data : obj.url + "&" + obj.data;}
	 if(obj.async === true){
     xhr.onreadystatechange = function(){if(xhr.readyState == 4){callback();}}}
     xhr.open(obj.method,obj.url,obj.async);
     if(obj.method === "post"){
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    xhr.send(obj.data);
	 }else{xhr.send(null);}
	 if(obj.async === false){callback();}
		  function callback(){
			  if(xhr.status == 200){
				 obj.success(xhr.responseText);
				 }else{
					alert("Error code:"+xhr.status+" Error message:"+xhr.statusText);
				 }					  
		}		   	
		function createXHR(){
		  if(typeof XMLHttpRequest != "underfined"){
		     return new XMLHttpRequest();
		  }else if(typeof ActiveXObject != "undefined"){
		     var version = [
							"MSXML2.XMLHttp.6.0",
							"MSXML2.XMLHttp.3.0",
							"MSXML2.XMLHttp"
			   ];
			   for(var i = 0;i<version.length;i++){
			   try{
			       return new ActiveXObject(version[i]);
			   }catch(e){}		        
			   }
		  }else{
			  throw new Error("Your browser does not support XHR");
		  }
		}
		function  params(data){
		    var arr = [];
			for(var i in data){
			arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
			}
			return arr.join("&");
		}
    }

    tools.prototype.objcount = function(obj){
    	var t = typeof obj;
    	if(t == 'string'){
    		return obj.length;
    	}else if(t == 'object'){
    		var ind = 0;
    		for(var i in obj){
    			ind++;
    		}
    		return ind;
    	}
    	return false;
    };

    tools.prototype.verticalAlign = function(landscape,portrait){
		var supportOrientation = (typeof window.orientation == "number" && typeof window.onorientationchange == "object"),
		    updateOrientation = function(){
		    	if(supportOrientation){
		    		updateOrientation = function(){
		    			var orientation = window.orientation;
                        switch(orientation){  
                            case 90:  
                            case -90:  
                                landscape(); 
                                break;  
                            default:  
                                portrait();
                        }			    			
		    		};
		    	}else{updateOrientation = function(){var orientation = (window.innerWidth > window.innerHeight) ? landscape() : portrait();};}
                updateOrientation();
		    };
            var init = function(){
                updateOrientation();  
                if(supportOrientation){window.addEventListener("orientationchange",updateOrientation,false);  
                }else{window.setInterval(updateOrientation,10);}
            };
            return init();
    };

    tools.prototype.modal = function(text){

    };

    /*===========================
    loading path
    ===========================*/	
	define(function(require,exports,module){
		require("./common/game.min.js");
		require("./common/json.js");
		Dom().hash5({
			callBack : function(obj){
				var arr = obj;
			    /*===========================
			    canvas ?
			    ===========================*/				
				if(arr.canvas != true){location.href = 'error.html';return false;}
				Dom().ajax({
					method:"get",
					url:"./dists/game.dists.json",
					data : {},
					success : function(data){
						var decode = loading.decode(data),
						    json = JSON.parse(data),//game data
                            path = ['images/','sounds/','fonts/'],
                            parentID = 'container',
                            gameWidth = 930,
                            gameHeight = 530,
                            playerLife = 20,//玩家生命
                            gameDists = Dom().objcount(json),//游戏总关卡
                            nowDists = 0,//默认开始关卡
                            jump = 0,//跳跃
                            directionLeft = null,
                            directionRight = null,
                            directionUp = null,
                            hasStarted = false, //游戏是否已开始
                            hasMusic = 0,//背景音乐
						    game = new Phaser.Game(gameWidth,gameHeight,Phaser.AUTO,'container'),
						    gameLoading = {
						    	image : {
						    		wall : path[0]+'pic_48x48.png',//墙体
						    		bawn : path[0]+'pic_48x48.png',//围墙
						    		exit : path[0]+'icon_exit.png',//出口
						    		key : path[0]+'icon_key.png',//钥匙
						    		enemyUp : path[0]+'pic_40x80.png',//敌人
						    		background : path[0]+'bg_back.png',//背景图
						    		cloud : path[0]+'bg_cloud.png'//云朵
						    	},
						    	spritesheet : {
						    		iconMenu : [path[0]+'menu.png',45,35],//菜单按钮
						    		btnMusic : [path[0]+'btn_music.png',80,80],//音乐按钮
						    		btnAlert : [path[0]+'btn_alert.png',80,80],//说明按钮
						    		btnHome : [path[0]+'btn_home.png',80,80],//主页按钮
						    		btnNews : [path[0]+'btn_news.png',80,80],//新闻按钮
						    		btnPlay : [path[0]+'btn_play.png',120,120],//开始按钮
						    		confirm : [path[0]+'confirm.png',104,58],//确定按钮
						    		btns : [path[0]+'icon_btn.png',95,95],//上按钮
						    		close : [path[0]+'close.png',32,32],//关闭
						    		modal : [path[0]+'modal.png',640,400],//模态窗
						    		player : [path[0]+'player.png',40,50],//玩家
						    		enemyDown : [path[0]+'pic_40x80.png',40,40],//敌人
						    		enemyLeft : [path[0]+'pic_40x80.png',40,40],//敌人
						    		lift : [path[0]+'pic_60x10.png',60,20],//升降机
						    		attack : [path[0]+'pic_48x48.png',48,48],
						    		enemyLong : [path[0]+'pic_95x530.png',95,530]//敌人
						    	},
						    	audio : {
						    		bgMusic : path[1]+'bg_music.mp3',//背景音乐
						    		flap : path[1]+'flap.wav',//跳跃音效,
						    		score : path[1]+'score.wav',//分数音效
						    		begin : path[1]+'begin.mp3',//开始音效
						    		die : path[1]+'die.mp3'//死亡音效
						    	},
						    	bitmapFont : {
						    		gameFont : [path[2]+'flappyfont.png',path[2]+'flappyfont.fnt']
						    	}
						    };

						    game.States = {};

						game.States.boot = function(){
							this.preload = function(){	
							if(!game.device.desktop){//移动设备适应
								//移动终端消除定位效果
								Dom('#'+parentID).css('position','relative').css('left',0).css('top',0).css('margin',0);
								Dom().verticalAlign(function(){
								    /*===========================
								    生成操作按键
								    ===========================*/
								    createHand();
								},function(){
									Dom('#'+parentID).find('div').remove();
									if(Dom('#'+parentID).find('div').length() < 1){
										var createEle = document.createElement('div');
										createEle.id = 'obj-screen';
										createEle.style.width = '100%';
										createEle.style.height = '100%';
										createEle.style.position = 'fixed';
										createEle.style.top = '0px';
										createEle.style.left = '0px';
										createEle.style.background = '#fff url(images/icon_alert.png) no-repeat center';
										document.getElementById(parentID).appendChild(createEle);										
									}
								});									
								this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
								this.scale.forcePortrait = true;
								this.scale.refresh();
							}								
								game.load.image('loading','images/preloader.gif');
							};
							this.create = function(){
								game.state.start('preload');
							};
						};

					    /*===========================
					    preload
					    ===========================*/						
						game.States.preload = function(){
							this.preload = function(){
			                var preloadSprite = game.add.sprite((gameWidth - 220) / 2,game.height / 2,'loading');
		                        game.load.setPreloadSprite(preloadSprite);							
								//loading img
								for(var i in gameLoading.image){game.load.image(''+i+'', gameLoading.image[i]);}
								//loading spritesheet
							    for(var i in gameLoading.spritesheet){
							        game.load.spritesheet(''+i+'', gameLoading.spritesheet[i][0], gameLoading.spritesheet[i][1], gameLoading.spritesheet[i][2]);
							    }
							    //loading audio
							    for(var i in gameLoading.audio){game.load.audio(''+i+'', gameLoading.audio[i]);}
							    //loading font
							    for(var i in gameLoading.bitmapFont){
							    	game.load.bitmapFont(''+i+'', gameLoading.bitmapFont[i][0], gameLoading.bitmapFont[i][1]);
							    }
							};
							this.create = function(){game.state.start('menu');}
						};

					    /*===========================
					    menu
					    ===========================*/ 						
						game.States.menu = function(){
							this.create = function(){
								var t = this,
								    bg = bg = game.add.tileSprite(0,0,game.width,game.height,'background'),
								    musicFlag = 0;//音乐开关
								t.bgMusic = game.add.sound('bgMusic',1,true);
								//开始音效
								t.begin = game.add.sound('begin',1,false);
							    /*===========================
							    play music
							    ===========================*/
						        if (hasMusic == 0) {t.bgMusic.play();}
						        var musicBtn = game.add.button((game.width - 90), 10, 'btnMusic', function(){
						        	musicFlag++;
						        	musicFlag == 1 ? (t.bgMusic.stop(),musicBtn.setFrames(1, 1, 1, 1)) : musicFlag >= 2 ? (t.bgMusic.play(),musicFlag = 0,musicBtn.setFrames(0, 0, 0, 0)) : null;
						        }, this, 1, 0, 2);

							    /*===========================
							    play game btn
							    ===========================*/
							    t.playGame = game.add.button(480 , 280, 'btnPlay', function(){
							    	hasStarted = true;hasMusic++;game.state.start('play');t.begin.play();
							    }, this, 1, 0, 2);
							    t.playGame.anchor.setTo(0.5, 0.5);

							    /*===========================
							    return home
							    ===========================*/
							    var returnHome = game.add.button((game.width - 90), 115, 'btnHome', function(){
							    	location.href = location.href;
							    }, this, 1, 0, 2);

							    /*===========================
							    check news
							    ===========================*/
							    var checkNews = game.add.button((game.width - 90), 335, 'btnNews', function(){

							    }, this, 1, 0, 2);

							    /*===========================
							    open alert
							    ===========================*/
							    var popup,tween,text;
							    popup = game.add.sprite(game.world.centerX, game.world.centerY, 'modal');
							    popup.anchor.set(0.5);
							    var pw = (popup.width / 2) - 30,
							        ph = (popup.height / 2) - 8,
							        closeButton = game.make.sprite(pw - 20, -(ph - 10), 'close'),
							        style = { font: "24px Arial", fill: "#000", wordWrap: true, wordWrapWidth: popup.width, align: "left",fontWeight : 'bolder'};
								    closeButton.inputEnabled = true;
								    closeButton.input.priorityID = 1;
								    //click close
								    closeButton.events.onInputDown.add(closeWindow, this);
								popup.addChild(closeButton);							        
							    popup.scale.set(0);
							    //create text
							    text = game.add.text(0, 0, "游戏简介：\n这是一次奇妙的冒险，每一次的冒险都充满着危险。\n在游戏中，玩家的任务就是躲避这些危险，成功到达\n目的地。游戏一共分为10个关卡，每个关卡都有不同\n的布局。随着游戏的深入，难度也会随着增加。你能\n冲到最后吗？", style);
				                text.anchor.set(0.5);text.scale.set(0);
							    text.x = Math.floor(popup.x + popup.width / 2);
							    text.y = Math.floor(popup.y + popup.height / 2);
							    //click open				                			    
							    var openAlertText = game.add.button((game.width - 90), 440, 'btnAlert',openWindow, this, 1, 0, 2);
								function openWindow() {
								    if ((tween && tween.isRunning) || popup.scale.x === 1){return;}
								    tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
								    text.scale.set(1);
								}
								function closeWindow() {
								    if (tween.isRunning || popup.scale.x === 0){return;}
								    tween = game.add.tween(popup.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In, true);
								    text.scale.set(0);
								}														        
							};
						    /*===========================
						    开始音效
						    ===========================*/							
							this.update = function(){this.playGame.angle += 1;};							
						};

					    /*===========================
					    play
					    ===========================*/
                        game.States.play = function(){
                        	this.create = function(){
                        		if(hasStarted === false){return false;}
                        		var t = this,
                        		    distsData = new Array();
                        		t.hasSuccess = false;//通关条件
                        		t.hasScored = false; //重置为未得分
                        		if(!game.device.desktop){createHand();}//移动设备生成手柄按键
                        		for(var i in json){distsData.push(json[i]);}
								t.bg = game.add.tileSprite(0,0,game.width,game.height,'background');
								game.add.tileSprite(0,0,game.width,game.height,'cloud').autoScroll(-10,0);
								//启动游戏物理系统
								game.physics.startSystem(Phaser.Physics.ARCADE);
								//将物理系统添加到所有对象中
								game.world.enableBody = true;
						        //箭头方向
						        t.cursor = game.input.keyboard.createCursorKeys();	
						        //创建玩家
						        t.player = game.add.sprite(70, 100, 'player');
						        //重力下降
						        t.player.body.gravity.y = 1800;
						        //创建组
						        t.createGroup = [t.walls,t.bawns,t.enemyUps,t.enemyDowns,t.exits,t.keys,t.lifts,t.enemyGroups,t.attacks];
						        for(var i = 0;i<t.createGroup.length;i++){t.createGroup[i] = game.add.group();}
								//跳跃音效
								t.soundFlap = game.add.sound('flap');
								//钥匙音效
								t.soundScore = game.add.sound('score');
								//死亡音效
								t.die = game.add.sound('die');								
								//关卡显示
								t.scoreText = game.add.bitmapText(game.world.centerX - 20, 5, 'gameFont', ''+(nowDists+1)+':'+distsData.length+'', 36);
                                //玩家生命值
								t.playText = game.add.bitmapText(5, 5, 'gameFont', playerLife < 10 ? '0'+ playerLife : playerLife, 36);
						        //根据json数据创建地图
						        for(var i = 0; i < distsData[nowDists].length; i++){
						        	for (var j = 0; j < distsData[nowDists][i].length; j++) {
						        		if (distsData[nowDists][i][j] == '-') {
						        			var wall = game.add.sprite(50+40*j, 50+40*i, 'wall');
						        			t.createGroup[0].add(wall);
						        			wall.body.immovable = true;
						        		}else if(distsData[nowDists][i][j] == 'x'){
								            var bawn = game.add.sprite(50+40*j, 50+40*i, 'bawn');
								            t.createGroup[1].add(bawn);
								            bawn.body.immovable = true; 				        			
						        		}else if (distsData[nowDists][i][j] == '^') {
								            var enemyUp = game.add.sprite(50+40*j, 50+40*i, 'enemyUp');
								            t.createGroup[2].add(enemyUp);						        			
						        		}else if(distsData[nowDists][i][j] == '!'){
								            var enemyDown = game.add.sprite(50+40*j, 50+40*i, 'enemyDown',1);
								            t.createGroup[3].add(enemyDown);
								            t.createGroup[3].y = -45;
						        		}else if(distsData[nowDists][i][j] == 'm'){
								            var exit = game.add.sprite(50+40*j, 50+40*i, 'exit');
								            t.createGroup[4].add(exit);						        			
						        		}else if(distsData[nowDists][i][j] == 'o'){
								            var key = game.add.sprite(50+40*j, 50+40*i, 'key');
								            t.createGroup[5].add(key);						        			
						        		}else if(distsData[nowDists][i][j] == '='){
								            var lift = game.add.sprite(50+40*j, 50+40*i, 'lift');
								            t.createGroup[6].add(lift);
								            lift.body.immovable = true;						        			
						        		}else if(distsData[nowDists][i][j] == '|'){
								            var enemyGroup = game.add.sprite(50+40*j, 50+40*i, 'enemyLong');
								            t.createGroup[7].add(enemyGroup);
						        		}else if(distsData[nowDists][i][j] == '#'){
								            var attack = game.add.sprite(50+40*j, 50+40*i, 'attack');
								            t.createGroup[8].add(attack);						        			
						        		}
						        	}
						        };
							    /*===========================
							    btnMenu
							    ===========================*/
							    t.modal({
							    	element : 'iconMenu',
							    	x : game.width - 50,
							    	y : 5,
							    	text : '警告！返回菜单会清空当前游戏的进度',
							    	style : {
							    		font: "32px Arial", 
							    		fill: "#000", 
							    		wordWrap: true, 
							    		wordWrapWidth: 640,
							    		align: "left",
							    		fontWeight : 'bolder'
							    	},
							    	fn : function(){
							    		hasStarted = false;Dom('#'+parentID).find('div').remove();
							    		playerLife = 20;nowDists = 0;game.state.start('menu');
							    	}
							    });
							    /*===========================
							    调整墙X，Y轴位置
							    ===========================*/
								t.createGroup[0].x = -50;t.createGroup[0].y = -50;//wall
								t.createGroup[1].x = -50;t.createGroup[1].y = -50;//bawn
                                t.createGroup[2].x = -46;t.createGroup[2].y = -50;//enemyUp
								t.createGroup[4].x = -50;t.createGroup[4].y = -50;//exit
                                t.createGroup[5].x = -50;t.createGroup[5].y = -50;//exit

							    /*===========================
							    调整关卡障碍
							    ===========================*/                                
							    if(nowDists == 3){
							        var dataArr = new Array();
									t.createGroup[6].forEach(function(i){dataArr.push(i);});
									game.add.tween(dataArr[0]).to({ y:game.height - 48 },2500,null,true,0,Number.MAX_VALUE,true);
									setTimeout(function(){game.add.tween(dataArr[1]).to({ y:game.height - 48 },2500,null,true,0,Number.MAX_VALUE,true);},30);
									setTimeout(function(){game.add.tween(dataArr[2]).to({ y:game.height - 48 },3000,null,true,0,Number.MAX_VALUE,true);},60);
									setTimeout(function(){game.add.tween(dataArr[3]).to({ y:game.height - 48 },3500,null,true,0,Number.MAX_VALUE,true);},90);
								}else if(nowDists == 4){
							        var dataArr = new Array();
									t.createGroup[6].forEach(function(i){dataArr.push(i);});	        
							        game.add.tween(dataArr[0]).to({ y:game.height - 48 },2500,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[1]).to({ y:game.height - 48 },3000,null,true,0,Number.MAX_VALUE,true);									
								}else if(nowDists == 5){
							        var dataArr = new Array();
									t.createGroup[6].forEach(function(i){dataArr.push(i);});	        
							        game.add.tween(dataArr[1]).to({ x:game.width - 96 },5000,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[0]).to({ y:game.height - 48 },2500,null,true,0,Number.MAX_VALUE,true);									
								}else if(nowDists == 6){
								    var dataArr = new Array();
									t.createGroup[7].forEach(function(i){dataArr.push(i);});
									dataArr[0].y = -(530 / 2);
									dataArr[1].y = (530 / 2);
									game.add.tween(t.createGroup[6]).to({ y:(game.height - 200) },2500,null,true,0,Number.MAX_VALUE,true);
									game.add.tween(dataArr[0]).to({ y : -(265 + (265 / 2)) },1000,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[1]).to({ y : (265 + (265 / 2)) },1000,null,true,0,Number.MAX_VALUE,true);									
								}else if(nowDists == 7){
							        var dataArr = new Array();
									t.createGroup[6].forEach(function(i){dataArr.push(i);});	
							        game.add.tween(dataArr[1]).to({ x : 48 },4500,null,true,0,Number.MAX_VALUE,true);
							        setTimeout(function(){
							         	game.add.tween(dataArr[0]).to({ x:game.width - 103 },5000,null,true,0,Number.MAX_VALUE,true);
							        },1000);									
								}else if(nowDists == 8){
							        var dataArr = new Array();
									t.createGroup[8].forEach(function(i){dataArr.push(i);});
									t.createGroup[8].x = -48;
							        t.createGroup[8].y = -48;							
							        game.add.tween(dataArr[0]).to({ x : game.width - 48 },2500,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[1]).to({ x : 48 },2500,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[2]).to({ x : game.width - 48 },2500,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[3]).to({ x : 48 },2500,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[4]).to({ x : game.width - 48 },2500,null,true,0,Number.MAX_VALUE,true);
							        game.add.tween(dataArr[5]).to({ x : 48 },2500,null,true,0,Number.MAX_VALUE,true);									
								}else if(nowDists == 9){
								    var dataArr = new Array();								    
									t.createGroup[7].forEach(function(i){dataArr.push(i);});
									dataArr[0].y = -(530 / 2);
									dataArr[1].y = (650 / 2);									
									game.add.tween(dataArr[0]).to({ y : -50 },1500,null,true,0,Number.MAX_VALUE,true);
									game.add.tween(dataArr[1]).to({ y : 50 },1500,null,true,0,Number.MAX_VALUE,true);									
								}
							    /*===========================
							    检测连跳
							    ===========================*/
							    document.onkeydown = function(event){
							    	if(hasStarted === false){return false;}
							    	var e = event || window.event || arguments.callee.caller.arguments[0];
									if(e && e.keyCode == 38){jump++;t.flap();}else if(e.keyCode == 40 || e.keyCode == 39 || e.keyCode == 37){jump++;}							    	
							    };	
                        	};
                        	this.update	= function(){
                        		if(hasStarted === false){return false;}
                        		var t = this,
                        		    _hitGround = [t.createGroup[0],t.createGroup[6]],
                        		    _enemyGround = [t.createGroup[2],t.createGroup[3],t.createGroup[7],t.createGroup[8]];
							    /*===========================
							    使玩家和墙壁相撞
							    ===========================*/
							    _hitGround.forEach(function(i){
							    	game.physics.arcade.collide(t.player,i,t.hitGround, null, t);
							    });
							    game.physics.arcade.collide(t.player, t.createGroup[1]);
								// 所谓的“takecoin功能当玩家将一枚硬币
								game.physics.arcade.overlap(t.player, t.createGroup[5], t.checkScore, null, t);	
						        // 玩家通关条件满足时，调用通关函数
								game.physics.arcade.overlap(t.player, t.createGroup[4], t.success, null, t);															    
							    /*===========================
							    方向键开始移动
							    ===========================*/
								if (t.cursor.left.isDown){t.player.body.velocity.x = -200;}else if (t.cursor.right.isDown){t.player.body.velocity.x = 200;}else{t.player.body.velocity.x = 0;}
								if (t.cursor.up.isDown && jump <= 2){t.player.body.velocity.y = -400;}

								t.createGroup[5].forEachExists(t.success,t); //分数检测和更新

							    /*===========================
							    玩家接触敌人时,调用“重启”功能
							    ===========================*/				        
							    _enemyGround.forEach(function(i){
							    	game.physics.arcade.overlap(t.player, i, t.restart, null, t);
							    });

							    /*===========================
							    处理关卡一些障碍
							    ===========================*/
							    if(nowDists == 5){t.dropStep(10);}else if(nowDists == 6){t.dropStep(600);}else if(nowDists == 7){t.dropStep(1000);}else if(nowDists == 9){t.dropStep(4000);}else{t.dropStep(5000);}
                        	};
						    /*===========================
						    设置掉落步数
						    ===========================*/                        	
                        	this.dropStep = function(val){
                        		var t = this;
								t.createGroup[3].forEach(function(i){if(t.player.x >= (i.x - 40)){i.body.gravity.y = val;}});	                        		
                        	};
                        	//碰地后可以再次连跳
							this.hitGround = function(){jump = 0;};
						    /*===========================
						    跳跃音效
						    ===========================*/	
							this.flap = function(){this.soundFlap.play();};
						    /*===========================
						    钥匙音效
						    ===========================*/	
							this.score = function(){this.soundScore.play();};	
						    /*===========================
						    死亡音效
						    ===========================*/	
							this.dieMusic = function(){this.die.play();};															
						    /*===========================
						    检测分数
						    ===========================*/													
							this.checkScore = function(player, key){
								key.kill();this.hasSuccess = true;this.score();
							};
							this.success = function(){
								if(this.hasSuccess === true){
								   this.scoreText.text = ++nowDists;
								   game.state.start('play');
								}
							};
							this.restart = function(){
								if(!this.hasScored){
									this.hasScored = true;
                                    playerLife <= 1 ? (nowDists = 0,playerLife = 20,
								    this.modal({
								    	x : game.width - 50,
								    	y : 5,
								    	text : 'GAME OVER',
								    	style : {
								    		font: "32px Arial", 
								    		fill: "#000", 
								    		wordWrap: true, 
								    		wordWrapWidth: 640,
								    		align: "left",
								    		fontWeight : 'bolder'
								    	},
								    	fn : function(){
								    	   this.dieMusic();game.state.start('play');
								    	}
								    })
                                    ) : (playerLife-=1,this.dieMusic(),game.state.start('play'));
								    
								}
								return false;
							};
							this.render = function(){
								if(hasStarted === false){return false;}
								var t = this;
								if(directionLeft === 'left'){
									t.player.body.velocity.x = -200;
								}else if(directionRight === 'right'){t.player.body.velocity.x = 200;}
								if(directionUp === 'up' && jump <= 2){t.player.body.velocity.y = -400;}
							};
						    /*===========================
						    弹窗
						    *
						    ===========================*/
						    this.modal = function(opt){
							    var popup,tween,text,t = this;
							    t.element = opt.element || null;
							    t.x = opt.x || 0;
							    t.y = opt.y || 0;
							    t.text = opt.text || null;
							    t.style = opt.style || null;
							    t.fn = opt.fn || new Function();
							    t.type = opt.type || 'define';
							    t.state = opt.state || null;
							    popup = game.add.sprite(game.world.centerX, game.world.centerY, 'modal');
							    popup.anchor.set(0.5);
							    var pw = (popup.width / 2) - 30,
							        ph = (popup.height / 2) - 8,
							        closeButton = game.make.sprite(pw - 20, -(ph - 10), 'close'),
							        confirmButton = game.make.sprite(-38, 100, 'confirm'),
							        style = style || {};
								    closeButton.inputEnabled = true;
								    confirmButton.inputEnabled = true;
								    closeButton.input.priorityID = 1;
								    confirmButton.input.priorityID = 1;
								    //click close
								    closeButton.events.onInputDown.add(closeWindow, this);
								    //click confirm
								    confirmButton.events.onInputDown.add(t.fn, this);
									popup.addChild(closeButton);
									popup.addChild(confirmButton);							        
								    popup.scale.set(0);
							    //create text
							    text = game.add.text(0, 0, t.text, t.style);
				                text.anchor.set(0.5);text.scale.set(0);
							    text.x = Math.floor(popup.x + popup.width / 2);
							    text.y = Math.floor(popup.y + popup.height / 2);
							    if(t.element != null){
								   //click open
								   var openAlertText = game.add.button(t.x, t.y, t.element,openWindow, this, 1, 0, 2);							    	
							    }else{openWindow();closeButton.scale.set(0);}
								function openWindow() {
								    if ((tween && tween.isRunning) || popup.scale.x === 1){return;}
								    tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
								    text.scale.set(1);
								}
								function closeWindow() {
								    if (tween.isRunning || popup.scale.x === 0){return;}
								    tween = game.add.tween(popup.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In, true);
								    text.scale.set(0);
								}
						    };
                        };
						game.state.add('boot',game.States.boot);
						game.state.add('preload',game.States.preload);
						game.state.add('menu',game.States.menu);
						game.state.add('play',game.States.play);
						game.state.start('boot');

						//生成手柄按键
						function createHand(){
							var createEleId = [['prev',190],['next',285],['up',0]],
							    createEle = null;
							Dom('#'+parentID).find('div').remove();
							if(Dom('#'+parentID).find('div').length() < 1 && hasStarted != false){
								for(var i = 0;i < 3;i++){
									createEle = document.createElement('div');
									(function(i){
										createEle.id = createEleId[i][0];
										createEle.style.width = 95 + 'px';
										createEle.style.height = 95 + 'px';
										createEle.style.position = 'absolute';
										createEle.style.background = 'url('+gameLoading.spritesheet.btns[0]+') no-repeat -'+createEleId[i][1]+'px top';
										createEle.style.top = '50%';
										createEle.style.marginTop = '-47.5px';
										document.getElementById(parentID).appendChild(createEle);												
									})(i);
								}
								Dom('#'+parentID).find('div').eq(0).css('left','40px');Dom('#'+parentID).find('div').eq(1).css('left','145px');Dom('#'+parentID).find('div').eq(2).css('right','40px');
							    /*===========================
							    btnPrev
							    ===========================*/							    
					    		Dom('#prev').bind('touchstart',function(event){
					    		  event.preventDefault();
					    		  if (event.targetTouches.length == 1){directionLeft = 'left';}
					    		  Dom(this).css('background','url(images/icon_btn.png) no-repeat -570px top');
					    		}).bind('touchend',function(){directionLeft = null;Dom(this).css('background','url(images/icon_btn.png) no-repeat -190px top');});
							    /*===========================
							    btnNext
							    ===========================*/							    
					    		Dom('#next').bind('touchstart',function(event){
					    	      event.preventDefault();
					    		  if (event.targetTouches.length == 1){directionRight = 'right';}
					    		  Dom(this).css('background','url(images/icon_btn.png) no-repeat -665px top');
					    		}).bind('touchend',function(){directionRight = null;Dom(this).css('background','url(images/icon_btn.png) no-repeat -285px top');});
							    /*===========================
							    btnUp
							    ===========================*/
					    		Dom('#up').bind('touchstart',function(event){
					    		  event.preventDefault();
					    		  if (event.targetTouches.length == 1){directionUp = 'up';}
					    		  Dom(this).css('background','url(images/icon_btn.png) no-repeat -380px top');
					    		}).bind('touchend',function(){directionUp = null;Dom(this).css('background','url(images/icon_btn.png) no-repeat left top');}); 							
							}
						}

					},
					async : true
				});
			}
		});
	});

    /*===========================
    addEvent
    ===========================*/	
	function addEvent(obj, type, fn) {
		if (typeof obj.addEventListener != 'undefined') {
			obj.addEventListener(type, fn, false);
		} else {
			if (!obj.events) obj.events = {};
			if (!obj.events[type]) {	
				obj.events[type] = [];
				if (obj['on' + type]) obj.events[type][0] = fn;
			} else {
				if (addEvent.equal(obj.events[type], fn)) return false;
			}
			obj.events[type][addEvent.ID++] = fn;
			obj['on' + type] = addEvent.exec;
		}
	}
	addEvent.ID = 1;
	addEvent.exec = function (event) {
		var e = event || addEvent.fixEvent(window.event);
		var es = this.events[e.type];
		for (var i in es) {
			es[i].call(this, e);
		}
	};
	addEvent.equal = function (es, fn) {
		for (var i in es) {
			if (es[i] == fn) return true;
		}
		return false;
	}
	addEvent.fixEvent = function (event) {
		event.preventDefault = addEvent.fixEvent.preventDefault;
		event.stopPropagation = addEvent.fixEvent.stopPropagation;
		event.target = event.srcElement;
		return event;
	};
	addEvent.fixEvent.preventDefault = function () {
		this.returnValue = false;
	};
	addEvent.fixEvent.stopPropagation = function () {
		this.cancelBubble = true;
	};

	function getStyle(element, attr) {
		var value;
		if (typeof window.getComputedStyle != 'undefined') {
			value = window.getComputedStyle(element, null)[attr];
		} else if (typeof element.currentStyle != 'undeinfed') {
			value = element.currentStyle[attr];
		}
		return value;
	}
})();

