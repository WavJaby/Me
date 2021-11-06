function About() {
	// 初始化視窗
	const win = new Window();
	win.setTitle('關於');
	win.setSize(false, 600, 600);
	win.setLocation(document.body.offsetWidth / 2 - 300, 50);
	this.setIcon = win.setIcon;
	
	const body = document.createElement('div');
	body.classList.add('about');
	win.addBody(body);
	
	body.style.width = '100%';
	body.style.height = '100%';
	body.style.color = 'whitesmoke';
	body.style['font-size'] = '20px';
	body.innerText = 'Hello World';
	
	
	
	// this.loadPlugin = function(plugin) {
		
	// }
}