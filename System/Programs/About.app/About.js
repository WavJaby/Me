function About(win, res) {
	// 初始化視窗
	win.setTitle('關於');
	win.setSize(false, 600, 600);
	win.setLocation(document.body.offsetWidth / 2 - 300, 50);
	this.setIcon = win.setIcon;
	
	const body = win.body;
	body.classList.add('aboutWindow');
	
	win.open();
	win.setCanResize(false);
	
	const toSource = document.createElement('a');
	toSource.href = 'https://github.com/WavJaby/Me';
	toSource.target = '_blank';
	toSource.classList.add('sourceLink');
	const toSourceIcon = res['githubIcon.svg'];
	toSourceIcon.classList.add('sourceIcon');
	body.appendChild(toSourceIcon);
	body.appendChild(toSource);
	
	
	
	// this.loadPlugin = function(plugin) {
		
	// }
}