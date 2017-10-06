let running = false;

var PC = 0x200;

var R = [];

function readRegister(i)
{
	return R[i];
}

function writeRegister(i, value)
{
	R[i] = value & 0xFF;
}

var I;

function writeI(value)
{
	I = value & 0xFFFF;
}
function readI()
{
	return I;
}

var Timers = [];

function readTimer(i)
{
	return Timers[i];
}
function writeTimer(i, value)
{
	Timers[i] = value & 0xFF;
}

var SP;
function readStackPointer()
{
	return SP;
}
function writeStackPointer(value)
{
	SP = value & 0xFF;
}

var Stack = [];
function readStack()
{
	SP--;
	return Stack[SP];
}
function writeStack(value)
{
	Stack[SP] = value & 0xFFFF;
	SP++;
}



function setupCPU()
{
	setupCleanMemory();
	setupOpcodeTables();
	
	PC = 0x200;
	SP = 0;
	
	for (let i = 0; i < 16; i++)
	{
		R[i] = 0;
	}
	
	I = 0;
	Timers[0] = 0;
	Timers[1] = 0;
	
	
	console.log("Done CPU setup");
}

function setupOpcodeTables()
{
	opcodes[0x0] = opcode0;
	opcodes[0x1] = opcode1nnn;
	opcodes[0x2] = opcode2nnn
	opcodes[0x3] = opcode3xkk;
	opcodes[0x4] = opcode4xkk;
	opcodes[0x5] = opcode5xy0;
	opcodes[0x6] = opcode6xkk;
	opcodes[0x7] = opcode7xkk;
	opcodes[0x8] = opcode8nnn;
	opcodes[0x9] = opcode9xy0;
	opcodes[0xA] = opcodeAnnn;
	opcodes[0xB] = opcodeBnnn;
	opcodes[0xC] = opcodeCxkk;
	opcodes[0xD] = opcodeDxyn;
	opcodes[0xE] = opcodeEnnn;
	opcodes[0xF] = opcodeFnnn;
	
	
	
	
	opcodes8[0x0] = opcode8xy0;
	opcodes8[0x1] = opcode8xy1;
	opcodes8[0x2] = opcode8xy2;
	opcodes8[0x3] = opcode8xy3;
	opcodes8[0x4] = opcode8xy4;
	opcodes8[0x5] = opcode8xy5;
	opcodes8[0x6] = opcode8xy6;
	opcodes8[0x7] = opcode8xy7;
	opcodes8[0xE] = opcode8xyE;
	
	opcodesF[0x07] = opcodeFx07;
	opcodesF[0x0A] = opcodeFx0A;
	opcodesF[0x15] = opcodeFx15;
	opcodesF[0x18] = opcodeFx18;
	opcodesF[0x1E] = opcodeFx1E;
	opcodesF[0x29] = opcodeFx29;
	opcodesF[0x33] = opcodeFx33;
	opcodesF[0x55] = opcodeFx55;
	opcodesF[0x65] = opcodeFx65;
	
	console.log("Done opcode setup");
}

function step()
{
	let opcode = ReadMemory16Bit(PC);
	let dec = (opcode & 0xF000) >> 12;
	if (opcodes[dec] != undefined)
	{
		if (debugTesting)  console.log(opcode + "--" + dec + "--" + opcodes[dec]);
		opcodes[dec](opcode);
	}
	else console.log("Instrction  0x"+ op.toString(16) + " not valid!");
	
}

function beep()
{
	ST = 30;
}






let opcodes = [];
let opcodes8 = [];
let opcodesF = []

function opcode0(op)
{
	if (op == 0x00E0)
	{
		opcode00E0(op);
	}
	else if (op == 0x00EE)
	{
		opcode00EE(op);
	}
	else
	{
		opcode0nnn(op);
	}
}

function opcode00E0(op)
{
	setupDisplayClean();
	PC+=2;
}

function opcode00EE(op)
{
	PC = readStack();
	PC += 2;
}

function opcode0nnn(op)
{
	PC = op & 0xFFF;
}

function opcode1nnn(op)
{
	PC = op & 0xFFF;
}

function opcode2nnn(op)
{
	writeStack(PC);
	PC = op & 0xFFF;	
}

function opcode3xkk(op)
{
	let kk = op & 0xFF;
	let x = (op & 0x0F00) >> 8;
	if (readRegister(x) == kk) PC += 4;
	else PC += 2;
}

function opcode4xkk(op)
{
	let kk = op & 0xFF;
	let x = (op & 0x0F00) >> 8;
	if (readRegister(x) != kk) PC += 4;
	else PC += 2;
}

function opcode5xy0(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	if (readRegister(x) == readRegister(y)) PC += 4;
	else PC += 2;
}

function opcode6xkk(op)
{
	let x = (op & 0x0F00) >> 8;
	let kk = op & 0xFF;
	writeRegister(x,kk);
	PC += 2;
}

function opcode7xkk(op)
{
	let x = (op & 0x0F00) >> 8;
	let kk = op & 0xFF;
	let origVal = readRegister(x);
	writeRegister(x, origVal+kk);
	PC += 2;
}

function opcode8xy0(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	writeRegister(x, readRegister(y));
	PC += 2;
}

function opcode8xy1(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	writeRegister(x, origX | origY);
	PC += 2;
}

function opcode8xy2(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	writeRegister(x, origX & origY);
	PC += 2;
}

function opcode8xy3(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	writeRegister(x, origX ^ origY);
	PC += 2;
}

function opcode8xy4(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	let result = origX + origY;
	if (result > 0xFF) writeRegister(15, 1);
	else writeRegister(15, 0);
	writeRegister(x, result & 0xFF);
	PC += 2;
}

function opcode8xy5(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	let result = origX - origY;
	if (origX > origY) writeRegister(15, 1);
	else writeRegister(15, 0);
	writeRegister(x, result & 0xFF);
	PC += 2;
}

function opcode8xy6(op)
{
	let x = (op & 0x0F00) >> 8;
	let origX = readRegister(x);
	if (origX & 0x01 == 1) writeRegister(15, 1);
	else writeRegister(15, 0);
	let result = origX >> 1;
	writeRegister(x, result & 0xFF);
	PC += 2;
}

function opcode8xy7(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	if (origY > origX) writeRegister(15, 1);
	else writeRegister(15, 0);
	let result = origY - origX;
	writeRegister(x, result & 0xFF);
	PC += 2;
}

function opcode8xyE(op)
{
	let x = (op & 0x0F00) >> 8;
	let origX = readRegister(x);
	if (origX & 0x80 == 0x80) writeRegister(15, 1);
	else writeRegister(15, 0);
	let result = origX << 1;
	writeRegister(x, result & 0xFF);
	PC += 2;
}

function opcode8nnn(op)
{
	let dec = op & 0x0F;
	if (opcodes8[dec] != undefined)
	{
		opcodes8[dec](op);
	}
	else console.log("Instrction  0x"+ op.toString(16) + " not valid!");
}

function opcode9xy0(op)
{
	let x = (op & 0x0F00) >> 8;
	let y = (op & 0x00F0) >> 4;
	let origX = readRegister(x);
	let origY = readRegister(y);
	if (origX != origY) PC += 4;
	else PC += 2;	
}

function opcodeAnnn(op)
{
	I = op & 0xFFF;
	PC += 2;
}

function opcodeBnnn(op)
{
	let val = readRegister(0);
	PC = (op&0x0FFF)+val;
}

function opcodeCxkk(op)
{
	let x = (op & 0x0F00) >> 8;
	let kk = op & 0x00FF;
	let rand = round(random(0,255));
	let val = rand & kk;
	writeRegister(x, val);
	PC += 2;
}

function opcodeDxyn(op)
{
	let x = readRegister((op & 0x0F00) >> 8);
	let y = readRegister((op & 0x00F0) >> 4);
	let n = op & 0X000F;
	let px = 0;
	for (let index = 0; index < n; index++)
	{
		let address = readI() + index;
		let arr = ReadMemory8Bit(address);
		for (let bit = 0; bit < 8; bit++)
		{
			let pwr = Math.pow(2,7-bit);
			let res = 0;
			if ((x+bit < 64) && (y+index<32))
			{
				let curPix = displayData[x+bit][y+index];
				if ((arr & pwr) != 0)
				{
					res = 1;
					if (curPix == 1) px |= 1;
				}
				displayData[x+bit][y+index] = curPix ^ res;
			}
		}
	}
	writeRegister(0xF, px);
	PC += 2;
}

function opcodeEx9E(op)
{
	let x = (op&0x0F00)>>8;
	if (keys[readRegister(x)] == 1) PC += 4;
	else PC += 2;
}

function opcodeExA1(op)
{
	let x = (op&0x0F00)>>8;
	if (keys[readRegister(x)] == 0) PC += 4;
	else PC += 2;
}

function opcodeEnnn(op)
{
	let dec = op & 0x00FF;
	if (dec == 0x9E) opcodeEx9E(op);
	else if (dec == 0xA1) opcodeExA1(op);
	else console.log("Instrction  0x"+ op.toString(16) + " not valid!");
}

function opcodeFx07(op)
{
	let x = (op&0x0F00)>>8;
	writeRegister(x, readTimer(0));
	PC += 2;
}

function opcodeFx0A(op)
{
	let x = (op&0x0F00)>>8;
	if (waiting == 0)	
	{
		waiting = 1;
	}
	else if (waiting == 2)
	{
		waiting = 0;
		writeRegister(x, lastKey);
		PC += 2;
	}
}

function opcodeFx15(op)
{
	let x = (op&0x0F00)>>8;
	writeTimer(0, readRegister(x));
	PC += 2;
}

function opcodeFx18(op)
{
	let x = (op&0x0F00)>>8;
	writeTimer(1, readRegister(x));
	PC += 2;
}

function opcodeFx1E(op)
{
	let x = (op&0x0F00)>>8;
	writeI(readI() + readRegister(x));
	PC += 2;
}

function opcodeFx29(op)
{
	let x = (op&0x0F00)>>8;
	I = readRegister(x)*5;
	PC += 2;
}

function opcodeFx33(op)
{
	let x = (op&0x0F00)>>8;
	let val = readRegister(x);
	WriteMemory8Bit(readI, (val-(val%100))/100)
	WriteMemory8Bit(readI+1, ((val - (val % 10)) % 100) / 10)
	WriteMemory8Bit(readI+2, val%10)
	PC += 2;
}

function opcodeFx55(op)
{
	let x = (op&0x0F00)>>8;
	for (let rId = 0; rId<=x; rId++)
	{
		WriteMemory8Bit(readI()+rId,readRegister(rId));
	}
	PC += 2;
}

function opcodeFx65(op)
{
	let x = (op&0x0F00)>>8;
	for (let rId = 0; rId<=x; rId++)
	{
		writeRegister(rId, ReadMemory8Bit(readI()+rId));
	}
	PC += 2;
}

function opcodeFnnn(op)
{
	let dec = op & 0xFF;
	if (opcodesF[dec] != undefined)
	{
		opcodesF[dec](op);
	}
	else
	{
		console.log("Instrction  0x"+ op.toString(16) + " not valid!");
	}
}