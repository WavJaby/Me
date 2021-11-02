var scripts = [
	'System/window.js',
	'System/notification.js',
	'System/fileSystem.js',
	'System/main.js',
	'aboutWindow.js',
	'terminal.js'
];

if (ieVersion === null)
	console.log('not IE 🎉');
else 
	console.log('IE version: ' + ieVersion);

function loadScript(url, onload) {
	if (ieVersion === null || ieVersion > 10) {
		var script = document.createElement('script');
		script.onload = onload;
		script.src = url;
		document.head.appendChild(script);
	} else 
		loadScriptIE(url, onload);
}

function loadCSS(url, onload) {
	var link = document.createElement('link'); 
	link.rel = 'stylesheet'; 
	link.type = 'text/css';
	link.href = url; 
	link.onload = onload;
	document.head.appendChild(link);
}

window.onload = function() {
	console.log('loading script...');
	console.time('loaded in');
	if (ieVersion === null || ieVersion > 10) {
		var loadCount = 0;
		for (var i = 0; i < scripts.length; i++) {
			loadScript(scripts[i], loadMainScript);
		}
		
		function loadMainScript() {
			if (++loadCount === scripts.length) {
				onPageLoad();
				console.timeEnd('loaded in');
			}
		}
	} else {
		loadScriptsForIE();
	}
}