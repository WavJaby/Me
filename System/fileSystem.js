'use strict';

function FileSystem() {
	const FileNodeType = {root:-1, folder:0, file:1};
	const FileType = {program: 0, text:1, image: 2};
	
	const systemRoot = {
		nodeType: -1,
		name: '',
		path: [],
		parentDir: null,
		childDirs: {},
		childFiles: {},
		
		cd: cd,
		ls: ls,
		mkdir: mkdir,
		getPath: getpath,
		tree: tree,
		treeText: treeText,
	};
	this.getRoot = function(){return systemRoot;};
	
	let userFolder;
	this.init = function(fileSystemLoaded) {
		// folder
		const systemFolder = systemRoot.mkdir('System');
		const programFolder = systemFolder.mkdir('Programs');
		const settingsFolder = systemFolder.mkdir('Settings');
		const iconFolder = systemFolder.mkdir('Icon');
		const fontFolder = systemFolder.mkdir('Font');
		userFolder = systemRoot.mkdir('home/WavJaby');
		userFolder.mkdir('Desktop');
		userFolder.mkdir('Download');
		userFolder.mkdir('Document');
		
		
		// file
		userFolder.cd('Desktop').createFile('HelloWorld', 'txt', FileType.text, 'Hello World!');
		iconFolder.createFile('close', 'svg', FileType.image);
		iconFolder.createFile('minimize', 'svg', FileType.image);
		iconFolder.createFile('warning', 'svg', FileType.image);
		
		
		// program
		const terminal = programFolder.createFile('Terminal', 'app', FileType.program);
		terminal.addResource('plugin', 'js');
		terminal.addResource('Terminal', 'css');
		terminal.addResource('icon', 'svg');
		
		const WebRTC = programFolder.createFile('WebRTC', 'app', FileType.program);
		WebRTC.addResource('WebRTC', 'css');
		
		const about = programFolder.createFile('About', 'app', FileType.program);
		about.addResource('About', 'css');
		about.addResource('icon', 'svg');
		about.addResource('body', 'html');
		about.addResource('githubIcon', 'svg');
		
		
		// out(systemRoot.tree(true))
		out(systemRoot.treeText())
		// out(systemRoot)
		
		fileSystemLoaded();
	}
	
	function createFile(name, extension, fileType, data) {
		const file = {
			nodeType: FileNodeType.file,
			fileType: fileType,
			name: name,
			extension: extension,
			fullName: name + '.' + extension,
			parentDir: this,
			
			getPath: getpath,
		};
		if (fileType === FileType.program) {
			file.app = null;
			file.resource = {};
			file.notLoadResource = [];
			file.addResource = addResource;
		} else {
			if (data === undefined)
				file.data = null;
			else
				file.data = data;
		}
		const path = this.path;
		const newPath = file.path = [];
		for (let i = 0; i < path.length; i++)
			newPath.push(path[i]);
		newPath.push(this.name);
		this.childFiles[file.fullName] = file;
		return file;
	}
	
//##############################資料夾##############################
	function mkdir(name) {
		let fileNode;
		let startIndex;
		let nextName;
		if ((startIndex = name.indexOf('/')) > -1) {
			if (startIndex === 0) {
				const nameEnd = name.indexOf('/', startIndex + 1);
				fileNode = systemRoot;
				if (nameEnd > -1) {
					nextName = name.slice(nameEnd + 1);
					name = name.slice(1, nameEnd);
				} else
					name = name.slice(1);
			} else {
				fileNode = this;
				nextName = name.slice(startIndex + 1);
				name = name.slice(0, startIndex);
			}
		} else
			fileNode = this;
		
		// 上一層
		if (name === '..') {
			if (this.parentDir !== null)
				return this.parentDir.mkdir(nextName);
		}
		// 這一層
		if (name === '.')
			return this.mkdir(nextName);
		// home
		if (name === '~')
			return userFolder.mkdir(nextName);
		// 創建資料夾
		const dir = {
			nodeType: FileNodeType.folder,
			name: name,
			parentDir: fileNode,
			childDirs: {},
			childFiles: {},
			
			cd: cd,
			ls: ls,
			mkdir: mkdir,
			createFile: createFile,
			open: open,
			getProgramIcon: getProgramIcon,
			getFile: getFile,
			getPath: getpath,
			tree: tree,
			treeText: treeText,
		};
		const path = fileNode.path;
		const newPath = dir.path = [];
		for (let i = 0; i < path.length; i++)
			newPath.push(path[i]);
		newPath.push(fileNode.name);
		fileNode.childDirs[name] = dir;
		
		if (nextName !== undefined)
			return dir.mkdir(nextName);
		return dir;
	}
	
	this.cd = function(path) {
		return systemRoot.cd(path);
	}
	
	function cd(path) {
		let paths;
		let fileNode;
		let startIndex;
		if ((startIndex = path.indexOf('/')) > -1) {
			if (startIndex === 0) {
				fileNode = systemRoot;
				const nameEnd = path.indexOf('/', startIndex + 1);
				if (nameEnd > -1)
					paths = path.slice(1).split('/');
				else
					paths = [path.slice(1)];
			} else {
				fileNode = this;
				paths = path.split('/');
			}
		} else {
			fileNode = this;
			paths = [path];
		}
		
		// 移動位置
		for (let i = 0; i < paths.length; i++) {
			if (paths[i] === '..')
				if (fileNode.parentDir !== null)
					fileNode = fileNode.parentDir;
				else
					return fileNode;
			else if (paths[i] === '.')
				continue;
			else if (paths[i] === '~')
				fileNode = userFolder;
			else {
				const newfileNode = fileNode.childDirs[paths[i]];
				if (newfileNode === undefined) {
					if (fileNode.childFiles[paths[i]] === undefined)
						return {code: 1, message: path + ' 資料夾不存在'};
					else
						return {code: 2, message: path + ' 不是資料夾'};
				}
				fileNode = newfileNode;
			}
		}
		return fileNode;
	}
	
	function tree(start) {
		const dirs = {};
		const files = {};
		const childDirs = this.childDirs;
		const childFiles = this.childFiles;
		for (let i in childDirs)
			dirs[childDirs[i].name] = childDirs[i].tree();
		for (let i in childFiles)
			dirs[childFiles[i].name] = childFiles[i];
		if (start) {
			const result = {};
			result[this.name] = {dirs: dirs, files: files};
			return result;
		}
		return {dirs: dirs, files: files};
	}
	
	function treeText(tab, end) {
		let result = '';
		const newLine = '\r\n';
		const childDirs = this.childDirs;
		const childFiles = this.childFiles;
		let nextTab = '';
		if (end !== undefined) {
			if (end)
				result += tab + '└╴';
			else
				result += tab + '├╴';
			nextTab = tab + (end ? '  ' : '│ ');
		}
			
		result += (this.nodeType === FileNodeType.root ? 'ROOT' : this.name) + newLine;
		const childDirsKey = Object.keys(childDirs);
		const childFilesKey = Object.keys(childFiles);
		for (let i = 0; i < childDirsKey.length; i++)
			result += childDirs[childDirsKey[i]].treeText(nextTab, i === childDirsKey.length - 1 && childFilesKey.length === 0);
		
		for (let i = 0; i < childFilesKey.length; i++)
			result += nextTab + (i === childFilesKey.length-1 ? '└╴' : '│ ') + childFiles[childFilesKey[i]].fullName + newLine;
		
		return result;
	}
	
	function ls() {
		return Object.keys(this.childDirs).concat(Object.keys(this.childFiles));
	}
	
//##############################檔案##############################
	function open(name, onLoad) {
		const program = this.childFiles[name];
		if (program !== undefined && program.fileType === FileType.program) {
			const appPath = program.getPath().slice(1) + '/';
			let resLoad = 0;
			function load() {
				if (resLoad++ < notLoadResource.length) return;
				const window = new Window(resource);
				let body;
				if ((body = resource.body) !== undefined) {
					const bodyEle = document.createElement('div');
					bodyEle.innerHTML = body;
					window.addBody(bodyEle);
				}
				const app = new (program.app)(window, resource);
				if (resource.plugin !== undefined) {
					if (app.pluginLoaded !== undefined)
						app.pluginLoaded(resource.plugin, onLoad);
				} else if (onLoad !== undefined)
					onLoad(app);
			}
			
			// 讀取資源
			const notLoadResource = program.notLoadResource;
			const resource = program.resource;
			for (let i = 0; i < notLoadResource.length; i++) {
				const res = notLoadResource[i];
				const resPath = appPath + res.fullName;
				if (resource[res.name] === undefined) {
					// 讀取插件
					if (res.fullName === 'plugin.js') {
						getText(resPath, function(text) {
							if (isIE10())
								text = toES5(text);
							eval('(' + text + ')')(resource.plugin = {});
							load();
						}); 
						continue;
					}
					// 讀取body
					if (res.fullName === 'body.html') {
						getText(resPath, function(text) {
							resource.body = text;
							load();
						});
						continue;
					}
					// 讀取Icon
					if (res.fullName === 'icon.svg') {
						getText(resPath, function(text) {
							const image = resource.icon = new Image();
							image.onload = load;
							image.src = resPath;
						});
						continue;
					}
				}
				if (resource[res.fullName] === undefined) {
					// 讀取css
					if (res.extension === 'css') {
						resource[res.fullName] = null;
						loadCSS(resPath, load);
						continue;
					} else if (res.extension === 'svg') {
						const image = resource[res.fullName] = new Image();
						image.onload = load;
						image.src = resPath;
						continue;
					}
				}
				load();
			}
			
			// 讀取主程式
			if (program.app === null)
				loadProgram(program, load);
			else if (typeof program.app === 'function')
				load();
			return {code: 0};
		}
		return {code: 1, message: '不是可執行檔'};
	}
	
	function getProgramIcon(name, onLoad) {
		const program = this.childFiles[name];
		if (program !== undefined && program.fileType === FileType.program) {
			const resource = program.resource;
			if (resource.icon !== undefined && onLoad !== undefined) onLoad(resource.icon);
			const notLoadResource = program.notLoadResource;
			const appPath = program.getPath().slice(1) + '/';
			for (let i = 0; i < notLoadResource.length; i++) {
				const res = notLoadResource[i];
				// 讀取Icon
				if (res.fullName !== 'icon.svg') continue;
				const resPath = appPath + res.fullName;
				getText(resPath, function(text) {
					const image = resource.icon = new Image();
					if (onLoad !== undefined)
						image.onload = onLoad(image);
					image.src = resPath;
				});
				return {code: 0};
			}
			return {code: 2, message: '找不到Icon'};
		}
		return {code: 1, message: '不是可執行檔'};
	}
	
	function addResource(name, extension) {
		this.notLoadResource.push({
			fullName: name + '.' + extension,
			name: name,
			extension: extension
		});
	}
	
	function getFile(name, onLoad) {
		const file = this.childFiles[name];
		if (file.data === null)
			if (file.extension === 'js')
				getText(program.getPath().slice(1), function(text) {
					if (isIE10())
						program.app = eval('(' + toES5(text) + ')');
					else
						program.app = eval('(' + text + ')');
					if (onLoad !== undefined) onLoad(program);
				});
			else
				getText(file.getPath().slice(1), function(text) {
					file.data = text;
					if (onLoad !== undefined) onLoad(file.data);
				});
		else
			onLoad(file.data);
		return file;
	}
	
	function loadProgram(program, onLoad) {
		out('讀取程式: ' + program.fullName);
		getText(program.getPath().slice(1) + '/' + program.name + '.js', function(text) {
			if (isIE10())
				program.app = eval('(' + toES5(text) + ')');
			else
				program.app = eval('(' + text + ')');
			if (onLoad !== undefined) onLoad(program);
		});
	}
	
	function getpath() {
		if (this.nodeType === FileNodeType.folder)
			if (this.path.length > 2) {
				if (this.path[2] === userFolder.name)
					return '~' + this.path.slice(3).join('/') + '/' + this.name;
				return this.path.join('/') + '/' + this.name;
			} else if (this.path.length === 2 && userFolder.name === this.name)
				return '~';
			else
				return this.path.join('/') + '/' + this.name;
		if (this.nodeType === FileNodeType.file)
			return this.path.join('/') + '/' + this.fullName;
		if (this.nodeType === FileNodeType.root)
			return '/';
	}
}