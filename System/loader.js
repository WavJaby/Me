var scripts = [
	'System/window.js',
	'System/notification.js',
	'System/fileSystem.js',
	'aboutWindow.js',
	'terminal.js'
];

if (ieVersion === null)
	console.log('not IE 🎉');
else 
	console.log('IE version: ' + ieVersion);

if (ieVersion === null || ieVersion > 10) {
	var mainScript = document.createElement('script');
	mainScript.src = 'System/main.js';
	
	// window.onload = loadMainScript;
	
	var loadCount = 0;
	for (var i = 0; i < scripts.length; i++) {
		var script = document.createElement('script');
		script.onload = loadMainScript;
		script.src = scripts[i];
		document.head.appendChild(script);
	}
	
	function loadMainScript() {
		// console.log(loadCount);
		if (++loadCount === scripts.length)
			document.head.appendChild(mainScript);	
	}
} else {
	loadIEScript();
}