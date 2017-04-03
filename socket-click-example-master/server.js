// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

//keep track of how times clients have clicked the button
var clickCount = 0;
var movePlayer;
var players=[10];
var id=1;



var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id;
	// Getters and setters
	var getX = function() {
		return x;
	};
	var getY = function() {
		return y;
	};
	var setX = function(newX) {
		x = newX;
	};
	var setY = function(newY) {
		y = newY;
	};
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		id: id
	}
};

// called when new player arrives from connection
function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;
    //io.emit("onNewPlayer", {id: newPlayer.id, x: data.x, y: data.y});
    console.log("new Player " + data.id);
    // Send existing players to the new player
	var i, existingPlayer;
    
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
        console.log("players x " + newPlayer.getX());
		io.emit("onNewPlayer", {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};



function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};


app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {  
    // create player here
    //onNewPlayer(id,150,150);
    id++;
//    client.on("newPlayer", onNewPlayer);
//    client.on("allPlayers", onNewPlayer);
    
    
    client.on('new player', function(cord){
        console.log('message: ' + cord.x + "  " + cord.y);
        cord.id = id;
        id++;
        onNewPlayer(cord);
        //io.emit('new player', {id: cord.id, x: cord.x, y: cord.y});
        console.log(cord.x);
  });
    
    
    
    
	//when the server receives clicked message, do this
    client.on('playerUpdate', function(data) {
          movePlayer = playerById(this.id);
          var x = data.x;
          var y = data.y;
    	  movePlayer.x;
          movePlayer.y;
          console.log("moving other players");
          io.emit("playerUpdate", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
		  //send a message to ALL connected clients
		  //io.emit('buttonUpdate', clickCount);
    });
    
    
    client.on('moved', function(cord){
        //console.log('message: ' + cord.x + "  " + cord.y);
        movePlayer = playerById(this.id);
        var x = cord.x;
        var y = cord.y;  
        movePlayer.x;
        movePlayer.y;
    //    movePlayer.setX(cord.x);
    //    movePlayer.setY(cord.y);
        io.emit('moving player', {id: cord.id, x: cord.x, y: cord.y});
  });
    
    
    
    
});

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
}); 