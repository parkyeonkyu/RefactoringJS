//위임 숨기기

manager = aPerson.department.manager;
↓
manager = aPerson.manager;
class Person {
    get manager() { return this.department.manager }
}

//배경
//모듈화 설계를 제대로하는 핵심은 캡슐화다.
//어쩌면 가장 중요한 요소일수도있다.
//캠슐화는 모듈들이 시스템의 다른 부분에 대해 알아야할 내용을 줄여준다.
//캡슐화가 잘 되어있다면 무언가를 변경해야 할 때 함께 고려해야할 모듈 수가 적어져서 코드를 변경하기가 훨씬 쉬워진다.

//위임객체를 숨김으로써 위임객체가 수정되더라도 서버 코드만 고치면되며, 클라이언트는 아무런 영향을 받지 않는다.


//절차
//1. 위임 객체의 각 메서드에 해당하는 위임 메서드를 서버에 생성한다.
//2. 클라이언트가 위임 객체 대신 서버를 호출하도록 수정한다. 하나씩 바꿀때마다 테스트한다.
//3. 모두 수정했다면, 서버로부터 위임 객체를 얻는 접근자를 제거한다.
//4. 테스트한다.

//예시
//Person클래스
constructor(name){
    this._name = name;
}
get name() { return this._name; }
get department() { return this._department; }
set department(arg) { this._department = arg; }

//Department클래스
get chargeCode() { return this._chargeCode; }
set chargeCode(arg) { this._chargeCode = arg; }
get manager() { return this._manager; }
set manager(arg) { this._manager = arg; }

//클라이언트에서 어떤사람이 속한 부서의 관리자를 알고 싶다고하자.
//그러기위해서는 부서 객체부터 얻어와야한다.
//클라이언트
manager = aPerson.department.manager;

//클라이언트는 부서클래스의 작동방식, 부서클래스가 관라지정보를 제공한다는 사실을 알아야한다.
//1. 이러한 의존성을 줄이려면 클라이언트가 부서 클래스를 볼수 없게 숨기고 대신 사람클래스에 간단한 위임 메서드를 만들면 된다.
//Person클래스
get manager(){ return this._department.manager; }

//2.이제 모든 클라이언트가 이 메서드를 사용하도록 고친다.
manager = aPerson.manager;

//3.클라이언트 코드를 다 고쳤다면 사람클래스의 department()접근자를 삭제한다.