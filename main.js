'use strict';
const storage = getStorage();
window.onload = function() {
	// 列表
	const menuBar = document.getElementById('menuBar');
	
//##############################列表區##############################
	const buttons = ['mHelp', 'mAbout', 'mProject'];
	const commands = ['help', 'about', 'project'];
	for (let i = 0; i < buttons.length; i++) {
		const element = document.getElementById(buttons[i]);
		element.value = commands[i];
		element.onclick = function() {
			clickedText = this.value;
			if (!typing)
				autoType();
		};
	}
	
	let clickedText;
	let typing = false;
	function autoType() {
		typing = true;
		let type = clickedText.length - 1;
		// let deleteCount = userInput.length;
		
		addChar();
		const id = setInterval(function() {
			if (type < 0) {
				clearInterval(id);
				terminal.userInput({
					key: 'Enter',
					auto: true
				});
				typing = false;
				return;
			}
			addChar();
		}, 50);
		
		function addChar() {
			// if (deleteCount > 0) {
				// userInput = userInput.slice(0, -1);
				// deleteCount--;
			// } else {
				terminal.userInput({
					key: clickedText.charAt(clickedText.length - type - 1),
					auto: true
				});
				type--;
			// }
		}
	}

//##############################通知##############################
	const notificationWindow = document.getElementById('notificationWindow');
	const notification = new Notification(notificationWindow);

//##############################視窗##############################
	// 視窗工具列
	const windowHeader = document.getElementById('wHeader');
	const windowBody = document.getElementById('wBody');
	const windowMinimize = document.getElementById('wMinimize');
	const windowClose = document.getElementById('wClose');
	
	// 設定視窗大小
	function setWindowBodyHeight() {
		windowBody.style.height = (
			window.innerHeight - 
			menuBar.offsetHeight - 
			windowHeader.offsetHeight
		) + 'px';
	}
	
	// 自動重新設定大小
	window.onresize = function() {
		setWindowBodyHeight();
		terminal.setResultHeight();
	};
	
	
    const terminal = new Terminal(windowHeader, windowBody);
	
	// 初始化
	setWindowBodyHeight();
    terminal.init();
    initFileSystem();
	
	
	
	// 最小化視窗
	windowMinimize.onclick = function() {
		const windowMinimizeCanvas = document.getElementById('windowMinimize');
		const mButtons = menuBar.getElementsByTagName('div');
		const buttonWidth = parseInt(mButtons[0].getStyle('width'));
		const minWin = new MinimizeWindow(windowMinimizeCanvas, (mButtons.length + 0.5) * buttonWidth);
		// 視窗
		minWin.addElement(windowHeader);
		minWin.addElement(windowBody);
		minWin.addElement(wTitle);
		const btns = wHeader.getElementsByTagName('img');
		minWin.addElement(btns[0]);
		minWin.addElement(btns[1]);
		// 文字
		const height = terminal.getHeight();
		const bound = terminal.getBoundingRect();
		minWin.setFakeText(height, bound);
		
		windowBody.hidden = true;
		windowHeader.hidden = true;
		minWin.minimize();
		
		const terminalButton = document.createElement('div');
		terminalButton.classList.add('menuItem');
		terminalButton.id = 'terminal';
		terminalButton.innerHTML = '<p>終端機</p>';
		
		menuBar.appendChild(terminalButton);
	}
	

	// 歡迎訊息
	if (storage.getItem('joinBefore') === null) {
		notification.sendNotification('歡迎光臨', '(。・ω・。)');
		storage.setItem('joinBefore', '0');
	} else {
		notification.sendNotification('歡迎回來', 'ヽ(✿ﾟ▽ﾟ)ノ');
	}
}


function MinimizeWindow(canvasElement, toX) {
	let ctx = canvasElement.getContext("2d");
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	canvasElement.style.display = 'none';
	
	
	const eles = [];
	function drawElements(canvas) {
		for (let i = 0; i < eles.length; i++){
			const ele = eles[i];
			const bound = ele.bound;
			if (ele.tagName == 'img') {
				canvas.drawImage(ele.image, bound.left, bound.top, bound.width, bound.height);
			} else if (ele.tagName == 'p') {
				canvas.fillStyle = ele.fillStyle;
				canvas.font = ele.font;
				canvas.fillText(ele.text, bound.left, bound.top + ele.height);
			} else if (ele.tagName == 'div') {
				canvas.fillStyle = ele.fillStyle;
				canvas.fillRect(bound.left, bound.top, bound.width, bound.height);
			} else {
				canvas.fillStyle = ele.fillStyle;
				ele.draw(canvas);
			}
		}
	}
	
	this.addElement = function(ele) {
		const itemData = {};
		itemData.bound = ele.getBoundingClientRect();
		if (ele.tagName == 'IMG') {
			itemData.tagName = 'img';
			itemData.image = ele; 
		} else if (ele.tagName == 'P') {
			itemData.tagName = 'p';
			itemData.fillStyle = ele.getStyle('color');
			itemData.font = ele.getStyle('font');
			itemData.text = ele.innerText;
			itemData.height = parseInt(ele.getStyle('font-size')) * 1.1;
		} else if (ele.tagName == 'DIV') {
			itemData.tagName = 'div';
			itemData.fillStyle = ele.getStyle('background-color');
		}
		eles.push(itemData);
	}
	
	this.setFakeText = function(height, eleBound) {
		const fillStyle = 'rgb(200,200,200)';
		const bound = eleBound;
		const gap = 5;
		const itemHeight = 25;
		const width = [];
		for (let i = gap; i < height; i += itemHeight + gap)
			width.push(Math.random() * bound.width / 3 + itemHeight);
		
		const itemData = {};
		itemData.draw = function(canvas) {
			for (let i = 0; i < width.length; i++) 
				canvas.fillRoundRect(bound.left, bound.top + i * (itemHeight + gap) + gap, width[i] , itemHeight, itemHeight / 2);
		}
		itemData.fillStyle = fillStyle;
		eles.push(itemData);
	}
	
	// 縮小
	let scale = 1;
	let x = 0;
	function minimize() {
		if (scale < 0.05) {
			canvasElement.style.display = 'none';
			return;
		}
		ctx.clearRect(0 - x * 2, 0, ctx.canvas.width * (2 - scale), ctx.canvas.height * (2 - scale));
		ctx.globalAlpha = scale;
		drawElements(ctx);
		
		x = toX * (1 - scale);
		ctx.setTransform (scale, 0, 0, scale, x, 0);
		scale *= 0.8;
		window.requestAnimationFrame(minimize);
	}
	// 放大
	
	
	this.minimize = function() {
		canvasElement.style.display = 'block';
		minimize();
	}
}


function Notification(notificationWindow) {
	this.sendNotification = function(title, description, time) {
		if(time === undefined) time = 2000;
		
		let notification = document.createElement('div');
		notification.classList.add('notification');
		let titleEle = document.createElement('h1');
		let descriptionEle = document.createElement('p');
		notification.appendChild(titleEle);
		notification.appendChild(descriptionEle);
		
		// 設定文字內容
		titleEle.innerText = title;
		descriptionEle.innerText = description;
		
		let windowWidth = notificationWindow.offsetWidth;
		let left = notificationWindow.offsetWidth;
		
		// 加入至視窗
		notificationWindow.appendChild(notification);
		
		let count = 0;
		// 滑入
		function slideIn() {
			if(left <= 1 || count > 100) {
				notification.style.left = '';
				count = 0;
				left = 1;
				setTimeout(slideOut, time);
			} else {
				notification.style.left = left + 'px';
				left = (left / 1.2) | 0;
				count++;
				window.requestAnimationFrame(slideIn);
			}
		}
		// 滑出
		function slideOut() {
			if(left > windowWidth || count > 100) {
				notificationWindow.removeChild(notification);
			} else {
				notification.style.left = left + 'px';
				left = left * 1.2;
				count++;
				window.requestAnimationFrame(slideOut);
			}
		}
		
		slideIn();
	}
}

function out(i) {
	console.log(i);
}







