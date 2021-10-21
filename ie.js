setUpIE();

function setUpIE() {
	if (String.prototype.startsWith === undefined) {
		String.prototype.startsWith = function(input) {
			for (var i = 0; i < input.length; i++) {
				if (this.charAt(i) !== input.charAt(i))
					return false;
			}
			return true;
		}
	}
}