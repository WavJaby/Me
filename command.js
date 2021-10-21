'use strict';
const help = 
'\
<div class="resultBorder">\
	<h1>指令教學<white>(ﾉ*ФωФ)ﾉ</white></h1>\
	<h2>help<green>&#9;就是這個啦</green></h2>\
	<h2>about<green>&#9;作者資訊</green></h2>\
	<h2>project<green>&#9;我的專案</green></h2>\
	<h2>clear<green>&#9;清除紀錄</green></h2>\
	<h2>version<green>&#9;版本w?</green></h2>\
</div>\
';
const about = 
'\
<div class="resultBorder">\
	<h1>關於作者</h1>\
	<h2>備審好難做@@</h2>\
	<h3>GitHub: <a href="https://github.com/WavJaby" target="_blank">github.com/WavJaby</a></h3>\
</div>\
';
const project = 
'\
<div class="resultBorder">\
	<h1>作品<span style="font-size: 10px;">(有用的)</h1>\
	<h2>Conway\'s GameOfLife 康威生命遊戲</h2>\
	<div style="position: relative; padding-left: 2em;">\
		<h3>簡介: </h3>\
		<h3><sp></sp>康威生命遊戲是由英國數學家 John Horton Conway 約翰·何頓·康威 在1970年所發明的</h3>\
		<h3><sp></sp>遊戲規則僅四條，卻能夠模擬生命的種種姿態</h3>\
		<h3><sp></sp>玩家就像上帝般，在無窮大的土地上創造生命，並靜靜地觀察它們誕生、死亡，周而復始</h3>\
		<h3><sp></sp><a href="https://docs.google.com/document/d/1xMYzwiYzN8xOA1419YIc7-bU8g7ej9wusodMBZ5BLoU/edit?usp=sharing" target="_blank">詳細介紹</a></h3>\
		<h3>目標: 製作單人和多人的康威生命遊戲</h3>\
		<h3>開始製作日期: 2021/4</h3>\
		<h3>原始碼GitHub(包含多人遊戲): <a href="https://github.com/WavJaby" target="_blank">github.com/WavJaby</a></h3>\
		<h3>單人遊玩: <a href="https://wavjaby.github.io/GameOfLife/" target="_blank">wavjaby.github.io/GameOfLife/</a></h3>\
		<video oncontextmenu="return false;" autoplay muted loop>\
			<source src="ProjectFiles/Switch engine.mp4" type="video/mp4">\
		</video>\
	</div>\
    \
	<h2>Disease Map 傳染病分布查詢系統(已停止更新)</h2>\
	<div style="position: relative; padding-left: 2em;">\
		<h3>簡介: </h3>\
		<h3>目標: </h3>\
		<h3>開始製作日期: 2020/3</h3>\
	</div>\
</div>\
';

function initCommands() {
    addCommand('help');
    addCommand('about');
    addCommand('version');
    addCommand('project');
    addCommand('clear', {what:null,where:null});
    addCommand('ls');
}

// 新增指令
const commands = {};
function addCommand(command, subcommand) {
    if (subcommand == undefined)
        commands[command] = null;
    else
        commands[command] = subcommand;
}

function onCommand(args, commandResult) {
    let output = true;
    let result;
    switch (args[0]) {
        case 'help':
        result = help;
        break;
        case 'about':
        result = about;
        break;
        case 'project':
        result = project;
        break;
        case 'clear':
        output = false;
        commandResult.innerHTML = '';
        break;
        case 'ls':
        result = fileSystem();
        break;
        default:
        result = args.join(' ') + ' 是什麼? 看不懂';
        break;
    }
    if(output)
        commandResult.innerHTML += result;
}


// 指令視窗
function Terminal() {
	// 初始化視窗
	const win = new Window();
	win.setTitle('終端機');
	// win.addMenuItem(item);
	
	// 建立元素
	const terminal = document.createElement('div');
	terminal.classList.add('terminal');
	
	const result = document.createElement('div');
	result.classList.add('result');
	
	const commandLine = document.createElement('p');
	commandLine.classList.add('commandLine');
	
	terminal.appendChild(result);
	terminal.appendChild(commandLine);
	
	// 指令
	const group = document.createElement('span');
	group.classList.add('group');
	const user = document.createElement('span');
	user.classList.add('user');
	const path = document.createElement('span');
	path.classList.add('path');
	const prefix = document.createElement('span');
	prefix.classList.add('prefix');
	const commandInput = document.createElement('span');
	
	// 加入
	commandLine.appendChild(group);
	commandLine.appendChild(document.createTextNode('@'));
	commandLine.appendChild(user);
	commandLine.appendChild(document.createTextNode(':'));
	commandLine.appendChild(path);
	commandLine.appendChild(document.createElement('br'));
	commandLine.appendChild(prefix);
	commandLine.appendChild(commandInput);
	
	// 修改內容
	group.innerText = 'AboutMe';
	user.innerText = 'WavJaby';
	path.innerText = '/Desktop';
	prefix.innerHTML = '$&nbsp;';

	win.addBody(terminal);
	win.onBodySizeChange = function() {
        setResultHeight();
	}
	
    this.init = function(max, x, y, w, h) {
        initCommands(this);
		
		const userIn = new UserInput(commands, submitHints, updateCommandLine, submitCommand);
		this.userInput = userIn.onInput;
		const userInput = userIn.onInput;
		
        // 打字時
        document.addEventListener('keydown', function(e) {
			userInput(e);
        });
        
		win.setWindowSize(max, x, y, w, h);
		win.show();
        setResultHeight();
    }
	// 傳送指令
	function submitCommand(args, userInput) {
		// 計算是否以滑動到最底
		const needScroll = result.scrollTop === result.scrollHeight - result.offsetHeight;
		commandInput.innerText = userInput;
		result.innerHTML += '<p>' + commandLine.innerHTML;
		onCommand(args, result);
		// 滑動到最底
		if (needScroll)
			result.scrollTop = result.scrollHeight - result.offsetHeight;
	}
	// 傳送提示
	function submitHints(hints) {
		let result = '<p>' + hints[0];
		for (let i = 1; i < hints.length; i++)
			result += '<sp></sp>' + hints[i];
		result.innerHTML += result + '</p>';
		result.scrollTop = result.scrollHeight - result.offsetHeight;
	}
	
	// 更新指令畫面
	function updateCommandLine(html) {
		commandInput.innerHTML = html;
	}
    
    // 設定結果區大小
    function setResultHeight() {
        result.style.maxHeight = (
            win.getBodyHeight() - 
            commandLine.offsetHeight
        ) + 'px';
    }
	
	this.getHeight = function() {
		return result.offsetHeight + commandLine.offsetHeight;
	}
	
	this.getBoundingRect = function() {
		return result.getBoundingClientRect();
	}
}

function UserInput(hints, showhints, displayUpdate, onSubmit) {
	function blinkSpan(text) {return '<span class="blink cantSelect">' + text + '</span>'};
	function blinkHintSpan(text) {return '<span class="blink hint cantSelect">' + text + '</span>'};
	function hintSpan(text) {return '<span class="hint cantSelect">' + text + '</span>'};
	
	//控制項
	let inInput;
	let cursorPos;
	let argsPos;
	let argsStartPos;
	// 輸入資訊
	let args;
	let userInput;
	// 提示
	let hintTab;
	let lastTabTime = 0;
	let hintPos;
    // 顯示
    let cmdDisplay;
    let cmdDisplayBlink;
	
	// 設定能否輸入
	this.setCanInput = function(state) {
		inInput = state;
	}
	
	this.onInput = function(e) {
		if (!inInput && e.auto === undefined)
			return;
		const key = e.key;
		let arg = args[argsPos];
		let getHint = true;
		if (key.length === 1) {
			const space = key === ' ';
			if(space && userInput.charAt(cursorPos - 1) === ' ')
				return;
			
			// 向後增加
			if (cursorPos === userInput.length) {
				userInput += key;
				if (!space)
					args[argsPos] += key;
			} 
			// 插入
			else {
				userInput = userInput.slice(0, cursorPos) + key + userInput.slice(cursorPos);
				if (!space)
					args[argsPos] = arg.slice(0, cursorPos - argsStartPos) + key + arg.slice(cursorPos - argsStartPos);
			}
			cursorPos++;
			// 空白
			if (space) {
				argsPos++;
				argsStartPos = cursorPos;
				args[argsPos] = '';
				getHint = false;
				hintTab = 0;
			}
		} else {
			// 功能鍵
			switch (key) {
				case 'Backspace':
				if (cursorPos > 0) {
					const space = userInput.charAt(cursorPos - 1) === ' ';
					if (cursorPos === userInput.length) {
						userInput = userInput.slice(0, -1);
						if (!space)
							args[argsPos] = arg.slice(0, -1);
					} else {
						userInput = userInput.slice(0, cursorPos - 1) + userInput.slice(cursorPos);
						if (!space)
							args[argsPos] = arg.slice(0, cursorPos - argsStartPos - 1) + arg.slice(cursorPos - argsStartPos);
					}
					cursorPos--;
					if (space) {
						argsPos--;
						argsStartPos = cursorPos - args[argsPos].length;
						for (let i = argsPos + 1; i < args.length; i++) {
							const nextArg = args[i];
							if (nextArg === undefined || nextArg.length == 0) break;
							args[i - 1] += nextArg;
							args[i] = '';
						}
						hintTab = 0;
					}
				}
				break;
				case 'ArrowLeft':
				if (cursorPos > 0) {
					cursorPos--;
					if (userInput.charAt(cursorPos) === ' ') {
						argsPos--;
						argsStartPos = cursorPos - args[argsPos].length;
						hintTab = 0;
					}
				}
				break;
				case 'ArrowRight':
				if (cursorPos < userInput.length) {
					cursorPos++;
					if (userInput.charAt(cursorPos - 1) === ' ') {
						argsPos++;
						argsStartPos = cursorPos;
						hintTab = 0;
					}
				}
				break;
				case 'Enter':
					onSubmit(args, userInput);
					resetCommandLine();
				return;
				case 'Tab':
					let hint = commandHint(args, argsPos);
					if (hint.length === 1) {
						hint = hint[hintPos];
						args[argsPos] = hint;
						userInput = userInput.slice(0, argsStartPos + arg.length) + hint.slice(arg.length) + userInput.slice(argsStartPos + arg.length);
						cursorPos = argsStartPos + hint.length;
					} else if (hint.length > 1) {
						hintPos++;
						if (hintPos == hint.length)
							hintPos = 0;
						
						if (Date.now() - lastTabTime < 100) {
							showhints(hint);
						}
					} else {
						hintTab++;
						if (hintTab == 2 && hintMap !== null)
							showhints(Object.keys(hintMap));
					}
					e.preventDefault();
				break;
				default:
				return;
			}
		}
		arg = args[argsPos];
		let hint = null;
		if (getHint)
			hint = commandHint(args, argsPos);
		if(hint !== null)
			hint = hint[hintPos];
		
		
		const cursorP = cursorPos - argsStartPos;
		const last = userInput.slice(argsStartPos + cursorP);
		const cursorAtlast = cursorP === arg.length;
		
		// 有提示
		if (hint !== undefined && hint !== null && arg.length < hint.length) {
			const hintLast = hintSpan(hint.slice(arg.length));
			cmdDisplay = userInput.slice(0, argsStartPos + arg.length) + hintLast;
			// 游標在最後
			if (cursorAtlast)
				cmdDisplayBlink = userInput.slice(0, argsStartPos + cursorP) + blinkHintSpan(hint.charAt(arg.length)) + hintSpan(hint.slice(arg.length + 1));
			else 
				cmdDisplayBlink = userInput.slice(0, argsStartPos + cursorP) + blinkSpan(arg.charAt(cursorP)) + arg.slice(cursorP + 1, arg.length) + hintLast;
		}
		// 沒有提示
		else {
			cmdDisplay = userInput.slice(0, argsStartPos + cursorP);
			if (cursorAtlast)
				cmdDisplayBlink = cmdDisplay + blinkSpan('&nbsp');
			else
				cmdDisplayBlink = userInput.slice(0, argsStartPos + cursorP) + blinkSpan(arg.charAt(cursorP)) + arg.slice(cursorP + 1, arg.length);
		}
		
		if (userInput.length !== argsStartPos + arg.length) {
			const other = userInput.slice(argsStartPos + cursorP);
			cmdDisplay += other;
			if (cursorAtlast)
				cmdDisplayBlink += userInput.slice(argsStartPos + cursorP + 1);
			else
				cmdDisplayBlink += other;
		}
		
		startIdleTimer();
		updateCommandLine();
		
		// console.log('###### args ######');
		// console.log(args);
		// console.log('###### hint ######');
		// console.log(hint);
		// console.log('###### cursorAtlast ######');
		// console.log(cursorAtlast);
		// console.log('###### userInput ######');
		// console.log('\'' + userInput + '\'');
	}
	
	function updateCommandLine() {
		displayUpdate(blink ? cmdDisplayBlink : cmdDisplay);
	}
	
	// 重設
	function resetCommandLine() {
		inInput = true;
		cursorPos = 0;
		argsPos = 0;
		argsStartPos = 0;
		
		args = [''];
		userInput = '';
		
		hintPos = 0;
		hintTab = 0;
		
		cmdDisplay = '';
		cmdDisplayBlink = blinkSpan('&nbsp;');
		
		updateCommandLine();
	}
	
	// 尋找提示
	let lastPos = 0;
	let lastCommands = [];
	let hintMap = hints;
	function commandHint(args, pos) {
		const command = args[pos];
		if (lastPos < pos) 
			hintMap = hintMap[lastCommands[pos-1]];
		else if (lastPos > pos) {
			hintMap = hints;
			for (let i = 0; i < pos; i++) {
				hintMap = hintMap[lastCommands[i]];
			}
		}
		
		let result = [];
		if (command.length > 0 && hintMap !== undefined) {
			for (let i in hintMap){
				if (i.startsWith(command)) {
					result.push(i);
				}
			}
		}
		lastCommands[pos] = command;
		lastPos = pos;
		return result;
	}
	
	// 游標閃爍
	let blink = true;
	let idle = true;
	let idleTimer;
	setInterval(function() {
		if (idle) {
			blink = !blink;
			updateCommandLine();
		}
	}, 600);
	function startIdleTimer() {
		blink = true;
		idle = false;
		// 一秒後游標開始閃爍
		clearTimeout(idleTimer);
		idleTimer = setTimeout(function() {
			idle = true;
		}, 500);
	}
	
	// init
	resetCommandLine();
}