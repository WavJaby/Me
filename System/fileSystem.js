'use strict';
/* FileSystem
/system
	/programs
	/settings
/home
	/user
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

const systemRoot = {};
function SystemFileSystem() {
	const FileNodeType = {folder:0, file:1};
	const FileType = {text:0, program:1};
	
	this.init = function() {
		systemRoot
	}
	
	function mkdir(path) {
		return
	}
}