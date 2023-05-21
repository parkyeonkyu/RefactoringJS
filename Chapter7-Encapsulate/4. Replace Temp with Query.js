//임시변수를 질의 함수로 바꾸기
const basePrice = this._quantity * this.itemPrice;
if (basePrice > 1000)
    return basePrice * 0.95;
else
    return basePrice * 0.98;
↓
get basePrice() { this._quantity * this._itemPrice; }
if (this.basePrice > 1000)
    return basePrice * 0.95;
else
    return basePrice * 0.98;


//배경
//함수 안에서 어떤 코드의 결과값을 뒤에서 다시 참조할 목적으로 임시 변수를 쓰기도 한다.
//임시 변수를 사용하면 값을 계산하는 코드가 반복되는 걸 줄이고 (변수 이름을 통해) 값의 의미를 설명할 수도 있어서 유용하다.
//그런데 한 걸음 더 나아가 아예 함수로 만들어 사용하는 편이 나을 때가 많다.

//긴 함수의 한 부분을 별도 함수로 추출하고자 할 때 먼저 변수들을 각각의 함수로 만들면 일이 수월해진다.
//추출한 함수에 변수를 따로 전달할 필요가 없어지기 때문이다.
//또한 이 덕분에 추출한 함수와 원래 함수의 경계가 더 분명해지기도 하는데, 그러면 부자연스러운 의존 관계나 부수효과를 찾고 제거하는 데 도움이 된다.

//!!여러곳에서 똑같은 방식으로 계산되는 변수를 발견할 때마다 함수로 바꿀수 있는지 살펴본다!!
//이번 리팩토링은 클래스 안에서 적용할 때 효과가 가장 크다.

//임시변수를 질의함수로 바꾼다고 다 좋아지는건아니다. 자고로 변수는 값을 한번만 계산하고, 그뒤로는 읽기만해야한다.
// 스냅숏 용도로 쓰이는 변수에는  이 리팩토링을 적용하면안된다.

//절차
//1. 변수가 사용되기 전에 값이 확실히 결정되는지, 변수를 사용할 때마다 계산 로직이 매번 다른 결과를 내지는 않는지 확인한다.
//2. 읽기 전용으로 만들 수 있는 변수는 읽기전용으로 만든다.
//3. 테스트한다.
//4. 변수 대입문을 함수로 추출한다.
//5. 테스트한다
//6. 변수 인라인하기로 임시변수를 제거한다

//예시
class Order {
    constructor(quantity, item) {
        this._quantity = quantity;
        this._item = item;
    }
    get price() {
        var basePrice = this._quantity * this._item.price;
        var discountFactor = 0.98;

        if (basePrice > 1000) discountFactor -= 0.03;
        return basePrice * discountFactor;
    }
}
//여기서 임시 변수인 basePrice와 discountFactor를 메서드로 바꿔보자
//2. 먼저 basePrice에 const를 붙여 읽기전용으로 만들고 3.테스트해본다
// 이렇게 하면 못보고 지나친 재대입 코드를 찾을수 있다.(컴파일 에러가 난다)
//지금처럼 코드가 간단할 때는 그럴일이 없겠지만, 코드가 길면 흔히 벌어지는 일이다.
get Price(){
    const basePrice = this._quantity * this._item.price;
}

//4.그런다음 대입문의 우변을 게터로 추출한다.
get Price(){
    const basePrice = this.basePrice;
    var discountFactor = 0.98;

    if (basePrice > 1000) discountFactor -= 0.03;
    return basePrice * discountFactor;
}

get basePrice(){
    return this._quantity * this._item.price;
}


//5. 테스트한다음  6.변수를 인라인한다.
get Price(){
    //const basePrice = this.basePrice; //아래로 인라인
    var discountFactor = 0.98;

    if (basePrice > 1000) discountFactor -= 0.03;
    return this.basePrice * discountFactor;
}


//6. discountFacotr변수도 같은순서로 처리, 먼저 함수추출하기
get price(){
    const discountFactor = this.discountFactor;
    return this.basePrice * discountFactor;
}

get discountFactor(){
    var discountFactor = 0.98;
    if (this.basePrice > 100) discountFactor -= 0.03;
    return discountFactor;
}

//마지막 인라인
get price(){
    return this.basePrice * this.discountFactor;
}
