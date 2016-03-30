function getGeometricObject(type) {
  var result = {
    type: type
  }, 
  opts = ['a','b','c','d'];
  
  for (var i = 1; i < arguments.length; i++) {
    result[opts[i-1]] = arguments[i];
  };
  
  switch(type) {
    case 'square':
      result.getSquare = function() {
        return this.a*this.a;
      };
      break;
    case 'rectangle':
      result.getSquare = function() {
        return this.a*this.b;
      };
      break;
    case 'triangle':
      result.getSquare = function() {
        var p = (this.a+this.b+this.c)/2;
        return Math.sqrt(p*(p-this.a)*(p-this.b)*(p-this.c));
      };
      break;
    default: 
      result.getSquare = function() {
        return 'Type "' + type + '" is unsupported';
      };
      break;
  }
  return result;
}

function Animal(name, type) {
  this.stepCount = 0;
  this.name = name;
  this.type = type;
};

Animal.prototype = {
  noises: {
    cat: 'meow',
    dog: 'woof',
    rat: 'squeak'
  },
  makeNoise: function() {
    if (this.noises[this.type] === undefined) {
      return 'Kind of animal "' + this.type + '" is unsupported';
    } else {
      return this.noises[this.type];
    }
  },
  walk: function(count) {
    return this.stepCount += count;
  }
};