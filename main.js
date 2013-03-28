

//9 array for all variables
var g;
//winning positions
var pos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];
//score
var countLost = 0;
var countTies = 0;
//onload
document.addEventListener('DOMContentLoaded', function(){
    initBoard();
});

//create board
function initBoard(){

    g = [0,0,0,0,0,0,0,0,0];

    for (var i = 0; i < 9; i++){
        var t = document.createElement('div');
        t.setAttribute("id", "t" + i);
        t.onclick = clickTic;
        document.getElementById("board").appendChild(t);

        if (i == 2 || i == 5){
            var b = document.createElement('br');
            document.getElementById("board").appendChild(b);
        }
    }

}

//handle click on empty square
function clickTic(e){
    var t = e.target;
    if (t.className.match("x")!=null || t.className.match("o")!=null)
        return;

    t.className += "x";

    var i = parseInt(t.id.substring(1));

    g[i] = 1;

    if (checkWin()==1){
        return;
    }else{
        response();
        checkWin();
    }
};

//computer intelligence figures best response
function response(){
    var p;

    function claim(o){
        g[o] = 2;
        document.getElementById("t"+o).className+="o";
        return;
    }

    for (var w=0; w<pos.length;w++){
        p = pos[w];
        var countX =0;
        var countO =0;
        var blankO = -1;
        for (var c = 0; c < 3; c++){
            if (g[p[c]] == 1) countX++;
            if (g[p[c]] == 2) countO++;
            if (g[p[c]] == 0) blankO = c;
        }

        //1 ensure win when pc has 2 in a row and blank
        if (countO==2 && blankO > -1){
            claim(p[blankO]);
            return;
        }

    }

    for (var w=0; w<pos.length;w++){
        p = pos[w];
        var countX =0;
        var countO =0;
        var blankO = -1;
        for (var c = 0; c < 3; c++){
            if (g[p[c]] == 1) countX++;
            if (g[p[c]] == 2) countO++;
            if (g[p[c]] == 0) blankO = c;
        }

        //2 avert sure loss when user has 2 in a row and blank
         if (countX==2 && blankO > -1){
             claim(p[blankO]);
            return;
        }

    }

    //3 claim optimal middle if open
    if (g[4] == 0){
        claim(4);
        return;
    }
	
	//avert diagonal xox => claim edge, not corner
	if(g.toString()==[0, 0, 1, 0, 2, 0, 1, 0, 0].toString()){
	    claim(7);
        return;
    }
	if(g.toString()==[1, 0, 0, 0, 2, 0, 0, 0, 1].toString()){
        claim(5);
        return;
    }
	//avoid corner trap
	if(g.toString()==[1, 0, 0, 0, 2, 0, 0, 1, 0].toString()){
	    claim(6);
        return;
    }
	
	
	 for (var w=0; w<pos.length;w++){
        p = pos[w];
        var countX =0;
        var countO =0;
        var blankO = -1;
        for (var c = 0; c < 3; c++){
            if (g[p[c]] == 1) countX++;
            if (g[p[c]] == 2) countO++;
            if (g[p[c]] == 0) blankO = c;
        }

        //4 avert user 2 in row when 1 in row and 2 blank by placing O in a corner
		if (countX==1 && countO==0 && blankO > -1){
            
			
			if (p[blankO]==0 && g[0] == 0){
				claim(0);
				return;
			}
			if (p[blankO]==2 && g[2] == 0){
				claim(2);
				return;
			}
			if (p[blankO]==6 && g[6] == 0){
				claim(6);
				return;
			}
			if (p[blankO]==8 && g[8] == 0){
				claim(8);
				return;
			}
			
        }
    }
	
	
	

	
    for (var w=0; w<pos.length;w++){
        p = pos[w];
        var countX =0;
        var countO =0;
        var blankO = -1;
        for (var c = 0; c < 3; c++){
            if (g[p[c]] == 1) countX++;
            if (g[p[c]] == 2) countO++;
            if (g[p[c]] == 0) blankO = c;
        }

        //5 support yourself to 2 in a row when 1 in row and 2 blank
         if (countO==1 && countX==0 && blankO > -1){
		 
             claim(p[blankO]);
            return;
        }

    }


    for (var w=0; w<pos.length;w++){
        p = pos[w];
        var countX =0;
        var countO =0;
        var blankO = -1;
        for (var c = 0; c < 3; c++){
            if (g[p[c]] == 1) countX++;
            if (g[p[c]] == 2) countO++;
            if (g[p[c]] == 0) blankO = c;
        }

        //6 avert user 2 in row when 1 in row and blank
     if (countX==1 && blankO > -1){
            claim(p[blankO]);
            return;
        }
    }

    //all taken
    countTies++;
    resetBoard()

}

function checkWin(){
    var p;
    for (var w=0; w<pos.length;w++){
        p = pos[w];

        if ( g[p[0]] == g[p[1]] && g[p[0]] == g[p[2]] && g[p[0]] > 0){

            for (var i=0;i<3;i++)
                document.getElementById("t"+p[i]).className+=" win";

            if (g[p[0]] == 1) {
                alert("You actually won!")
            }
            if (g[p[0]] == 2) {
                countLost++;
            }

            resetBoard();
            return 1;
        }
    }
}

function resetBoard(){
	g = [0,0,0,0,0,0,0,0,0];
	document.getElementById('score-o').innerText = countLost;
	document.getElementById('score-g').innerText = countTies;
	
    setTimeout(function(){
        for (var i = 0; i < 9; i++)
            document.getElementById("t" + i).className = "";
		
		g = [0,0,0,0,0,0,0,0,0];
    }, 500);
}