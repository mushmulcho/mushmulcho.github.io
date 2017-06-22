(function(Player){
	var Table = (function(){
		var body;

		function Table(){		
			init();
		}
		//Static
		Table.prototype.addPlayers = function(name){
			return createPlayersTables(name);
		};
		//Private
		function init(){
			body = $("#content");
			if(powerMode){
				newPlayer();
				deletePlayer();
			}
			createPlayersTables();
		}
		function deletePlayer(){
			$("#delete").click(function(){
				var name = $("#deletePlayer").val();

				View.Storage.removePlayer(name);
				createPlayersTables();
				$("#deletePlayer").val("");
			});
		}
		function newPlayer(){
			$("#newPlayer").click(function(){
				var name = $("#characterName").val();
				var gold = $("#gold").val();

				if(name !==""){
					if(typeof parseInt(gold) !== "number")gold = 0;

					var character = {name:name,gold:gold,items:{}};

					View.Storage.addPlayer(character);
					$("#gold, #characterName").val("");
					createPlayersTables();
				}
			});
		}
		function createPlayersTables(name){
			var allSum = 0;
			var playersNames = Player.Storage.playerNames();
			var JSONfile = Player.Storage.JSONfile();

			if($(".fullHouse")) $(".fullHouse").remove();

			var fullHouse = $('<div></div>')
							.addClass('fullHouse')
							.css({"width": window.innerWidth,"padding-left": name?'25%':'4%'});

			body.after(fullHouse);

			for (var i = 0; i < playersNames.length; i++) {
				var player = JSONfile[playersNames[i]];
                var playerSumWithTransport = convertGold(updatePlayersGold(player),euro);

				if(name && player.name != name)
					continue;
				$(".fullHouse").append("<table class="+player.name+"><tr><th class='name'>"+player.name+"</th><th id='gold'>"+playerSumWithTransport+"</th></tr></table>");
				if(player.items)
					for(var key in player.items)
						$("."+player.name).append("<tr><td class='item'>"+player.items[key][0]+"</td><td>"+convertGold(player.items[key][1],euro)+"</td></tr>");
				allSum+=playerSumWithTransport;
			}
			
			$(".name").click(addItem);
			$(".item").click(removeItem);
			console.log("Sum of all players:"+allSum + " "+(euro?"EUR":"BGN"));//TODO
		}
        function updatePlayersGold(player) {

            var transport = Player.Creator.transport();
            var allSumWithoutTransport = Player.Creator.money().noTransport;
            var sumOfAllItems = 0;
            var playerDeliverySum = 0;

            for (var name in player.items) {
                sumOfAllItems += (+player.items[name][1])
            }

            playerDeliverySum = ((100 / (allSumWithoutTransport / sumOfAllItems)) * 0.01) * transport;
			console.log(player.name,playerDeliverySum+"EUR")//TODO:remove
			return playerDeliverySum + sumOfAllItems
        }
		return Table;
	})();

	Player.Table = Table;
})(Player || (Player = {}));
