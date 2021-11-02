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
		this.replace(new RegExp(input, 'gi'), '');
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
function loadScriptIE(url, onload) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			var script = document.createElement('script');
			script.textContent = toES5(request.responseText);
			script.onload = onload;
			document.head.appendChild(script);
		}
	}
	request.send();
}

function addScript(url, onload) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
			onload(request.responseText);
	}
	request.send();
}

function loadScriptsForIE() {
	var loadCount = 0;
	var mainScript = document.createElement('script');
	addScript('System/main.js', function(text) {
		mainScript.textContent = toES5(text);
		loadMainScript();
	});
	mainScript.onload = function() {
		onPageLoad();
		console.timeEnd('loaded in');
	};
	
	for (var i = 0; i < scripts.length; i++) {
		if (scripts[i] === 'System/main.js') continue;
		addScript(scripts[i], function(text) {
			var script = document.createElement('script');
			script.textContent = toES5(text);
			document.head.appendChild(script);
			loadMainScript();
		});
	}
	
	function loadMainScript() {
		if (++loadCount === scripts.length) {
			document.head.appendChild(mainScript);
		}
	}
}

function toES5(input) {
	input = input
		.replace(/const /g, 'var ')
		.replace(/let /g, 'var ')
		.replace(/.classList.add\('/g, '.className+=(\' ')
	;
	var regex = /(.*)\.classList\.remove\( *'([\d\w]+)' *\)/g;
	var find;
	while((find = regex.exec(input)) != null) {
		input = input.replace(
			new RegExp(find[1].replace('[', '\\[').replace(']', '\\]') + '\\.classList\\.remove\\( *\'' + find[2] + '\' *\\)'), 
			find[1] + '.className=' + find[1] + '.className.replace(/' + find[2] + '/g,\'\'\)'
		);
	}
	
	return input;
}


