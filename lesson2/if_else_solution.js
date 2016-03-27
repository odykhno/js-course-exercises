function greaterNum (a,b) {
  return (a > b) ? a : b;
}

function helloWorld(lang) {
switch (lang) {
case 'en':
  return'Hello';
  break;
case 'ua':
  return'Привіт';
  break;
case 'es':
  return'Hola';
  break;
default:
  return'Привет';
}
}

function assignGrade(mark) {
     if (mark <= 0) {
       return 'Such mark doesn\'t exists';
     } else if (mark >=1 && mark <=20) {
       return 1;
     } else if (mark <= 40) {
       return 2;
     } else if (mark <= 60) {
       return 3;
     } else if (mark <= 80) {
       return 4;
     } else {
       return 5;
     }
}

