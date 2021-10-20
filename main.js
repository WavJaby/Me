'use strict';
const storage = getStorage();
window.onload = function() {
	// 列表
	const menuBar = document.getElementById('menuBar');
	
//##############################列表區##############################
	// const buttons = ['mHelp', 'mAbout', 'mProject'];
	// const commands = ['help', 'about', 'project'];
	// for (let i = 0; i < buttons.length; i++) {
		// const element = document.getElementById(buttons[i]);
		// element.value = commands[i];
		// element.onclick = function() {
			// clickedText = this.value;
			// if (!typing)
				// autoType();
		// };
	// }
	
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
	// 自動重新設定大小
	// window.onresize = function() {
		// setWindowBodyHeight();
		// terminal.setResultHeight();
	// };
	const minWinCanvas = document.createElement('canvas');
	minWinCanvas.classList.add('windowMinimize');
	const minWindow = new MinimizeWindow(minWinCanvas);
	
	
    const terminal = new Terminal();
    terminal.init();
	
	// 初始化
	// setWindowBodyHeight();
    // initFileSystem();
	
	
	
	// 最小化視窗
	/*
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
	*/

	// 歡迎訊息
	if (storage.getItem('joinBefore') === null) {
		notification.sendNotification('歡迎光臨', '(。・ω・。)');
		storage.setItem('joinBefore', '0');
	} else {
		notification.sendNotification('歡迎回來', 'ヽ(✿ﾟ▽ﾟ)ノ');
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







