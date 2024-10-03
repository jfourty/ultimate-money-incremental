var money = 0;
var scavs = 0;

function updateTitle() {
    document.title = "$" + round(money);
}

function moneyClick(number){
    money = money + number;
    document.getElementById("money").innerHTML = money;
};

function buyScav(){
    var scavsCost = Math.floor(100 * Math.pow(1.15,scavs));
    if(money >= scavsCost){
        scavs = scavs + 1;
    	money = money - scavsCost;
        document.getElementById('scavs').innerHTML = scavs;
        document.getElementById('money').innerHTML = money;
    };
    var nextCost = Math.floor(100 * Math.pow(1.15,scavs));
    document.getElementById('scavsCost').innerHTML = nextCost;
};

function round(input){
    var output = Math.round(input * 1000000)/1000000;
	return output;
}

function save(){
    var saveData = {
        money: money,
        scavs: scavs
    };
    localStorage.setItem("save", JSON.stringify(saveData));
}

function load(){
    var savegame = JSON.parse(localStorage.getItem("save"));
    if (savegame) {
        if (typeof savegame.money !== "undefined") money = savegame.money;
        if (typeof savegame.scavs !== "undefined") scavs = savegame.scavs;
        document.getElementById('money').innerHTML = round(money);
        document.getElementById('scavs').innerHTML = scavs;
    }
}

function remove(){
    localStorage.removeItem("save")
}

window.setInterval(function(){
    document.getElementById('money').innerHTML = round(money);
    moneyClick(scavs);
    updateTitle()
}, 1000);