document.addEventListener("DOMContentLoaded", function() {
		document.getElementById("submit").onclick=function(event) {
			
			if (document.getElementById('player1_name').value=="Guest") {
				console.log(document.getElementById('player1_name').value);
				if(!confirm("If you want your results to be stored sign in or sign up!"))
				return;
			} 
			var connect4=new Connect4('#connect4', document.getElementById('rows').value, document.getElementById('columns').value, 
										document.getElementById('player1_name').value, document.getElementById('player2_name').value,
										document.getElementById('firstToStart').value);

			var btn = document.getElementById('submit');
			if (btn.innerHTML=="Submit") {		
				btn.innerHTML = "Restart";
			}
			else if(btn.innerHTML=="Restart") {
				var myNode=document.getElementById("connect4");
				while(myNode.firstChild){
					myNode.removeChild(myNode.firstChild);
				}
				connect4=new Connect4('#connect4', document.getElementById('rows').value, document.getElementById('columns').value, 
										document.getElementById('player1_name').value, document.getElementById('player2_name').value,
										document.getElementById('firstToStart').value);
			}  
			document.getElementById("turn").style.display="block";
			event.preventDefault();
		}
});

	function on() {
		document.getElementById("overlay").style.display = "block";
	}

	function off() {
		document.getElementById("overlay").style.display = "none";
		
	}
	
	function signIn(){
		var name=document.getElementById('login');
		document.getElementById('player1_name').value=name.value;
		document.getElementById('player1_name').readOnly=true;
		off();
		event.preventDefault();
	}
	
	function showResults(){
		document.getElementById("ratingsList").innerHTML='';
		var temp='';
		var i=0;
		for(var key in localStorage) {
			if(i<=localStorage.length) {	
				console.log(temp);
				document.getElementById("ratingsList").innerHTML+=temp;
				i++;
				temp='<br>'+i+'. '+key+' '+localStorage[key]+'';
				}
				else {
					break;
				}
			}
			event.preventDefault(); 
	}
	
	
	
	