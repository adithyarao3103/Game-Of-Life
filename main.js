var grid = [];
var t;
var n;
var gen=0;

var white = 1;
var black = 0;



function toggle(i, j){
	if(grid[i][j] == white){
		grid[i][j] = black;
		document.getElementById(`t_${i}_${j}`).style.backgroundColor = "white";
	}
	else{
		grid[i][j] = white;
		document.getElementById(`t_${i}_${j}`).style.backgroundColor = "black";
	}
}

function clearBoard(){
	clearTimeout(t);
	gen = 0;
	document.getElementById("generation").innerHTML="Generation: " + gen;
	grid = [];
	var board = document.getElementById("board")
	var tiles = '';
	for(i=0;i<n;i++){
		grid.push([]);
		for(j=0; j<n; j++){
			tiles = tiles + `<div id="t_${i}_${j}" class="tile" style="background-color:white" onclick="toggle(${i}, ${j})"></div>`;
			grid[i].push(black);
		}
	}
	board.innerHTML = tiles;
}

function initialize(){
	clearTimeout(t);
	n = parseInt(document.getElementById("number").value);
	document.documentElement.style.setProperty('--x', n);
	clearBoard();
}


function random(){
	clearTimeout(t);
	gen = 0;
	document.getElementById("generation").innerHTML="Generation: " + gen;
	grid=[];
	for(i=0;i<n;i++){
		grid.push([]);
		for (j = 0; j < n; j++) {
			grid[i].push((Math.random()>=0.5)? 1 : 0);
		}
	}
	for(i=0;i<n;i++){
		for (j = 0; j < n; j++){
			if(grid[i][j] == 1){document.getElementById(`t_${i}_${j}`).style.backgroundColor = "black"; }
			else {document.getElementById(`t_${i}_${j}`).style.backgroundColor = "white";}
		}
	}
}

function start(){
	var sum = 0;
	gen = gen+1;
	document.getElementById("generation").innerHTML="Generation: " + gen;
	temp = []
	temp.push([])
	for(i=0;i<n;i++){
		temp[0].push(0);
	}
	for(i=1;i<n-1;i++){
		temp.push([]);
		temp[i].push(0);
		for(j=1;j<n;j++){
			sum = 0;
			for(x=-1;x<=1;x++){
				for(y=-1;y<=1;y++){
					sum = sum + grid[i+x][j+y];
				}
			}

			sum = sum-grid[i][j];
			
			if(grid[i][j] == 0){
				if(sum == 3){
					temp[i].push(1);
				}
				else{
					temp[i].push(0);
				}
			}
			else{
				if(sum >3 || sum<2){
					temp[i].push(0);
				}
				else{
					temp[i].push(1);
				}
			}
		}
		temp[i].push([0])
	}
	temp.push([])
	for(j=0;j<n;j++){
		temp[n-1].push(0);
	}

	grid = [...temp];
	for(i=0;i<n;i++){
		for (j = 0; j < n; j++){
			if(grid[i][j] == 1){document.getElementById(`t_${i}_${j}`).style.backgroundColor = "black"; }
			else {document.getElementById(`t_${i}_${j}`).style.backgroundColor = "white";}
		}
	}
	t = setTimeout(function(){start();}, 200);
}

function stop(){
	clearTimeout(t)

}



initialize();



