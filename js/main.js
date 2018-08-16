document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {
  
  	play: document.getElementById('play'),
  	pause: document.getElementById('pause'),
  	reset: document.getElementById('reset'),
  	setDiv: document.getElementById('setDiv'),
  	chronoDiv: document.getElementById('chronoDiv'),
  	setsValue: document.getElementById('setsValue'),
  	workValue: document.getElementById('workValue'),
  	workFinish: 0,
  	restValue: document.getElementById('restValue'),
  	positionNavigator: 0,
  	state: 1, // 1 -> config, 2 -> chrono
  	stateChrono: 1,  // 1 -> rest, 2 -> work
  	cycle: document.getElementById('cycle'),
  	timeRest: document.getElementById('timeRest'),
  	textChrono: document.getElementById('textChrono'),
  	interval: null,
  	intervalButton: null,
  	audio: new Audio(),

  	playSound: function(srcSound){
		app.audio.src = "./sound/" + srcSound + ".ogg";
		app.audio.play();
  	},
  
  	init: function() {
    	document.getElementById("setsLess").focus();
    	document.addEventListener('keydown', app.manejarTeclado);

    	app.play.addEventListener('click', app.initChrono);
    	app.reset.addEventListener('click', app.resetChrono);
    	app.pause.addEventListener('click', app.pauseChrono);

    	let classnameLess = document.getElementsByClassName('lessBtn');
    	for (var i = 0; i < classnameLess.length; i++) {
    		classnameLess[i].addEventListener('click', app.lessValue);
    		classnameLess[i].addEventListener('mousedown', app.lessValueCont);
    		classnameLess[i].addEventListener('mouseup', app.lessValueContEnd);
		}

    	let classnameMore = document.getElementsByClassName('moreBtn');
    	for (var i = 0; i < classnameMore.length; i++) {
    		classnameMore[i].addEventListener('click', app.moreValue);
    		classnameMore[i].addEventListener('mousedown', app.moreValueCont);
    		classnameMore[i].addEventListener('mouseup', app.moreValueContEnd);
		}

	    if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
    	}
  	},

	initChrono: function() {
		setDiv.classList.add("hide");
		chronoDiv.classList.remove("hide");
		app.state = 2;
		app.positionNavigator = 0;
		/* TODO refactorizar */
		document.getElementsByClassName('nv-select')[0].classList.remove('nv-select');
		document.getElementsByClassName('navigatorChrono')[0].classList.add('nv-select');
		/* TODO refactorizar */
		cycle.innerText = (app.workFinish + 1) + "/" + app.setsValue.innerText;
		timeRest.innerText = app.restValue.innerText;
		document.getElementById('principalDiv').classList.add('rest');

		//init clock		
		app.textChrono.innerText = "Rest"; /* TODO refactorizar */
		/* TODO refactorizar */
		document.getElementsByTagName("html")[0].classList.add('rest');
		document.getElementsByClassName("jumbotron")[0].classList.add('rest');
		/* TODO refactorizar */
		let restTime = app.restValue.innerText;		
		app.interval = setInterval(function() {			
  			if (restTime === 0) {
  				if (app.stateChrono === 1) {  			
					restTime = app.workValue.innerText;
					app.stateChrono = 2;
					app.textChrono.innerText = "Work"; /* TODO refactorizar */
					/* TODO refactorizar */
					document.getElementsByTagName("html")[0].classList.remove('rest');
					document.getElementsByClassName("jumbotron")[0].classList.remove('rest');
					document.getElementsByTagName("html")[0].classList.add('work');
					document.getElementsByClassName("jumbotron")[0].classList.add('work');
					/* TODO refactorizar */
  					app.playSound('alert');
  				} else {
  					restTime = app.restValue.innerText;
  					app.stateChrono = 1;
  					app.textChrono.innerText = "Rest"; /* TODO refactorizar */
  					app.workFinish += 1;  							
  					if (app.workFinish >= app.setsValue.innerText){
  						clearInterval(app.interval);
  						app.playSound('gong');
						app.textChrono.innerText = "Finish !!!"; /* TODO refactorizar */
						clearInterval(app.interval);
						restTime = 0;
    					setTimeout(function () {
							app.showConfig();
    					}, 10000);
  					} else {
	  					cycle.innerText = (app.workFinish + 1) + "/" + app.setsValue.innerText;
	  					/* TODO refactorizar */
	  					document.getElementsByTagName("html")[0].classList.remove('work');
	  					document.getElementsByClassName("jumbotron")[0].classList.remove('work');
	  					document.getElementsByTagName("html")[0].classList.add('rest');
	  					document.getElementsByClassName("jumbotron")[0].classList.add('rest');
	  					/* TODO refactorizar */
	  					app.playSound('gong2');
					}
  				}
  			} else {
				restTime -=1;
			}

  			timeRest.innerText = restTime;
  			if (restTime === 3) { 
  				app.playSound('end');
  			}
		}, 1000);
	},

	resetChrono: function() {
		if ( (app.workFinish >= app.setsValue.innerText) || confirm('¿Reset chrono?')) { //TODO no preguntar
			clearInterval(app.interval);
			app.workFinish = 0;
			app.showConfig();
		}
		
	},

	showConfig: function() {
		 /* TODO refactorizar */
		document.getElementsByTagName("html")[0].classList.remove('work');
		document.getElementsByClassName("jumbotron")[0].classList.remove('work');
		document.getElementsByTagName("html")[0].classList.remove('rest');
		document.getElementsByClassName("jumbotron")[0].classList.remove('rest');
		 /* TODO refactorizar */
		app.setDiv.classList.remove("hide");
		app.chronoDiv.classList.add("hide");
		app.state = 1;
		app.positionNavigator = 0;
		app.workFinish = 0;
		 /* TODO refactorizar */
		document.getElementsByClassName('nv-select')[0].classList.remove('nv-select');
		document.getElementsByClassName('navigatorConfig')[0].classList.add('nv-select');
		 /* TODO refactorizar */
	},

	pauseChrono: function() {
		alert('Pause');
	},

	lessValue: function(type) {
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		switch(type) {
    		case 'sets':
				app.setsValue.innerText -= 1;
				if (app.setsValue.innerText < 1) {
					app.setsValue.innerText = 1;
				}
  				break;
  			case 'work':
				app.workValue.innerText -= 5;
				if (app.workValue.innerText < 5) {
					app.workValue.innerText = 5;
				}
  				break;
			case 'rest':
				app.restValue.innerText -= 5;
				if (app.restValue.innerText < 5) {
					app.restValue.innerText = 5;
				}
  				break;
		}
	},

	lessValueCont: function(type) {		
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		app.intervalButton = setInterval( function() {
			switch(type) {
	    		case 'sets':
					app.setsValue.innerText -= 1;
					if (app.setsValue.innerText < 1) {
						app.setsValue.innerText = 1;
					}
	  				break;
	  			case 'work':
					app.workValue.innerText -= 5;
					if (app.workValue.innerText < 5) {
						app.workValue.innerText = 5;
					}
	  				break;
				case 'rest':
					app.restValue.innerText -= 5;
					if (app.restValue.innerText < 5) {
						app.restValue.innerText = 5;
					}
	  				break;
			}
		}, 500);
	},

	lessValueContEnd: function() {
		clearInterval(app.intervalButton);
	}

	moreValue: function(type) {
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		switch(type) {
    		case 'sets':
				if (parseInt(app.setsValue.innerText) < 30) {
					app.setsValue.innerText = parseInt(app.setsValue.innerText) + 1;
					if (parseInt(app.setsValue.innerText) < 1) {
						app.setsValue.innerText = 1;
					}
				}
  				break;
  			case 'work':
				if (parseInt(app.workValue.innerText) < 300) {
					if (parseInt(app.workValue.innerText) < 60) {
						app.workValue.innerText = parseInt(app.workValue.innerText) + 5;
					} else if (parseInt(app.workValue.innerText) < 120) {
						app.workValue.innerText = parseInt(app.workValue.innerText) + 10;
					} else if (parseInt(app.workValue.innerText) < 180) {
						app.workValue.innerText = parseInt(app.workValue.innerText) + 15;
					} else if (parseInt(app.workValue.innerText) < 300) {
						app.workValue.innerText = parseInt(app.workValue.innerText) + 30;
					}
					if (parseInt(app.workValue.innerText) < 5) {
						app.workValue.innerText = 5;
					}
				}
				break;
			case 'rest':
				if (parseInt(app.restValue.innerText) < 120) {
					if (parseInt(app.restValue.innerText) < 60) {
						app.restValue.innerText = parseInt(app.restValue.innerText) + 5;
					} else if (parseInt(app.restValue.innerText) < 120) {
						app.restValue.innerText = parseInt(app.restValue.innerText) + 10;
					}
					if (parseInt(app.restValue.innerText) < 5) {
						app.restValue.innerText = 5;
					}
				}
				break;
		}
	},


	moreValueCont: function(type) {		
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		app.intervalButton = setInterval( function() {
			switch(type) {
				case 'sets':
					if (parseInt(app.setsValue.innerText) < 30) {
						app.setsValue.innerText = parseInt(app.setsValue.innerText) + 1;
						if (parseInt(app.setsValue.innerText) < 1) {
							app.setsValue.innerText = 1;
						}
					}
						break;
					case 'work':
					if (parseInt(app.workValue.innerText) < 300) {
						if (parseInt(app.workValue.innerText) < 60) {
							app.workValue.innerText = parseInt(app.workValue.innerText) + 5;
						} else if (parseInt(app.workValue.innerText) < 120) {
							app.workValue.innerText = parseInt(app.workValue.innerText) + 10;
						} else if (parseInt(app.workValue.innerText) < 180) {
							app.workValue.innerText = parseInt(app.workValue.innerText) + 15;
						} else if (parseInt(app.workValue.innerText) < 300) {
							app.workValue.innerText = parseInt(app.workValue.innerText) + 30;
						}
						if (parseInt(app.workValue.innerText) < 5) {
							app.workValue.innerText = 5;
						}
					}
					break;
				case 'rest':
					if (parseInt(app.restValue.innerText) < 120) {
						if (parseInt(app.restValue.innerText) < 60) {
							app.restValue.innerText = parseInt(app.restValue.innerText) + 5;
						} else if (parseInt(app.restValue.innerText) < 120) {
							app.restValue.innerText = parseInt(app.restValue.innerText) + 10;
						}
						if (parseInt(app.restValue.innerText) < 5) {
							app.restValue.innerText = 5;
						}
					}
					break;
			}
		}, 500);
	},

	moreValueContEnd: function(type) {
		clearInterval(app.intervalButton);
	}

  	manejarTeclado: function(e) {

	    if (e.key === "Enter") {
    		switch(document.getElementsByClassName('nv-select')[0].id) {
	    		case 'play':
					app.initChrono();      
      				break;
      			case 'reset':
					app.resetChrono();
      				break;
      			case 'pause':
					app.pauseChrono();
      				break;
  				case 'setsLess':
					app.lessValue('sets');
      				break;
  				case 'workLess':
					app.lessValue('work');
      				break;
  				case 'restLess':
					app.lessValue('rest');
      				break;			
  				case 'setsMore':
					app.moreValue('sets');
      				break;
  				case 'workMore':
					app.moreValue('work');
      				break;
  				case 'restMore':
					app.moreValue('rest');
      				break;
  			}
	    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      app.changeFocus(1);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      app.changeFocus(-1);
    }

  },

  changeFocus: function(changePosicion) {
  	let navigator = document.getElementsByClassName('navigatorConfig');
  	if (app.state === 2) {  		
		navigator = document.getElementsByClassName('navigatorChrono');
  	}
	navigator[app.positionNavigator].classList.remove('nv-select');
	app.positionNavigator += changePosicion;
	if(navigator[app.positionNavigator] === undefined) {
		app.positionNavigator = 0;
	}
	navigator[app.positionNavigator].classList.add('nv-select');
  }  
};
