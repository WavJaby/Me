function About(win, res) {
	const body = document.createElement('div');
	body.classList.add('dashboardWindow');
	body.classList.add('padding');
	
	const blockImageHeight = 300;
	const blockMinWidth = 250;
	
	function Row() {
		const row = document.createElement('div');
		row.classList.add('row');
		body.appendChild(row);
		this.classList = row.classList;
		this.blockCount = 0;
		this.addBlock = function(titleText, text, time, image, onclick) {
			const block = document.createElement('div');
			block.classList.add('padding');
			block.classList.add('block');
			const imageBox = document.createElement('div');
			imageBox.classList.add('image');
			const img = image.cloneNode();
			const title = document.createElement('div');
			title.classList.add('title');
			const description = document.createElement('div');
			description.classList.add('description');
			const timestamp = document.createElement('div');
			timestamp.classList.add('time');
			
			block.onclick = onclick;
			title.innerText = titleText;
			description.innerText = text;
			timestamp.innerText = time;
			imageBox.appendChild(img);
			block.appendChild(imageBox);
			block.appendChild(title);
			block.appendChild(description);
			block.appendChild(timestamp);
			row.appendChild(block);
			this.blockCount++;
		}
        
        this.addEmpty = function() {
			const block = document.createElement('div');
            block.classList.add('empty');
			row.appendChild(block);
			this.blockCount++;
        }
	}
	
	const viewer = fileSystem.cd('System/Programs').getProgram('PDFViewer');
	const row1 = new Row();
	row1.addBlock(
		'康威生命遊戲 Conway\'s GameOfLife',
		'康威生命遊戲是由英國數學家 John Horton Conway 約翰·何頓·康威 在1970年所發明的。\r\n\
		遊戲規則僅四條，卻能夠模擬生命的種種姿態，玩家就像上帝般，在無窮大的土地上創造生命，並靜靜地觀察它們誕生、死亡，周而復始。',
		'2021/4',
		res['GameOfLife.png'],
		function() {
			viewer.open(function(app) {app.open('康威生命遊戲 Conway\'s Game of Life.pdf');});
		}
	);
	row1.addBlock(
		'YouTube Downloader library for Java',
		'解釋YouTube下載器原理，以及如何製作。\r\n使用Java製作下載器的Library。',
		'2020/5~2021/8',
		res['YouTubeDownloader.png'],
		function() {
			viewer.open(function(app) {app.open('YouTube下載器.pdf');});
		}
	);
	row1.addBlock(
		'JsonObject parser library for Java',
		'製作了解析速度比org.Json快2倍以上的Json Parser，且程式碼僅有18KB，適合讀取大型檔案、小型專案或測試使用。\r\n\
		為本身開發的Youtube Downloader、Discord bot API、KeyBase bot API主要工具。',
		'2021/5',
		res['JsonParser.png'],
		function() {
			window.open('https://github.com/WavJaby/TinyJson', '_blank').focus();
		}
	);
	
	const row2 = new Row();
	row2.addBlock(
		'Disease Map 傳染病分布查詢系統(已停止更新)',
		'使用Java以及Google Map API來製作應用程式，並製作自動抓取器來取得每日縣市疫情資訊。\r\n\
		可以將各縣市疫情資料顯示於地圖上，供使用者查看，也可以查看歷史資料等',
		'2020/3 ~ 2020/5',
		res['DiseaseMap.png'],
		function() {
			window.open('https://github.com/WavJaby/DiseaseMap', '_blank').focus();
		}
	);
    
    row2.addEmpty();
    row2.addEmpty();
	
	
	win.setOnSizeChange(function(width, height) {
		if (width < row1.blockCount * (blockMinWidth + 20) + 100)
			row1.classList.remove('table');
		else 
			row1.classList.add('table');
		if (width < row2.blockCount * (blockMinWidth + 20) + 100)
			row2.classList.remove('table');
		else 
			row2.classList.add('table');
	});
	
	win.addBody(body);
	win.setMinSize(400, 300);
	win.setTitle('我的專案');
	win.setSize(true);
	win.open();
}