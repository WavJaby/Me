// 指令視窗
function Terminal(win) {
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
	const pathEle = document.createElement('span');
	pathEle.classList.add('path');
	const prefix = document.createElement('span');
	prefix.classList.add('prefix');
	const commandInput = document.createElement('span');
	
	// 加入
	commandLine.appendChild(group);
	commandLine.appendChild(document.createTextNode('@'));
	commandLine.appendChild(user);
	commandLine.appendChild(document.createTextNode(':'));
	commandLine.appendChild(pathEle);
	commandLine.appendChild(document.createElement('br'));
	commandLine.appendChild(prefix);
	
	// 修改內容
	group.innerText = 'Main';
	user.innerText = 'WavJaby';
	let path = fileSystem.cd('home/WavJaby/Desktop'); this.getPath = function(){return path;};
	pathEle.innerText = path.getPath(); this.setPath = function(newPath){path = newPath; pathEle.innerText = path.getPath();};
	prefix.innerHTML = '$&nbsp;';
	
	// 指令註冊
	const commands = {};
	const listeners = {};
	this.registerCommand = function(command, listener) {
		commands[command] = listener.args;
		listeners[command] = listener.onSubmit;
	}
	
//##############################初始化視窗##############################
	win.setTitle('終端機');
	// win.addMenuItem(item);
	win.addBody(terminal);
	win.onSizeChange = setResultHeight;
	win.setOnActivateStateChange(function(boolean) {
		if (boolean)
			document.onkeydown = userInput;
		userIn.setCanInput(boolean);
	});
	win.setDefaultSize(600, 350);
	
//##############################載入##############################
	// 使用者輸入
	let userIn;
	let userInput;
	this.pluginLoaded = function(plugin, onLoad) {
		userIn = new (plugin.UserInput)(commands, commandLine, showHints, submitCommand);
		userInput = userIn.onInput;
		
		plugin.initCommands(this);
		onLoad(this);
	}

    this.setSize = win.setSize;
	
    this.setLocation = win.setLocation;
	
	this.open = function(invisible) {
		if (!invisible)
			win.open(setResultHeight);
	}
	
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
	
//##############################監聽##############################
	// 傳送指令
	function submitCommand(args, userInput) {
		// 計算是否以滑動到最底
		const needScroll = result.scrollTop === result.scrollHeight - result.offsetHeight;
		commandInput.innerText = userInput;
		result.innerHTML += '<p>' + commandLine.innerHTML + '</p>';
		const listener = listeners[args[0]];
		if (listener !== undefined)
			listener(args, result, this);
		// 滑動到最底
		if (needScroll)
			result.scrollTop = result.scrollHeight - result.offsetHeight;
	}
	// 傳送提示
	function showHints(hints) {
		if (hints.length > 0) {
			let hint = '<p>' + hints[0];
			for (let i = 1; i < hints.length; i++)
				hint += '<sp></sp>' + hints[i];
			result.innerHTML += hint + '</p>';
			result.scrollTop = result.scrollHeight - result.offsetHeight;
		}
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