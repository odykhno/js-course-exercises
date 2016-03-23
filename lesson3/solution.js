function hasRepeatingElements(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i], i+1) != -1) {
      return true;
    }
  }
  return false;
}

function negativeElementsSum(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == 0) {
      for (var j = i+1; j < arr.length; j++) {
        if (arr[j] < 0) {
          sum += arr[j];
        } 
      }
      break;
    }
  }
  return sum;
}

function commonElements(arr1, arr2) {
  var res = [];
  for (var i = 0; i < arr1.length; i++) {
    for (var j = 0; j < arr2.length; j++) {
      if (arr1[i] == arr2[j]) {
        res.push(arr1[i]);
      }
    }
  }
  return res;
}

function identityMatrix(size) {
  var res = [];
  if (size < 1 || size > 10) {
    return null;
  } else {
    for (var i = 0; i < size; i++) {
      res[i] = [];
      for (var j = 0; j < size; j++) {
        if (i == j) {
          res[i][j] = 1;
        } else {
          res[i][j] = 0;
        }
      }
    }
  }
  return res;
}
