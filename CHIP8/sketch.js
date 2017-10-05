var dz;
var pulse;
var ST = 0;

var keyCodeMap = [];
var keys = [];
var lastKey;
var waiting = 0;
var menuSize = 32;
var pixelSize = 10;

function reset()
{
	setupDisplayClean();
	setupCPU();
	background(0);
}

function setup() {
	var canvas = createCanvas(64*pixelSize, 32*pixelSize+menuSize);
	dz = select("#dropZone");
	canvas.dragOver(dragHigh);
	canvas.dragLeave(dragUnhigh);
	canvas.drop(dropped,dragUnhigh);
	pulse = new p5.Pulse();
	pulse.amp(0.5);
	pulse.freq(220);
	
	
	keyCodeMap[88] = 0;
	keyCodeMap[49] = 1;
	keyCodeMap[50] = 2;
	keyCodeMap[51] = 3;
	keyCodeMap[81] = 4;
	keyCodeMap[87] = 5;
	keyCodeMap[69] = 6;
	keyCodeMap[65] = 7;
	keyCodeMap[83] = 8;
	keyCodeMap[68] = 9;
	keyCodeMap[89] = 10;
	keyCodeMap[67] = 11;
	keyCodeMap[52] = 12;
	keyCodeMap[82] = 13;
	keyCodeMap[70] = 14;
	keyCodeMap[86] = 15;
	for (let i = 0; i < 16; i++)
	{
		keys[i] = 0;
	}
	reset();
	console.log("Initial configuration finished\n\n");
}

function keyPressed()
{
	if (keyCodeMap[keyCode] != undefined)
	{
		keys[keyCodeMap[keyCode]] = 1;
		if (waiting == 1)
		{
			waiting = 2;
			lastKey = keyCodeMap[keyCode];
		}
	}
}

function keyReleased()
{
	if (keyCodeMap[keyCode] != undefined)
	{
		keys[keyCodeMap[keyCode]] = 0;
	}
}

var DropBar = 25;

function draw() {
	if (ST > 0)
	{
		pulse.start();
		ST--;
	}
	else if (ST == 0)
	{
		pulse.stop();
		ST--;
	}
	if (running)
	{
		for (let repeat = 0; repeat < 9; repeat++)
		{
			step();
		}
		if (readTimer(0) > 0) writeTimer(0, readTimer(0)-1);
		if (readTimer(1) > 1) writeTimer(1, readTimer(1)-1);
		else if (readTimer(1) == 1) {writeTimer(1, 0); beep();}
	}
	
	fill(DropBar);
	noStroke();
	rect(5,5,154,menuSize-10);
	textAlign(LEFT,TOP);
	fill(255);
	text("DROP ROM TO START",20,8);
	textAlign(RIGHT,TOP);
	text("60",width-5,8);
	
	for (let x = 0; x < 64; x++)
	{
		for (let y = 0; y < 32; y++)
		{
			if (displayData[x][y] == 0)fill(0,255/4);
			else fill(255);
			rect(x*pixelSize,y*pixelSize+menuSize,pixelSize,pixelSize);
		}
	}
}

function dragHigh()
{
	DropBar = 50;
}
function dragUnhigh()
{
	DropBar = 25;
}
function dropped(file)
{
	reset();
	data = atob(file.data.substr(13));
	for (let i = 0; i < data.length; i++)
	{
		WriteMemory8Bit(0x200+i, data.charCodeAt(i));
	}
	running = true;
	console.log("Rom loaded\n\n");
}
