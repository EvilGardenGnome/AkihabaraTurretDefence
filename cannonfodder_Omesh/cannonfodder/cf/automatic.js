var Automatic = {
	AddCapman: function() {
		// Now, let's add our capman. The player is usually added once per match and "moved" in the map on level changes (as you've seen into the newLife method)	
		gbox.addObject({
			id:"capman", // Every object has an ID for being picked up every time (we've used the ID into newLife)
			group:"player", // ... and is put in a group (do you remember the setGroups command?)
			tileset:"capman", // Uses this tileset, generated during loading phase...
			killed:false, // and, for now, was not killed.
			scorecombo:1, // We'll keep also the score combo, while eating ghosts. at start is 0. Will increase while we're invincible.
			
			initialize:function() { // The "initialize" method is called the first frame the object spawns and never more.
				// We will use the topview toys, since capman is... well... a top view game.
				toys.topview.initialize(this,{
					colh:gbox.getTiles(this.tileset).tileh, // Topview games offers semi-isometric features but we are not using reduced collision box, since is flat 2D
					colw:gbox.getTiles(this.tileset).tilew,
					staticspeed:2, // Topview gives accelleration to object by default but the player moves at static speed in capman, without accellerations
					nodiagonals:true, // The player cannot move in diagonal direction
					noreset:true, // Do not reset moving state if any change is made, so capman keep going straight
					frames:{ // These are quite self explanatory
						still:{ speed:2, frames:[0] },
						hit:{speed:1,frames:[0,1,0,1]},
						standup:{ speed:1, frames:[0] },
						standdown:{ speed:1, frames:[0] },
						standleft:{ speed:1, frames:[0] },
						standright:{ speed:1, frames:[0] },
						movingup:{speed:3,frames:[0,2,1,2] },
						movingdown:{speed:3,frames:[0,4,3,4] },
						movingleft:{speed:3,frames:[0,6,5,6] },
						movingright:{speed:3,frames:[0,6,5,6] }
					}
					// What? Starting "x" and "y" are not here. That's because, when the first level starts, the "newLife" calls "spawn" over the player, setting the position.
				});
			},
			
			first:function() { // Usually everyting involving interacton is into the "first" method.
				this.counter=(this.counter+1)%10; // This line must be used in every object that uses animation. Is needed for getting the right frame (the "frames" block few lines up)
				
				if (!this.killed&&!maingame.gameIsHold()&&!maingame.bullettimer) { // If capman is still alive and the game is not "hold" (level changing fadein/fadeouts etc.) and the "bullet timer" is not stopping the game.
				
					// First of all, let's move.
					var olddata=help.createModel(this,["x","y","accx","accy","xpushing","ypushing","facing"]); // A little trick: capman cannot change direction, if hits a wall, so we backup capman's status here. Will restored if capman hits the wall.
					toys.topview.controlKeys(this,{left:"left",right:"right",up:"up",down:"down"}); // Set capman's horizontal and vertical speed.
					toys.topview.applyForces(this); // Moves capman 
					// Note that our capman will keep going since we're not changing the speed given by controlKeys and applied by applyForces (i.e. toys.handleAccellerations)
					toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // check tile collisions.
																							  // tolerance indicates how "rounded" the corners are (for turning precision - in capman have to be precise but not too much, for anticipated turnings)
																							  // Approximation is the distance in pixel of each check. Lower approximation is better but is slower. Usually using the lower between the tile size and the sprite height is enough.
					if (this.touchedup||this.toucheddown||this.touchedleft||this.touchedright) { // If capman hits some wall
						help.copyModel(this,olddata); // the olddata properties are replaced to the local object
						toys.topview.applyForces(this); // And is moved like we've done before, like the player hasn't changed direction.
						toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1});
					}
					
					// The side warp. If capman reach one of the left or right side of the maze, is spawn on the other side,in the same direction
					if ((this.x<0)&&(this.facing==toys.FACE_LEFT)) // If capman reaches the left side of the maze, facing left
						this.x=maze.w-this.w; // move capman on right side
					else if ((this.x>(maze.w-this.w))&&(this.facing==toys.FACE_RIGHT)) // If capman reaches the right side of the maze, facing right
						this.x=0; // move capman on the left side.
					
					toys.topview.setFrame(this); // setFrame sets the right frame checking the facing and the defined animations in "initialize"
					
					// Then... let's eat!
					var inmouth=help.getTileInMap(this.x+this.hw,this.y+this.hh,maze,0); // I'll explain this the next line.
					// getTileInMap returns the tile in the specified coord in pixel. So the x position plus half of his width (and the same for y and half height), gives the center of capman (i.e. the mouth)
					// The third argument is the tile map we're checking, that is our maze. 0 is the returned value if the pointed coord is our from the map. All this for picking which tile is in the
					// capman's mouth!
					if (inmouth>7) { // If capman is eating a pill (8 for normal pill, 9 for power pill)
						if (inmouth == 9) { // If is a powerpill
							gbox.hitAudio("powerpill"); // Play the powerpill sound. hitAudio plays an audio from start and is useful for sound effects. playAudio does nothing if the audio was already playing, so is useful for music playback.
							this.scorecombo=1; // Reset the combo counter.
							gbox.getObject("ghosts","ghost1").makeeatable(); // Make the ghosts vulnerable.
							gbox.getObject("ghosts","ghost2").makeeatable();
							gbox.getObject("ghosts","ghost3").makeeatable();
							gbox.getObject("ghosts","ghost4").makeeatable();
						} else
							gbox.hitAudio("eat"); // If is a classic pill, play the classic "gabogabo" sound!
						var mouthx=help.xPixelToTileX(maze,this.x+this.hw); // Let's get the pill coordinate in the maze...
						var mouthy=help.yPixelToTileY(maze,this.y+this.hh);
						help.setTileInMap(gbox.getCanvasContext("mazecanvas"),maze,mouthx,mouthy,null); // ... and set a null tile over that.
						maingame.hud.addValue("score","value",10); // Player earns 10 points. "hud" items also stores their values and can be used to store the real score.
						maingame.pillscount--; // Let's decrease the number of pills into the maze.
					}
				}
			},
			
			// The blit phase is the very last method called every frame. It should only draw the object on the bufferContext (i.e. the screen)
			blit:function() {
				if (!this.killed) // If the player is alive, then draw it on the screen. Is a nice trick, since is not needed to destroy/recreate the player every life.
					gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.fliph,flipv:this.flipv,camera:this.camera,alpha:1});
					// That means: draw, from my tileset, a frame in position dx,dy flipping the sprite horizontally and/or vertcally, using the camera coords and with full opacity
					// All the arguments are taken from this: the "toys" values everything for doing something coherent from the genre of game you're using.
					// So, our "capman" flips, moves and does animation automatically. Really nerds can code something more complex, skipping or integrating the
					// "toys" methods.
			},
			
			// And now, a custom method. This one will kill the player and will be called by ghosts, when colliding with capman.
			kill:function() {
				if (!this.killed) { // If we're alive...
					this.killed=true; // First of all, capman is killed. As you've seen, that makes capman invisible and on hold.
					gbox.hitAudio("die"); // Play the die sound
					maingame.hud.addValue("lives","value",-1); // Then decrease the lives count.
					maingame.playerDied({wait:50}); // Telling the main game cycle that the player died. The arguments sets a short delay after the last fadeout, for making visible the dead animation
					toys.generate.sparks.simple(this,"sparks",null,{tileset:this.tileset,frames:{speed:4,frames:[6,5,7,8,9,9,9,9]}});
					// And here comes a common trick: the player is still where was killed and a "spark" (i.e. unuseful animation) starts in the same place.
					// This method allows many nice tricks, since avoid destruction/recreation of the player object, allow a respawn the player in the place it was killed very easily (switching
					// the killed attribute. The "spark.simple" method spawns a spark in the same position of the object in the first argument.
				}
			}

		});
		  
	},
	AddGhost: function (data) {
		// Ghosts are objects too, like capman.
		gbox.addObject({
			ghostid:data.id, // We will give a number to each ghost, since their behaviour is quite similiar, with some exception I'll explain. Let's store this id here.
			id:"ghost"+data.id, // The object name is derived from the passed ID. So, addGhost({id:1}); will generate a "ghost1" object.
			group:"ghosts", // Ghosts are all on their group
			tileset:"ghost"+data.id, // A nice trick, isn't it? Ghost ID 1 will pick the "ghost1" tileset, that means a red ghost, ID 2 gets the light blue one and so on.
			status:"inhouse", // We will use a "status" property to check what the ghost is doing: if is in his house, waiting for going up, if is chasing capman or if is escaping. At the begining it is in his house...
			time:75, // ...and will stay there for 75 frames. 
			
			initialize:function() { // From now, go back to the capman object for what I'm not commenting. You're getting better, so let's make the things harder :)
				toys.topview.initialize(this,{
					colh:gbox.getTiles(this.tileset).tileh, // That is like capman...
					colw:gbox.getTiles(this.tileset).tilew,
					staticspeed:2,
					nodiagonals:true,
					noreset:true,
					frames:{
						still:{ speed:2, frames:[0] },
						hit:{speed:1,frames:[0,1,0,1]},
						standup:{ speed:1, frames:[0] },
						standdown:{ speed:1, frames:[1] },
						standleft:{ speed:1, frames:[2] },
						standright:{ speed:1, frames:[2] },
						movingup:{speed:1,frames:[0] },
						movingdown:{speed:1,frames:[1] },
						movingleft:{speed:1,frames:[2] },
						movingright:{speed:1,frames:[2] }
					},
					x:data.x, // This time, we will place ghosts on creation. We will destroy and recreate the ghosts every time, since the status of enemies, bullets and foes rarely needs to be kept.
					y:data.y
				});
			},
			
			first:function() {
				this.counter=(this.counter+1)%10; // Our animation handler...
				
				var olddata=help.createModel(this,["x","y","accx","accy","facing"]); // Just like capman, we will use this to cancel a movement, if hits the wall.
				if (!maingame.gameIsHold()&&!maingame.bullettimer) { // The killed condition is no longer here, since the ghosts never die :(

					switch (this.status) { // capman does the same thing during the game but ghosts, instead, are busy in many activities, like...
					
						case "inhouse": { // ...bouncing up and down in their house.
							// Now we're going into the interesting part: things that moves by itself. Every genre of game has their ways: shoot'em up uses usually scripted or procedural movement, platform games can
							// have very complex scripts... For capman, we're going to use the "virtual stick" way: ghosts moves exactly like capman but moved by a "virtual joystick" that we're going to move for him.
							// Let's see how. There are several advantages on using virtual sticks, for example, we're using all the toys for deciding direction, movement and collisions.
							if (this.facing == toys.FACE_UP) // If the ghost is facing up...
								toys.topview.controlKeys(this,{pressup:1}); // ...we simulate to press up on his virtual joystick...
							else
								toys.topview.controlKeys(this,{pressdown:1}); // ...else we're pressing down.
							toys.topview.applyForces(this); // Let's move the ghost...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check if is colliding with a wall.
							if (this.touchedup||this.toucheddown) // If the ghost touched the border of the house...
								this.facing=(this.facing==toys.FACE_UP?toys.FACE_DOWN:toys.FACE_UP); // Invert their direction. The next cycle, the ghost will move in the opposite direction.
							
							if (this.time==0) // If is time to go out from the house
								this.status="goout"; // Let's change the status
							else
								this.time--; // else keep counting the frames.
								
							break; // That's all. Our ghost is moving up and down.
						}
						
						case "goout": { // So we're leaving the house.
							if (this.x<maze.hw-this.hw) { // If we're on the left side of the maze (note: finalizeTilemap have valued also half width and height of the map)
								toys.topview.setStaticSpeed(this,1); // Slowly... (notes: we're using "setStaticSpeed" when creating classic maze games, when pixel-precision with the playfield is needed, like capman or bomberman games)
								toys.topview.controlKeys(this,{pressright:1}); //  Let's move to the right
							} else if (this.x>maze.hw-this.hw) { // If we're on the right side...
								toys.topview.setStaticSpeed(this,1); // Slowly...
								toys.topview.controlKeys(this,{pressleft:1}); //  Let's move to the left
							} else { // And, if we're on the center
								toys.topview.setStaticSpeed(this,2) // Faster!
								toys.topview.controlKeys(this,{pressup:1}); //  Let's move up, out from the house
							}
							toys.topview.applyForces(this); // Let's move the ghost...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check if is colliding with a wall.
							if (this.touchedup) // If the ghost touches a border up...
								this.status="chase"; // We're out from the labirynth. Is the time to kick the capman a$$!
							break; // That is enough.
						}
						
						case "chase": { // We're ghosts. And angry. Let's go after capman!
							toys.topview.setStaticSpeed(this,2) // Setting the moving speed.
							// I've read somewhere that ghosts have different "aggressivity". We're going to simulate this this way: we're creating two different behaviours. The first one moves the ghost
							// toward capman's position. The second one is completely random. How to decide how much "aggressive" the ghost is?
							var aggressivity=this.ghostid; // First of all, let's calculate the aggressivity. Lower values means more aggressivity, so ghost 1 is more aggressive than ghost 4.
							aggressivity-=maingame.level-1; // The, we're going to increase the aggressivity each level. so ghost 4 is aggressive 4 in level 1, aggressive 3 in level 2, aggressive 2 in level 3 and so on.
							if (aggressivity<0) aggressivity=0; // If we're going mad (aggressivity<0) let's keep the calm: lower aggressivity threshold is 0.
							if (help.random(0,aggressivity)==0) { // ...now ghosts with lower aggressivity have more possibilites to move toward capman. Higher aggressivity means more probabilities to get a random direction.
								// This is the "chasing" method. Is quite simple.
								var capman=gbox.getObject("player","capman"); //  First of all, let's check where is capman.
								if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) { // Ghosts can't go in their opposite direction, so if we're moving horizontally, the next move is vertical and vice versa.
									if (capman.x>this.x) // is on my right?
										toys.topview.controlKeys(this,{pressright:1}); //  Let's move right.
									else if (capman.x<this.x) // on my left?
										toys.topview.controlKeys(this,{pressleft:1}); //  Let's move left.
								} else {
									if (capman.y>this.y) // is under me?
										toys.topview.controlKeys(this,{pressdown:1}); //  Let's move down.
									else if (capman.y<this.y) // is over me?
										toys.topview.controlKeys(this,{pressup:1}); //  Let's move up.									
								}
							} else { // If we're moving randomly...
								if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) // The same condition of moving...
									if (help.random(0,2)==0) toys.topview.controlKeys(this,{pressleft:1}); else toys.topview.controlKeys(this,{pressright:1}); // But direction is random, this time.
								else
									if (help.random(0,2)==0) toys.topview.controlKeys(this,{pressup:1}); else toys.topview.controlKeys(this,{pressdown:1});
							}
							toys.topview.applyForces(this); // Then we're moving to that direction...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check if is colliding with a wall.
							break;
						}
						
						case "eaten": { // We were eaten by capman. We need to go back to the ghost's house door, that is near the center of the maze.
							toys.topview.setStaticSpeed(this,4); // We're in a hurry now!
							if ((this.x==maze.hw-this.hw)&&(this.y==maze.hh-38)) // If we've reached the door
								this.status="goin"; // ... and let's enter the door
							else {
								if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) { // The code is the same of the chase version, but we're going toward the center
									if (maze.hw-this.hw>this.x) toys.topview.controlKeys(this,{pressright:1});
									else if (maze.hw-this.hw<this.x)  toys.topview.controlKeys(this,{pressleft:1});
								} else {
									if (maze.hh-38>this.y) toys.topview.controlKeys(this,{pressdown:1});
									else if (maze.hh-38<this.y) toys.topview.controlKeys(this,{pressup:1});
								}
							}
							toys.topview.applyForces(this); // Then we're moving to that direction...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check if is colliding with a wall.
							break;
						}
						
						case "goin": { // Now we're going back at home. Just moving down slowly...
							toys.topview.setStaticSpeed(this,1) // Slowly...
							toys.topview.controlKeys(this,{pressdown:1}); // Moving down...
							toys.topview.applyForces(this); // Let's move...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check if is colliding with a wall.
							if (this.toucheddown) { // If we've touched the house floor...
								this.tileset=this.id; // change wear...								
								toys.topview.setStaticSpeed(this,2) // Faster...
								this.time=75; // We stay here for a while...
								this.status="inhouse"; // ...and remember that after the "inhouse", the cycle starts over again: "goout" and "chase"!
							}
							break;
						}
						
						case "escape":{ // If we're escaping from capman, the logic is the reverse of chase, so...
							toys.topview.setStaticSpeed(this,1) // Slowly
							var capman=gbox.getObject("player","capman"); //  Where is capman?
							if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) {
								if (capman.x>this.x) // is on my right?
									toys.topview.controlKeys(this,{pressleft:1}); //  Let's move left|
								else if (capman.x<this.x) // on my left?
									toys.topview.controlKeys(this,{pressright:1}); //  Let's move right!
							} else {
								if (capman.y>this.y) // is under me?
									toys.topview.controlKeys(this,{pressup:1}); //  Let's move up!.
								else if (capman.y<this.y) // is over me?
									toys.topview.controlKeys(this,{pressdown:1}); //  Let's move down!									
							}
							toys.topview.applyForces(this); // Then we're moving to that direction...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check if is colliding with a wall.
							this.time--; // Decrease the timer. This time means for how much time the ghost is vulnerable.
							if (this.time>0) { // if we can be eaten...
								// Now we're setting the tileset. Switching tilesets with the same number of frames allow to change dynamically how the character looks. This is a sample:
								if (this.time>50) // If there is a lot of time left to be eaten...
									this.tileset="ghostscared"; // let's pick the "scared" tileset (that one with blue color and wavy mouth)
								else // ...else, if time is running out...
									if (Math.floor(this.time/4)%2==0) // This is a little trick for make a think blinking using only a counter. The "/2" slow down the blink time and the "%2" gives an "on/off" output. So...
										this.tileset="ghostscared"; // sometime picks the scared tileset...
									else
										this.tileset=this.id; // ...and sometime picks the original tileset.
							} else {
								this.tileset=this.id; // set the original tileset...
								this.status="chase"; // and go back for chasing!
							}


							break;
						}
					}
					
					// Not scripted movements can end on "still" condition (for example, we're trying to move toward a wall)
					// So, since ghosts never stop moving, we're going to make sure that a direction is taken, if the last movement touched a wall.
					if ((this.status=="chase")||(this.status=="eaten")||(this.status=="escape")) { 
					
						if (this.touchedup||this.toucheddown||this.touchedleft||this.touchedright) { // If hitting a wall
							help.copyModel(this,olddata); // we're reversing to the old movement...
							toys.topview.controlKeys(this,{pressup:(this.facing==toys.FACE_UP),pressdown:(this.facing==toys.FACE_DOWN),pressleft:(this.facing==toys.FACE_LEFT),pressright:(this.facing==toys.FACE_RIGHT)}); // Push toward the old direction.
							toys.topview.applyForces(this); // redo the moving...
							toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check collision.
							if (this.touchedup||this.toucheddown||this.touchedleft||this.touchedright) { //Uh-oh. If colliding here too, our ghost is really stuck.
								for (var i=0;i<4;i++) // So we're trying to move in any of the four direction.
									if (i!=((olddata.facing+2)%4)) { // Do you remember? Ghosts cannot go back, so we're skipping the opposite direction. The trick: opposite direction is current direction +2. Have a look to the toys constants.
										help.copyModel(this,olddata); // First, go back on the starting point...
										toys.topview.controlKeys(this,{pressup:(i==toys.FACE_UP),pressdown:(i==toys.FACE_DOWN),pressleft:(i==toys.FACE_LEFT),pressright:(i==toys.FACE_RIGHT)}); // Push one of the direction
										toys.topview.applyForces(this); // redo the moving...
										toys.topview.tileCollision(this,maze,"map",null,{tolerance:0,approximation:1}); // ...and check collision again.
										if (!(this.touchedup||this.toucheddown||this.touchedleft||this.touchedright)) break; //  If we've not touched anything, we're no longer stuck!
										// Else, we'll try the other direction
									}
								// If we're here, a valid direction was taken. YAY!
							}
						}
					
					}
					
					toys.topview.setFrame(this); // Every remember to call this at least once :)

					// The side warp is valid for ghosts too! :)
					if ((this.x<0)&&(this.facing==toys.FACE_LEFT))  this.x=maze.w-this.w;
					else if ((this.x>(maze.w-this.w))&&(this.facing==toys.FACE_RIGHT)) this.x=0;
					
					// Then... let's bug capman a bit
					var capman=gbox.getObject("player","capman"); // As usual, first we pick our capman object...
					if (gbox.collides(this,capman,2)) { // If we're colliding with capman, with a tolerance of 2 pixels...
						if (this.status=="chase") { // and we're hunting him...
							maingame.bullettimer=10; // ...stop the game for a while.
							capman.kill(); // ...kill capman. "kill" is the custom method we've created into the capman object.
						} else if (this.status=="escape") { // else, if we were escaping from capman (uh oh...)
							gbox.hitAudio("eatghost"); // Play the ghost-eaten sound.
							maingame.bullettimer=10; // ...stop the game for a while.
							toys.generate.sparks.popupText(capman,"sparks",null,{font:"small",jump:5,text:capman.scorecombo+"x100",keep:20}); // Text sparks are useful to "replace" sound effects, give quick hints o make a game really rad! ;)
							maingame.hud.addValue("score","value",capman.scorecombo*100); // Gives to the player 100*combo points...
							capman.scorecombo++; // Increase the combo counter...
							this.tileset="ghosteaten"; // change wear...
							this.status="eaten"; // ...and let's go back to the house...
						}
					}

				}
			},
			
			makeeatable:function() { // If called, the ghost became eatable by capman. Is called by capman when a powerpill is eaten
				if (this.status=="chase") { // If was chasing capman...
					this.status="escape"; // Time to escape!
					this.time=150; // For a while :)
				}
			},
			
			blit:function() { // In the blit phase, we're going to render the ghost on the screen, just like capman.
				gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.fliph,flipv:this.flipv,camera:this.camera,alpha:1});
			}

		});
	}
};