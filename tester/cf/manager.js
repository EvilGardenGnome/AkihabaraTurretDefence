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
				thismerit = (1*this.turretpanex+2*this.turretpaney);
				this.score -= this.turretPricing[thismerit];
				//
				if (this.contextTurret == null)
				{
					this.contextTurret = this.addTurret(this.cursorx,this.cursory);
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
	},
	
	
	
	
	entityList: [],
	fodderList: [],
	fodderCounter: 0,
	addFodder: function() {
		Q = gbox.addObject({
			id:"fodder_"+this.fodderCounter,
			group:"fodder",
			tileset:"fodder",
			
			initialize:function() {
			},
			
			first:function() {
			},
			
			blit:function() {
			},
			Draw:function() {
				gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:0,dx:this.gx*Manager.gridsnap,dy:this.gy*Manager.gridsnap,scalex:Manager.gridsnap/gbox.getTiles(this.tileset).tilew,scaley:Manager.gridsnap/gbox.getTiles(this.tileset).tileh,fliph:false,flipv:false,camera:this.camera,alpha:1});
			},
			
			kill:function() { Despawn(this); }
		});
		//
		this.entityList.push(Q);
		this.fodderList.push(Q);
		//
		this.fodderCounter++;
		return Q;
	},
	turretList: [],
	turretCounter: 0,
	addTurret: function(xx,yy) {
		Q = gbox.addObject({
			id:"turret"+this.turretCounter,
			group:"turret",
			tileset:"turret_basic",
			
			gx: 0,
			gy: 0,
			isUpgraded: false,
			merits: [],
			
			initialize:function() {
			},
			
			first:function() {
			},
			
			blit:function() {
			},
			Draw:function() {
				Q = {tileset:this.tileset,tile:4,
					scalex:(Manager.gridsnap*1.5)/gbox.getTiles(this.tileset).tilew,
					scaley:(Manager.gridsnap*1.5)/gbox.getTiles(this.tileset).tileh,
					fliph:false,flipv:false,camera:this.camera,alpha:1};
				Q.dx = this.gx*Manager.gridsnap-(gbox.getTiles(this.tileset).tilew*Q.scalex-Manager.gridsnap)/2;
				Q.dy = this.gy*Manager.gridsnap-(gbox.getTiles(this.tileset).tileh*Q.scaley-Manager.gridsnap)/1;
				//
				gbox.blitTile(gbox.getBufferContext(),Q);
			},
			
			kill:function() { Despawn(this); }
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
	addShell: function() {
		Q = gbox.addObject({
			id:"shell"+this.shellCounter,
			group:"shell",
			tileset:"shell",
			
			initialize:function() {
			},
			
			first:function() {
			},
			
			blit:function() {
			},
			Draw:function() {
				gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:0,dx:this.gx*Manager.gridsnap,dy:this.gy*Manager.gridsnap,scalex:1,scaley:1,fliph:false,flipv:false,camera:this.camera,alpha:1});
			},
			
			kill:function() { Despawn(this); }
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
		index = entityList.indexOf(obj);
		if (obj >= 0) { entityList.splice(index, 1); }
		
		index = fodderList.indexOf(obj);
		if (obj >= 0) { fodderList.splice(index, 1); }
		
		index = turretList.indexOf(obj);
		if (obj >= 0) { turretList.splice(index, 1); }
		
		index = shellList.indexOf(obj);
		if (obj >= 0) { shellList.splice(index, 1); }
	},
};