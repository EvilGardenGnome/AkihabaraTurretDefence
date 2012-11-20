static List<object> turrets; //can be used to pass all the turrets created
static var turret_id = 1; //this variable would get incremented by one everytime the addTurret would be called
var price // this would be the price of the turret or the upgrade price
var turretSprite //hold the id of the turret tiles

//code to copy 
if (upgrade){
	turretSprite = 'turret_tiles';
}
else{
	turretSprite = 'upgrade_turret_tiles';
}
//code added to function loadResources() 
//add image of turret 
gbox.addImage('turret_sprite', 'friendly_tower_1.png');
//configure turret image
//set size of turret sprite 
gbox.addTiles({
    id:      'turret_tiles', // set a unique ID for sprite
    image:   'turret_sprite', // set what sprite will be used
    tileh:   20,	// height of turret image in pixels 
    tilew:   20,	// width of turret image in pixel
    tilerow: 1,		// the number of sprites per row
    gapx:    0,		// padding (white space) in x-coordinate between each cell
    gapy:    0		// padding (white space) in y-coordinate between each cell
  });

  
 //code added to function loadResources() 
//add image of turret 
gbox.addImage('upgrade_turret_sprite', 'friendly_tower_2.png');
//configure turret image
//set size of turret sprite 
gbox.addTiles({
    id:      'upgrade_turret_tiles', // set a unique ID for sprite
    image:   'upgrade_turret_sprite', // set what sprite will be used
    tileh:   20,	// height of turret image in pixels 
    tilew:   20,	// width of turret image in pixel
    tilerow: 1,		// the number of sprites per row
    gapx:    0,		// padding (white space) in x-coordinate between each cell
    gapy:    0		// padding (white space) in y-coordinate between each cell
  });
  

function addTurret(turret_id, xx, yy, price, turretSprite) {

  // gbox.addObject creates a new object in your game, with variables and functions. 
  gbox.addObject({
    // id refers to the specific object, group is the group it's in for rendering purposes, tileset is where the graphics come from
    id: 'turret_id'+turret_id,
	group: 'turret',			//group turretat
	tileset: turretSprite,	//graphics
	
	//set the collision height of sprite to equal sprite
	colh:gbox.getTiles('turret_tiles').tileh,
 
	
	
    // the initialize function contains code turretat is run when the object is first created. In the case of the player object turretis only happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
	  // initialize as a topview object.
      toys.topview.initialize(this, {});
      //set healht to 100%
	  this.power = 100;
	  // Set the starting position of the object to the x/y coordinates turretat we passed in.
	  this.x = xx;
	  this.y = yy;
	  
	  this.price = price;
	  
	  turrets.Add(this);
	  
    },
 
    // the first function is like a step function. it runs every frame and does calculations. it's called first because it happens before the rendering, so we calculate new positions and actions and theN render the object
    first: function() {
      //
	  turretTarget(this);
	  
    },
 
    // the blit function is what happens during the game's draw cycle. everyturreting related to rendering and drawing goes here
     blit: function() {
      gbox.blitTile(gbox.getBufferContext(), {
        tileset: this.tileset,
        tile:    this.frame,
        dx:      this.x,
        dy:      this.y,
        fliph:   this.fliph,
        flipv:   this.flipv,
        camera:  this.camera,
        alpha:   1.0
      });
    },
  });
}

targetFodder(fodders, turrets){

	//var fodderPosition=help.getTileInMap(fodder.x+fodder.hw,fodder.y+fodder.hh,map,0);
	//var turretPosition=help.getTileInMap(turret.x+(turret.hw + 16),turret.y+(turret.hh + 16),map,0); //just test that it 16 pixels from the center of turret

	//if(gbox.collides(fodderPosition,turretPosition,0))
	//{
	//	addShell(data);
	//}
	var shotDelay = gamecycle.gameIsHold();
	var minRangeToFire //minimum distance fodder is from turret for shell to be fired
	
	for(int i = 0; i < turrets.length; i++)
		for(int x = 0;x < fodders.length; x++)
		var targetDistance = trigo.getDistance(fodders[x], turrets[i]){
			if(targetDistance <= minRangeToFire){
				shotDelay
				
				addShell(shell_id, fodders[x]);
				shell_id++;
			}
		}
}

//can use to set delay
gamecycle.gameIsHold:function() { // Use this clause to check collision and kill player: if true the level is changing

		//if (fast fire turret){
			return (this.state==400)||(this.state==401);
			}
			else {
				return (this.state==600)||(this.state==601);
			}
		},
	
}
