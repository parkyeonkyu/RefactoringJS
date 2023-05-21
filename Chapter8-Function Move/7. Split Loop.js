//반복문 쪼개기

let averageAge = 0;
let totalSalary = 0;
for (const p of people) {
    averageAge += p.age;
    totalSalary += p.salary;
}
averageAge = averageAge / people.length;

▽

let totalSalary = 0;
for (const p of people) {
    totalSalary += p.salary;
}

let averageAge = 0;
for (const p of people) {
    averageAge += p.age;
}
averageAge = averageAge / people.length;


//배경
//종종 반복문하나에서 두가지 일을 수행하는 모습을 보게된다.
//그저 두 일을 한꺼번에 처리할 수 있다는 이유에서 말이다.
//하지만 이렇게 하면 반복문을 수정할때마다 두가지 일 모두를 잘이해하고 진행해야한다.
//반대로 각각의 반복문으로 분리해두면 수정할 동작 하나만 이해하면된다.

//반복문을 분리하면 사용하기도 쉬워진다. 한가지 값만 계산하는 반복문이라면 그 값만 곧바로 반환할 수 있다.
// 반면 여러 일을 수행하는 반복문이라면 구조체를 반환하거나 지역 변수를 활용해야 한다.
//참고로 반복문 쪼개기는 서로 다른일들이 한 함수에서 이뤄지고 있다는 신호일수있고,
//그래서 반복문 쪼개기와 함수추출하기는연이어 수행하는 일이 잦다.

//반복문을 두 번 실행해야 하므로 이 리팩토링을 불편해하는 프로그래머도 많다
//다시 한번 이야기하지만 리팩토링과 최적화를 구분하자.
//최적화는 코드를 깔끔하게 정리한 이후에 수행하자. 반복문을 두번 실행하는게 병목이라 밝혀지면 그때 다시하나로 합치기는 식은죽 먹기다
//하지만 심지어 긴 리스트를 반복하더라도 병목으로 이어지는 경우는 드물다.
//오히려 반복문 쪼개기가 다른 더 강력한 최적화를 적용할 수 있는 길을 열어주기도 한다.