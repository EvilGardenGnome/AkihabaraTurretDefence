var Database = {
	PickLevel: function(thislevel)
	{
		var thismap;
		switch (thislevel)
		{
			case 0: thismap = help.asciiArtToMap([
				"qqwweerrqqwweerrqqwweerrqqwwqqwweerrqqww",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"wweerrqqwweerrqqwweerrqqwweewweerrqqwwee",
				"qqwweerrqqwweerrqqwweerrqqwwqqwweerrqqww",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
				"  ww  qqwweerr                    qqwwee",
				"ee    qqwweerr                    qqwwee",
			],[[null,"  "],[0,"qq"],[1,"ww"],[2,"ee"],[3,"rr"]]);
			break;
			
			case 1: thismap = help.asciiArtToMap([
				"12111111111111111121",
				"1v1111111111111111v1",
				"1v8888888188888888v1",
				"1v8888888188888888v1",
				"1v88   88188    88v1",
				"1v88   88188    88v1",
				"1v88   88188    88v1",
				"1v8888888188888888v1",
				"1v8888888188888888v1",
				"1v1111111111111111v1",
				"1v8888888188888888v1",
				"1v8888888188888888v1",
				"1v88   88188    88v1",
				"1v88   88188    88v1",
				"1v88   88188    88v1",
				"1v88   88188    88v1",
				"1v8888888188888888v1",
				"1v8888888188888888v1",
				"1>>>>>>>>7<<<<<<<<<1",
				"11111111111111111111"
			],
			[[null, ' '],[1, '1'],[2, '2'],[3, '>'],[4, '<'],[5, '^'],[6, 'v'],[7, '7'],[8, '8']]);
			break;
			case 2: thismap = help.asciiArtToMap([
				"12111111111111111121",
				"1v888888888888v<<<<1",
				"1v888888888888v88881",
				"1v88        88v88881",
				"1v88        88v888 1",
				"1v888       88v888 1",
				"1v8888      88v888 1",
				"1>v888      88>v8881",
				"18>v888     888>v881",
				"111>v11111111111>v11",
				"1888>v888     888>v1",
				"1 888>v88      888v1",
				"1 8888v88      888v1",
				"1  888v888     888v1",
				"1   88v888    v<<<<1",
				"1   88>>>7888v<88881",
				"1   88881^88v<888881",
				"1   88881^8v<888   1",
				"1    8881^<<8888   1",
				"11111111111111111111"
			],
			[[null, ' '],[1, '1'],[2, '2'],[3, '>'],[4, '<'],[5, '^'],[6, 'v'],[7, '7'],[8, '8']]);
			break;
			case 3: thismap = help.asciiArtToMap([
				"12111112111121111121",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1v88 88v 11 v88 88v1",
				"1>>>>>>>>>7<<<<<<<<1",
				"18888888811888888881",
				"11111111111111111111"
			],
			[[null, ' '],[1, '1'],[2, '2'],[3, '>'],[4, '<'],[5, '^'],[6, 'v'],[7, '7'],[8, '8']]);
			break;
			case 4: thismap = help.asciiArtToMap([
				"12111111111111111111",
				"1v8v<<<<<<<<<<<<<<<1",
				"1v8v18888881111111^1",
				"1v8v1v<<<<<<<<<<<8^1",
				"1v8v1v8888888888^8^1",
				"1v8v1v8v<<<<<<<8^8^1",
				"1v8v1v8v888888^8^8^1",
				"1v8v1v8v88v<<8^8^8^1",
				"1v8v1v8v88v8^8^8^8^1",
				"1v8v1v8v88v8^8^8^8^1",
				"1v8v1v8v8778^8^8^8^1",
				"1v8v1v8v88^8^8^8^8^1",
				"1v8v1v8>>>^8^8^8^8^1",
				"1v8v1v888888^8^8^8^1",
				"1v8v1>>>>>>>^8^8^8^1",
				"1v8v1888881111^8^8^1",
				"1v8>>>>>>>>>>>^8^8^1",
				"1v88888888888888^8^1",
				"1>>>>>>>>>>>>>>>^8^2",
				"111111111111111111^<"
			],
			[[null, ' '],[1, '1'],[2, '2'],[3, '>'],[4, '<'],[5, '^'],[6, 'v'],[7, '7'],[8, '8']]);
			break;
		}
		//
		return help.finalizeTilemap({
				tileset:"backdrop",
				map: thismap,
			});
	},
	
	GetTurretName: function(theseMerits) {
		if (theseMerits.indexOf(Manager.AllMerits.Attack)>=0 && theseMerits.indexOf(Manager.AllMerits.Defense)>=0)
		{
			return "Shotgun";
		}
		else
		{
			return "Turret";
		}
	},


	pickMap: function(thisid) {
		return maps[thisid].layout;
	},
	
	maps: [
		{
			spawns: [
				{x:5,y:0},
				{x:0,y:5},
			],
			width: 16,
			height: 16,
			layout: [
				"     v       $  ",
				"     v          ",
				"     >>>>>>v    ",
				"           v    ",
				"         $ v    ",
				">>v        v    ",
				"  v        v    ",
				"  v        v    ",
				"  v        v    ",
				"  v $      >>>v ",
				"  v       $   v ",
				"  >>>>>>>v    v ",
				"         v  $ v ",
				"$        v    v ",
				"         >>>>>@ ",
				"                ",
			],
		},
	],
};