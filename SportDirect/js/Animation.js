var Animation = Animation || {};
(function(animation){

	var renderer;
	var stage;
	var resources =["present-box.png"];
	var resourcesPath = "res/";
	var oldPosY = 0;
	var oldPosX = 0;

	animation.init = function(){
		renderer = PIXI.autoDetectRenderer(window.innerWidth, 1024,{roundPixels: true});
		renderer.backgroundColor = 0x808080;
		stage = new PIXI.Container();

		$('.view').append(renderer.view);
       
       loadResources();
       addMouseMoveEventToBody();
       animate();
	};

	animation.stage = function(){
		if(stage)
			return stage;
	};

	function addMouseMoveEventToBody(){
		$('body').on('mousemove',moveAllObjects)
	}
	function present(){
		var texture = PIXI.Texture.fromImage(resourcesPath + resources[0] )
        for (var i = 0; i < 10; i++) {
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

		resources.forEach(function(name,index){
			loader.add(name, resourcesPath+name);	
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

	animation.init();

})(Animation);
