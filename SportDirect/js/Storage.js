(function(Player){

	var Storage = (function(){

		//var _JSONfile = {"Генчо":{"name":"Генчо","gold":70.78,"items":{"SoulCal Chino Shorts Mens":["SoulCal Chino Shorts Mens","12"],"No Fear Alpha Mens Skate Shoes  Colour: Navy/Khaki - 12(46)":["No Fear Alpha Mens Skate Shoes  Colour: Navy/Khaki - 12(46)","24"],"Lee Cooper Heavy Weight Full Zipped Reversible Hoody Mens":["Lee Cooper Heavy Weight Full Zipped Reversible Hoody Mens","11.99"],"Character T Shirt Mens Colour Darth Vader":["Character T Shirt Mens Colour Darth Vader","4.79"],"New York York Yankees Flight Shoulder Bag Colour:Brown/Orange":["New York York Yankees Flight Shoulder Bag Colour:Brown/Orange","7.2"],"Hot Tuna Aloha Board Shorts Mens - Colour: Black - XXX Large":["Hot Tuna Aloha Board Shorts Mens - Colour: Black - XXX Large","10.80"]}},"Дели":{"name":"Дели","gold":5.399999999999999,"items":{"Character Tee SS Lds63 Adventure Time 8 (XS)":["Character Tee SS Lds63 Adventure Time 8 (XS)","5.4"]}},"Калоян":{"name":"Калоян","gold":12,"items":{"Pierre C Detail Polo Sn73 Red":["Pierre C Detail Polo Sn73 Red","12"]}},"Гошо":{"name":"Гошо","gold":94.80000000000001,"items":{"Donnay 10 Pack Trainer Socks X2":["Donnay 10 Pack Trainer Socks X2","9.6"],"Donnay 3 Pack Tees White/Blue/Navy Large X2":["Donnay 3 Pack Tees White/Blue/Navy Large X2","14.4"],"Lonsdale 2 Pack Trunk Mens X2":["Lonsdale 2 Pack Trunk Mens X2","13.2"],"Nike Flex 2016 Run Sn71 Black/Blue 9 (44)":["Nike Flex 2016 Run Sn71 Black/Blue 9 (44)","57.6"]}},"Марто":{"name":"Марто","gold":14.399999999999999,"items":{"Lee C Tex X4":["Lee C Tex X4","14.4"]}},"Захари":{"name":"Захари","gold":50.4,"items":{"Lee C Tex X4":["Lee C Tex X4","14.4"],"Karrimor Tempo 4 Tr Grey/Blue/Lime":["Karrimor Tempo 4 Tr Grey/Blue/Lime","36"]}},"Аз":{"name":"Аз","gold":100.77999999999999,"items":{"Karrimor Antibes Beige":["Karrimor Antibes Beige","23.99"],"No Fear Spine Shoe Burgundy":["No Fear Spine Shoe Burgundy","23.99"],"SoulCal Chino Shorts Mens":["SoulCal Chino Shorts Mens","12"],"Disney Animal Single Boxer Mens X2":["Disney Animal Single Boxer Mens X2","9.6"],"Everlast Trnr Sock Brown ":["Everlast Trnr Sock Brown ","3"],"Donnay Trainer Dark Asst":["Donnay Trainer Dark Asst","3.6"],"Firetrap 1 Pack Formal Socks Mens":["Firetrap 1 Pack Formal Socks Mens","1.8"],"Pierre Cardin C Chino Short ":["Pierre Cardin C Chino Short ","10.8"],"Replay 5 Basic Swim Shorts Mens":["Replay 5 Basic Swim Shorts Mens","12"]}},"Пламен":{"name":"Пламен","gold":206.38,"items":{"adidas Durama Running Shoes Ladies":["adidas Durama Running Shoes Ladies","28.8"],"Lee C Tex X4":["Lee C Tex X4","14.4"],"Dunlop Canvas Black/Black":["Dunlop Canvas Black/Black","15.6"],"Karrimor Excel Lime/Blue/White":["Karrimor Excel Lime/Blue/White","41.99"],"Converse Zakim Grey/White":["Converse Zakim Grey/White","53.99"],"Under Armour Heat Gear 3 Pack Mens Quarter Socks":["Under Armour Heat Gear 3 Pack Mens Quarter Socks","9"],"Dunlop 2pk White":["Dunlop 2pk White","3.6"],"Donnay Trainer 10Pk White":["Donnay Trainer 10Pk White","3.6"],"Karrimor 2pk White/Fluo ":["Karrimor 2pk White/Fluo ","5.4"],"Puma ST Trainer Burgundy/White":["Puma ST Trainer Burgundy/White","30"]}}}
		var _playerNames = [];
		var linkToBlank = "https://drive.google.com/open?id=0B5FT30-zbj8KdnQwSG9DOE90MW8";

		function Storage(){ 
			init();
		}

		
		Storage.prototype.setJSON = function(file){
			if(file === null || typeof file !== "object") 
				return console.log("JSON error:"+ file);//TODO;
			_JSONfile = file ;
		};
		
		Storage.prototype.addPlayer = function addPlayer(player){
			if(player === null || typeof player !=="object") return console.log("Name of the new player has to be a string");//TODO
			if(_playerNames.indexOf(player.name) == -1){
				_playerNames.push(player.name);
				_JSONfile[player.name] = player;
			}
			else
				return console.log("That name already exists");//TODO
		};
		Storage.prototype.removePlayer = function removePlayer(name){
			if(name == null || typeof name !=="string") return console.log("Name of the new player has to be a string");//TODO
			if(_playerNames.indexOf(name) !== -1){
				_playerNames.splice(_playerNames.indexOf(name), 1);
				delete _JSONfile[name];
			}
			else
				return console.log("That name doesn't exists");//TODO
		};
		//Static
		Storage.playerNames = function (){
			return _playerNames.slice();
		};
		Storage.JSONfile = function(){
			return _JSONfile;
		};
		
		//Private
		function init(){
			saveJSONToLocalStorage();
			var header = $('header');
			if(powerMode){
				var a = $("<div>").attr({"download":"backup.json","class":"download"}).text("Download JSON").css("cursor","pointer").click(createJSONfileForDownload);	
				header.append(a);
			}		
			//header.append("<div class='download'><a target='_blank' href="+linkToBlank+" ><b> link to Order</b></a></div>");
			header.append("<button class='btn btn-success' id='convert'>Convert Currency</button>");
			header.append("<div class='download'><div class='dropdown'><button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'>All Players<span class='caret'></span></button><ul class='dropdown-menu'></ul> </div></div>");
			$('#convert').click(function(){
				if(euro) euro = false;
				else euro = true;

				View.Table.addPlayers();
			});

			$.each(_JSONfile,function(key,value){
				var name = $("<li value="+key+">"+key+"</li>").click(function(){
					View.Table.addPlayers(this.innerText);
				});
				$('.dropdown-menu').append(name);
			});
		
			$('.dropdown-menu').append( 
				$("<li value=null>All</li>").click(function(){
					View.Table.addPlayers(null);
				})
			);

		}
		function saveJSONToLocalStorage(){
			if(_JSONfile){
				for(var name in _JSONfile){
					if(_playerNames.indexOf(name) == -1){
						_playerNames.push(name);
					}
					localStorage.setItem(name , JSON.stringify(_JSONfile[name]));
				}
			}

		}
		
		function createJSONfileForDownload(e){
			e.preventDefault();
			var json = JSON.stringify(_JSONfile);
			var a = document.createElement("a")
				 a.setAttribute('download','backup.json')
				 a.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(json))
				 a.click()
		}

		return Storage;
	})();

	Player.Storage = Storage;
})(Player || (Player = {}));