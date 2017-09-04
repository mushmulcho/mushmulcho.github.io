var powerMode = false;
var euro = true;
var EUR = 1.96;
var Player;
var View = {};
var _JSONfile;

console.log('UnlimitedPowerMode',powerMode," EUR:",EUR);//TODO

window.onload = function() {
    $.getJSON("res/pr.json", function(json) {
        _JSONfile = json;
        View.Storage = new Player.Storage();
        View.Creator = new Player.Creator();
        View.Table =new Player.Table();
    });


};

var convertGold = function(){
	return function convertGold(sum,toEuro){
		if(toEuro)return  +(Math.abs(sum).toFixed(2));
		else return +(+sum * EUR).toFixed(2);
	};
}();

function addItem(){
	if(!powerMode)return;

	var name = this.childNodes[0].nodeValue;
	var product = "";

	for(var i = 0;i<2;i++){
		bootbox.prompt({
		  title: i===0?"Cost":"Add Item",
		  callback: function(result) {
		    if (result === null) {
		      	return;
		    } else {
		    	var players = Player.Storage.JSONfile();
		    	if(/Add/.test(this[0].innerText)){
		    		players[name].items[result] = [];
		    		product = result;
		    		$("."+name).append("<tr><td class='item'>"+result+"</td></tr>");
		    	}else{
		    		players[name].gold=+players[name].gold +(+result);
		    		$("."+name+" tbody tr:last-child").append("<td>"+result+"</td>");
		    	}
		      			      	
		      	players[name].items[product].push(result);
		      	View.Storage.setJSON(players);
		      	View.Table.addPlayers();
		    }
		  }
		});
	}	
}
function removeItem(){
	if(!powerMode)return;
	var name = this.offsetParent.className;
	var product = this.innerText;

	var JSON = Player.Storage.JSONfile();
	JSON[name].gold=+JSON[name].gold -(+JSON[name].items[product][1]);
	delete JSON[name].items[product];	
	View.Storage.setJSON(JSON);
	View.Table.addPlayers();
}
