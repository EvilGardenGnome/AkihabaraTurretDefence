function manager(fodder, shell, turret){

	var baseHealth = 100;
	var basePostionX = 123;
	var basePositionY = 123;
	
	var wave = 10;
	
	var fodderPosition=help.getTileInMap(fodder.x+fodder.hw,fodder.y+fodder.hh,map,0); // this gets the center position of the fodder
	var shellPosition=help.getTileInMap(shell.x+shell.hw,shell.y+shell.hh,map,0); // this gets the center position of the shell
	
	if(fodderPosition == shellPosition){
		fodder.health--; // decriment fodder health
		shell.isAlive = false; // boolean that would control if shell is drawn
	}
	
	if(fodderPosition.x == basePostionX && fodderPosition.y == basePostionY){
		baseHealth--;
	}
	
	//code that will be used to trigger wave
	if(wave != 0){
		setInterval(function(){startWave()},30000);
	}
	
	startWave(){
	
	switch(wave) {
		case 1:
			//create fodder wave 10
			break;
		case 2:
			//create fodder wave 9
			break;
		case 3:
			//create fodder wave 8
			break;
		case 4:
			//create fodder wave 7
			break;
		case 5:
			//create fodder wave 6
			break;
		case 6:
			//create fodder wave 5
			break;
		case 7:
			//create fodder wave 4
			break;
		case 8:
			//create fodder wave 3
			break;
		case 9:
			//create fodder wave 2
			break;
		case 10:
			//create fodder wave 1
			break;
	}
		wave--;
	}
}

targetFodder(fodders, turrets){

	//var fodderPosition=help.getTileInMap(fodder.x+fodder.hw,fodder.y+fodder.hh,map,0);
	//var turretPosition=help.getTileInMap(turret.x+(turret.hw + 16),turret.y+(turret.hh + 16),map,0); //just test that it 16 pixels from the center of turret

	//if(gbox.collides(fodderPosition,turretPosition,0))
	//{
	//	addShell(data);
	//}
	var minRangeToFire //minimum distance fodder is from turret for shell to be fired
	
	for(int i = 0; i < turrets.length; i++)
		for(int x = 0;x < fodders.length; x++)
		var targetDistance = trigo.getDistance(fodders[x], turrets[i]){
			if(targetDistance <= minRangeToFire){
				addShell(id, fodders[x]);
			}
		}
}