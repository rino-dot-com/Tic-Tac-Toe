var player, mode, diff, start, sym, turns, board;
var spots = document.getElementsByClassName("click");
var cngrts = document.getElementById("winner");
var compPlay = 1;
var choices = ["top-left","top-middle","top-right","middle-left","middle-middle","middle-right","bottom-left","bottom-middle","bottom-right"];

var x;
for (x=0; x < 9; x++) {
	spots[x].onclick = function() {cngrts.innerHTML = "You Have To Click The Play Button First";};
}

function play() {
    document.getElementById("playButton").innerHTML = "Reset"
	board = [0,0,0,0,0,0,0,0,0];
	if (document.getElementById("single").checked) {
		mode = "single";
	} else if (document.getElementById("multi").checked) {
		mode = "multi";
	}
	if (document.getElementById("easy").checked) {
		diff = "easy";
	} else if (document.getElementById("hard").checked) {
		diff = "hard";
	}
	if (document.getElementById("playr").checked) {
		start = "playr";
	} else if (document.getElementById("comp").checked) {
		start = "comp";
	}
	if (document.getElementById("crosses").checked) {
		sym = "crosses";
	} else if (document.getElementById("naughts").checked) {
		sym = "naughts";
	}
	
	if (mode == "single" && start == "playr" && sym == "naughts" || mode == "single" && start == "comp" && sym == "crosses") {
		player = "naught.png";
	} else {
		player = "cross.png";
	}
	
	for (x=0; x < 9; x++) {
		spots[x].onclick = function() {click(this);check();};
		spots[x].innerHTML = "";
	}
	
	cngrts.innerHTML = "";
	
	turns = 9;
	compPlay = 1;
	if (mode == "single" && start == "comp") {
		compMove();
	}
}

function click(e) {
	e.innerHTML = "<img src='" + player + "'>";
	e.onclick = "";
	if (player == "cross.png") {
		player = "naught.png";
	} else if (player == "naught.png") {
		player = "cross.png";
	}
	//check();
}

function findWinner(playBoard) {
	var p;
	for (p=0; p < 3; p++) {
		if (playBoard[p*3] + playBoard[p*3 + 1] + playBoard[p*3 + 2] == 3) {
			return "Cross";
		} else if (playBoard[p*3] + playBoard[p*3 + 1] + playBoard[p*3 + 2] == -3) {
			return "Circle";
		}
	}
	
	var q;
	for (q=0; q < 3; q++) {
		if (playBoard[q] + playBoard[q + 3] + playBoard[q + 6] == 3) {
			return "Cross";
		} else if (playBoard[q] + playBoard[q + 3] + playBoard[q + 6] == -3) {
			return "Circle";
		}
	}
	
	if (playBoard[0] + playBoard[4] + playBoard[8] == 3) {
		return "Cross";
	} else if (playBoard[0] + playBoard[4] + playBoard[8] == -3) {
		return "Circle";
	}
	
	if (playBoard[2] + playBoard[4] + playBoard[6] == 3) {
		return "Cross";
	} else if (playBoard[2] + playBoard[4] + playBoard[6] == -3) {
		return "Circle";
	}
	
	return "";
}

function check() {
	var n;
	for (n=0; n < 9; n++) {
		if (spots[n].innerHTML == "<img src=\"cross.png\">") {
			board[n] = 1;
		} else if (spots[n].innerHTML == "<img src=\"naught.png\">") {
			board[n] = -1;
		}
	}
	
	var end = findWinner(board);
	
	if (end != "") {
		win(end);
		return;
	}
	
	turns--;
	if (turns == 0) {
		cngrts.innerHTML = "It's a Draw! :o";
        document.getElementById("playButton").innerHTML = "New Game";
		return;
	}
	
	if (mode == "single" && compPlay) {
		compMove();
	} else if (mode == "single") {
		compPlay = 1;
	}
}

function findScore(testBoard, place, depth) {
	var empty = [];
	var scores = [];
	var funcBoard = testBoard.slice();
	//console.log(funcBoard,depth,place);
	// var v = findWinner(funcBoard);
	// if ((sym == "crosses" && w == "Circle") || (sym == "naughts" && w == "Cross")) {
		// score += 10;
		// return score;
	// }
	
	var r;
	for (r=0; r < 9; r++) {
		if (funcBoard[r] == 0) {
			empty.push(r);
			scores.push(0);
		}
	}
	
	var w = findWinner(funcBoard);
	
	if ((sym == "crosses" && w == "Circle") || (sym == "naughts" && w == "Cross")) {
		return [10-depth,0];
	} else if ((sym == "crosses" && w == "Cross") || (sym == "naughts" && w == "Circle")) {
		return [depth-10,0];
	} else if (empty.length == 0) {
		return [0,0];
	}
	
	depth = depth + 1;
	
	var u;
	for (u=0; u < empty.length; u++) {
		var newBoard = funcBoard.slice();
		newBoard[empty[u]] = place;
		var score = findScore(newBoard, place * -1, depth);
		scores[u] = score[0];
	}
	
	var send_score = [scores[0],empty[0]];
	var k;
	if ((sym == "crosses" && place == -1) || (sym == "naughts" && place == 1)) {
		for (k=1; k < scores.length; k++) {
			if (scores[k] > send_score[0]) {
				send_score = [scores[k],empty[k]];
			}
		}
	} else if ((sym == "naughts" && place == -1) || (sym == "crosses" && place == 1)) {
		for (k=1; k < scores.length; k++) {
			if (scores[k] < send_score[0]) {
				send_score = [scores[k],empty[k]];
			}
		}
	}
	//console.log(scores + " : " + place);
	return send_score;
}

function compMove() {
	var choice;
	var pick = -1000000;
	if (diff == "easy") {
		
		pick = Math.floor(Math.random() * 9);
		choice = choices[pick];
		while (!document.getElementById(choice).onclick) {
			pick = Math.floor(Math.random() * 9);
			choice = choices[pick];
		}
		
	} else if (diff == "hard") {
		
		if (turns == 9 && start == "comp") {
			//console.log("I go first");
			pick = Math.floor(Math.random() * 20);
			if (pick > 8) {
				choice = choices[4];
			} else {
				choice = choices[pick];
			}
			
		} 
		// else if (turns == 8 && start == "playr") {
			//console.log("You go first");
			// if (!document.getElementById("middle-middle").onclick) {
				// do {
					// pick = Math.floor(Math.random() * 9);
				// } while (pick == 4);
			// } else {
				// pick = 4;
			// }
			// choice = choices[pick];
			
		// } 
		else if (turns <= 8) {
			//console.log("Now I go");
			var mark;
			if (sym == "crosses") {
				mark = -1;
			} else {
				mark = 1;
			}
			
			var emptySpots = [];
			var s;
			for (s=0; s < 9; s++) {
				if (board[s] == 0) {
					emptySpots.push(s);
				}
			}
			//console.log(mark);
			var scoresList = findScore(board, mark, -1);
			
			var index = scoresList[1];
			
			choice = choices[index];
			//console.log("final scores: " + scoresList);
			
		}
		
	}
	//console.log(choice);
	var send = document.getElementById(choice);
	compPlay = 0;
	send.click();
}

function win(winner) {    
	if (mode == "single") {
		if (winner == "Cross" && sym == "crosses" || winner == "Circle" && sym == "naughts") {
			cngrts.innerHTML = "You Win! :D";
		} else {
			cngrts.innerHTML = "You Lose :P";
		}
	} else {
		cngrts.innerHTML = winner + " Wins!";
	}
	
	for (x=0; x < 9; x++) {
		spots[x].onclick = "";
	}
    
    document.getElementById("playButton").innerHTML = "New Game";
}
