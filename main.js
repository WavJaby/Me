'use strict';
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
			if(!typing)
				autoType();
		};
	}
	
	let clickedText;
	let typing = false;
	function autoType() {
		inInput = false;
		idle = false;
		blink = true;
		hintHTML = null;
		clearTimeout(idleTimer);
		typing = true;
		let type = clickedText.length - 1;
		let deleteCount = userInput.length;
		
		addChar();
		const id = setInterval(function() {
			if (type < 0) {
				clearInterval(id);
				submitCommand();
				updateCommandLine();
				idle = true;
				inInput = true;
				typing = false;
				return;
			}
			addChar();
		}, 50);
		
		function addChar() {
			if (deleteCount > 0) {
				userInput = userInput.slice(0, -1);
				deleteCount--;
			} else {
				userInput += clickedText.charAt(clickedText.length - type - 1);
				type--;
			}
			cmdDisplayBlink = userInput + blinkSpan + '&nbsp;</span>';
			updateCommandLine();
		}
	}
	
	
//##############################視窗##############################
	// 視窗工具列
	const windowHeader = document.getElementById('wHeader');
	const windowBody = document.getElementById('wBody');
	
	// 設定視窗大小
	function setWindowBodyHeight() {
		windowBody.style.height = (
			window.innerHeight - 
			menuBar.offsetHeight - 
			windowHeader.offsetHeight
		) + 'px';
	}
	
    const commandWindow = new CommandWindow(windowHeader, windowBody);
	
	window.onresize = function() {
		setWindowBodyHeight();
		commandWindow.setResultHeight();
	};
	
	// 初始化
	setWindowBodyHeight();
    commandWindow.init();
    initFileSystem();
}











