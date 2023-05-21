//필드 옮기기
class Customer {
    get plan() { return this._plan; }
    get discountRate() { return this._discountRate; }
}

▽

class Customer {
    get plan() { return this._plan; }
    get discountRate() { return this.plan.discountRate; }
}

//배경
//프로그램 상당부분이 동작구현코드로 이루어지지만, 프로그램의 진짜 힘은 데이터 구조에서 나온다.
//주어진 문제에 적합한 데이터 구조를 활용하면 동작 코드는 자연스럽게 단순하고 직관적으로 짜여진다. 
//반면 데이터 구조를 잘못 선택하면 아귀가 맞지 않는 데이터를 다루기 위한 코드로 범벅이 된다.
//이해하기 어려운 코드가 만들어지는 데서 끝나지 않고, 데이터 구조 자체도 그 프로그램이 어떤일을 하는지 파악하기 어렵게한다.

//그래서 데이터 구조가 중요하다!. 하지만 훌륭한 프로그램이 갖춰야할 다른요인들처럼 제대로하기가 어렵다.
//가장 적합한 데이터 구조를 알아내고자 프로젝트 초기에 분석을 해본결과
//경험과 도메인 주도 설계같은 기술이 내 능력을 개선해줌을 알아냈다.
//하지만 나의 모든 기술과 경험에도 불구하고 초기 설계에서는 실수가 빈번했다.
//프로젝트를 진행할수록 우리는 문제 도메인과 데이터 구조에 대해 더 많은 것을 배우게 된다.
//그래서 오늘까지는 합리적이고 올바랐던 설계가 다음주면  잘못된것으로 판명나곤 했다.

//현재 데이터 구조가 적절하지 않음을 깨닫게 되면 곧바로 수정해야 한다. 고치지않고 데이터구조에 남겨진 흠들은
//우리머릿속을 혼란스럽게 하고 훗날 작성하게 될 코드를 더욱 복잡하게 만들어버린다.

//절차
//1. 소스 필드가 캡슐화되어 있지 않다면 캡슐화한다.
//2. 테스트한다.
//3. 타깃 객체에 필드(와 접근자 메서드들)를 생성한다.
//4. 정적 검사를 수행한다
//5. 소스객체에서 타깃 객체를 참조할 수 있는지 확인한다.
//  > 기존 필드나 메서드 중 타깃 객체를 넘겨주지 않는게 있을 지 모른다. 없다면 이런 기능의 메서드를 쉽게만들수 잇는지 살펴본다.
//    간단하지 않다면 타깃 객체를 저장할 새 필드를 소스 객체에 생성하자. 이는 영구적인 변경이 되겠지만 더넓은 맥락에서 리팩터링을 충분히하고나면 다시없앨수있을때도 있다.
//6. 접근자들이 타깃 필드를 사용하도록 수정한다.
//  > 여러 소스에서 같은 타깃을 공유한다면, 먼저 세터를 수정하여 타깃 필드와 소스 필드 모두를 갱신하게 하고, 이어서 일관성을 깨뜨리는 갱신을 검출할 수 있도록
//    어서션을 추가 하자. 모든게 잘 마무리 되었다면 접근자들이 타깃 필드를 사용하도록 수정한다.
//7. 테스트한다
//8. 소스 필드를 제거한다.
//9. 테스트한다.


//예시
//Customer 클래스.
constructor(name, discountRate){
    this._name = name;
    this._discountRate = discountRate;
    this._contract = new CustomerContract(dateToday());
}


get discountRate(){ return this._discountRate; }
becomePreferred(){
    this._discountRate += 0.83;
    //다른일들
}

applyDiscount(amount){
    return amount.subtract(amoun.multiply(this._discountRate));
}

//CustomerContract클래스
constructor(startDate){
    this._startDate = startDate;
}

//여기서 할인율을 뜻하는 discountRate필드를  Customer에서 CustomerContract로 옮기고싶다고 해보자
//1. 가장 먼저 할 일은 이 필드를 캡슐화하는것(변수캡슐화하기 6.6)
//Customer클래스
constructor(name, discountRate){
    this._name = name;
    this._setDiscountRate(discountRate);
    this._contract = new CustomerContract(dateToday());
}


_setDiscountRate(aNumber) { this._discountRate = aNumber; }
get discountRate(){ return this._discountRate; }
becomePreferred(){
    this._discountRate += 0.83;
    //다른일들
}

applyDiscount(amount){
    return amount.subtract(amoun.multiply(this._discountRate));
}

//할인율을 수정하는 public 세터를 만들고 싶지는 않아서 세터 속성이 아니라 메서드를 이용했다.

//3. 이제 CustomerContract클래스에 필드 하나와 접근자들을 추가한다.
//CustomerContract 클래스
constructor(startDate, discountRate){
    this._startDate = startDate;
    this._discountRate = discountRate;
}

get discountRate(){ return this._discountRate; }
set discountRate(arg){ this._discountRate = arg; }

//6.그런다음 Customer의 접근자들이 새로운 필드를 사용하도록 수정한다. 다 수정하고나면
//  'Cannot set property 'discountRate' of undefined' 라는 오류가 날것이다.
//  생성자에서 Contract객체를 생성하기도 전에 _setDiscountRate()를 호출하기때문이다. 
// 이 오류를 고치려면 먼저 기존상태로 되돌린다음, 문장슬라이드하기를 적용해 _setDiscountRate() 호출을 계약 생성뒤로 옮겨야한다.
// Customer클래스
constructor(name, discountRate){
    this._name = name;
    this._contract = new CustomerContract(dateToday());
    this._setDiscountRate(discountRate);
}

//테스트에 성공하면 접근자들을 다시 수정하여 새로운 계약 인스턴스를 사용하도록 한다.
//Customer클래스
_setDiscountRate(aNumber) { this._contract.discountRate = aNumber; }
get discountRate(){ return this._contract.discountRate; }