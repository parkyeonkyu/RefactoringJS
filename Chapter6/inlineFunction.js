function getRating(driver) {
    return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}

function moreThanFiveLateDeliveries(driver) {
    return driver.numberOfLateDeliveries > 5;
}

/////////////////////위 두함수를 아래로 변경////////////////
function getRating(driver) {
    return (driver.numberOfLateDeliveries > 5) ? 2 : 1;

}

//서브클래스에서 오버라이드하는 메서드는 인라인하면 안된다
// 인라인 함수를 호출하는 곳을 모두 찾는다
//각 호출문을 함수 본문으로 교체한다.
//하나씩 교체할때마다 테스트한다.
//함수정의(원래 함수)를 삭제한다.

//예제2
function reportLines(aCustomer) {
    const lines = [];
    gatherCustomerData(lines, aCustomer);
    return lines;
}

function gatherCustomerData(out, aCustomer) {
    out.push(["name", aCustomer.name]);
    out.push(["location", aCustomer.location]);
}

/////////////////refactoring//////////////////////////
//gatherCustomerData 내용을 한줄씩 옮긴다. 이상이없으면 원래함수를 삭제하고 적용한다.
function reportLines(aCustomer) {
    const lines = [];
    out.push(["name", aCustomer.name]);
    out.push(["location", aCustomer.location]);
    return lines;
}
