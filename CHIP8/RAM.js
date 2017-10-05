memory = [];

function setupCleanMemory()
{
	for (let i = 0; i < 0x1000; i++)
	{
		memory[i] = 0;
	}
	setupLoadFont();
	console.log("Done Memory Cleanup");
}

function ReadMemory8Bit(address)
{
	return memory[address];
}

function WriteMemory8Bit(address, value)
{
	value = value%256;
	memory[address] = value;
}

function ReadMemory16Bit(address)
{
	return (memory[address] << 8) + memory[address+1];
}

function WriteMemory16Bit(address, value)
{
	memory[address] = (value>>8)%256;
	memory[address+1] = value%256;
}

function setupLoadFont()
{
	memory[0] = 0xf0;
	memory[1] = 0x90;
	memory[2] = 0x90;
	memory[3] = 0x90;
	memory[4] = 0xf0;
	memory[5] = 0x20;
	memory[6] = 0x60;
	memory[7] = 0x20;
	memory[8] = 0x20;
	memory[9] = 0xf0;
	memory[10] = 0xf0;
	memory[11] = 0x10;
	memory[12] = 0xf0;
	memory[13] = 0x80;
	memory[14] = 0xf0;
	memory[15] = 0xf0;
	memory[16] = 0x10;
	memory[17] = 0xf0;
	memory[18] = 0x10;
	memory[19] = 0xf0;
	memory[20] = 0x80;
	memory[21] = 0xa0;
	memory[22] = 0xf0;
	memory[23] = 0x20;
	memory[24] = 0x20;
	memory[25] = 0xf0;
	memory[26] = 0x80;
	memory[27] = 0xf0;
	memory[28] = 0x10;
	memory[29] = 0xf0;
	memory[30] = 0xf0;
	memory[31] = 0x80;
	memory[32] = 0xf0;
	memory[33] = 0x90;
	memory[34] = 0xf0;
	memory[35] = 0xf0;
	memory[36] = 0x10;
	memory[37] = 0x30;
	memory[38] = 0x10;
	memory[39] = 0x10;
	memory[40] = 0xf0;
	memory[41] = 0x90;
	memory[42] = 0xf0;
	memory[43] = 0x90;
	memory[44] = 0xf0;
	memory[45] = 0xf0;
	memory[46] = 0x90;
	memory[47] = 0xf0;
	memory[48] = 0x10;
	memory[49] = 0xf0;
	memory[50] = 0xf0;
	memory[51] = 0x90;
	memory[52] = 0xf0;
	memory[53] = 0x90;
	memory[54] = 0x90;
	memory[55] = 0xe0;
	memory[56] = 0x90;
	memory[57] = 0xe0;
	memory[58] = 0x90;
	memory[59] = 0xe0;
	memory[60] = 0x60;
	memory[61] = 0x90;
	memory[62] = 0x80;
	memory[63] = 0x90;
	memory[64] = 0x60;
	memory[65] = 0xe0;
	memory[66] = 0x90;
	memory[67] = 0x90;
	memory[68] = 0x90;
	memory[69] = 0xe0;
	memory[70] = 0xf0;
	memory[71] = 0x80;
	memory[72] = 0xe0;
	memory[73] = 0x80;
	memory[74] = 0xf0;
	memory[75] = 0xf0;
	memory[76] = 0x80;
	memory[77] = 0xe0;
	memory[78] = 0x80;
	memory[79] = 0x80;
	console.log("Done Font Loading");
}