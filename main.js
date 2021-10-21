'use strict';
const storage = getStorage();
const windowResize = new WindowResize();
const menuBar = new MenuBar();
const notification = new Notification();
const minWindow = new MinimizeWindow();

window.onload = function() {
	// 列表
	const program = document.createElement('div');
	program.innerText = '程式集';
	const about = document.createElement('div');
	about.innerText = '關於我';
	menuBar.addItem(program);
	menuBar.addItem(about);
	menuBar.init();
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
	notification.init();

//##############################視窗##############################
	minWindow.init();
	
//##############################初始化##############################
    // 開視窗
    const terminal = new Terminal();
    terminal.init();

	// 歡迎訊息
	if (storage.getItem('joinBefore') === null) {
		notification.sendNotification('歡迎光臨', '(。・ω・。)');
		storage.setItem('joinBefore', '0');
	} else {
		notification.sendNotification('歡迎回來', 'ヽ(✿ﾟ▽ﾟ)ノ');
	}
}

function MenuBar() {
	const menuBar = document.createElement('div');
	this.init = function() {
		menuBar.classList.add('menuBar');
		menuBar.classList.add('cantSelect');
		document.body.appendChild(menuBar);
	}
	
	this.addItem = function(item) {
		item.classList.add('item');
		menuBar.appendChild(item);
	}
	
	this.getHeight = function() {
		return menuBar.offsetHeight;
	}
}


function Notification() {
	const notificationWindow = document.createElement('div');
	this.init = function() {
		notificationWindow.classList.add('notificationWindow');
		document.body.appendChild(notificationWindow);
	}
	
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

function WindowResize() {
    const windows = [];
    
	window.onresize = function() {
        if(windows.length == 0) return;
        if(windows.length == 1) {
            windows[0].resize();
            return;
        }
        
        for (let i = 0; i < windows.length; i++)
            windows[i].resize();
	};
    
    this.addWindow = function(win) {
        windows.push(win);
    }
}

function out(i) {
	console.log(i);
}







