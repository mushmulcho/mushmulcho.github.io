var Main = Main || {};
(function(Main){
	var Animation = (function(){
		// Static
		Animation.resources = ["present-box.png"];
		Animation.resourcesPath = "https://mushmulcho.github.io/SportDirect/res/";

		// Private
		var renderer;
		var stage;
		var oldPosY = 0;
		var oldPosX = 0;

		function Animation () {
			init();
		}
		init = function(){
			renderer = PIXI.autoDetectRenderer(window.innerWidth, 1024,{roundPixels: true,transparent: true});
			stage = new PIXI.Container();

			$('body').append(renderer.view);
	       console.log("INIT")
	       loadResources();
	       addMouseMoveEventToBody();
	       animate();
		};

		Animation.stage = function(){
			if(stage)
				return stage;
		};

		function addMouseMoveEventToBody(){
			$('body').on('mousemove',moveAllObjects)
		}
		function present(){
	        for (var i = 0; i < 10; i++) {
	        	var randomImageName = Animation.resources[Math.floor(Math.random() + (Animation.resources.length - 1))]
	        	var texture = PIXI.Texture.fromImage(Animation.resourcesPath + randomImageName)
	            var gift = new PIXI.Sprite(texture);

	            gift.x = Math.floor(Math.random() *((window.innerWidth/10) )+((window.innerWidth/10)*i))
	            gift.y = Math.floor(Math.random() * 900 ) + 50
				gift.anchor = {x:0.5,y:0.5}
	            gift.rotation = Math.random() * (Math.PI * 2)
				gift.scale = {x:0.5,y:0.5};
	            stage.addChild(gift);
	        }

		}
		function moveAllObjects(event){
			var y = event.clientY
			var x = event.clientX
			var newPosY = 0
			var newPosX = 0
			var rotation = 0
			var children = stage.children
			var len = children.length

			if(oldPosY > y){
	            newPosY = -0.5
			}else if(oldPosY <y){
	            newPosY = 0.5
			}

			if(oldPosX > x){
				rotation = -0.01
				newPosX = -0.2
			}else if(oldPosX < x ){
	            rotation = 0.01
	            newPosX = 0.2
			}
			oldPosX = x
			oldPosY = y
			for(var i = 0; i < len; i++){
				children[i].y += newPosY
				children[i].x += newPosX
				children[i].rotation += rotation
			}
		}
		function loadResources(){

			var loader = PIXI.loader;

			Animation.resources.forEach(function(name,index){
				loader.add(name, Animation.resourcesPath + name);	
			});
			loader.once('complete',function onComplete(e,resources){

				present();
			});
			loader.load();
		}

	 	function animate() {
	        renderer.render(stage);
	        requestAnimationFrame(function () {
	            animate();
	        });
	    }

	    return Animation;
	})()
	

	Main.Animation = Animation;
})(Main);
