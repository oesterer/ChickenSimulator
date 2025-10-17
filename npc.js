class NonPlayableChicken {

  constructor(name, position) {
    this.name = name;
    this.position = position;
    this.queue = [];
    this.programPath();
    this.w = 80;
    this.h = 80;
    this.index = 0;
  }

  programPath() {
  	this.queue.push({action:"MOVE",target:new Vector(100,100),speed:2});
  	this.queue.push({action:"MOVE",target:new Vector(200,120),speed:3});
  	this.queue.push({action:"PAUSE",duration:50});
  	this.queue.push({action:"MOVE",target:new Vector(200,300),speed:4});
  	this.queue.push({action:"JUMP",duration:100,height:10});
  	this.queue.push({action:"MOVE",target:new Vector(400,300),speed:5});
  	this.queue.push({action:"MOVE",target:new Vector(550,300),speed:6});
  	this.queue.push({action:"LAY_EGG"});
  	this.queue.push({action:"PICK_NEW_TARGET"});
  }

  update() {

  	let step=null;
  	if(this.index<this.queue.length) {
  		step=this.queue[this.index];
  	} else {
  		return;
  	}

  	if(step.action=="MOVE") {
        let direction=step.target.sub(this.position);
        let distance=direction.length();
        direction=direction.unitVector()
        if(distance< (5+2*step.speed)) {
            this.index++;            
        } else {
            this.position=this.position.add(direction.mul(step.speed));
        }
  	} else if(step.action=="LAY_EGG") {
  		console.log(this.name+" is laying an egg");
  		this.index++;
  	} else if(step.action=="PICK_NEW_TARGET") {
  		this.programPath();
  		this.index++;
  	} else if(step.action=="PAUSE") {
  		if(step.duration>0) {
  			step.duration--;
  		} else {
  			this.index++;
  		}
    } else if(step.action=="JUMP") {
  		if(step.duration>0) {
  			step.duration--;
  			if(step.duration%8>3) {
  				this.position.y=this.position.y+step.height/4;
  			} else{
  				this.position.y=this.position.y-step.height/4;
  			}
  		} else {
  			this.index++;
  	    }
  	}

  }

  print() {
        console.log(this.name+" at "+this.position.toString());
  }
}