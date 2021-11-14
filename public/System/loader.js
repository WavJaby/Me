var scripts = [
	'System/window.js',
	'System/notification.js',
	'System/fileSystem.js',
];

function loadScript(url, onload) {
	if (ieVersion === null || ieVersion > 10) {
		var script = document.createElement('script');
		script.onload = onload;
		script.src = url;
		document.head.appendChild(script);
	} else 
		loadScriptIE(url, onload);
}

function getText(url, onload) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function () {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
			onload(request.responseText);
	}
	request.send();
}

function getData(url, onload) {
	if (ieVersion === null || ieVersion > 10)
		getText(url, onload);
	else {
		var request = new XDomainRequest();
		request.onload = out;
		request.open('GET', url.replace('https', 'http'));
	}
}

function loadCSS(url, onload) {
	var css = document.createElement('link'); 
	css.rel = 'stylesheet'; 
	css.type = 'text/css';
	css.href = url; 
	css.onload = onload;
	document.head.appendChild(css);
}

window.onload = function() {
	timer('花費: ');
	out('## 開始讀取系統...');
	if (ieVersion === null || ieVersion > 10) {
		var loadCount = 0;
		for (var i = 0; i < scripts.length; i++) {
			loadScript(scripts[i], loadMainScript);
		}
		
		function loadMainScript() {
			if (++loadCount === scripts.length)
				loadScript('System/main.js', loadMainScript);
			else if (loadCount > scripts.length)
				timer('花費: ');
		}
	} else {
		loadScriptsForIE();
	}
}