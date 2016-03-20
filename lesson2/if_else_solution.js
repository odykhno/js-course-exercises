function greaterNum(a,b) {
if (a>b) return a;
else return b;
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

function assignGrade(ball) {
     if (ball >=1 && ball <=20) {
     return 1;
      } else if (ball <= 40) {
      return 2;
       } else if (ball <= 60) {
         return 3;
         } else if (ball <= 80) {
           return 4;
            } else {
              return 5;
      }
     }

