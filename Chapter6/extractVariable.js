//변수 추출하기 

//   . 표현식이 너무 복잡해서 이해하기 어려움
//   . 디버거에 breakpoint걸어 중간값 확인이 용이
//   . 표현식에 이름 붙이기
//예제1
function a() {
    return A * B - Math.max(0, A - 500) * B * 0.05 + Math.min(A * B * 0.1, 100);
}

function a() {
    const basePrice = A * B
    const quantityDiscount = Math.max(0, A - 500) * B * 0.05;
    const shipping = Math.min(basePrice * 0.01, 100)

    return basePrice - quantityDiscount + shipping;
}

//예제 2
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get Quantity() { return this._data.quantity; }
    get itemPrice() { return this._data.itemPrice; }

    get price() {
        return this.quantity * this.itemPrice -
            Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 +
            Math.min(this.quantity * this.itemPrice * 0.1, 100);
    }
}

class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get Quantity() { return this._data.quantity; }
    get itemPrice() { return this._data.itemPrice; }

    get price() {
        return this.basePrice - this.quantityDiscount + this.shipping;
    }

    get shipping() { return Math.min(this.basePrice * 0.1, 100); }
    get quantityDiscount() { return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05; }
    get basePrice() { return this.quantity * this.itemPrice; }
}


//변수 인라인하기
let basePrice = anOrder.basePrice;
return (basePrice > 1000);

//변수인라인하기 refactoring
return anOrder.basePrice > 1000;


//함수선언 바꾸기
function circum(radius) {
    return 2 * Math.PI * radius;
}

//함수선언 바꾸기 refactoring
// circumference내에서 하나씩바꿀때마다 테스트를하고 모두 변경하고도 이상이 없으면 기존함수를 삭제하고 circumference를 사용한다
function circum(radius) {
    return circumference(radius);
}

function circumference(radius) {
    return 2 * Math.PI * radius;
}