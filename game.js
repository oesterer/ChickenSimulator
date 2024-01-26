const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const chickenImg = document.getElementById("chicken");
const cornImg = document.getElementById("corn");
const dogImg = document.getElementById("dog")
const grassImg = document.getElementById("grass")
const dirtImg = document.getElementById("dirt")
const waterImg = document.getElementById("water")
const npcImg = document.getElementById("npc")

const LOITERING=0;
const MOVING=1;

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
    this.sound.currentTime = 0;
  }
}

v1=new Vector(10,50);
v2=new Vector(20,30);
v1.print();
v2.print();
v1.add(v2).print();
v1.sub(v2).print();
console.log(v2.length());
v1.mul(5).print();
v1.div(5).print();
v1.unitVector().print();


chickenSound = new sound("chicken-sound.mp3");

world = {
  w: 4000,
  h: 4000
};

view = {
  x: 0,
  y: 0,
  w: canvas.width,
  h: canvas.height
}

chicken = {
  position:new Vector(30,30),
  w: 80,
  h: 80,
  speedX: 0,
  speedY: 0
};


dog = {
  position:new Vector(700,30),
  direction:new Vector(-1,1),
  w: 174,
  h: 130,
  speed: 10
};

cornCount=200;


class Location {
    constructor(name, position) {
        this.name = name;
        this.position = position;      
    }

    print() {
        console.log(this.name+" at "+this.position.toString());
    }
}

locations=[];
locations.push(new Location("Trampoline",new Vector(50,50)));
locations.push(new Location("Yard",new Vector(100,100)));
locations.push(new Location("Yard1",new Vector(100,1002)));
locations.push(new Location("Yard2",new Vector(200,502)));
locations.push(new Location("Yard3",new Vector(300,803)));
locations.push(new Location("Yard4",new Vector(300,504)));
locations.push(new Location("Yard5",new Vector(500,105)));

for (i = 0; i < locations.length; i++) {
    locations[i].print();
}

/*
class NonPlayableChicken {
  constructor(name, position) {
    this.name = name;
    this.position = position;
    this.status = MOVING;
    this.target = position;
    this.speed = 5;
    this.w = 80;
    this.h = 80;
  }

  setTarget(target) {
    this.target = target;
    this.status = MOVING;
  }

  updatePosition() {
    if(this.status==MOVING) {
        let direction=this.target.sub(this.position);
        let distance=direction.length();
        direction=direction.unitVector()

        if(distance<2*this.speed) {
            this.pickNextTarget();            
        } else {
            this.position=this.position.add(direction.mul(this.speed));
        }
    }
  }

    pickNextTarget() {
        let i=Math.floor(Math.random()*locations.length);
        let target=locations[i];
        console.log(this.name+" going to "+target.name);
        this.setTarget(target.position);
    }

    print() {
        console.log(this.name+" at "+this.position.toString());
    }
}
*/


for (i = 0; i < cornCount; i++) {
    corn[i]= {
        x: Math.floor(Math.random() * (world.w-25)),
        y: Math.floor(Math.random() * (world.h-100)),
        w: 25,
        h: 100,
        eaten: false
    };
}


let npc=[];
npc.push(new NonPlayableChicken("Miso",new Vector(0,0)));
//npc.push(new NonPlayableChicken("Inari",new Vector(100,100)));
//npc.push(new NonPlayableChicken("Omlet",new Vector(100,100)));
//npc.push(new NonPlayableChicken("Boba",new Vector(100,100)));

for (i = 0; i < npc.length; i++) {
    npc[i].print();
}


points=0;
stopSound=-1;
dogTouch=-1;



let fps = 60;

let gameLoop = () => {
	update();
	updateDog();

    for (i = 0; i < npc.length; i++) {
        npc[i].update();
        //npc[i].print();
    }

    draw();

    for (i = 0; i < cornCount; i++) {
	   if(checkCollision(chicken,corn[i])) {
            //console.log("Collision!!!");
            corn[i].x=Math.floor(Math.random() * (world.w-corn[i].w));
            corn[i].y=Math.floor(Math.random() * (world.h-corn[i].h));
            points++;
            chickenSound.play();
		    stopSound=45;
        }
	}

	if(checkCollision(chicken,dog)) {
		if(dogTouch<=0) {
			points--;
		    dogTouch=20;
		}
	}

	if(dogTouch>=0) {
		dogTouch--;
	}

	if(stopSound>=0) {
		stopSound--;
	}
	if(stopSound<=0) {
		stopSound=-1;
        chickenSound.stop();
	}    
};



let drawBackground = () => {

    if(chicken.position.x<view.x+view.w/4) {
        view.x=chicken.position.x-view.w/4;
    } else if(chicken.position.x>view.x+view.w*3/4) {
        view.x=chicken.position.x-view.w*3/4;
    }

    if(chicken.position.y<view.y+view.h/4) {
        view.y=chicken.position.y-view.h/4;
    } else if(chicken.position.y>view.y+view.h*3/4) {
        view.y=chicken.position.y-view.h*3/4;
    }

    if(view.x<0)view.x=0;
    if(view.x>(world.w-view.w))view.x=world.w-view.w;

    if(view.y<0)view.y=0;
    if(view.y>(world.h-view.h))view.y=world.h-view.h;

    canvasContext.clearRect(0, 0, view.w, view.h);

    for (x = 0; x < 40; x++) {
        for (y = 0; y < 40; y++) {
            tileX=x*100-view.x;
            tileY=y*100-view.y;
            if(background[y][x]==0){
                canvasContext.drawImage(grassImg,1,1,232,232,tileX,tileY,100,100);
            } else if(background[y][x]==1){
                canvasContext.drawImage(dirtImg,1,1,232,232,tileX,tileY,100,100);
            } else if(background[y][x]==2){
                canvasContext.drawImage(waterImg,1,1,232,232,tileX,tileY,100,100);
            }
        }
    }
}

background=[[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [2,2,2,2,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [2,2,2,2,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];


let gameInterval = setInterval(gameLoop, 1000 / fps);


let draw = () => {
    drawBackground();
    
    canvasContext.drawImage(chickenImg,0,0,32,32,chicken.position.x-view.x,chicken.position.y-view.y,chicken.w,chicken.h);
    for (i = 0; i < cornCount; i++) {
        canvasContext.drawImage(cornImg,0,0,214,854,corn[i].x-view.x,corn[i].y-view.y,corn[i].w,corn[i].h);
    }

    let viewVector=new Vector(view.x,view.y);
    for (i = 0; i < npc.length; i++) {
        let vector=npc[i].position.sub(viewVector);
        canvasContext.drawImage(npcImg,0,0,32,32,vector.x,vector.y,npc[i].w,npc[i].h);
        //console.log("NPC x "+npc[i].x+" y "+npc[i].y);
    }

    //canvasContext.scale(-1,1)
    canvasContext.drawImage(dogImg,0,0,348,261,dog.position.x-view.x,dog.position.y-view.y,dog.w,dog.h);
    //canvasContext.scale(1,1)

    canvasContext.font = "48px serif";
	canvasContext.fillText("Points: "+points, 750, 50);
    canvasContext.font = "18px serif";
	//canvasContext.fillText("Speed: "+speed, 5, 20);

};

let updateDog = () => {
    dog.position=dog.position.add(dog.direction.mul(dog.speed));

    //console.log("Dog position "+dog.position+" direction "+dog.direction);

    if(dog.position.x<=0 ||
       dog.position.x>=(world.w-dog.w) ||
       dog.position.y<=0 ||
       dog.position.y>=(world.h-dog.h) ||
       Math.floor(Math.random()*1000)<5) {

        v=chicken.position.sub(dog.position);

//console.log("v "+v);
//console.log("v.length "+v.length);
        v=v.div(v.length());



        dog.direction=v;
    }


/*
	if(dog.position.x<=0) {
		dog.speedX=Math.floor(Math.random() * 15) + 3;
	} else if(dog.position.x>=(world.w-dog.w)) {
		dog.speedX=-1*(Math.floor(Math.random() * 15) + 3);
	}

	if(dog.position.y<=0) {
		dog.speedY=Math.floor(Math.random() * 15) + 3;
	} else if(dog.position.y>=(world.h-dog.h)) {
		dog.speedY=-1*(Math.floor(Math.random() * 15) + 3);
	}

*/    
}


let updateNpc = (npc) => {


    if(Math.floor(Math.random()*1000)<5) {
        npc.speedX=Math.floor(Math.random() * 10)-5;
    }
    if(Math.floor(Math.random()*1000)<5) {
        npc.speedY=Math.floor(Math.random() * 10)-5;
    }

    npc.x=npc.x+npc.speedX;
    npc.y=npc.y+npc.speedY;

    if(npc.x<=0) {
        npc.speedX=Math.floor(Math.random() * 5);
    } else if(npc.x>=(world.w-npc.w)) {
        npc.speedX=-1*(Math.floor(Math.random() * 5));
    }

    if(npc.y<=0) {
        npc.speedY=Math.floor(Math.random() * 5);
    } else if(npc.y>=(world.h-npc.h)) {
        npc.speedY=-1*(Math.floor(Math.random() * 5));
    }
}


let update = () => {	
    chicken.position.x+=chicken.speedX;
    if(chicken.position.x<=0) {
        chicken.position.x=0;
        chicken.speedX=0;
    }
    if(chicken.position.x>=(world.w-chicken.w)) {
        chicken.position.x=(world.w-chicken.w);
        chicken.speedX=0;
    }

    chicken.position.y+=chicken.speedY;
    if(chicken.position.y<=0) {
        chicken.position.y=0;
        chicken.speedY=0;
    }
    if(chicken.position.y>=(world.h-chicken.h)) {
        chicken.position.y=(world.h-chicken.h);
        chicken.speedY=0;
    }
};

let checkCollision = (rect1,rect2) => {  
  if (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  ) {
    //console.log("Collision!!!");
    return true;
  } else {
    // No collision
    //console.log("No collision");
    return false;
  }
};

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;

    if (k == 37 || k == 65) {
        // left arrow or a
        if(chicken.speedX<0) {
            if(chicken.speedX>=-10)chicken.speedX--;
        } else {
            chicken.speedX=-1; 
        }
    } else if (k == 38 || k == 87) {
        // up arrow or w
        // left arrow or a
        if(chicken.speedY<0) {
            if(chicken.speedY>=-10)chicken.speedY--;
        } else {
            chicken.speedY=-1; 
        }
    } else if (k == 39 || k == 68) {
        // right arrow or d
        if(chicken.speedX>0) {
            if(chicken.speedX<=10)chicken.speedX++;
        } else {
            chicken.speedX=1; 
        } 
    } else if (k == 40 || k == 83) {
        if(chicken.speedY>0) {
            if(chicken.speedY<=10)chicken.speedY++;
        } else {
            chicken.speedY=1; 
        }                    
    }    
});

window.addEventListener("keyup", (event) => {
    let k = event.keyCode;
    if (k == 37 || k == 65) {
        // left arrow or a
        chicken.speedX=0;  
    } else if (k == 38 || k == 87) {
        // up arrow or w
        chicken.speedY=0;
    } else if (k == 39 || k == 68) {
        // right arrow or d
        chicken.speedX=0;  
    } else if (k == 40 || k == 83) {
        chicken.speedY=0;                    
    }     
});