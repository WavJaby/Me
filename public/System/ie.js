function loadScriptsForIE() {
	var loadCount = 0;
	var mainScript = document.createElement('script');
	getText('System/main.js', function(text) {
		mainScript.textContent = toES5(text);
		loadMainScript();
	});
	mainScript.onload = function() {
		timer('花費: ');
	};
	
	for (var i = 0; i < scripts.length; i++) {
		if (scripts[i] === 'System/main.js') continue;
		getText(scripts[i], function(text) {
			var script = document.createElement('script');
			script.textContent = toES5(text);
			document.head.appendChild(script);
			loadMainScript();
		});
	}
	
	function loadMainScript() {
		if (loadCount++ < scripts.length) return;
		document.head.appendChild(mainScript);
	}
}
function isIE10() {return ieVersion !== null && ieVersion < 11};

