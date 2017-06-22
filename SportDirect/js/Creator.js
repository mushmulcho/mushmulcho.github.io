(function (Player){
	
	var Creator = (function(){
		var transportationCharges = 34;//EUR 70 BGN
		var moneyTakenFromCard = 589.93;// EUR 1156.26 BGN

		function Creator(){
			init();
		}
		Creator.money = function(){

			return {
				all:moneyTakenFromCard,
				noTransport:moneyTakenFromCard - (transportationCharges * EUR)
			}
		}
		Creator.changeCurrency = function(){

		};
		Creator.transport = function(){
			return transportationCharges;
		};
		//private
		function init(){
			if(powerMode)
				appendCharacterCreator();
			appendSum();
		}
		function appendCharacterCreator(){
			$("#content")
			.append("<h2>Creating New Character</h2>"+
				"<input placeholder='Character Name' id='characterName'></input>"+
				"<input placeholder='Gold' id='gold'></input>")
			.append("<button class='btn btn-success' id='newPlayer'>New Character</button>")
			.append("<br><input placeholder='Delete Character' id='deletePlayer'>"+
				"</input><button class='btn btn-danger' id='delete'>Delete Character</button>");
		}
		function appendSum(){
			$("#content")
			.append("<br><div class='text'>Доставка:</div><input value='"+transportationCharges+" &euro;' disabled></input>")
			.append("<br><div class='text'>Общо:</div><input id='end' value='"+moneyTakenFromCard * EUR+" BGN'  disabled></input>")
		}
		return Creator;
	})();

	Player.Creator = Creator;
})(Player || (Player = {}));