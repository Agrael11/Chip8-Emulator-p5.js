displayData = [];

function setupDisplayClean()
{
	for (let x = 0; x < 64; x++)
	{
		displayData[x] = [];
		for (let y = 0; y < 32; y++)
		{
			displayData[x][y] = 0;
		}
	}
	
	console.log("Display cleaned");
}