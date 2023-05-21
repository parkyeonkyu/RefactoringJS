class Person {
    get officeAreacode() { return this._officeAreaCode; }
    get officeNumber() { return this._officeNumber; }
}

↓

class Person {
    get officeAreacode() { return this._telephoneNumber.areacode; }
    get officeNumber() { return this._telephoneNumber.number; }
}

class TelephoneNumber {
    get areaCode() { return this._areaCode; }
    get number() { return this._number; }
}

//클래스 추출하기

//배경 
//클래스는 반드시 명확하게 추상화하고 소수의 주어진 역할만 처리해야한다는 가이드라인을 들어봤을것이다.
//하지만 실무에서는 몇 가지 연산을 추가하고 데이터도 보강하면서 클래스가 점점 비대해지곤한다.
//기존 클래스를 굳이 쪼갤 필요까지는 없다고 생각하여 새로운 역할을 덧씌우기 쉬운데,
//역할이 갈수록 많아지고 새끼를 치면서 클래스가 굉장히 복잡해진다.
//그러다보면 어느새 전자레인지로 바짝 익힌 음식처럼 딱딱해지고 만다.

//메서드와 데이터가 너무 많은 클래스는 이해하기가 쉽지 않으니 잘 살펴보고 적절히 분리하는것이 좋다.
//특히 일부 데이터와 메서드를 따로 묶을 수 있다면 어서 분리하라는 신호다. 
//함께 변경되는 일이 많거나 서로 의존하는 데이터들도 분리한다.
//특정 데이터나 메서드 일부를 제거하면 어떤일이 일어나는지 자문해보면 판단에 도움이 된다.
//제거해도 다른 필드나 메서드 들이 논리적으로 문제가 없다면 분리할 수 있다는 뜻이다

//절차
//1. 클래스의 역할을 분리할 방법을 정한다.
//2. 분리될 역할을 담당할 클래스를 새로 만든다.
//>>> 원래 클래스에 남은 역할과 클래스 이름이 어울리지 않는다면 적절히 바꾼다.
//3. 원래 클래스의 생성자에서 새로운 클래스의 인스턴스를 생성하여 필드에 저장해둔다.
//4. 분리될 역할에 필요한 필드들을 새 클래스로 옮긴다(8.2필드옮기기), 하나씩 옮길때마다 테스트한다.
//5. 메서드들도 새 클래스로 옮긴다(8.1함수옮기기), 이때 저수준 메서드, 즉 다른 메서드를 
//호출하기보다는 호출당하는 일이 많은 메서드부터 옮긴다. 하나씩 옮길때마다 테스트한다.
//6. 양쪽 클래스의 인터페이스를 살펴보면서 불필요한ㅁ ㅔ서드를 제거하고, 이름도 새로운 환경에 맞게 바꾼다.
//7. 새 클래스를 외부로 노출할지 정한다. 노출하려거든 새 클래스에 참조를 값으로 바꾸기(9.4) 적용할지 고민해본다.

//예시
class Person {
    get name() { return this._name; }
    set name(args) { this._name = arg; }
    get telephoneNumber() { return `(${this.officeAreacode}) ${this.officeNumber}`; }
    get officeAreaCode() { return this._officeAreaCode; }
    set officeAreaCode(arg) { this._officeAreaCode = arg; }
    get officeNumber() { return this._officeNumber; }
    set officeNumber(arg) { this._officeNumber = arg; }
}

//1. 여기서 전화번호 관련 동작을 별도 클래스로 뽑아보자.
//2. 먼저 빈 전화번호를 표현하는 TelephoneNumber클래스를 정의한다.

class TelephoneNumber {

}

//3. 다음으로 Person클래스의 인스턴스를 생성할때 전화번호 인스턴스도 함께 생성해 저장해둔다.
//Person클래스...
constructor(){
    this._telephoneNumber = new TelephoneNumber();
}
//TelephoneNumber클래스..
get officeAreacode() { return this._officeAreaCode; }
set officeAreacode(arg) { this._officeAreaCode = arg; }

//4. 그런다음 필드들을 하나씩 새클래스로 옮긴다.
//Person클래스
get officeAreaCode() { return this._telephoneNumber.officeAreaCode; }
set officeAreaCode(arg) { this._telephoneNumber.officeAreaCode = arg; }

//테스트 해서 문제없으면 다음 필드로 넘어간다.
//TelephoneNumber클래스..
get officeNumber(){ return this._officeNumber; }
set officeNumber(arg) { this._officeNumber = arg; }

//Person클래스
get officeNumber() { return this._telephoneNumber.officeNumber; }
set officeNumber(arg) { this._telephoneNumber.officeNumber = arg; }

//다시 테스트해보고 5.이어서 telephoneNumber()메서드를 옮긴다.
//TelephoneNumber클래스
get telephoneNumber() { return `(${this.officeAreacode}) ${this.officeNumber}`; }

//Person클래스
get telephoneNumber() { return this._telephoneNumber.telephoneNumber; }

//6.이제 정리할 차례, 새로만든 클래스는 순수한 전화번호를 뜻하므로 사무실이란 단어를 쓸 이유가없다.
// 마찬가지로 전화번호라는 뜻도 메서드 이름에서 다시 강조할 이유가 없다.
// 그러니 메서드들의 이름을 적절히 바꿔주자 (함수선언바꾸기 6.5)
//TelephoneNumber클래스
get areaCode() { return this._areaCode; }
set areaCode(arg) { this._areaCode = arg; }
get number(){ return this._number; }
set number(arg) { this._number = arg; }

//Person클래스
get officeAreaCode() { return this._telephoneNumber.areaCode; }
set officeAreaCode(arg) { this._telephoneNumber.areaCode = arg; }
get officeNumber() { return this._telephoneNumber.number; }
set officeNumber(arg) { this._telephoneNumber.number = arg; }


//마지막으로 전화번호를 사람이 읽기 좋은 포맷으로 출력하는 역할도 전화번호 클래스에 맡긴다.
//TelephoneNumber클래스
toString() { return `(${this.areaCode}) ${this.number}`; }

//Person클래스
get telephoneNumber() { return this._telephoneNumber.toString(); }

//7. 전화번호는 여러모로 쓸모가 많으니 이 클래스는 클라이언트에게 공개하는것이 좋겠다.
//그러면 "office"로 시작하는 메서드들을 없애고 TelephoneNumber의 접근자를 바로 사용하도록 바꿀 수 있다.
//그런데 기왕 이렇게 쓸 거라면 전화번호를 값 객체 로 만드는게 나으니 참조를 값으로 바꾸기(9.4)부터 적용한다.

