'use strict';

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Battleground() {
  this.rounds = 1;
  this.robots = [];
}

Battleground.prototype.addRobot = function(robot) {
  this.robots.push(robot);
};

Battleground.prototype.randomRobot = function(attackingRobot) {
  var damagedRobot;
  do {
    damagedRobot = random(0, this.robots.length-1);
  } while (damagedRobot == attackingRobot || !this.robots[damagedRobot].alive);
  return damagedRobot;
};

Battleground.prototype.isDead = function(robot, aliveCount) {
  if (!robot.alive) {
    aliveCount--; // subtract dead robot
    console.log(robot.name + ' is out of game');
  }
  return aliveCount;
};

Battleground.prototype.startBattle = function() {
  // remember number of alive robots before battle
  var aliveCount = this.robots.length;
  while (aliveCount > 1) {
    for (var i = 0; i < this.robots.length; i++) {
      if (this.robots[i].alive) { // exclude turn of dead robot
        console.log('Round ' + this.rounds);
        console.log(this.robots[i].name + ' attacks with ' + 
                    this.robots[i].weapon.power + ' power ' + 
                    this.robots[i].weapon.type + ' damage');
        if (this.robots[i].weapon.type == 'area') {
          for (var j = 0; j < this.robots.length; j++) {
            if (i != j && this.robots[j].alive) {
              this.robots[i].attack(this.robots[j]);
              console.log(this.robots[j].name + ' receives ' +
                          this.robots[i].weapon.power + ' points damage');
              aliveCount = this.isDead(this.robots[j], aliveCount);
            }
          }
        } else {
          var randRobot = this.randomRobot(i);
          this.robots[i].attack(this.robots[randRobot]);
          console.log(this.robots[randRobot].name + ' receives ' + 
                      this.robots[i].weapon.power + ' points damage');
          aliveCount = this.isDead(this.robots[randRobot], aliveCount);
        }
        this.rounds++;
      }
    }
  }
  // search for the only alive robot 
  var aliveRobot = this.robots.filter(function(robot){
    return robot.alive;
  })[0];
  console.log(aliveRobot.name + ' wins!!!');
};

Battleground.prototype.size = function() {
  return this.robots.length;  
};

function Robot(name) {
  this.name = name;
  this.alive = true;
  this.health = random(20, 50);
  this.weapon = makeWeapon();
}

Robot.prototype.receiveDamage = function(points) {
  if (this.health - points <= 0) {
    this.health = 0;
    this.alive = false;
  } else {
    this.health -= points;
  }
  return this;
};

Robot.prototype.attack = function(otherRobot) {
  otherRobot.receiveDamage(this.weapon.power);
  return otherRobot;
};

function makeWeapon() {
  var power, type,
  randType = random(1,2);
  randType == 1 ? type = 'area': type = 'single';
  power = random(5, 20);
  return new Weapon(type, power);
}

function Weapon(type, power) {
  this.type = type;
  this.power = power;
}

function makeBattle(robotCount) {
  if (robotCount <= 1) {
    throw new Error ('robotCount is too few to start a battle!');
  }
  var bg = new Battleground();
  for (var i = 0; i < robotCount; i++) {
    var robotNumber = i+1;
    var robot = new Robot('Robot' + robotNumber);
    bg.addRobot(robot);
  }
  return bg;
}

var bg = makeBattle(4);
bg.startBattle();