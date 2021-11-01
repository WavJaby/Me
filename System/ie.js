if (String.prototype.startsWith === undefined) {
	console.log('no startsWith');
	String.prototype.startsWith = function(input) {
		for (var i = 0; i < input.length; i++) {
			if (this.charAt(i) !== input.charAt(i))
				return false;
		}
		return true;
	}
	
	String.prototype.delete = function(input) {
		this.replace(new RegExp(input,'gi'), '');
	}
}

if (typeof requestAnimationFrame === 'undefined') {
	console.log('no requestAnimationFrame');
	var delay = 1000/60;
	var callBacks = [];
	var idleCount = 0;
	var interval = null;
	
	window.requestAnimationFrame = function(callBack) {
		if (callBack.animationFrameID === undefined) {
			callBack.animationFrameID = callBacks.length;
			callBack.animationStart = true;
			callBacks[callBack.animationFrameID] = callBack;
			start();
		} else {
			callBack.animationStart = true;
			callBacks[callBack.animationFrameID] = callBack;
		}
	}
	
	function start() {
		if (interval !== null) return;
		interval = setInterval(function() {
			for (var i = 0; i < callBacks.length; i++)
				if (callBacks[i].animationStart) {
					callBacks[i].animationStart = false;
					callBacks[i]();
					idleCount = 0;
				}
			if (idleCount > 100) {
				for (var i = 0; i < callBacks.length; i++)
					callBacks[i].animationFrameID = undefined;
				callBacks.length = 0;
				clearInterval(interval);
				interval = null;
			}
			idleCount++;
		}, delay);
	}
}

// 給IE11以下的加載器
function addScript(url, onload) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			onload(request.responseText);
		}
	}
	request.send();
}

function loadIEScript() {
	var loadCount = 0;
	var mainScript = document.createElement('script');
	addScript('System/main.js', function(text) {
		mainScript.textContent = toES5(text);
		loadMainScript();
	});
	
	for (var i = 0; i < scripts.length; i++) {
		addScript(scripts[i], function(text) {
			var script = document.createElement('script');
			script.textContent = toES5(text);
			document.head.appendChild(script);
			loadMainScript();
		});
	}
	
	window.onload = loadMainScript;
	
	function loadMainScript() {
		if (++loadCount === scripts.length + 2)
			document.head.appendChild(mainScript);	
	}
}

function toES5(input) {
	return input
		.replace(/const /g, 'var ')
		.replace(/let /g, 'var ')
		.replace(/.classList.add\('/g, '.className+=(\' ')
		.replace(/.classList.remove/g, '.className.delete')
	;
}


