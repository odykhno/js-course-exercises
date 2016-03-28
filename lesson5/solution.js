function getGeometricObject(type) {
  var a = arguments[1],
      b = arguments[2],
      c = arguments[3],
  //create mapping types to getSquare function
      geoSq = {
    'square': function() {
      return a*a;
    },
    'rectangle': function() {
      return a*b;
    },
    'triangle': function() {
      var p = (a+b+c)/2;
      return Math.sqrt(p*(p-a)*(p-b)*(p-c));
    }
  },
  result = arguments;
  result.getSquare = function() {
    if (geoSq[type] === undefined) {
      return 'Such type is unsupported';
    } else {
    return geoSq[type]();
    }
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
      return 'Such kind of animal is unsupported';
    } else {
    return this.noises[this.type];
    }
  },
  walk: function(count) {
    return this.stepCount +=count;
  }
};