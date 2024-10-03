var money = 0;
var scavs = 0;

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

window.setInterval(function(){
    moneyClick(scavs);
}, 1000);