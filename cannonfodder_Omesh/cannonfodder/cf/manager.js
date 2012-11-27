function DrawRect(left,top,right,bottom,color,alpha)
{
	gbox.blitRect(gbox.getBufferContext(),
	{x:left,y:top,w:right-left,h:bottom-top,alpha:alpha,color:color});
}
function DrawText(x,y,text,halign,valign)
{
	gbox.blitText(gbox.getBufferContext(),
	{font:"small",text:text,dx:x,dy:y,dw:0,dh:0,halign:halign,valign:valign});
}


var Manager = {
	id:"manager",
	group:"player",
	tileset:null,

	score: 1000,
	
	gameState: null,
	AllGameStates: {intro:0,frozen:1,active:2,paused:3,outro:4},
	AllMerits: {Attack:0,Technique:1,Defense:2,Speed:3},
	/* Game states:
	0 (Intro) - "Wave X: Get ready!"
	1 (Frozen) - You can place stuff right before the wave starts
	2 (Active) - Waves are approaching and many functionalities are locked out
	3 (Paused) - Similar to "Frozen", but certain functionalities aren't active
	4 (Outro) - "Wave complete!" *next level*
	*/
	
	remainingFodder: 0,
	waveCount: 0,
	
	
	basespotx: 0,
	basespoty: 0,
	initialize:function() {
		for (var A in maze.map)
		{
			for (var B in maze.map[A])
			{
				if (maze.map[A][B] == 7)
				{
					this.basespotx = parseInt(B);
					this.basespoty = parseInt(A);
					//
					this.cursorx = this.basespotx;
					this.cursory = this.basespoty;
					break;
				}
			}
		}
	},
	
	
	gridsnap: 24,
	gridwidth: 20,
	gridheight: 20,
	
	cursorx: 0,
	cursory: 0,
	shiftmotionx: 0,
	shiftmotiony: 0,
	first: function() {
		
	},
	blit: function() {
		DrawRect(0,0,gbox.getScreenW(),gbox.getScreenH(),'rgb(0,160,255)',1/3);
		
		
		for (var Q in this.entityList)
		{
			this.entityList[Q].Draw();
		}
	
	
		// gbox._screen.getContext("2d")
		locatex = this.cursorx*this.gridsnap +this.shiftmotionx*this.gridsnap*(this.lerpcounter/3);
		locatey = this.cursory*this.gridsnap +this.shiftmotiony*this.gridsnap*(this.lerpcounter/3);
		DrawRect(locatex,locatey,locatex+this.gridsnap,locatey+this.gridsnap,'rgb(255,0,160)',1/2);
		DrawText(16,16,""+maze.map[this.cursory][this.cursorx],gbox.ALIGN_LEFT,gbox.ALIGN_TOP);
		
		
		Q = {tileset:'base',tile:0,
			scalex:0.2,scaley:0.2,
			fliph:false,flipv:false,camera:this.camera,alpha:1};
		Q.dx = this.basespotx*Manager.gridsnap+Manager.gridsnap/2 -(gbox.getTiles(Q.tileset).tilew*Q.scalex)/2;
		Q.dy = this.basespoty*Manager.gridsnap+Manager.gridsnap/2 -(gbox.getTiles(Q.tileset).tileh*Q.scaley)/2;
		gbox.blitTile(gbox.getBufferContext(),Q);
		
		
		hudareaw = gbox.getScreenW()-maze.w -8;
		hudareah = maze.h/4 -8;
		
		
		DrawRect(maze.w,0,gbox.getScreenW(),gbox.getScreenH(),'rgb(0,0,0)',1);
		
		
		locatex = maze.w +4;
		locatey = maze.h*(1/4) +4;
		gbox.blitRect(gbox.getBufferContext(),
		{x:locatex,y:locatey,w:hudareaw,h:hudareah,alpha:1,color:'rgb(80,80,0)'});
		for (var Q in this.turretList)
		{
			if (this.turretList[Q] == this.contextTurret)
			{
				DrawRect(locatex,locatey+(hudareah/5)*parseInt(Q),locatex+hudareaw,locatey+(hudareah/5)*(parseInt(Q)+1),'rgb(255,255,255)',1/3);
			}
			DrawText(locatex+hudareaw*(0/4),locatey+(hudareah/5)*Q,Database.GetTurretName(this.turretList[Q].merits)+": ("+this.turretList[Q].merits+")",gbox.ALIGN_LEFT,gbox.ALIGN_TOP); // this.turretList[Q].typename
		}
		
		locatex = maze.w +4;
		locatey = maze.h*(2/4) +4;
		gbox.blitRect(gbox.getBufferContext(),
		{x:locatex,y:locatey,w:hudareaw,h:hudareah,alpha:1,color:'rgb(80,0,0)'});
		// Weapon types: Rocket, Shotgun, Laser, Gatling
		// Attack ~ Doubles the power of shots
		thisalpha = 1/3;
		thisstring = "";
		if (this.turretSelection)
		{
			thisstring = ""+this.turretPricing[0];
			if (this.turretpanex == 0 && this.turretpaney == 0) {thisalpha = 2/3;}
		}
		DrawRect(locatex            +2,locatey              +2,locatex+hudareaw/2 -4,locatey+hudareah/2 -4,'rgb(255,0,0)',thisalpha);
		DrawText(locatex+hudareaw*(1/4),locatey+hudareah/2,thisstring,gbox.ALIGN_CENTER,gbox.ALIGN_BOTTOM);
		// Defense ~ Damages everything on the same panel
		thisalpha = 1/3;
		thisstring = "";
		if (this.turretSelection)
		{
			thisstring = ""+this.turretPricing[2];
			if (this.turretpanex == 0 && this.turretpaney == 1) {thisalpha = 2/3;}
		}
		DrawRect(locatex            +2,locatey+hudareah/2 +2,locatex+hudareaw/2 -4,locatey+hudareah   -4,'rgb(0,255,0)',thisalpha);
		DrawText(locatex+hudareaw*(1/4),locatey+hudareah,thisstring,gbox.ALIGN_CENTER,gbox.ALIGN_BOTTOM);
		// Technique ~ Shots continue to pierce at less damage
		thisalpha = 1/3;
		thisstring = "";
		if (this.turretSelection)
		{
			thisstring = ""+this.turretPricing[1];
			if (this.turretpanex == 1 && this.turretpaney == 0) {thisalpha = 2/3;}
		}
		DrawRect(locatex+hudareaw/2 +2,locatey              +2,locatex+hudareaw   -4,locatey+hudareah/2 -4,'rgb(0,0,255)',thisalpha);
		DrawText(locatex+hudareaw*(3/4),locatey+hudareah/2,thisstring,gbox.ALIGN_CENTER,gbox.ALIGN_BOTTOM);
		// Speed ~ Enhances fire rate and bullet speed
		thisalpha = 1/3;
		thisstring = "";
		if (this.turretSelection)
		{
			thisstring = ""+this.turretPricing[3];
			if (this.turretpanex == 1 && this.turretpaney == 1) {thisalpha = 2/3;}
		}
		DrawRect(locatex+hudareaw/2 +2,locatey+hudareah/2 +2,locatex+hudareaw   -4,locatey+hudareah   -4,'rgb(255,255,0)',thisalpha);
		DrawText(locatex+hudareaw*(3/4),locatey+hudareah,thisstring,gbox.ALIGN_CENTER,gbox.ALIGN_BOTTOM);
		
		
		locatex = maze.w +4;
		locatey = maze.h*(0/4) +4;
		gbox.blitRect(gbox.getBufferContext(),
		{x:locatex,y:locatey,w:hudareaw,h:hudareah,alpha:1,color:'rgb(0,80,0)'});
		DrawText(locatex+hudareaw/2,locatey,"$"+this.score,gbox.ALIGN_CENTER,gbox.ALIGN_TOP);
		DrawText(locatex+hudareaw,locatey+64,"Remaining: "+this.remainingFodder,gbox.ALIGN_RIGHT,gbox.ALIGN_TOP);
		DrawText(locatex+hudareaw/2,locatey+hudareah,"Frozen",gbox.ALIGN_CENTER,gbox.ALIGN_BOTTOM);
		
		locatex = maze.w +4;
		locatey = maze.h*(3/4) +4;
		gbox.blitRect(gbox.getBufferContext(),
		{x:locatex,y:locatey,w:hudareaw,h:hudareah,alpha:1,color:'rgb(0,0,80)'});
		DrawText(locatex+hudareaw/2,locatey+hudareah/2,"Base",gbox.ALIGN_CENTER,gbox.ALIGN_BOTTOM);
		DrawRect(locatex+hudareaw*(1/5),locatey+hudareah/2,locatex+hudareaw*(4/5),locatey+hudareah/2 +8,'rgb(0,160,255)',1);
		DrawRect(locatex+hudareaw*(1/5),locatey+hudareah/2,locatex+hudareaw*(1/5) +(hudareaw*(3/5))*(0.50),locatey+hudareah/2 +8,'rgb(255,255,255)',1);
		
		gbox.blitText(gbox.getBufferContext(),{font:"small",text:"$"+this.score,valign:gbox.ALIGN_TOP,halign:gbox.ALIGN_CENTER,dx:maze.w,dy:0,dw:gbox.getScreenW(),dh:0});
	},
	
	lerpcounter: 0,
	turretSelection: false,
	turretpanex: 0,
	turretpaney: 0,
	contextTurret: null,
	turretPricing: [0,0,0,0],
	Update: function() {
		/*
		if (this.bullettimer>0) this.bullettimer--; // ...keep updated the "bullet time" counter...
		if (maingame.pillscount==0) // ...check if the maze is clear...
			maingame.gotoLevel(maingame.level+1); // ...and warp to the next level, if true.
		if (this.bonustimer>0) { // If the there is time left, before the bonus needs to be spawned...
			this.bonustimer--; // Decrease the timer
			if (this.bonustimer==0) // If the time is up...
				maingame.addBonus({bonusid:maingame.hud.getValue("bonus","value").length}); // Spawn the bonus.
			// Checking the timer after decreasing make sure that is spawned only once.
		}
		*/
		
		
		if (this.turretSelection)
		{
			if (gbox.keyIsPressed('left')) { this.turretpanex = 0; }
			else if (gbox.keyIsPressed('right')) { this.turretpanex = +1; }
			
			if (gbox.keyIsPressed('up')) { this.turretpaney = 0; }
			else if (gbox.keyIsPressed('down')) { this.turretpaney = +1; }
		
		
			if (gbox.keyIsPressed('b'))
			{
				this.turretSelection = false;
			}
			else if (gbox.keyIsPressed('c'))
			{
			this.addFodder(1,0, 4, 10);
				thismerit = (1*this.turretpanex+2*this.turretpaney);
				this.score -= this.turretPricing[thismerit];
				//
				if (this.contextTurret == null)
				{
					this.contextTurret = this.addTurret(this.cursorx,this.cursory,20);
					
					//
					this.contextTurret.x = this.cursorx*this.gridsnap;
					this.contextTurret.y = this.cursory*this.gridsnap;
				}
				else
				{
					if (this.contextTurret.merits.indexOf(thismerit)>=0){return;}
					// <Make turret AWESOME>
					this.contextTurret.isUpgraded = true;
					this.contextTurret.tileset = "turret_advance";
				}
				//
				this.contextTurret.merits.push(thismerit);
				//
				this.turretSelection = false;
			}
		}
		else
		{
			if (gbox.keyIsPressed('a'))
			{
				switch (maze.map[this.cursory][this.cursorx])
				{
					case 8:
					if (this.contextTurret == null)
					{
						this.turretPricing = [800,1200,900,1000];
					}
					else
					{
						if (this.contextTurret.isUpgraded) {break;}
						//
						// <Changes based on current upgrades>
						this.turretPricing = [1000,1000,1000,1000];
					}
					this.turretSelection = true;
					break;
				}
			}
		
		
			if (this.shiftmotionx == 0 && this.shiftmotiony == 0)
			{
				if (gbox.keyIsPressed('left')) { 
					if (0 <= this.cursorx-1) this.shiftmotionx = -1;
				}
				else if (gbox.keyIsPressed('right')) { 
					if (this.cursorx+1 < this.gridwidth) this.shiftmotionx = +1;
				}
				
				if (gbox.keyIsPressed('up')) {
					if (0 <= this.cursory-1) this.shiftmotiony = -1; 
				}
				else if (gbox.keyIsPressed('down')) { 
					if (this.cursory+1 < this.gridheight) this.shiftmotiony = +1;
				}
			}
			
			if (this.shiftmotionx!=0 || this.shiftmotiony!=0)
			{
				this.lerpcounter++;
				if (this.lerpcounter >= 3)
				{				
					this.cursorx += this.shiftmotionx;
					this.cursory += this.shiftmotiony;
					//
					this.shiftmotionx = 0;
					this.shiftmotiony = 0;
					//
					this.lerpcounter = 0;
					
					
					this.contextTurret = null;
					for (var i in this.turretList){
						if (this.turretList[i].gx == this.cursorx && this.turretList[i].gy == this.cursory)
						{
							this.contextTurret = this.turretList[i];
							break;
						}
					}
				}
			}
		}
		
		
		
		for (var n in Manager.fodderList)
		{
			fodderMovement(Manager.fodderList[n]);
		}
	},
	

	entityList: [],
	fodderList: [],
	fodderCounter: 0, 
	addFodder: function(x,y,health,speed) {
		Q = gbox.addObject({
			id:"fodder_"+this.fodderCounter,
			group:"fodder",
			tileset:"fodder",
			health: health,
			speed: speed,
			initialize:function() {
			},
			
			first:function() {
			},
			Update: function() {
				fodderMovement(this);
			},
			
			blit:function() {

			},
			Draw:function() {
				gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:0,dx:this.gx*Manager.gridsnap,dy:this.gy*Manager.gridsnap,scalex:Manager.gridsnap/gbox.getTiles(this.tileset).tilew,scaley:Manager.gridsnap/gbox.getTiles(this.tileset).tileh,fliph:false,flipv:false,camera:this.camera,alpha:1});
				Q.dx = this.gx*Manager.gridsnap-gbox.getTiles(this.tileset).tilew*Q.scalex-Manager.gridsnap;
				Q.dy = this.gy*Manager.gridsnap-gbox.getTiles(this.tileset).tileh*Q.scaley-Manager.gridsnap;
				//this.cursorx*this.gridsnap +this.shiftmotionx*this.gridsnap*(this.lerpcounter/3);
				//
			},
			
			kill:function() { Manager.Despawn(this); }
		});
		Q.gx = x;
		Q.gy = y;
		
		//Q.health = 4;
		//
		this.entityList.push(Q);
		this.fodderList.push(Q);
		//
		this.fodderCounter++;
		return Q;
	},
	turretList: [],
	turretCounter: 0,
	addTurret: function(xx,yy, delay) {
		Q = gbox.addObject({
			id:"turret"+this.turretCounter,
			group:"turret",
			tileset:"turret_basic",
			frame: 0,
			
			faceAngle: 0,
			
			gx: 0,
			gy: 0,
			isUpgraded: false,
			shotDelay: delay,
			merits: [],
			
			initialize:function() {
			},
			
			first:function() {
			
				if(Manager.fodderList.length >0)
				{
					angleTurretFace(this, Manager.fodderList[0]);
					targetFodder(Manager.fodderList[0], this);
				}
			},
			
			blit:function() {
			},
			Draw:function() {
				Q = {tileset:this.tileset,tile:this.frame,
					scalex:(Manager.gridsnap*1.5)/gbox.getTiles(this.tileset).tilew,
					scaley:(Manager.gridsnap*1.5)/gbox.getTiles(this.tileset).tileh,
					fliph:false,flipv:false,camera:this.camera,alpha:1};
				Q.dx = this.gx*Manager.gridsnap-(gbox.getTiles(this.tileset).tilew*Q.scalex-Manager.gridsnap)/2;
				Q.dy = this.gy*Manager.gridsnap-(gbox.getTiles(this.tileset).tileh*Q.scaley-Manager.gridsnap)/1;
				//
				gbox.blitTile(gbox.getBufferContext(),Q);
			},
			
			kill:function() { Manager.Despawn(this); }
		});
		//
		Q.gx = xx;
		Q.gy = yy;
		//
		this.entityList.push(Q);
		this.turretList.push(Q);
		//
		this.turretCounter++;
		return Q;
	},
	shellList: [],
	shellCounter: 0,
	addShell: function(xx,yy, speed) {
		Q = gbox.addObject({
			id:"shell"+this.shellCounter,
			group:"shell",
			tileset:"shell",
			
			myTarget: null,
			
			x: xx,
			y: yy,
			gx: 0,
			gy: 0,
			speed: speed,
			initialize:function() {
			},
			
			first:function() {
				shellMovement(this, this.myTarget);
			},
			
			blit:function() {
			},
			Draw:function() {
				gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:0,dx:this.x,dy:this.y,scalex:1,scaley:1,fliph:false,flipv:false,camera:this.camera,alpha:1});
			},
			
			kill:function() { Manager.Despawn(this); }
		});
		//
		this.entityList.push(Q);
		this.shellList.push(Q);
		//
		this.shellCounter++;
		return Q;
	},
	
	
	
	Despawn: function (obj) {
		var index;
		index = Manager.entityList.indexOf(obj);
		if (index >= 0) { Manager.entityList.splice(index, 1);}
		
		index = Manager.fodderList.indexOf(obj);
		if (index >= 0) { Manager.fodderList.splice(index, 1);}
		
		index = Manager.turretList.indexOf(obj);
		if (index >= 0) { Manager.turretList.splice(index, 1); }
		
		index = Manager.shellList.indexOf(obj);
		if (index >= 0) { Manager.shellList.splice(index, 1);}
	},
};

var moveX =0;//counter to state when to advance
var moveY =0;//counter to state when to advance

var tileValue 
var fodderLerp
function fodderMovement(fodder){
	//window.alert(maze.tilew);
	tileValue = maze.map[fodder.gy][fodder.gx];
	if (moveX == 0 && moveY == 0){
		if(tileValue == '2' || tileValue == '6'){
			//moveX = 0;
			moveY = 1;
		}
		else if(tileValue == '4'){
			moveX = -1;
			//moveY = 0;
		}
		else if(tileValue == '3'){
			moveX = 1;
			//moveY = 0;
		}
		else if(tileValue == '5'){
			//moveX = 0;
			moveY = -1;
		}
		else if(tileValue == '7'){
			// <BOOM>
		}
	}
	else{
		if(fodderLerp < fodder.speed) {
			fodderLerp++;
		}
		else{//update the position
			fodder.gx += moveX;
			fodder.gy += moveY;
			
			moveY = 0;
			moveX = 0;
			
			fodderLerp = 0;
			
			//angleTurretFace(Manager.turretList, fodder);
			//targetFodder(fodders, Manager.turretList);
		}
	}
}


function angleTurretFace(turret, fodder){
	//for(var i = 0; i<turret.length; i++){
		//var angle = trigo.getAngle(turret[0], fodder);
	//}
	var deltaY = fodder.gy - turret.gy;
	var deltaX = fodder.gx - turret.gx;
	var angle = (Math.atan2(-deltaY,deltaX)) * 180 / Math.PI
	var x = Math.floor((angle + 45/2 + 360)/45) % 8;
	
	turret.frame = x;
}


	var fireRate = 0;

	var minRangeToFire = 5;//minimum distance fodder is from turret for shell to be fired
	var targetDistance = 0;
	var i = 1;
function targetFodder(fodders, turret){//(fodders, turret){
	//targetDistance = trigo.getDistance(fodders, turret[0]){//get distance of fodder to turret
	targetDistance = Math.sqrt(Math.pow(fodders.gx-turret.gx,2)+Math.pow(fodders.gy-turret.gy,2))
	//window.alert(targetDistance);
		if(targetDistance <= minRangeToFire) // test if it within the minimum distance from fodder
		{
			if (fireRate == turret.shotDelay)
			{//can pass a variable to measure the 
				Q = Manager.addShell(turret.gx * Manager.gridsnap, turret.gy * Manager.gridsnap, 20);
				//Q.speed = 20;
				Q.myTarget = fodders;
				fireRate = 0;
				i++;
			}
			fireRate++;
		}
	}

	
	var shellVecX = 0;
var	shellVecY = 0;

function shellMovement(shell, fodder) {

	var deltaY = fodder.gy * Manager.gridsnap - shell.y;
	var deltaX = fodder.gx * Manager.gridsnap - shell.x;
	var product = Math.atan2(deltaY,deltaX);
	
	//var angleToFodder = trigo.getAngle(shell, fodder);
	//window.alert(angle);
	var hyp = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	shellVecX = Math.min(hyp,shell.speed) * Math.cos(product);
	shellVecY = Math.min(hyp,shell.speed) * Math.sin(product);
		
	shell.x += shellVecX;
	shell.y += shellVecY;
	//debugger;
	//shell.gx = Math.floor(shell.x / 20);
	//shell.gy = Math.floor(shell.y / 20);
		if(shell.x == fodder.gx * Manager.gridsnap  && shell.y == fodder.gy * Manager.gridsnap)
		{
			shell.kill();
			fodder.health--;
			//debugger;
			if(fodder.health < 1){
				fodder.kill();
				//debugger;
			}
			
			//debugger;
		}

	shellVecX = 0;
	shellVecY = 0;
}

var armed = true;
var shellPreviousGX = 0;
var shellPreviousGY = 0;

function shellHitFodder(fodder,shell){
//debugger;
	//shellPreviousGX = shell.gx;
	//shellPreviousGY = shell.gy;
	
	shell.gx = Math.floor(shell.x / 20);
	shell.gy = Math.floor(shell.y / 20);
	
	//if(shellPreviousGX != shell.gx && shellPreviousGY != shell.gy)
	//debugger;
	//console.log(shellPreviousGX)
	//console.log(shell.gx)
	//console.log("fodder gx: " +fodder.gx)
		//console.log("fodder gy: " +fodder.gy)
		//console.log("shell x: " + shell.gx)
		//console.log("shell y: " + shell.gy) 

		if(shell.x == fodder.gx  && shell.y == fodder.gy)
		{
		
			//fodder.health--;
			//if(fodder.health < 1){
				fodder.kill();
				//debugger;
			//}
			shell.kill();
			//debugger;
		}
	
}