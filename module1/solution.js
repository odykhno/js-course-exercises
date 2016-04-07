'use strict';

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Battleground() {
  this.rounds = 1;
  this.robots = [];
  this.aliveCount = 0;
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

Battleground.prototype.updateAlive = function(robot) {
  if (!robot.alive) {
    this.aliveCount--; // subtract dead robot
    console.log(robot.name + ' is out of game');
  }
};

Battleground.prototype.logRoundAttack = function(attackingRobot) {
  console.log('Round ' + this.rounds);
  console.log(attackingRobot.name + ' attacks with ' + 
              attackingRobot.weapon.power + ' power ' + 
              attackingRobot.weapon.type + ' damage');
};

Battleground.prototype.startBattle = function() {
  this.aliveCount = this.robots.length;
  while (this.aliveCount > 1) {
    for (var i = 0; i < this.robots.length; i++) {
      if (this.robots[i].alive) { // exclude turn of dead robot
        this.logRoundAttack(this.robots[i]);
        if (this.robots[i].weapon.type == 'area') {
          for (var j = 0; j < this.robots.length; j++) {
            if (i != j && this.robots[j].alive) {
              this.robots[i].attack(this.robots[j]);
              this.updateAlive(this.robots[j]);
            }
          }
        } else {
          var randRobot = this.randomRobot(i);
          this.robots[i].attack(this.robots[randRobot]);
          this.updateAlive(this.robots[randRobot]);
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
  console.log(otherRobot.name + ' receives ' +
              this.weapon.power + ' points damage');
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
    var robot = new Robot('Robot' + (i+1));
    bg.addRobot(robot);
  }
  return bg;
}

var bg = makeBattle(4);
bg.startBattle();