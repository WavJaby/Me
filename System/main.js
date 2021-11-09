'use strict';

const storage = getStorage();
const fileSystem = new FileSystem();
const menuBar = new MenuBar();
const notification = new Notification();
out('準備檔案系統...');
fileSystem.init(desktopLoad);

function desktopLoad() {
	timer('花費: ');
	out('準備桌面...');
//##############################視窗##############################
	winManager.init();
//##############################通知##############################
	notification.init();
//##############################列表##############################
	const homeMenu = document.createElement('div');
	homeMenu.classList.add('homeMenu');
	const homeButton = document.createElement('div');
	homeButton.classList.add('homeButton');
	homeButton.classList.add('fade');
	homeMenu.appendChild(homeButton);

	const programList = new DropDownList(homeMenu);
	
	function createListItem(text, onclick) {
		const button = document.createElement('div');
		button.classList.add('item');
		button.classList.add('fade');
		button.innerText = text;
		button.onclick = onclick;
		return button;
	}
	
	
	const programs = fileSystem.cd('System/Programs');
	// 終端機
	const terminalBtn = createListItem('終端機', function() {
		programs.open('Terminal.app', function(app) {app.open();});
		programList.close();
	});
	programList.addItem(terminalBtn);
	
	// webRTC
	const webRtcBtn = createListItem('Web RTC', function() {
		programs.open('WebRTC.app', function(app) {app.open();});
		programList.close();
	});
	programList.addItem(webRtcBtn);

	homeButton.onclick = programList.toggle;
	menuBar.addEle(homeMenu);
	menuBar.init();


//##############################初始化##############################
	programs.open('Terminal.app', function(app) {
		app.setSize(true);
		app.open();
		programs.open('About.app');
	});


	// 歡迎訊息
	if (storage.getItem('joinBefore') === null) {
		notification.sendNotification('歡迎光臨', '(。・ω・。)');
		storage.setItem('joinBefore', '0');
	} else {
		notification.sendNotification('歡迎回來', 'ヽ(✿ﾟ▽ﾟ)ノ');
	}
}

//##############################其他東西##############################
function DropDownList(target) {
	const dropDownList = document.createElement('div');
	dropDownList.classList.add('dropdownlist');
	const slider = document.createElement('slider');
	slider.classList.add('slider');
	dropDownList.appendChild(slider);
	target.appendChild(dropDownList);
	
	let open = false;
	
	this.toggle = function() {
		open = !open;
		if (open) {
			dropDownList.style.height = slider.offsetHeight + 'px';
			dropDownList.style.width = slider.offsetWidth + 'px';
			slider.classList.add('open');
		} else
			slider.classList.remove('open');
	}
	
	this.close = function() {
		open = false;
		slider.classList.remove('open');
	}
	
	this.addItem = function(item) {
		slider.appendChild(item);
	}
}

function MenuBar() {
	const menuBar = document.createElement('div');
	
	this.init = function() {
		menuBar.classList.add('menuBar');
		menuBar.classList.add('cantSelect');
		document.body.appendChild(menuBar);
	}
	
	this.addEle = function(item) {
		menuBar.appendChild(item);
	}
	
	this.addItem = function(item) {
		item.classList.add('item');
		item.classList.add('fade');
		menuBar.appendChild(item);
	}
	
	this.removeItem = function(item) {
		menuBar.removeChild(item);
	}
	
	this.getHeight = function() {
		return menuBar.offsetHeight;
	}
}







