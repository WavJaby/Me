'use strict';
/* FileSystem
/System
	/programs
	/settings
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

const systemRoot = {
	nodeType: 0,
	name: '',
	path: [''],
	parentDir: null,
	childDirs: {},
	childFiles: {}
};
function FileSystem() {
	const FileNodeType = {folder:0, file:1};
	const FileType = {text:0, program:1};
	
	this.init = function() {
		const systemFolder = mkdir('System', systemRoot);
		const programFolder = systemFolder.mkdir('programs');
		out(programFolder.getPath())
		// systemFolder.mkdir('settings');
		// const homeFolder = mkdir('home', systemRoot);
		// homeFolder.mkdir('WavJaby');
	}
	
	function FileNode() {
		this.type = FileNodeType.file;
	}
	
	function mkdir(name, folderNode) {
		if (folderNode === undefined) folderNode = this;
		console.log(folderNode);
		const dir = {
			type: FileNodeType.folder,
			name: name,
			parentDir: folderNode,
			childDirs: {},
			childFiles: {},
			
			mkdir: mkdir,
			getPath: getpath,
		};
		const path = folderNode.path;
		const newPath = [];
		for (let i = 0; i < path.length; i++)
			newPath.push(path[i]);
		newPath.push(name);
		
		dir.path = newPath;
		folderNode.childDirs[name] = dir;
		return dir;
	}
	
	function getpath() {
		return this.path.join('/') + '/';
	}
}