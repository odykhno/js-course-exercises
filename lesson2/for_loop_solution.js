function numberGenerator() {
for (var i = 0; i < 5; i++) {
  var min = 1, 
      max = 20,
      num = Math.floor(min + Math.random() * (max + 1 - min));
  if (num % 2 == 0) {
  console.log (num + ' четное');
  } else console.log (num + ' нечетное');
}
}

function multiplicationTable() {
    var prod;
  for (var i = 1; i <= 10; i++) {
    for (var j = 1; j <= 10; j++) {
      prod = i * j;
      console.log (i + ' * ' + j + ' = ' + prod);
    }
  }
    }

function checkAssignGrade() {
for (var i = 80; i <= 100; i++) {
  console.log ('Для i=' + i + ' оценка ' + assignGrade(i));
}
}
