//알고리즘 교체하기

function foundPerson(people) {
    for (let i = 0; i < people.length; i++) {
        if (people[i] === "Don") {
            return "Don";
        }
        if (people[i] === "John") {
            return "John";
        }
        if (people[i] === "Kent") {
            return "Kent";
        }
    }
}

↓

function foundPerson(people) {
    const candidates = ["Don", "John", "Kent"];
    return people.find(p => candidates.includes[p]) || '';
}

//배경
//복잡한코드를 간결하게 바꾸는게 여러모로 좋음
//문제를 더 확실히 이해하고 훨씬 쉽게 해결하는 방법을 발견했을때
//내코드와 똑같은 기능을 제공하는 라이브러리를 찾았을때

//이작업을 착수하려면 반드시 메서드를 가능한 잘게 나눴는지 확인해야한다.
//거대하고 복잡한 알고리즘을 교체하기란 상당히 어려우니 알고리즘을 간소화하는 작업부터 해야 교체가 쉬워진다.

//절차
//1. 교체할 코드를 함수 하나에 모은다.
//2. 이 함수만을 이용해 동작을 검증하는 테스트를 마련한다.
//3. 대체할 알고리즘을 준비한다.
//4. 정적 검사를 수행한다.
//5. 기존 알고리즘과 새알고리즘의 결과를 비교하는 테스트수행, 두결과가같다면 리팩터링은끝
//   그렇지 않다면 기존 알고리즘을 참고해서 새 알고리즘을 테스트하고 디버깅한다.