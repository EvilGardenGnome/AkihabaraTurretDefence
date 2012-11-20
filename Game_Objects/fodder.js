static List<object> fodders;

//code added to function loadResources() 
//add image of fodder 
gbox.addImage('fodder_sprite', 'fodder_sprite.png');
//configure the fodder image
//set size of fodder sprite 
gbox.addTiles({
    id:      'fodder_tiles', // set a unique ID for sprite
    image:   'fodder_sprite', // set what sprite will be used
    tileh:   24,	// the height of the image in pixels 
    tilew:   24,	// the width of the image in pixel
    tilerow: 4,		// the number of sprites per row
    gapx:    0,		// the padding (white space) in x-coordinate between each cell
    gapy:    0		// the padding (white space) in y-coordinate between each cell
  });

  

function addFodder(xx,yy,health, speed, id) {

  // gbox.addObject creates a new object in your game, wifodder variables and functions. In fodderis case we're creating the player.
  gbox.addObject({
    // id refers to the specific object, group is the group it's in for rendering purposes, tileset is where the graphics come from
    id: 'fodder_id'+id,
	group: 'fodder',			//group fodderat
	tileset: 'fodder_tiles'+id,	//graphics
	
	//set the collision height of sprite to equal sprite
	colh:gbox.getTiles('fodder_tiles').tileh,
 
    // the initialize function contains code fodderat is run when the object is first created. In the case of the player object fodderis only happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
	  // initialize as a topview object.
      toys.topview.initialize(this, {});
      //set health to 100%
	  this.healt = health;
	  // Set the starting position of the object to the x/y coordinates fodderat we passed in.
	  this.x = xx;
	  this.y = yy;
	  
	  this.staticspeed:2
	  
	  this.power = 5;
	  
	  this.nodiagonals:true, // The player cannot move in diagonal direction
	  this.noreset:true, // Do not reset moving state if any change is made, so capman keep going straight
	  
	  this.speed = speed;
	  
	  fodders.Add(this);
    },
 
    // the first function is like a step function. it runs every frame and does calculations. it's called first because it happens before the rendering, so we calculate new positions and actions and theN render the object
    first: function() {
      //test if fodder is alive
	  if(this.health != 0){
		fodderMovement(this);
	  }
	  
    },
 
    // the blit function is what happens during the game's draw cycle. everyfoddering related to rendering and drawing goes here
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

function fodderMovement(fodder) {

	fodder.touchedup
	fodder.toucheddown
	fodder.touchedleft
	fodder.touchedright
	
	//following if statements keep current direction
	if(fodder.touchedup && fodder.toucheddown && fodder.facing==toys.FACE_RIGHT)
	{
		fodder.facing==toys.FACE_RIGHT
		toys.topview.controlKeys(this,{pressright:1});
		toys.topview.applyForces(this);
	}

	if(fodder.touchedup && fodder.toucheddown && fodder.facing==toys.FACE_LEFT)
	{
		fodder.facing==toys.FACE_LEFT
		toys.topview.controlKeys(this,{pressleft:1});
		toys.topview.applyForces(this);
	}
	
	if(fodder.touchedleft && fodder.touchedright && fodder.facing==toys.FACE_DOWN)
	{
		fodder.facing==toys.FACE_DOWN
		toys.topview.controlKeys(this,{pressdown:1});
		toys.topview.applyForces(this);
	}

	if(fodder.touchedleft && fodder.touchedright && fodder.facing==toys.FACE_UP)
	{
		fodder.facing==toys.FACE_UP
		toys.topview.controlKeys(this,{pressup:1});
		toys.topview.applyForces(this);
	}
	
	//following if statements change direction
	if((fodder.touchedup || fodder.toucheddown) && fodder.facing==toys.FACE_LEFT)
	{
		fodder.facing==toys.FACE_RIGHT
		toys.topview.controlKeys(this,{pressright:1});
		toys.topview.applyForces(this);
		 
	}
	
	if((fodder.touchedup || fodder.toucheddown) && fodder.facing==toys.FACE_RIGHT)
	{
		fodder.facing==toys.FACE_LEFT
		toys.topview.controlKeys(this,{pressleft:1});
		toys.topview.applyForces(this);
	}
	
	if((fodder.touchedleft || fodder.touchedright) && fodder.facing==toys.FACE_DOWN)
	{
		fodder.facing==toys.FACE_UP
		toys.topview.controlKeys(this,{pressup:1});
		toys.topview.applyForces(this);
	}
	
	if((fodder.touchedleft || fodder.touchedright) && fodder.facing==toys.FACE_UP)
	{
		fodder.facing==toys.FACE_DOWN
		toys.topview.controlKeys(this,{pressdown:1});
		toys.topview.applyForces(this);
	}

	//tests for collision 
	toys.topview.tileCollision(fodder, map, 'map', null, { tolerance: 6, approximation: 3 });
	
	
	// First, we set collisions on all sides of "fodder" (the object we're checking) to be false.
	// We'll set these to true if it turns out we're colliding.
	// function will then set acceleration along these axes to zero.
	fodder.touchedup=false; fodder.toucheddown=false; fodder.touchedleft=false; fodder.touchedright=false;
	
	
	//get the tolerance for collision and the approximation 
	var tolerance=(data&&(data.tolerance!=null)?data.tolerance:6);
      var approximation=(data&&(data.approximation!=null)?data.approximation:10);
	 // IMPORTANT: To make this easier to understand, I'm going to assume that tolerance = 0 for
      // the rest of this function! once you understand it without tolerance, it's easy to add in
      // the concept of tolerance.  ALSO IMPORANT: We'll assume approximation = 1.

      // This "t" variable is confusing, but for our purposes it's -1.
      var t=tolerance-approximation;

      // A do-while loop that runs until t === the width of the object's collision area minus
      // tolerance minus 1. So if we have a 32x32 object we're checking, using our values this will
      // run until t is 31 (32-1=31) Basically the loop runs left to right across the sprite's
      // collision area (that's what t does, it traverses x) and then checks above and below the
      // sprite to see if we're colliding on the top or bottom at position x=t
      do {
        // On our first loop we're adding approximation right back to t, so t = tolerance, which is
        // 0 in our case. He could have just said "t = tolerance" and incremented the variable at
        // the end of this block, but whatever.
        t+=approximation;

        // If we're far enough to the right that we're outside of the area we're testing for
        // collision (in this case, when t>31) we clamp the value for t to 31. This does two things:
        // it breaks the while loop because we're done traversing, but it also makes sure that we
        // always get ONE collision test on the very far right edge of our collision area (if
        // approximation is bigger than the width of our collision area, we could skip the sprite
        // altogether -- this ensures we get at least one valid check)

        if (t>	fodder.colw-tolerance-1) t=	fodder.colw-tolerance-1;

        // When you see "fodder.x+fodder.colx" or "fodder.y+fodder.coly", that is just "the absolute x/y position of
        // the upper left corner of our collision mask". So to break it down: the first argument
        // we're passing getTileInMap is the absolute X position that we're at while we traverse the
        // collision mask from right to left. The second argument is a constant: it's just the
        // bottom of our collision mask, minus 1. So we're asking for the tile that is along our
        // current X value, but is just inside the bottom edge of our collision mask. IE: "Hey, what
        // tile am I colliding with on the bottom at at this particular X point?"


       var bottom=help.getTileInMap(fodder.x+fodder.colx+t,fodder.y+fodder.coly+fodder.colh-1,map,defaulttile,tilemap);
        // Same but for the top instead of the bottom of the collision mask
        var top=help.getTileInMap(fodder.x+fodder.colx+t,fodder.y+fodder.coly,map,defaulttile,tilemap);
        // If our top or bottom colliding tiles are solid, set the appropriate variables
        if (map.tileIsSolid(fodder,top)) fodder.touchedup=true;
        if (map.tileIsSolid(fodder,bottom)) fodder.toucheddown=true;
        // Keep on trucking until we get all the way to the right of our collision mask
      } while (t!=fodder.colw-tolerance-1);


      // This does the same thing but traverses top to bottom and checks tiles that are just inside
      // the left or right edge of our collision mask

      t=tolerance-approximation;
      do {
        t+=approximation;
        if (t>fodder.colh-tolerance-1) t=fodder.colh-tolerance-1;
        var left=help.getTileInMap(fodder.x+fodder.colx,fodder.y+fodder.coly+t,map,defaulttile,tilemap);
        var right=help.getTileInMap(fodder.x+fodder.colx+fodder.colw-1,fodder.y+fodder.coly+t,map,defaulttile,tilemap);
        if (map.tileIsSolid(fodder,left)) fodder.touchedleft=true;
        if (map.tileIsSolid(fodder,right)) fodder.touchedright=true;
      } while (t!=fodder.colh-tolerance-1);

      // Set acceleration to 0 depending on the direction we're colliding in, and clamp the object's
      // position along the axis to be just adjacent to the tile we're colliding with. (This
      // prevents us rubberbanding into walls as we collide into them, and makes it a smooth stop.)

      if (fodder.touchedup) {
        fodder.accy=0;
        fodder.y=help.yPixelToTile(map,fodder.y+fodder.coly,1)-fodder.coly;
      }
      if (fodder.toucheddown) {
        fodder.accy=0;
        fodder.y=help.yPixelToTile(map,fodder.y+fodder.coly+fodder.colh-1)-fodder.coly-fodder.colh;
      }
      if (fodder.touchedleft) {
        fodder.accx=0;
        fodder.x=help.xPixelToTile(map,fodder.x+fodder.colx,1)-fodder.colx;
      }
      if (fodder.touchedright) {
        fodder.accx=0;
        fodder.x=help.xPixelToTile(map,fodder.x+fodder.colx+fodder.colw-1)-fodder.colx-fodder.colw;
      }

    },

// A NOTE ON TOLERANCE AND APPROXIMATION: Tolerance will affect how "forgiving" your collision is.
// It affects the outer bounds of those while loops. Approximation is just how many X/Y positions we
// want to skip during our test. So an approximation of 1 is pixel-perfect collision along those
// axes. An approximation of 2 skips every other pixel. Etc.


var 

toys.topview.tileCollision(fodder, map, 'map', null, { tolerance: 6, approximation: 3 });
