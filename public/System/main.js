'use strict';

const dbUrl = 'https://script.google.com/macros/s/AKfycbwgQy6QNPc4CpD4AO4Atqj7we7N5NDBVAQT1w1t0KOLdlfLeVrdFGUs6t50O1Cn_1VE/exec';
getData(dbUrl + '?data=MyWeb&post=connect', out);

const storage = getStorage();
const fileSystem = new FileSystem();
const menuBar = new MenuBar();
const clock = new Clock();
const notification = new Notification();
out('準備檔案系統...');
fileSystem.init(desktopLoad);

function desktopLoad() {
	timer('花費: ');
	out('準備桌面...');
//##############################視窗##############################
	winManager.init();
//##############################時鐘##############################
	clock.init();
//##############################通知##############################
	notification.init();
//##############################列表##############################
	const homeMenu = document.createElement('div');
	homeMenu.classList.add('homeMenu');
	const homeButton = document.createElement('img');
	homeButton.classList.add('homeButton');
	homeButton.classList.add('fade');
	homeButton.src = 'System/Icon/OSIcon.svg';
	homeMenu.appendChild(homeButton);

	const programList = new DropDownList(homeMenu);
	
	function createListItem(text, appName) {
		const button = document.createElement('div');
		const title = document.createElement('div');
		button.classList.add('item');
		button.classList.add('fade');
		
		title.innerText = text;
		const program = programs.getProgram(appName);
		if (program.getIcon(function(icon){
			// 加入Icon
			button.appendChild(icon);
			button.appendChild(title);
		}).code > 0) {
			// 如果沒有Icon
			button.appendChild(title);
		}
		
		button.onclick = function() {
			program.open(function(app) {if(app.open!==undefined)app.open();});
			programList.close();
		};
		programList.addItem(button);
	}
	
	
	const programs = fileSystem.cd('System/Programs');
	// 終端機
	createListItem('終端機', 'Terminal');
	// Dashboard
	createListItem('Dashboard', 'Dashboard');
	// PDF檢視器
	createListItem('PDF檢視器', 'PDFViewer');
	// WebRTC
	createListItem('Web RTC', 'WebRTC');
	// WebAR
	createListItem('Web AR', 'WebAR');
	// About
	createListItem('關於', 'About');

	homeButton.onclick = programList.toggle;
	menuBar.addEle(homeMenu);
	menuBar.init();


//##############################初始化##############################
	programs.getProgram('Terminal').open(function(app) {
		// app.setSize(true);
		app.open();
		// programs.open('About');
	});
	// programs.getProgram('Dashboard').open();

	// 歡迎訊息
	if (storage.getItem('joinBefore') === null) {
		notification.sendNotification('歡迎光臨', '(。・ω・。)');
		storage.setItem('joinBefore', '0');
	} else {
		notification.sendNotification('歡迎回來', 'ヽ(✿ﾟ▽ﾟ)ノ');
	}
}

//##############################其他東西##############################
function Clock() {
	const clock = document.createElement('div');
	clock.classList.add('clock')
	let date = new Date();
	let dateText = format(date.getFullYear()) + '/' + format(date.getMonth()) + '/' + format(date.getDate());
	this.init = function() {
		menuBar.addEle(clock);
		update();
		sw = false;
		setTimeout(setInterval, 1000 - Date.now()%1000, update, 500);
	}
	
	let sw = false;
	let time, hr, min, sec;
	function update() {
		if (sw = !sw) {
			time = Date.now()/1000|0;
			sec = time % 60;
			time = time/60|0;
			min = time % 60;
			time = time/60|0;
			hr = time % 24 + 8;
			time = time/24|0;
			if (sec+min+hr===0) {
				date = new Date();
				dateText = format(date.getFullYear()) + '/' + format(date.getMonth()) + '/' + format(date.getDate());
			}
			clock.innerText = dateText + ' ' + format(hr) + ':' + format(min) + ':' + format(sec);
		} else
			clock.innerText = dateText + ' ' + format(hr) + ' ' + format(min) + ' ' + format(sec);
	}
	
	function format(i) {
		return i < 10 ? '0' + i : i;
	}
}

function DropDownList(target) {
	const dropDownList = document.createElement('div');
	dropDownList.classList.add('dropdownlist');
	const slider = document.createElement('div');
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
	menuBar.classList.add('menuBar');
	menuBar.classList.add('cantSelect');
	
	this.init = function() {
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







