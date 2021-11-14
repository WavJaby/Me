function About(win, res) {
	// 初始化視窗
	win.setTitle('PDF檢視器');
	win.setSize(false, 800, 800);
	
	this.open = function(name) {
		const embed = document.createElement('iframe');
		embed.src = 'System/Programs/PDFViewer.app/' + name;
		if (ieVersion !== null)
			embed.style.pointerEvents = 'none';
		// const embed = document.createElement('object');
		// embed.data = 'System/Programs/PDFViewer.app/' + name;
		// embed.type = 'application/pdf';
		
		win.addBody(embed);
		
		win.setOnSizeChange(function(width, height) {
			embed.width = width;
			embed.height = height;
		});
		
		// this.loadPlugin = function(plugin) {
			
		// }
		win.open();
	}
}