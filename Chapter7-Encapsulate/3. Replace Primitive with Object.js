//기본형을 객체로 바꾸기
orders.filter(o => "high" === o.priority || "rush" === o.priority)
↓
orders.filter(o => o.priority.higherThan(new Priority("normal")))

//배경
// 개발초기에는 단순한 정보를 숫자나 문자열 같은 간단한 데이터 항목으로 표현할 때가 많다.
//그러다 개발이 진행되면서 간단했던 이 정보들이 더이상 간단하지 않게 변한다.
//예를 들어 처음에는 전화번호를 문자열로 표현했는데, 나중에 포매팅이나 지역코드 추출같은 특별한 동작이 필요해질 수 있다.
//이런 로직들로 금세 중복 코드가 늘어나서 사용할때마다 드는 노력도 늘어나게 된다.

//단순한 출력 이상의 기능이 필요해지는 순간 그 데이터를 표현하는 전용 클래스를 정의하는편이 좋다.
//시작은 기본형 데이터를 감싼것과 큰 차이가 없을 것이라 효과가 미미하다.
//하지만 나중에 특별한 동작이 필요해지면 이 클래스에 추가하면 되니 프로그램이 커질수록 점점 유용한 도구가 된다.
//손에꼽는 유용한 리팩토링중 하나!!

//절차
//1. 변수 캡슐화
//2. 단순한 값 클래스를 만든다. 생성자는 기존값을 인수로 받아서 저장하고, 이값을 반환하는 게터를 추가
//3. 정적 검사를 수행
//4. 값 클래스의 인스턴스를 새로 만들어서 필드에 저장하도록 세터를 수정한다. 이미 있다면 필드의 타입을 적절히 변경한다.
//5. 새로 만든 클래스의 게터를 호출한 결과를 반환하도록 게터를 수정한다.
//6. 테스트한다
//7. 함수이름을 바꾸면 원본 접근자의 동작을 더 잘 드러낼 수 있는지 검토한다.
//  >> 참조를 값으로 바꾸거나 값을 참조로 바꾸면 새로 만든 객체의 역할이 더 잘드러나는지 검토한다.

//예시
class Order {
    constructor(data) {
        this.priority = data.priority;
    }
}

//클라이언트 사용예제
highPriorityCount = orders.filter(o => "high" === o.priority
    || "rush" === o.priority).length;

//1. 데이터 값을 다루기 전에 항상 변수부터 캡슐화
class Order {
    constructor(data) {
        this._priority = data.priority;
    }

    get priority() { return this._priority; }
    set priority(aString) { this._priority = aString; }
}

//이제 우선순위 속성을 초기화하는 생성자에서 방금 정의한 세터를 사용할 수 있다.
//이렇게 필드를 자가 캡슐화하면 필드 이름을 바꿔도 클라이언트 코드는 유지할 수 있다.!!!

//2. 다음으로 우선순위 속성을 표현하는 값 클래스 Priority를 만든다. 
//이 클래스는 표현할 값을 받는 생성자와 그 값을 문자열로 반환하는 변환 함수로 구성된다.
class Priority {
    constructor(value) { this._value = value; }
    toString() { return this._value; }
}

//이 상황에서는 개인적으로 게터(value()) 보다는 변환함수(toString())를 선호한다.
//클라이언트 입장에서보면 속성 자체를 받은게 아니라 해당 속성을 문자열로 표현한 값을 요청한게 되기 때문이다.

//4,5는 그런다음 방금 만든 Priority클래스를 사용하도록 접근자들을 수정한다.
class Order {
    constructor(data) {
        this._priority = data.priority;
    }

    get priority() { return this._priority.toString(); }
    set priority(aString) { this._priority = new Priority(aString); }
}

//7. 이렇게 Priority 클래스를 만들고 나면 Order클래스의 게터가 이상해진다.
//이 게터가 반환하는 값은 우선순위 자체가 아니라 우선순위를 표현하는 문자열이다. 그러니 즉시 함수이름을 바꿔준다.
get priorityString(){ return this._priority.toString(); }
set priority(aString) { this._priority = new Priority(aString); }

//클라이언트(사용)
highPriorityCount = orders.filter(o => "high" === o.priorityString
    || "rush" === o.priorityString).length;


//더 가다듬기
class Priority {
    constructor(value) {
        if (value instanceof Priority) return value; //클래스면 그대로 return
        if (Priority.legalValues().includes(value))  //아니면 정해진 우선순위에 속하는지 체크
            this._value = value;
        else
            throw new Error(`<${value}는 유효하지 않은 우선순위입니다.`);
    }

    toString() { return this._value; }
    get _index() { return Priority.legalValues().findIndex(s => s === this._value); }
    static legalValues() { return ['low', 'normal', 'high', 'rush']; }
    equals(other) { return this._index === other._indexl }
    higherThan(other) { return this._index > other._index; }
    lowerThan(other) { return this._index < other._index; }
}

//클라이언트
highPriorityCount = orders.filter(o => o.priority.higherThan(new Priority("normal"))).length;