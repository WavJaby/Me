function Plugin(plugin) {
	const helpHTML = 
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
		<h2>安安</h2>\
		<h3>GitHub: <a href="https://github.com/WavJaby" target="_blank">github.com/WavJaby</a></h3>\
	</div>\
	';
	const project = 
	'\
	<div class="resultBorder">\
		<h1>作品們</h1>\
		<h2>Conway\'s GameOfLife 康威生命遊戲</h2>\
		<div style="position: relative; padding-left: 2em;">\
			<video oncontextmenu="return false;" autoplay muted loop>\
				<source src="ProjectFiles/Switch engine.mp4" type="video/mp4">\
			</video>\
			<h3>簡介: </h3>\
			<h3><sp></sp>康威生命遊戲是由英國數學家 John Horton Conway 約翰·何頓·康威 在1970年所發明的</h3>\
			<h3><sp></sp>遊戲規則僅四條，卻能夠模擬生命的種種姿態</h3>\
			<h3><sp></sp>玩家就像上帝般，在無窮大的土地上創造生命，並靜靜地觀察它們誕生、死亡，周而復始</h3>\
			<h3><sp></sp><a href="https://docs.google.com/document/d/1xMYzwiYzN8xOA1419YIc7-bU8g7ej9wusodMBZ5BLoU/edit?usp=sharing" target="_blank">詳細介紹</a></h3>\
			<h3>目標: 製作單人和多人的康威生命遊戲</h3>\
			<h3>開始製作日期: 2021/4</h3>\
			<h3>原始碼GitHub(包含多人遊戲): <a href="https://github.com/WavJaby" target="_blank">github.com/WavJaby</a></h3>\
			<h3>單人遊玩: <a href="https://wavjaby.github.io/GameOfLife/" target="_blank">wavjaby.github.io/GameOfLife/</a></h3>\
		</div>\
		<h2>......</h2>\
	</div>\
	';
	
		// <h2>Disease Map 傳染病分布查詢系統(已停止更新)</h2>\
		// <div style="position: relative; padding-left: 2em;">\
			// <h3>簡介: </h3>\
			// <h3>目標: </h3>\
			// <h3>開始製作日期: 2020/3</h3>\
		// </div>\

	plugin.initCommands = function(terminal) {
		const help = {
			args: null,
			onSubmit: function (args, commandResult, terminal) {
				commandResult.innerHTML += helpHTML;
			}
		};
		
		const version = {
			args: null,
			onSubmit: function (args, commandResult, terminal) {
				commandResult.innerHTML += '<p>Ver. 1.0 Alpha</p>';
			}
		};
		
		const file = new (function() {
			const ter = terminal;
			let args = this.args = {};
			let path = ter.getPath();
			function updateHints() {
				const hints = path.lsHint();
				for (let i in args)
					delete args[i];
				for (let i = 0; i < hints.length; i++) {
					args[hints[i]] = null;
				}
			}
			updateHints();
			
			this.onSubmit = function (args, commandResult, terminal) {
				let status;
				switch (args[0]) {
					case 'cd':
						if(args.length === 1) return;
						let newPath = path.cd(args[1]);
						if (newPath.code === undefined) 
							path = newPath;
						else {
							commandResult.innerHTML += '<p>' + newPath.message + '</p>';
							return;
						}
						break;
					case 'mkdir':
						if(args.length === 1) return;
						path.mkdir(args[1])
						return;
					case 'ls':
						commandResult.innerHTML += '<p>' + path.ls().join('<sp></sp>') + '</p>';
						return;
					case 'cat':
						if(args.length === 1) return;
						status = path.getFile(args[1], function(file) {
							commandResult.innerHTML += '<p>' + file.data + '</p>';
						});
						if (status.code)
							commandResult.innerHTML += '<p>' + args[1] + ' ' + status.message + '</p>';
						return;
					case '.':
						if(args.length === 1) return;
						status = path.getProgram(args[1]);
						if (status.code)
							commandResult.innerHTML += '<p>' + args[1] + ' ' + status.message + '</p>';
						else 
							status.open(function(app){app.open()});
						return;
					default:
					return;
				}
				updateHints();
				ter.setPath(path);
			}
		})();
		
		terminal.registerCommand('help', help);
		terminal.registerCommand('version', version);
		terminal.registerCommand('cd', file);
		terminal.registerCommand('ls', file);
		terminal.registerCommand('mkdir', file);
		terminal.registerCommand('.', file);
		terminal.registerCommand('cat', file);
		terminal.registerCommand('clear', new (function() {
			this.args = null;
			this.onSubmit = function (args, commandResult, terminal) {
				commandResult.innerHTML = '';
			}
		})());
		terminal.registerCommand('projects', new (function() {
			this.args = null;
			this.onSubmit = function (args, commandResult, terminal) {
				commandResult.innerHTML += project;
			}
		})());
		// addCommand('help');
		// addCommand('about');
		// addCommand('version');
	}

	plugin.UserInput = function(commands, commandLineElement, showhints, onSubmit) {
		const blinkerEle = document.createElement('span');
		blinkerEle.classList.add('blink');
		const frontEle = document.createElement('span');
		const backEle = document.createElement('span');
		const endEle = document.createElement('span');
		const hintEle = document.createElement('span');
		hintEle.classList.add('hint');
		hintEle.classList.add('cantSelect');
		
		commandLineElement.appendChild(frontEle);
		commandLineElement.appendChild(blinkerEle);
		commandLineElement.appendChild(backEle);
		commandLineElement.appendChild(hintEle);
		commandLineElement.appendChild(endEle);
		
		let frontText = '', blinkText = '', backText = '', hintText = '', endText = '';

		//控制項
		let canInput;
		let cursorPos;
		let argsPos;
		let argsStartPos;
		// 輸入資訊
		let userInput;
		let args;
		let inputChange;
		// 提示
		let hintTab;
		let lastTabTime = 0;
		let hintPos;
		const history = [];
		let historyPos = 0;
		
		// 設定能否輸入
		this.setCanInput = function(state) {
			canInput = state;
			if (state)
				startBlink();
			else
				stopBlink();
		}
		
		this.onInput = function(e) {
			if (!canInput && e.auto === undefined)
				return;
			let key = e.key;
			let arg = args[argsPos];
			let getHint = true;
			if (key === 'Spacebar') key = ' ';
			if (key.length === 1) {
				const space = key === ' ';
				
				// 向後增加
				if (cursorPos === userInput.length) {
					userInput += key;
					if (!space)
						args[argsPos] += key;
					frontText = userInput;
					blinkText = backText = endText = '';
				} 
				// insert
				else {
					const front = userInput.slice(0, cursorPos);
					const end = userInput.slice(cursorPos);
					userInput = front + key + end;
					if (!space)
						args[argsPos] = arg.slice(0, cursorPos - argsStartPos) + key + arg.slice(cursorPos - argsStartPos);
					frontText = front + key;
					blinkText = end.charAt(0);
					backText = arg.slice(cursorPos - argsStartPos + 1);
					endText = userInput.slice(argsStartPos + arg.length + (cursorPos - argsStartPos === arg.length?2:1));
				}
				cursorPos++;
				// 空白
				if (space) {
					argsPos++;
					if (cursorPos - argsStartPos <= arg.length) {
						args.insert(argsPos, args[argsPos - 1].slice(cursorPos - argsStartPos - 1));
						args[argsPos - 1] = args[argsPos - 1].slice(0, cursorPos - argsStartPos - 1);
					} else if (args[argsPos] === undefined) {
						getHint = false;
						args[argsPos] = '';
					}
					argsStartPos = cursorPos;
					hintTab = 0;
				}
			} else {
				// 功能鍵
				switch (key) {
					case 'Backspace':
						e.preventDefault();
						if (cursorPos > 0) {
							const space = userInput.charAt(cursorPos - 1) === ' ';
							if (cursorPos === userInput.length) {
								userInput = userInput.slice(0, -1);
								if (!space)
									args[argsPos] = arg.slice(0, -1);
								frontText = userInput;
								blinkText = backText = endText = '';
							} else {
								const front = userInput.slice(0, cursorPos - 1);
								userInput = front + userInput.slice(cursorPos);
								if (!space)
									args[argsPos] = arg.slice(0, cursorPos - argsStartPos - 1) + arg.slice(cursorPos - argsStartPos);
								frontText = front;
								blinkText = userInput.charAt(cursorPos - 1);
								backText = arg.slice(cursorPos - argsStartPos + 1);
								endText = userInput.slice(argsStartPos + arg.length - 1);
							}
							cursorPos--;
							if (space) {
								argsPos--;
								argsStartPos = cursorPos - args[argsPos].length;
								for (let i = argsPos + 1; i < args.length; i++) {
									const nextArg = args[i];
									if (nextArg === undefined || nextArg.length === 0) break;
									args[i - 1] += nextArg;
									args[i] = '';
								}
								hintTab = 0;
							}
						}
						break;
					case 'ArrowLeft':
						e.preventDefault();
						if (cursorPos > 0) {
							cursorPos--;
							const space = userInput.charAt(cursorPos) === ' ';
							if (space) {
								argsPos--;
								argsStartPos = cursorPos - args[argsPos].length;
								hintTab = 0;
							}
							frontText = userInput.slice(0, cursorPos);
							blinkText = userInput.charAt(cursorPos);
							backText = args[argsPos].slice(cursorPos - argsStartPos + 1);
							endText = userInput.slice(argsStartPos + args[argsPos].length);
						}
						break;
					case 'ArrowRight':
						e.preventDefault();
						if (cursorPos < userInput.length) {
							cursorPos++;
							const space = userInput.charAt(cursorPos - 1) === ' ';
							if (space) {
								argsPos++;
								argsStartPos = cursorPos;
								hintTab = 0;
							}
							frontText = userInput.slice(0, cursorPos);
							backText = args[argsPos].slice(cursorPos - argsStartPos + 1);
							blinkText = userInput.charAt(cursorPos);
							endText = userInput.slice(argsStartPos + args[argsPos].length);
						}
						break;
					case 'Enter':
						e.preventDefault();
						frontEle.innerText = userInput;
						let last = 0;
						for (let i = 0; i < args.length; i++)
							if (args[i].length > 0) last = i+1;
						onSubmit(args.slice(0, last), userInput);
						historyPos = history.length;
						history.push(args);
						resetCommandLine();
						return;
					case 'Tab':
						e.preventDefault();
						let hint = commandHint(args, argsPos);
						if (hint.length === 1) {
							hint = hint[hintPos];
							args[argsPos] = hint;
							userInput = userInput.slice(0, argsStartPos + arg.length) + hint.slice(arg.length) + userInput.slice(argsStartPos + arg.length);
							cursorPos = argsStartPos + hint.length;
							
							frontText = userInput.slice(0, cursorPos);
							endText = userInput.slice(cursorPos + 1);
							backText = hintText = '';
							blinkText = ' ';
						} else if (hint.length > 1) {
							hintPos++;
							if (hintPos === hint.length)
								hintPos = 0;
							
							if (Date.now() - lastTabTime < 100) {
								showhints(hint);
							}
						} else {
							hintTab++;
							if (hintTab === 2 && hintMap !== null)
								showhints(Object.keys(hintMap));
						}
						break;
					case 'ArrowUp':
						e.preventDefault();
						if (historyPos === history.length - 1) {
							history.push(args);
						}
						out(history);
						break;
					case 'ArrowDown':
						e.preventDefault();
					default:
					return;
				}
			}
			
			arg = args[argsPos];
			let hint = null;
			if (getHint) {
				const hints = commandHint(args, argsPos);
				if (hintPos >= hints.length)
					hintPos = 0;
				if(hints.length > 0)
					hint = hints[hintPos];
			}
			
			
			if (hint !== null && arg.length < hint.length) {
				if (cursorPos - argsStartPos === arg.length) {
					hintText = hint.slice(arg.length + 1);
					blinkText = hint.charAt(arg.length);
					blinkerEle.classList.add('hint');
					blinkerEle.classList.add('cantSelect');
				} else {
					hintText = hint.slice(arg.length);
					blinkerEle.classList.remove('hint');
					blinkerEle.classList.remove('cantSelect');
				}
			} else {
				hintText = '';
				blinkerEle.classList.remove('hint');
				blinkerEle.classList.remove('cantSelect');
			}
			
			inputChange = true;
			startIdleTimer();
			updateCommandLine();
			
			// console.log('###### args ######');
			// console.log(args);
			// console.log(arg);
			// console.log('###### hint ######');
			// console.log(hint);
			// console.log('###### userInput ######');
			// console.log('\'' + userInput + '\'');
			// console.log('###### userInput ######');
			// console.log('\'' + frontText + '\'', '\'' + blinkText + '\'', '\'' + backText + '\'', '\'' + hintText + '\'', '\'' + endText + '\'');
		}
		
		function updateCommandLine() {
			if (blink) {
				if (blinkText.length === 0)
					blinkerEle.innerText = ' ';
				else
					blinkerEle.innerText = blinkText;
				if (inputChange) {
					frontEle.innerText = frontText;
					endEle.innerText = endText;
				}
				hintEle.innerText = hintText;
				backEle.innerText = backText;
			} else {
				blinkerEle.innerText = '';
				if (inputChange) {
					frontEle.innerText = frontText;
					endEle.innerText = endText;
				}
				if (cursorPos - argsStartPos === args[argsPos].length) {
					backEle.innerText = backText;
					hintEle.innerText = blinkText + hintText;
				} else {
					backEle.innerText = blinkText + backText;
					hintEle.innerText = hintText;
				}
			}
			inputChange = false;
		}
		
		// 重設
		function resetCommandLine() {
			cursorPos = 0;
			argsPos = 0;
			argsStartPos = 0;
			
			args = [''];
			userInput = '';
			
			hintPos = 0;
			hintTab = 0;
			
			frontText = blinkText = backText = hintText = endText = '';
			frontEle.innerText = blinkerEle.innerText = backEle.innerText = hintEle.innerText = endEle.innerText = '';
			updateCommandLine();
		}
		
		// 尋找提示
		let lastPos = 0;
		let hintMap = commands;
		function commandHint(args, pos) {
			if (lastPos < pos) {
				if (hintMap !== null) {
					hintMap = hintMap[args[pos-1]];
					if (hintMap === undefined)
						hintMap = null;
				}
			} else if (pos < lastPos) {
				hintMap = commands;
				for (let i = 0; i < pos; i++) {
					if ((hintMap = hintMap[args[i]]) === null || (hintMap === undefined && (hintMap = null) === null))
						break;
				}
			}
			
			const command = args[pos];
			const result = [];
			if (command.length > 0 && hintMap !== null) {
				for (let i in hintMap) {
					if (i.startsWith(command)) {
						result.push(i);
					}
				}
			}
			lastPos = pos;
			return result;
		}
		
		// 游標閃爍
		let blink = true;
		let idleTimer = null;
		let blinkInterval = null;
		function startBlink() {
			blink = true;
			updateCommandLine();
			if (blinkInterval === null)
				blinkInterval = setInterval(function() {
					blink = !blink;
					updateCommandLine();
				}, 600);
		}
		function stopBlink() {
			clearInterval(blinkInterval);
			clearTimeout(idleTimer);
			blink = false;
			updateCommandLine();
			blinkInterval = null;
		}
		function startIdleTimer() {
			blink = true;
			clearInterval(blinkInterval);
			blinkInterval = null;
			// 一秒後游標開始閃爍
			clearTimeout(idleTimer);
			idleTimer = setTimeout(function() {
				startBlink();
			}, 500);
		}
		
		resetCommandLine();
	}
}
