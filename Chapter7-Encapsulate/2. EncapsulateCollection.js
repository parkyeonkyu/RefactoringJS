//컬렉션 캡슐화하기

class Person {
    get courses() { return this._courses }
    set courses(aList) { this._courses = aList; }
}

class Person {
    get courses() { return this._courses.slice() }
    addCourse(aCourse) {... }
    removeCourse(aCourse) {... }
}
//배경
//가변데이터를 모두 캡슐화하는편 > 그러면 데이터 구조가 언제 어떻게 수정되는지 파악하기 쉬워서 필요한시점에 데이터 구조를 변경하기도 쉬워지기때문
//특히 객체지향 개발자들은 캡슐화를 적극 권장하는데 컬렉션을 다룰때는 곧잘 실수를 저지르기때문
//e.g. 컬렉션 변수로의 접근을 캡슐화하면서 게터가 컬렉션자체를 반환하도록 한다면, 그 컬렉션을 감싼 클래스가 눈치채지 못하는 상태에서 컬렉션의 원소들이 바뀌어버릴수 있다.
// 이런문제를 방지하기 위해 컬렉션을 감싼 클래스에 흔히 add()와 remove()라는 이름의 컬렉션 변경자 메서드를 만든다.

//절차
/*
    1. 아직 컬렉션을 캡슐화하지 않았다면 변수 캡슐화하기 부터 한다.
    2. 컬렉션에 원소를 추가/제거하는 함수를 추가
    3. 정적 검사수행
    4. 컬렉션참조하는 부분을 모두 찾는다. 컬렉션의 변경자를 호출하는 코드가 모두 앞에서 추가한 추가/제거 함수를 호출하도록 수정한다, 하나수정할대마다 테스트한다
    5. 컬렉션 게터를 수정해서 원본 내용을 수정할 수 없는 읽기전용 프락시나 복제본을 반환하게한다.
    6. 테스트한다.
*/

class Person {
    constructor(name) {
        this._name = name;
        this._courses = [];
    }
    get name() { return this._name; }
    get courses() { return this._courses }
    set courses(aList) { this._courses = aList; }
}

class Course {
    constructor(name, isAdvanced) {
        this._name = name;
        this._isAdvanced = isAdvanced;
    }

    get name() { return this._name }
    get isAdvanced() { return this._isAdvanced }

}

//클라이언트는 Person이 제공하는 수업 컬렉션에서 수업 정보를 얻는다.
numAdvancedCourses = aPerson.courses.filter(c => c.isAdvanced).length;

//허점이존재
const basicCourseNames = readBasicCourseNames(filename);
aPerson.courses = basicCourseNames.map(name => new Course(name, false));

//클라이언트 입장에서는 다음처럼 수업 목록을 직접 수정하는것이 훨씬 편할 수 있다.
for (const name of readBasicCourseNames(filename)) {
    aPerson.courses.push(new Course(name, false));
}
//하지만 이런식으로 갱신하면 Person클래스가 더는 컬렉션을 제어할 수 없으니 캡슐화가 깨진다.
//필드를 참조하는 과정만 캡슐화했을 뿐 필드에 담긴 내용은 캡슐화하지 않는 게 원인이다.

//2.제대로 캡슐화하기 위해 먼저 클라이언트가 수업을 하나씩 추가하고 제거하는 메서드를 Person에 추가해보자
//Person Class
addCourse(aCourse){
    this._courses.push(aCourse);
}
removeCourse(aCourse, fnIfAbsent = () => { throw new RangeError(); }){
    const index = this._courses.indexOf(aCourse);
    if (index === -1) fnIfAbsent();
    else this._courses.splice(index, 1);
}

//제거메서드에서는 클라이언트가 컬렉션에 없는 원소를 제거하려할때의 대응 방식을 정해야 한다.
//그냥 무시하거나 에러를 던질 수도 있다. 여기서는 기본적으로 에러를 던지되, 호출자가 원하는 방식으로 처리할 여지도 남겨뒀다.

//4. 그런다음 컬렉션의 변경자를 직접 호출하던 코드를 모두 찾아서 방금추가한 메서드를 사용하도록 바꾼다.
for (const name of readBasicCourseNames(filename)) {
    aPerson.addCourse(new Course(name, false));
}

//이렇게 개별원소를 추가하고 제거하는 메서드를 제공하기때문에 setCourses()를 사용할 일이 없어졌으니 제거한다.
//세터를 제공해야할 특별한 이유가 있다면 인수로 받은 컬렉션의 복제본을 필드에 저장하게 한다.
//--Person 클래스
set courses(aList) { this._courses = aList.slice(); }

//이렇게하면 클라이언트는 용도에 맞는 변경메서드를 사용하도록 할 수 있다.
//5. 하지만 나는 메서드들을 사용하지 않고서는 아무도 목록을 변경할 수 없게 만드는 방식을 선호한다.
//다음과 같이 복제본을 제공하면 된다.
get courses(){ return this._courses.slice(); }

//내경험에 따르면 컬렉션에 대해서는 어느 정도 강박증을 갖고 불필요한 복제본을 만드는 편이
//예상치 못한 수정이 촉발한 오류를 디버깅하는것보다 낫다.
//때론 명확히 드러나지 않는 수정이 일어날 수 있다.
//컬렉션 관리를 책임지는 클래스라면 항상 복제본을 제공해야한다. 그리고 나는 컬렉션을 변경할 가능성이 있는 작업을 할 때도 습관적으로 복제본을 만든다.