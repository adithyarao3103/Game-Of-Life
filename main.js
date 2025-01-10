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

function renderBoard() {
    clearTimeout(t);
    const board = document.getElementById("board");
    let tiles = '';
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const color = grid[i][j] === white ? "black" : "white";
            tiles += `<div id="t_${i}_${j}" class="tile" style="background-color:${color}" onclick="toggle(${i}, ${j})"></div>`;
        }
    }
    board.innerHTML = tiles;
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
	renderBoard();
}

function start() {
    var sum = 0;
    gen = gen + 1;
    document.getElementById("generation").innerHTML = "Generation: " + gen;

    let temp = [];
    for (i = 0; i < n; i++) {
        temp.push([]);
        for (j = 0; j < n; j++) {
            temp[i].push(0);
        }
    }

    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            sum = 0;
            for (x = -1; x <= 1; x++) {
                for (y = -1; y <= 1; y++) {
                    let ni = (i + x + n) % n; 
                    let nj = (j + y + n) % n; 
                    sum += grid[ni][nj];
                }
            }

            sum -= grid[i][j]; 

            if (grid[i][j] == 0) {
                if (sum == 3) {
                    temp[i][j] = 1; 
                }
            } else {
                if (sum < 2 || sum > 3) {
                    temp[i][j] = 0; 
                } else {
                    temp[i][j] = 1; 
                }
            }
        }
    }

    grid = temp;
    renderBoard();

    t = setTimeout(function () { start(); }, 200);
}


function stop(){
	clearTimeout(t)

}



initialize();


function savePattern() {
    const pattern = {
        size: n,
        grid: grid
    };
    const blob = new Blob([JSON.stringify(pattern)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pattern.gol";
    a.click();
    URL.revokeObjectURL(a.href);
}


function loadPattern(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const content = JSON.parse(e.target.result);

            // Validate the JSON structure
            if (!content.size || !Array.isArray(content.grid)) {
                throw new Error("Invalid file format");
            }

            n = content.size;
            grid = content.grid;

            // Update board dimensions and render the saved pattern
            document.documentElement.style.setProperty('--x', n);
			document.getElementById("number").value = n;
			document.getElementById("generation").innerHTML = 'Generation: 0';
			gen=0;
            renderBoard();
        } catch (error) {
            alert("Invalid file format! " + error.message);
        }
    };
    reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener("change", loadPattern);
    }
});

document.getElementById("customFileButton").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});

async function loadPatternFromServer(filename) {
    try {
        // Fetch the file content from the server
        const response = await fetch(`${filename}`);
        if (!response.ok) {
            throw new Error('Failed to load the pattern file.');
        }

        const content = await response.json();

        // Validate the file content
        if (!content.size || !Array.isArray(content.grid)) {
            throw new Error('Invalid pattern file format.');
        }

        // Update the grid and board
        n = content.size;
        grid = content.grid;

        // Update board dimensions and render the pattern
        document.documentElement.style.setProperty('--x', n);
		document.getElementById("number").value = n;
		document.getElementById("generation").innerHTML = 'Generation: 0';
		gen=0;
		renderBoard();
    } catch (error) {
        alert(`Error loading pattern: ${error.message}`);
    }
}

