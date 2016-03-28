function getGeometricObject(type) {
  var result = {
        type: type
      }, 
      opts = ['a','b','c','d'];
  for (var i = 1; i < arguments.length; i++) {
    result[opts[i-1]] = arguments[i];
  }
  //create mapping types to getSquare function
  var geoSq = {
        'square': function() {
          return result.a*result.a;
        },
        'rectangle': function() {
          return result.a*result.b;
        },
        'triangle': function() {
           var p = (result.a+result.b+result.c)/2;
           return Math.sqrt(p*(p-result.a)*(p-result.b)*(p-result.c));
        }
      }
  result.getSquare = function() {
    if (geoSq[type] === undefined) {
      return 'Type "' + type + '" is unsupported';
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
      return 'Kind of animal "' + this.type + '" is unsupported';
    } else {
    return this.noises[this.type];
    }
  },
  walk: function(count) {
    return this.stepCount += count;
  }
};