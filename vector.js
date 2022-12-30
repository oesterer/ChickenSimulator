class Vector {

	constructor(x, y) {
		this.x=x;
		this.y=y;
	}

	add(v2) {
		return new Vector(this.x+v2.x,this.y+v2.y);
	}

	sub(v2) {
		return new Vector(this.x-v2.x,this.y-v2.y);
	}

	length() {
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}

	mul(num) {
		return new Vector(this.x*num,this.y*num);
	}

	div(num) {
		return new Vector(this.x/num,this.y/num);
	}	

	unitVector() {
		return this.div(this.length());
	}

	print() {
		console.log(this.toString());
	}

	toString() {
		return "["+this.x+","+this.y+"]";
	}
}