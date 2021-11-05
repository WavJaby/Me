'use strict';
/* FileSystem
/System
	/Programs
	/Settings
/home
	/WavJaby
		/Desktop
		/Download
		/Document
		
*/


/* FileNodeType
folder: 0
file: 1
*/

/* FileNode
nodeType: FileNodeType
fileType: FileType
name: String
path: Array

parentNode: FileNode
childFolders: Array
childFiles: Array
*/

function FileSystem() {
	const FileNodeType = {root:-1, folder:0, file:1};
	const FileType = {text:0, program:1};
	
	const systemRoot = {
		nodeType: -1,
		name: '',
		path: [],
		parentDir: null,
		childDirs: {},
		childFiles: {},
		
		cd: cd,
		mkdir: mkdir,
		getPath: getpath,
		tree: tree,
		treeText: treeText,
	};
	this.getRoot = function(){return systemRoot;};
	
	this.init = function(fileSystemLoaded) {
		const systemFolder = systemRoot.mkdir('System');
		const programFolder = systemFolder.mkdir('Programs');
		const settingsFolder = systemFolder.mkdir('Settings');
		const userFolder = systemRoot.mkdir('home/WavJaby');
		userFolder.mkdir('Desktop');
		userFolder.mkdir('Download');
		userFolder.mkdir('Document');
		userFolder.cd('Desktop').createFile('HelloWorld', 'txt', FileType.text, 'Hello World!');
		
		const terminalAPP = programFolder.createFile('Terminal', 'app', FileType.program);
		terminalAPP.pluginName = 'plugin.js';
		terminalAPP.addResource('Terminal', 'css');
		programFolder.createFile('About', 'app', FileType.program);
		// const about = programFolder.mkdir('About').createFile('about', 'app', FileType.program);
		
		
		// out(systemRoot.tree(true))
		out(systemRoot.treeText())
		// out(systemRoot)
		
		fileSystemLoaded();
	}
	
	function createFile(name, extension, fileType) {
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
			file.plugin = null;
			file.pluginName = null;
			file.resource = [];
			file.addResource = addResource;
		} else
			file.data = null;
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
		// 創建資料夾
		const dir = {
			nodeType: FileNodeType.folder,
			name: name,
			parentDir: fileNode,
			childDirs: {},
			childFiles: {},
			
			cd: cd,
			mkdir: mkdir,
			createFile: createFile,
			open: open,
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
					return undefined;
			else if (paths[i] === '.')
				continue;
			else {
				fileNode = fileNode.childDirs[paths[i]];
				if (fileNode === undefined) return undefined;
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
	
//##############################檔案##############################
	function open(name, onLoad) {
		const program = this.childFiles[name];
		if (program.nodeType === FileType.program) {
			const appPath = program.getPath() + program.fullName + '/';
			let resource = program.resource;
			let resLoad = 0;
			function load() {
				if (resLoad++ < resource.length) return;
				const app = new (program.app)();
				if (program.plugin === null && program.pluginName !== null) {
					// 讀取插件
					getFileText(appPath + program.pluginName, function(text) {
						program.plugin = {};
						if (isIE10())
							eval('(' + toES5(text) + ')')(program.plugin);
						else
							eval('(' + text + ')')(program.plugin);
						if (app.pluginLoaded !== undefined)
							app.pluginLoaded(program.plugin, onLoad);
					});
				} else if (typeof program.app === 'function') {
					if (app.pluginLoaded !== undefined)
						app.pluginLoaded(program.plugin, onLoad);
				} else 
					onLoad(app);
			}
			
			for (let i = 0; i < resource.length; i++) {
				const res = resource[i];
				res.loaded = true;
				if (res.extension === 'css')
					loadCSS(appPath + res.fullName, load);
				else
					load();
			}
			
			if (program.app === null)
				loadProgram(program, load);
			else if (typeof program.app === 'function')
				load();
			return {code: 0};
		}
		return {code: 1, message: '不是可執行檔'};
	}
	
	function addResource(name, extension) {
		this.resource.push({
			fullName: name + '.' + extension, 
			name: name, 
			extension: extension, 
			loaded: false
		});
	}
	
	function getFile(name, onLoad) {
		const file = this.childFiles[name];
		if (file.data === null)
			if (file.extension === 'js')
				getFileText(program.getPath() + program.fullName, function(text) {
					if (isIE10())
						program.app = eval('(' + toES5(text) + ')');
					else
						program.app = eval('(' + text + ')');
					if (onLoad !== undefined) onLoad(program);
				});
			else
				getFileText(file.getPath() + file.fullName, function(text) {
					file.data = text;
					if (onLoad !== undefined) onLoad(file);
				});
		else
			onLoad(file);
		return file;
	}
	
	function loadProgram(program, onLoad) {
		getFileText(program.getPath() + program.fullName + '/' + program.name + '.js', function(text) {
			if (isIE10())
				program.app = eval('(' + toES5(text) + ')');
			else
				program.app = eval('(' + text + ')');
			if (onLoad !== undefined) onLoad(program);
		});
	}
	
	function getpath() {
		if (this.nodeType === FileNodeType.folder)
			return this.path.join('/') + '/' + this.name + '/';
		if (this.nodeType === FileNodeType.file)
			return this.path.join('/') + '/';
	}
}