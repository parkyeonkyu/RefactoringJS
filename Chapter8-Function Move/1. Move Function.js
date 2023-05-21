//함수 옮기기

//배경 
//좋은 소프트웨어 설계 핵심은 모듈화가 얼마나 잘되어있느냐를 뜻하는 모듈성
//모듈성이랑 프로그램 어딘가를 수정하려 할때 해당 기능과 깊이 관련된 작은 일부만 이해해도 가능하게 해주는 능력
//모듈성을 높이려면 서로 연관된 요소들을 함께 묶고, 요소 사이의 연결관계를 쉽게 찾고 이해할 수 있도록 해야 한다.

//객체 지향 프로그래밍의 핵심 모듈화 컨텍스트는 클래스다.
//어떤 함수가 자신이 속한 모듈 A의 요소들보다 다른 모듈 B의 요소들을 더많이 참조한다면 모듈 B로 옮겨줘야 한다.
//이렇게 하면 캡슈로하가 좋아져서, 이 소프트웨어의 나머지 부분은 모듈 B의 세부사항에 덜 의존하게 된다.

//절차
//1. 선택한 함수가 현재 컨텍스트에서 사용중인 모든 프로그램 요소를 살펴본다. 이요소들중에 함께 옮겨야할게 있는지 고민해본다
//  - 호출되는 함수중 함께 옮길게 있다면 대체로 그 함수를 먼저 옮기는게 낫다. 얽혀 있는함수가 여러개라면 다른 곳에 미치는 영향이 적은 함수부터 옮긴다.
//  - 하위 함수들의 호출자가 고수준 함수 하나뿐이면 먼저 하위함수들을 고수준 함수에 인라인한 다음, 고수준 함수를 옮기고, 옮긴위치에서 개별 함수들로 다시 추출한다
//2. 선택한 함수가 다형 메서드인지 확인한다.
//  - 객체 지향 언어에서는 같은 메서드가 슈퍼클래스나 서브클래스에도 선언되어 있는지까지 고려해야한다.
//3. 선택한 함수를 타깃 컨텍스트로 복사한다(이때 원래 함수를 소스함수라하고 복사해서 만든 새로운 함수를 타깃함수라 한다.)
//   타깃함수가 새로운 터전에 잘 자리 잡도록 다듬는다.
//  - 함수 본문에서 소스 컨텍스트의 요소를 사용한다면 해당요소들을 매개변수로 넘기거나 소스 컨텍스트 자체를 참조로 넘겨준다.
//  - 함수를 옮기게 되면 새로운 컨텍스트에 어울리는 새로운 이름으로 바꿔야할 경우가 많다. 필요한경우 바꿔준다
//4. 정적 분석을 수행
//5. 소스컨텍스트에서 타깃 함수를 참조할 방법을 찾아 반영한다.
//6. 소스 함수를 타깃함수의 위임함수가 되도록 수정한다.
//7. 테스트한다.
//8. 소스 함수를 인라인 할지 고민한다.
//  - 소스 함수는 언제까지라도 위임함수로 남겨둘 수 있다. 하지만 소스함수를 호출하는 곳에서 타깃 함수를 직접 호출하는 데 무리가 없다면 중간단계(소스함수)는 제거하는 편이 낫다

//예시 1. 중첩 함수를 최상위로 옮기기
//GPS 추적 기록의 총 거리를 계산하는 함수

function trackSummary(points) {
    const totalTime = calculateTime();
    const totalDistance = calculateDistance();
    const pace = totalTime / 60 / totalDistance;
    return {
        time: totalTime,
        distance: totalDistance,
        pace: pace
    }


    function calculateDistance() { //총 거리 계산
        let result = 0;
        for (let i = 1; i < points.length; i++) {
            result += distance(points[i - 1], points[i]);
        }
        return result;
    }

    function distance(p1, p2) {... } //두지점의 거리 계산
    function radians(degrees) {... } // 라디안 값으로 변환
    function calculateTime() {... } // 총 시간 계산
}

//이 함수에서 중첩 함수인 calculateDistance()를 최상위로 옮겨서 추적 거리를 다른 정보와 는 독립적으로 계산하고 싶다.
//3. 먼저 이함수를 최상위로 복사
function trackSummary(points) {
    const totalTime = calculateTime();
    const totalDistance = calculateDistance();
    const pace = totalTime / 60 / totalDistance;
    return {
        time: totalTime,
        distance: totalDistance,
        pace: pace
    }


    function calculateDistance() { //총 거리 계산
        let result = 0;
        for (let i = 1; i < points.length; i++) {
            result += distance(points[i - 1], points[i]);
        }
        return result;
    }

    function distance(p1, p2) {... } //두지점의 거리 계산
    function radians(degrees) {... } // 라디안 값으로 변환
    function calculateTime() {... } // 총 시간 계산
}
function top_calculateDistance() {  // 최상위로 복사하면서 새로운 (임시) 이름을 지어줌
    let result = 0;
    for (let i = 1; i < points.length; i++) {
        result += distance(points[i - 1], points[i]);
    }
    return result;
}

//이처럼 함수를 복사할 때 이름을 달리해주면 코드에서나 머리속에서나 소스함수와 타깃함수가 쉽게 구별된다.
//지금은 가장 적합한 이름을 고민할 단계가 아니므로 임시로 지어주면 된다.

//이 프로그램은 지금 상태로도 동작하지만 내 정적 분석기는 불만이다.
//새함수가 정의되지않은 심벌(distance와 points)를 사용하기 때문이다
//points는 매개변수로 넘기면 자연스럽다
function top_calculateDistance(points) {  // 최상위로 복사하면서 새로운 (임시) 이름을 지어줌
    let result = 0;
    for (let i = 1; i < points.length; i++) {
        result += distance(points[i - 1], points[i]);
    }
    return result;
}

//1. distance() 함수도 똑같이 처리할 수 있지만 calculateDistance()와 함께 옮기는게 합리적으로 보인다
//distance()는 radians()만 사용하면 radians()는 현재 컨텍스트에 있는 어떤것도 사용하지않는다.
//따라서 두 함수를 매개변수로 넘기기보다는 함께 옮겨버리는것이 낫다.
//이를 위해 현재 컨텍스트에서 이함수들을 calculateDistance() 함수 안으로 옮것이 낫다.
function calculateDistance() { //총 거리 계산
    let result = 0;
    for (let i = 1; i < points.length; i++) {
        result += distance(points[i - 1], points[i]);
    }
    return result;

    function distance(p1, p2) {... } //두지점의 거리 계산
    function radians(degrees) {... } // 라디안 값으로 변환
}


//그런다음 정적 분석과 테스트를 활용해 어딘가에서 문제가 생기는지 검증해본다.
//지금경우엔 아무문제가없으니 같은내용을 새로만든 top_calculateDistance()함수로도 복사한다
function top_calculateDistance(points) {  // 최상위로 복사하면서 새로운 (임시) 이름을 지어줌
    let result = 0;
    for (let i = 1; i < points.length; i++) {
        result += distance(points[i - 1], points[i]);
    }
    return result;

    function distance(p1, p2) {... } //두지점의 거리 계산
    function radians(degrees) {... } // 라디안 값으로 변환
}


//이번에도 복사한 코드가 프로그램 동작에 아무런 영향을 주지않지만
//4. 다시한번 정적분석을 수행해볼 타이밍이다. 내가만약 distance()가 radians()를 호출하는걸 발견하지 못했더라도
//정적분석기가 지금 단계에서 이 문제를 찾아줬을 것이다.

//6. 이제 밥상을 다차렸으니 메인요리(핵심이 되는 수정)를 맛볼 시간이다.
//   즉 소스함수인 calculateDistance()의 본문을 수정하여 top_calculateDistance()를 호출하게 하자
function calculateDistance() { //총 거리 계산
    return top_calculateDistance(points);
}


//7. 이시점에 '반드시' 모든 테스트를 수행하여 옮겨진 함수가 새 보금자리에 잘 정착했는지 확인해야한다.
//  테스트에 통과하면 이삿짐을 새 집에 풀어놓는다. 가장 먼저 소스 함수를 대리자 역할로 그대로 둘지를 정한다.
//  이예의 소스함수는(중첩된 함수답게) 호출자가 많지않은 상당히 지역화된 함수다. 그러니 소스함수는 제거하는편이 낫다
// calculateDistance()를 삭제한다

//이제 새함수에 이름을 지어줄 시간이다. 최상위 함수는 가시성이 가장 높으니 적합한 이름을 신중히 지어주는것이 좋다.
//totalDistance()정도면 부족하지 않을것이다 그런데
//trackSummary()안에 정의된 똑같은 이름의 변수가 새 함수를 가릴 것이라 곧바로 적용할 수는 없다.
// 어떻게 하면좋을까? 곰곰히 생각해보면 이변수를 남겨둘 이유가 없으니 변수 인라인하기로 해결하자

//중첩함수를 사용하다보면 숨겨진 데이터끼리 상호 의존하기가 아주 쉬우니 중첩함수는 되도록 만들지 말자.
function trackSummary(points) {
    const totalTime = calculateTime();
    const pace = totalTime / 60 / totalDistance(points);
    return {
        time: totalTime,
        distance: totalDistance(points),
        pace: pace
    }
}

function totalDistance(points) {  // 최상위로 복사하면서 새로운 (임시) 이름을 지어줌
    let result = 0;
    for (let i = 1; i < points.length; i++) {
        result += distance(points[i - 1], points[i]);
    }
    return result;

    function distance(p1, p2) {... } //두지점의 거리 계산
    function radians(degrees) {... } // 라디안 값으로 변환
}

function distance(p1, p2) {... } //두지점의 거리 계산
function radians(degrees) {... } // 라디안 값으로 변환
function calculateTime() {... } // 총 시간 계산




//예시 2. 다른 클래스로 옮기기
//Account클래스
get bankCharge(){
    let result = 4.5;
    if (this._daysOverdrawn > 0) result += this.overdraftCharge;
    return result;
}

get overdraftCharge(){
    if (this.TypeError.isPremium) {
        const baseCharge = 10;
        if (this.daysOverdrawn <= 7)
            return baseCharge;
        else
            return baseCharge + (this.daysOverdrawn - 7) * 0.85;
    }
    else
        return this.daysOverdrawn * 1.75;
}

//이제부터 계좌종류에 따라 이자 책정 알고리즘이 달라지도록 고쳐보자.
//그러려면 마이너스 통장의 초과인출 이자를 계산하는 overdraftCharge()를 계좌 종류 클래스인 AccountType으로 옮기는게 자연스러울 것이다.

//1. 첫 단계로 overdraftCharge()메서드가 사용하는 기능들을 살펴보고, 그 모두를 한꺼번에 
//   옮길만한 가치가 있는지 고민해보자. 이예에서는 daysOverdrawn()메서드는 Account클래스에 남겨둬야 한다.
//   (계좌 종류가 아닌) 계좌별로 달라지는 메서드이기 때문이다.
//2. 다음으로 overdraftCharge()메서드 본문을 AccountType클래스로 복사한 후 새 보금자리에 맞게 정리한다.
//AccountType 클래스
overdraftCharge(daysOverdrawn){
    if (this.isPremium) {
        const baseCharge = 10;
        if (daysOverdrawn <= 7)
            return baseCharge;
        else
            return baseCharge + (this.daysOverdrawn - 7) * 0.85;
    }
    else
        return daysOverdrawn * 1.75;
}

//이 메서드를 새보금자리에 맞추려면 호출 대상 두 개의 범위를 조정해야한다.
//isPremium은 단순휘 this를 통해 호출했다
//daysOverdrawn은 값을 넘길지, 아니면 계좌채로 넘길지 정해야한다. 우선 간단히 값으로 넘기기로함
//하지만 초과 인출된 일수 외에 다른 정보가 필요해지면 추후 계좌채로 넘기도록 변경할 수도 있을 것이다.
//계좌에서 원하는 정보가 계좌 종류에 따라 달라진다면 더욱 그렇다

//6. 다음으로 원래 메서드의 본문을 수정하여 새 메서드를 호출하도록 한다. 이제 원래 메서드는 위임 메서드가 된다.
//Account클래스
get bankChare(){
    let result = 4.5;
    if (this._daysOverdrawn > 0) result += this.overdraftCharge;
    return result;
}

get overdraftCharge(){ //위임메서드
    return this.type.overdraftCharge(this.daysOverdrawn);
}

//8. 이제 위임 메서드인 overdraftCharge()를 남겨둘지 아니면 인랄인할지 정해야 한다. 인라인쪽을 선택하면 다음처럼 된다.
get bankCharge(){
    let result = 4.5;
    if (this._daysOverdrawn > 0)
        result += this.type.overdraftCharge(this.daysOverdrawn);
    return result;
}

//여기선 날짜만 넘파라미터로 넘겼지만
//만약 계좌에서 가져와야할 데이터가 많았다면 계좌전체 객체를 넘기면된다.