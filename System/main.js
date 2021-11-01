'use strict';
const storage = getStorage();
const menuBar = new MenuBar();
const notification = new Notification();

//##############################列表##############################
const program = document.createElement('div');
program.innerText = '程式集';
menuBar.addItem(program);
menuBar.init();
// const buttons = ['mHelp', 'mAbout', 'mProject'];
// const commands = ['help', 'about', 'project'];
// for (let i = 0; i < buttons.length; i++) {
	// const element = document.getElementById(buttons[i]);
	// element.value = commands[i];
	// element.onclick = function() {
		// clickedText = this.value;
		// if (!typing)
			// autoType();
	// }
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
// let i = 0;
// let id = setInterval(function() {
	// const terminal = new Terminal();
	// terminal.init(true, 100 + i * 20, 100 + i * 20, 500, 200);
	// terminal.open();
	// i++;
	// (i < 5 || clearInterval(id));
// }, 100);
const aboutWindow = new AboutWindow();

const terminal = new Terminal();
terminal.init(false, 100, 100, 600, 300);
terminal.open();


// 歡迎訊息
if (storage.getItem('joinBefore') === null) {
	notification.sendNotification('歡迎光臨', '(。・ω・。)');
	storage.setItem('joinBefore', '0');
} else {
	notification.sendNotification('歡迎回來', 'ヽ(✿ﾟ▽ﾟ)ノ');
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

function out(i) {
	console.log(i);
}







