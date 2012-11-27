var maingame; // The magic object that handles the full play cycle
var maze; // The maze array, with pills and walls
		  
		  
		gbox.blitTile = function(tox,data) {
			if (tox==null) return;
			var ts=this._tiles[data.tileset];
			var img=this.getImage(ts.image);
			this._implicitsargs(data);
			tox.save();
			tox.globalAlpha=(data.alpha?data.alpha:1);
			tox.scale((data.scalex?data.scalex:1),(data.scaley?data.scaley:1));
			tox.translate((data.fliph?ts.tilew:0), (data.flipv?ts.tileh:0)); tox.scale((data.fliph?-1:1), (data.flipv?-1:1));
			this._safedrawimage(tox,img, ts.gapx+(ts.tilew*(data.tile%ts.tilerow)),ts.gapy+(ts.tileh*Math.floor(data.tile/ts.tilerow)),(data.w==null?ts.tilew:data.w),(data.h==null?ts.tileh:data.h),data.dx*(data.fliph?-1:1)/(data.scalex?data.scalex:1),data.dy*(data.flipv?-1:1)/(data.scaley?data.scaley:1),(data.w?data.w:ts.tilew),(data.h?data.h:ts.tileh));
			tox.restore();
		};
		  
		  
		var screenwidth = 640;
		var screenheight = 480;
		  
		// First of all, let's load all the needed resources. Is done on the "onLoad" event of the window.
		gbox.onLoad(function () {
			help.akihabaraInit({ // Akihabara is initialized with title and all the default settings.
				title:"Capman", // ... Just changing the game title...
				splash:{footnotes:["Music 'Only Heroes Win at Skee Ball' by Greenleo","Contact him: greenleo.bandcamp.com"]}, // And adding some credits to Greenleo on the loading screen, which made the main theme. Great work! Trivia: is also the Akiba Hero 2nd song :)
				width: screenwidth,
				height: screenheight,
				zoom: 1.35
			});
			document.body.style.backgroundColor="#FFFFFF";

			gbox.addImage("logo","capman/logo.png"); // Images are loaded setting an alias and a file name. Can be full images, like the logo (load this ASAP, so will be shown during the loading screen)
			gbox.addImage("cels","capman/cels.png"); // or sprites sheet, like this one...
			gbox.addImage("font","capman/font.png"); // ...or font set.
			gbox.addImage("bg","cf/gametiles.png");
			gbox.addImage("base","cf/base.png");
			gbox.addImage("turret_basic","cf/turret_basic.png");
			gbox.addImage("turret_advance","cf/turret_advance.png");
			
			//added by Omesh
			gbox.addImage("chopper","cf/fodder.png");
			gbox.addImage("missile","cf/m.png");
			
			gbox.addFont({id:"small",image:"font",firstletter:" ",tileh:8,tilew:8,tilerow:255,gapx:0,gapy:0}); // Font are mapped over an image, setting the first letter, the letter size, the length of all rows of letters and a horizontal/vertical gap.
			// Sometime you can find pixel fonts with multiple colors, one per row/block. You can map multiple fonts on the same image, so create many fonts, one for each color.
			
			gbox.addTiles({id:"bonus",image:"cels",tileh:12,tilew:12,tilerow:8,gapx:0,gapy:24}); // A row from bonuses...
			gbox.addTiles({id:"maze",image:"cels",tileh:4,tilew:4,tilerow:10,gapx:0,gapy:36}); // The tilesets are taken from the sprite sheet too.
			gbox.addTiles({id:"backdrop",image:"bg",tileh:24,tilew:24,tilerow:9,gapx:0,gapy:0});
			gbox.addTiles({id:"base",image:"base",tileh:240,tilew:360,tilerow:1,gapx:0,gapy:0});
			
			gbox.addTiles({id:"tower1",image:"tower1",tileh:200,tilew:200,tilerow:4,gapx:0,gapy:0});
			gbox.addTiles({id:"turret_basic",image:"turret_basic",tileh:160,tilew:160,tilerow:8,gapx:0,gapy:0});
			gbox.addTiles({id:"turret_advance",image:"turret_advance",tileh:160,tilew:200,tilerow:8,gapx:0,gapy:0});
			gbox.addTiles({id:"fodder",image:"chopper",tileh:200,tilew:200,tilerow:4,gapx:0,gapy:0});
			gbox.addTiles({id:"shell",image:"missile",tileh:160,tilew:160,tilerow:3,gapx:0,gapy:0});
			
			//added by Omesh 
			//gbox.addTiles({id:"chopper1",image:"chopper",tileh:160,tilew:160,tilerow:4,gapx:0,gapy:0});
			
			// Now let's load some audio samples...
			var audioserver="audio/"; // You don't have to create this variable but is handy when defining a lot of audio files with the same path. You can also refer a server side script that serves the audio file, putting the file name as GET parameter. Watch out for injections! :)
			gbox.addAudio("eat",[audioserver+"eat.mp3",audioserver+"eat.ogg"],{channel:"sfx"}); // The capman's "gabogabo" sound. We're giving 2 audio file names for better browser compatibility. We're also defining that this audio sample will be played by default into the "sfx" channel.
			gbox.addAudio("eatghost",[audioserver+"laser.mp3",audioserver+"laser.ogg"],{channel:"sfx"}); // The capman's ghost-eated sound effect.
			gbox.addAudio("powerpill",[audioserver+"powerup3.mp3",audioserver+"powerup3.ogg"],{channel:"sfx"}); // The capman's powerpill sound effect.
			gbox.addAudio("die",[audioserver+"die.mp3",audioserver+"die.ogg"],{channel:"sfx"}); // The capman's death sound effect.
			gbox.addAudio("bonus",[audioserver+"coin.mp3",audioserver+"coin.ogg"],{channel:"sfx"}); // The sound played when capman eat a bonus.
			gbox.addAudio("default-menu-option",[audioserver+"select.mp3",audioserver+"select.ogg"],{channel:"sfx"}); // These are default sounds: are played maingame object during menus.
			gbox.addAudio("default-menu-confirm",[audioserver+"start.mp3",audioserver+"start.ogg"],{channel:"sfx"});
			gbox.addAudio("ingame",["cf/"+"gameplay.mp3"],{channel:"bgmusic",loop:true}); // This one is the ingame music. We're putting this into the "bgmusic" channel and will be looped: once ended will start over. Note that creating audio into the bgmusic channel makes them "lighter" for the browser, since is ready to be played only one at time.

			
			gbox.loadAll(go); // When everything is ready, the "loadAll" downloads all the needed resources and runs the "go" function when it's done loading.
			
		}, false);
		
  // This is our "go" function we've register and will be called after all the resources are ready. i.e. gfx are loaded, tilesets and fonts are available
  function go() {
	// The very first thing to do is to set which groups will be involved in the game. Groups can be used for grouped collision detection and for rendering order
	
	//Omesh added chopper1 
	gbox.setGroups(["background","shell","fodder","turret","sparks","player","hud","gamecycle"]); // Usually the background is the last thing rendered. The last thing is "gamecycle", that means games messages, like "gameover", menus etc.
	gbox.setAudioChannels({bgmusic:{volume:0.8},sfx:{volume:1.0}}); // If we're going to add audio to our game, we have to create virtual channels. Channels acts like groups but for audio: audio on the same channels can be stopped together and shares the same highest volume.

	
	maingame=gamecycle.createMaingame("gamecycle","gamecycle"); // We create a new maingame into the "gamecycle" group. Will be called "gamecycle". From now, we've to "override" some of the maingame default actions.
	
	maingame.bullettimer=0; // Maingame is a javascript object, so it can host any kind of variable, like our "bullet timer". Keeps the game still for a while, that happens when eating a ghost or when being eated ;)
	
	if (gbox.dataLoad("capman-hiscore")===null) // We will keep the highscores too. So, if there is any highscore saved...
		gbox.dataSave("capman-hiscore",100); // ... we will put a "100 points" hiscore.
	
   // This method is called every new level. That is called also for the first level, so...
  maingame.changeLevel=function(level) {
		// The first time the "changeLevel" is called, level is NULL. Our first stage is "1", so...
		if (level==null) level=1;
		// We need to store this number somewhere, since is needed to define which is the next level.
		maingame.level=level; // "maingame" is handy enough to store some game data.
		maingame.hud.setValue("stage","value","WAVE "+level); // Put on the screen the stage name (I'll explain what the "hud" is in the "initializeGame" function)

		
		// Let's prepare the maze map now. Every stage is the same level but you can generate a new level each "changeLevel" call, using the "level" argument value.
		// This is just an array with the tile id or NULL for an empty transparent space.
		maze=Database.PickLevel(4); 
		maze.tileIsSolid = function(obj,t){ // This function have to return true if the object "obj" is checking if the tile "t" is a wall, so...
				return (t!==null)&& // Is a wall if is not an empty space and...
						((t==0)&&(obj.status!="goin")); // The ghost's door (only if is not a ghost that is trying to go out or in)
		};
		gbox.createCanvas("mazecanvas",{w:maze.w,h:maze.h}); // Since finalizeMap have calculated the real height and width, we can create a canvas that fits perfectly our maze... Let's call it "mazecanvas".
		// gbox.createCanvas("hudcanvas",{w:screenwidth-maze.w,h:screenheight});
		gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"),maze); // Let's paste the maze map in the "maze" object into the just created "mazecanvas". So is now ready to be rendered.
						
		this.newLife(); // We will call the local "newLife" method, since this came displaces enemies and player every new level. Do you remember this in capman? ;)
		
		
		Manager.initialize();
  }
  
  // This event is triggered every time the player "reborn". As you've seen, is manually called in the last line of "changelevel"
  maingame.newLife=function(up) {
	// Let's clean up the level from the ghosts, sparks (visual effects like explosions - in capman are sparks the earned points messages) and left bonuses, if any.
	gbox.trashGroup("sparks");
	gbox.trashGroup("bonus");
	gbox.trashGroup("ghosts");
	gbox.purgeGarbage(); // the gbox module have a garbage collector that runs sometime. Let's call this manually, for optimization (and better reinitialization)
	maingame.bullettimer=0; // Reset the bullettimer, so the game can continue normally.
	// toys.topview.spawn(gbox.getObject("player","capman"),{x:maze.hw-6,y:maze.hh+50,accx:0,accy:0,xpushing:false,ypushing:false}); // Our "capman" object into the "player" group spawns in the middle of the maze every time it spawns.
	// Automatic.AddGhost({id:1,x:maze.hw-12,y:maze.hh-20}); // Ghost are added here
	// Automatic.AddGhost({id:2,x:maze.hw-24,y:maze.hh-17});
	// Automatic.AddGhost({id:3,x:maze.hw+4,y:maze.hh-20});
	// Automatic.AddGhost({id:4,x:maze.hw+14,y:maze.hh-17});
	if (this.bonustimer) this.bonustimer=300; // The timer is reset after spawning a new life, if the bouns is not appeared. As I said before, We well talk about this counter at the end.
	gbox.playAudio("ingame"); // Start playing the ingame music. Notes that the "maingame" object will fade in/out and stop the "bgmusic" channel when the screen will fade automatically. We just need to play the music when the screen is fading to fade the music too!
  }

	
// This method is called before starting the game, after the startup menu. Everything vital is done here, once per play.
maingame.initializeGame=function() {

	// Maingame gives an "hud" object that is rendered over everything. Really useful for indicators, like score, lives etc. The first thing we do is to populate this object.
	// maingame.hud.setWidget("label",{widget:"label",font:"small",value:"1UP",dx:480,dy:20,clear:true}); // This is a classic "1UP" static label. Unuseful but really retro!
	// maingame.hud.setWidget("score",{widget:"label",font:"small",value:0,dx:480,dy:50,clear:true}); // A score counter. This not only is a displayed value but will really keep the player's score.
	// maingame.hud.setWidget("label",{widget:"label",font:"small",value:"HI",dx:480,dy:80,clear:true}); // The "HI" label. Becouse "HI" is more retro.
	// maingame.hud.setWidget("hiscore",{widget:"label",font:"small",value:0,dx:480,dy:110,clear:true}); // The hiscore counter. This one will be just used for displaying.

	// maingame.hud.setWidget("lives",{widget:"symbols",minvalue:0,value:3-maingame.difficulty,maxshown:3,tileset:"capman",tiles:[5],dx:480,dy:140,gapx:16,gapy:0}); // The classic life indicator, with repated capman symbols. Note the "difficulty usage" ;)
	// maingame.hud.setWidget("bonus",{widget:"stack",rightalign:true,tileset:"bonus",dx:gbox.getScreenW()-5,dy:gbox.getScreenH()-34,gapx:12,gapy:0,maxshown:8,value:[]}); // The bonus queue: is the "history" of the picked up bonuses, on the lower right corner, aligned to the right. Starts with an empty array. gapx and gapy is the distance between symbols
	maingame.hud.setWidget("stage",{widget:"label",font:"small",value:"",dx:0,dw:gbox.getScreenW()-5,dy:32,halign:gbox.ALIGN_RIGHT,clear:true}); // The label with the stage name (low creativity: STAGE 1, STAGE 2 etc). Is empty for now, will be filled when a new level starts.
	
	// maingame.hud.setValue("hiscore","value",gbox.dataLoad("capman-hiscore")); // setValue is used to set parametes on hud. So, well, we're setting the "hiscore value" to the loaded data "capman-hiscore" that contains the latest hiscore.

	// An object will draw the maze on the screen
	gbox.addObject({
		id:"bg", // This is the object ID
		group:"background", // Is in the "backround" group, that is the lower group in the "setGroups" list. Will be drawn for first.
		initialize:function() { // This action is executed the first time the object is called, so...
			gbox.setCameraY(2,{w:maze.w,h:maze.h}); // We place the camera a bit down, since the full maze doesn't fit the screen.
		},
		blit:function() { // Then, the most important action: the "blit", where object are drawn on the screen.
			gbox.blitFade(gbox.getBufferContext(),{alpha:1}); // First let's clear the whole screen. Blitfade draws a filled rectangle over the given context (in this case, the screen)
			gbox.blit(gbox.getBufferContext(),gbox.getCanvas("mazecanvas"),{dx:0,dy:0,dw:gbox.getCanvas("mazecanvas").width,dh:gbox.getCanvas("mazecanvas").height,sourcecamera:true}); // Simply draw the maze on the screen.
		}
	});
	
	
	gbox.addObject(Manager);
	
	  
	 
	// Automatic.AddCapman();
 
 
 
 // Some final touch to the maingame object...
  maingame.gameIsOver=function() { // This method is called by maingame itself to check if the game is over or not. So...
	var isGameover=maingame.hud.getValue("lives","value")==0; // the game is REALLY over when lives counter reaches the zero.
	if (isGameover) // Just in time, we can do something useful, since we're here. Like... checking if we have a new *CAPMAN CHAMPION*...
		if (maingame.hud.getNumberValue("score","value")>maingame.hud.getNumberValue("hiscore","value")) // If the player's score is higher the shown hiscore...
			gbox.dataSave("capman-hiscore",maingame.hud.getNumberValue("score","value")); // ... save the player's score as new hiscore. The next time we play "capman", the new hiscore to beat will be this one.
	return isGameover; // Finally, returning if the game is ended or not.
  }
  // You can do this hiscore business in the ending animation, but for a tutorial, the "gameIsOver" is good enough. Is also unfair that there isn't an hiscore for each difficulty level. The world is bad... luckly you can this sources whenever you want, as exercise.
  
 // And now let's do something not related with ghosts, capmans, pills and mazes. Usually random things and hidden countings happens during the gameplay, so...
 maingame.gameEvents=function() { // This method happens every frame of the gameplay. You can keep here game timers or make happen random things, like...
	Manager.Update();
  }
  
 // Another generator, but this one is simplier: this spawns a bonus in the middle of the maze.
 maingame.addBonus=function(data) { // Let's start with something that spawn a ghost. Objects as arguments are not only flexible, but you can give a name to the parameters or skipping them when calling.
	// All the bonuses have the same code, with a "bonusid" variable that changes its look and score. Notice that the bonus object don't use any toys, except for spawning sparks.
	// This is an example of an object implemented using nothing but the gbox object for his life cycle.
	gbox.addObject({
		id:null, // Bouns doesn't need to be referred, so we can give to him a "null" id. A random ID is given when created
		group:"bonus", // Bonuses are in their group...
		tileset:"bonus", // Using their tilesets...
		time:250, // ...and remains on the screen for a little while.
		bonusid:data.bonusid, // We're keeping here which type of bonus we are.
		frame:(data.bonusid>7?7:data.bonusid), // The bonus type. The first 8 are different. Then the last one is repeated, but with growing score.
		x:maze.hw-6,y:maze.hh+54,
		first:function() {
			// Bonuses are quite simple...
			var capman=gbox.getObject("player","capman"); // ... checking where capman is.
			if (gbox.collides(this,capman)) { // If is colliding with the bonus...
				gbox.hitAudio("bonus"); // Play the bonus sound...
				var bonusscore=((this.bonusid+1)*100); // Calculate the bonus multiplier...
				maingame.hud.addValue("score","value",bonusscore); // Gives to the player the related bonus...
				maingame.hud.pushValue("bonus","value",this.frame); // Add the bonus image to the bonus queue (the pile on the bottom of the screen)
				toys.generate.sparks.popupText(this,"sparks",null,{font:"small",jump:5,text:bonusscore,keep:20}); // Our nice "text spark" with the earned score...
				gbox.trashObject(this); // ...and self-destroy.
			} else if (this.time==0) // If the time is up...
				gbox.trashObject(this); // ...too late, capman. Self-destroy without giving points
			else this.time--; // else, countdown.
		},
	
		blit:function() {
			gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.fliph,flipv:this.flipv,camera:this.camera,alpha:1});
		}

	 });
		
}

// Last but not least, the intro screen.
// As you've seen, there are a bunch of method that are called by the "maingame" during the game life. We've used the default behaviour for most of them (the "let's begin" message, the "gameover" screen etc.)
// but all of them are customizable. In this case, we're going to create a custom intro screen.
maingame.gameTitleIntroAnimation=function(reset) { 
	if (reset) { // "reset" is true before the first frame of the intro screen. We can prepare the intro animation...
		toys.resetToy(this,"rising"); // Like resetting a local toy. Some of the toys are "helpers": they use a local datastore of an object and does stuff, when called. For example: we're reserving a data store called "rising" to the "maingame" object.
	} else { // Then, when is the time to render our animation...
		gbox.blitFade(gbox.getBufferContext(),{alpha:1}); // First clear up the screen...
		toys.logos.linear(this,"rising",{image:"logo",x:gbox.getScreenHW()-gbox.getImage("logo").hwidth,y:20,sx:gbox.getScreenHW()-gbox.getImage("logo").hwidth,sy:gbox.getScreenH(),speed:1,audioreach:"eatghost"}); // Then we're telling to the "linear" toy (which renders something that moves from a point to another and eventually plays an audio on end) to use the "rising" data store, for keeping his values.
	}
};

}


// That's all. Please, gamebox... run the game!
  gbox.go();
  
  maingame.pressStartIntroAnimation=function(reset) {
		if (reset) {
			toys.resetToy(this,"default-blinker");
		} else {
			toys.text.blink(this,"default-blinker",gbox.getBufferContext(),{font:"small",text:"PRESS Z TO START",valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:Math.floor(gbox.getScreenH()/3),dw:gbox.getScreenW(),dh:Math.floor(gbox.getScreenH()/3)*2,blinkspeed:10});
		return gbox.keyIsHit("a");
		}
	};
  
}