document.addEventListener("DOMContentLoaded", function() {
		document.getElementById("submit").onclick=function(event) {
			
			if (document.getElementById('player1_name').value=="Guest") {
				if(!confirm("If you want your results to be stored sign in or sign up!"))
				return;
			} 
			if(document.getElementById('player2_name').checked==true)
				document.getElementById('player2_name').value="Computer";
			var connect4=new Connect4('#connect4', document.getElementById('rows').value, document.getElementById('columns').value, 
										document.getElementById('player1_name').value, document.getElementById('player2_name').value,
										document.getElementById('firstToStart').value, document.getElementById('level').value);

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
			document.getElementById('turn').innerHTML='';
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
		const url = "http://twserver.alunos.dcc.fc.up.pt:8008/register";
		var data = JSON.stringify({"nick":document.getElementById('login').value, "pass":document.getElementById('pass').value});
		postData(url,data);
		off();
		event.preventDefault();
	}
	
	function signUp() {
		let login=document.getElementById('login').value;
		let pass=document.getElementById('pass').value;
		off();
		console.log(login, pass);
		const url = "http://twserver.alunos.dcc.fc.up.pt:8008/register";
		var data = JSON.stringify({"nick":login, "pass":pass});
		console.log(data);
		postData(url, data);
	}
	
	function postData(url, data) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.send(data);
		xhr.onreadystatechange=function() {
			if(xhr.readyState===4){
				if(xhr.status==200)
					auth(xhr.responseText);	
				if(xhr.status==400)
					auth(null);
			}
		}
	}
	
	function auth(response) {
		var res=JSON.parse(response);
		if(res==null){
			alert("Bad login or password!");
			return;
		}
		if(Object.keys(res).length === 0 && res.constructor === Object){
			document.getElementById('player1_name').value=document.getElementById('login').value;
			document.getElementById('player1_name').readOnly=true;
		}
	}
	function showResults(){
		document.getElementById("ratingsList").innerHTML='';
		var temp='';
		var i=0;
		for(var key in sessionStorage) {
			if(i<sessionStorage.length) {	
				i++;
				temp='<br>'+i+'. '+key+' '+sessionStorage[key]+'';
				document.getElementById("ratingsList").innerHTML+=temp;
				}
				else {
					break;
				}
			}
			event.preventDefault(); 
	}
	
	

	
	
	
	