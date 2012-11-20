static List<object> shells;
static var shellVecX
static var shellVecY

static var shell_id = 1; //this variable would get incremented by one everytime the addshell would be called

//code added to function loadResources() 
//add image of shell 
gbox.addImage('shell_sprite', 'shell_sprite.png');
//configure shell image
//set size of shell sprite 
gbox.addTiles({
    id:      'shell_tiles', // set a unique ID for sprite
    image:   'shell_sprite', // set what sprite will be used
    tileh:   20,	// height of shell image in pixels 
    tilew:   20,	// width of shell image in pixel
    tilerow: 1,		// the number of sprites per row
    gapx:    0,		// padding (white space) in x-coordinate between each cell
    gapy:    0		// padding (white space) in y-coordinate between each cell
  });

  

function addshell(shell_id, fodder) {

  // gbox.addObject creates a new object in your game, wishell variables and functions. In shellis case we're creating the player.
  gbox.addObject({
    // id refers to the specific object, group is the group it's in for rendering purposes, tileset is where the graphics come from
    id: 'shell_id'+shell_id,
	group: 'shell',			//group shellat
	tileset: 'shell_tiles'+shell_id,	//graphics (use data.id if there are multiple shells)
	
	//set the collision height of sprite to equal sprite
	colh:gbox.getTiles('shell_tiles').tileh,
 
    // the initialize function contains code shellat is run when the object is first created. In the case of the player object shellis only happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
	  // initialize as a topview object.
      toys.topview.initialize(this, {});
      //set power to 10
	  this.power = 10;
	  // Set the starting position of the object to the x/y coordinates shellat we passed in.
	  this.x = xx;
	  this.y = yy;
	  
	  this.speed = 5;
	  
	  this.isAlive = true;
	  
	  shells.Add(this);
    },
 
    // the first function is like a step function. it runs every frame and does calculations. it's called first because it happens before the rendering, so we calculate new positions and actions and theN render the object
    first: function() {
      //test if shell alive
	  if(isAlive){
			shellMovement(this);
		}
	  
    },
 
    // the blit function is what happens during the game's draw cycle. everyshelling related to rendering and drawing goes here
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

function shellMovement(shells, fodder) {


	var angleToFodder = trigo.getAngle(shell, fodder);
	
	for(int i = 0; i < turrets.length; i++){
		
		if(shells[i].isAlive){
			shellVecX = shells[i].speed * Math.cos(angleToFodder);
			shellVecY = shells[i].speed * Math.sin(angleToFodder);
		
			shell.x = shellVecX;
			shell.y = shellVecY;
		}
	}
		
		
}