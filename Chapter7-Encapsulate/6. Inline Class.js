//클래스 인라인하기

class Person {
    get officeAreaCode() { return this._telephoneNumber.areaCode; }
    get officeNumber() { return this._telephoneNumber.number; }
}

class TelephoneNumber {
    get areaCode() { return this._areacode; }
    get number() { return this._number; }
}

↓

class Person {
    get officeAreaCode() { return this._officeAreacode; }
    get officeNumber() { return this._officeNumber; }
}

//배경
//클래스 인라인하기는 클래스 추출하기를 거꾸로 돌리는 리팩토링이다.
//더이상 제역할을 못해서 그대로 두면 안되는 클래스는 인라인해버린다.
//역할을 옮기는 리팩터링을 하고 나니 특정 클래스에 남은 역할이 거의 없을때 이런 현상이 자주발생한다.
//이럴땐 이 불쌍한 클래스를 가장 많이 사용하는 클래스로 흡수시키자.

//두 클래스기능을 지금과 다르개 배분하고 싶을때도 클래스를 인라인한다.
//클래스를 인라인해서 하나로 합친 다음  새로운 클래스를 추출(7.5)하는게 쉬울 수도 있기 때문이다.
//이는 코드를 재구성할 때 흔히 사용하는 방식이기도 하다.
//상황에 따라 한 컨텍스트의 요소들은 다른 쪽으로 하나씩 옮기는게 쉬울 수도 있고, 
//인라인 리팩터링으로 하나로 합친 후 추출하기 리팩토링으로 다시 분리하는게 쉬울 수도 있다.


//절차
//1. 소스 클래스의 각public 메서드에 대응하는 메서드들을 타킷 클래스에 생성한다. 이 메서드들은 단순히 작업을 소스 클래스로 위임해야 한다.
//2. 소스 클래스의 메서드를 사용하는 코드를 모두 타깃 클래스의 위임 메서드를 사용하도록 바꾼다. 하나씩 바꿀때마다 테스트한다.
//3. 소스 클래스의 메서드와 필드를 모두 타깃 클래스로 옮긴다 하나씩 옮길때마다 테스트한다.
//4. 소스 클래스를 삭제하고 조의를 표한다.

//예시
//배송 추적 정보를 표현하는 TrackingInformation클래스를 준비했다.
class TrackingInformation {
    get shippingCompany() { return this._shippingCompany; } //배송 회사
    set shippingCompany(arg) { this._shippingCompany = arg; }
    get trackingNumber() { return this._trackingNumber; } //추적 번호
    set trackingNumber(arg) { this._trackingNumber = arg; }
    get display() {
        return `${this.shippingCompany}: ${this.trackingNumber}`;
    }
}

//이클래스는 배송(shipment) 클래스의 일부처럼 사용된다.
//Shipment 클래스..
get trackingInfo(){
    return this._trackingInformation.display;
}

get trackingInformation() { return this._trackingInformation; }
set trackingInformation(aTrackingInformation){
    this._trackingInformation = aTrackingInformation;
}

//TrackingInformation이 예전에는 유용했을지 몰라도 현재는 제 역할을 못하고 있으니 Shipment클래스로 인라인하려 한다.
//먼저 TrackingInformation의 메서드를 호출하는 코드를 찾는다.

//클라이언트
aShipment.trackingInformation.shippingCompany = request.vendor;
//1.이처럼 외부에서 직접호출하는 TrackingInformation의 메서드들을 모조리 Shipment로 옮긴다.
//그런데 보통때의 함수옮기기와는 약간다르게 진행해보자. 먼저 Shipment에 위임함수를 만들고 클라이언트가 이를 호출하도록 숮어하는것이다.

//Shipment클래스
 set shippingCompany(arg) { this._trackingInformation.shippingCompany = arg; }
//클라이언트
aShipment.shippingCompany = request.vendor;

//클라이언트에서 사용하는 TrackingInformation의 모든 요소를 이런식으로 처리한다.
//다 고쳤다면 TrackingInformation의 모든 요소를 Shipment로 옮긴다.
//먼저 display()메서드를 인라인 한다.
//Shipment 클래스
get trackingInfo(){
    return `${this.shippingCompany}: ${this.trackingNumber}`;
}

//4. 다옮겨졌다면 Tracking Information 클래스를 삭제한다.
//최종 Shipment클래스
get trackingInfo(){
    return `${this.shippingCompany}: ${this.trackingNumber}`;
}
get shippingCompany() { return this._shippingCompany; } //배송 회사
set shippingCompany(arg) { this._shippingCompany = arg; }
get trackingNumber() { return this._trackingNumber; } //추적 번호
set trackingNumber(arg) { this._trackingNumber = arg; }