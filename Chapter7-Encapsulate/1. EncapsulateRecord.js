//레코드 캡슐화하기

organization = { name: "애크미 구스베리", country: "GB" };

class Organization {
    constructor(data) {
        this._name = data.name;
        this._country = data.country;
    }

    get name() { return this._name; }
    set name(arg) { this._name = arg; }
    get country() { return this._country; }
    set country(arg) { this._country = arg; }
}

//1. 간단한 레코드 캡슐화하기
const organization = { name: "애크미 구스베리", country: "GB" };

result += `<h1${organization.name}</h1>`; //읽기 예
organization.name = reName; //쓰기 예

//1. refactoring
//상수 캡슐화
function getRawDataOfOrganization() { return organization; }

result += `<h1>${getRawDataOfOrganization().name}</h1>`; //읽기 예
getRawDataOfOrganization().name = reName; //쓰기 예


//클래스만들기
class Organization {
    constructor(data) {
        this._data = data
    }
}

const organization = new Organization({ name: "애크미 구스베리", country: "GB" });
function getRawDataOfOrganization() { return organization._data; }
function getRawDataOfOrganization() { return organization; }



//2. 중첩된 레코드 캡슐화하기
customerData = {
    "1920": {
        name: "마틴 파울러",
        id: "1920",
        usages: {
            "2016": {
                "1": 50,
                "2": 55,
                //나머지달은 생략
            },
            "2015": {
                "1": 70,
                "2": 63,
                //나머지 달은 생략
            }
        }

    },
    "38673"{
        name: "닐 포드",
        id: "38673"
    }
    //다른 고객정보도 같은 형식으로 저장된다.
}

//중첩정도가 심할수록 읽거나 쓸때 데이터 구조안으로 더 깊숙이 들어가야한다.
//쓰기 예
customerData[customerID].usages[year][month] = amount;
//읽기 예
function compareUsage(customerID, laterYear, month) {
    const later = customerData[customerID].usages[laterYear][month];
    const earlier = customerData[customerID].usages[laterYear - 1][month];
    return { laterAmount: later, change: later - earlier };
}


//refactoring
// 1) 변수 캡슐화부터 시작
function getRawDataOfCustomers() { return customerData; }
function setRawDataOfCustomers(arg) { customerData = arg; }

//쓰기 예
getRawDataOfCustomers()[customerID].usages[year][month] = amount;
//읽기 예
function compareUsage(customerID, laterYear, month) {
    const later = getRawDataOfCustomers()[customerID].usages[laterYear][month];
    const earlier = getRawDataOfCustomers()[customerID].usages[laterYear - 1][month];
    return { laterAmount: later, change: later - earlier };
}

//그다음 전체 데이터 구조를 표현하는 클래스를 정의하고, 이를 반환하는 함수를 새로 만든다.
class CustomerData {
    constructor(data) {
        this._data = data;
    }
}
function getCustomerData() { return customerData; }
function getRawDataOfCustomers() { return customerData.data; }
function setRawDataOfCustomers(arg) { customerData = new CustomerData(arg); }
//쓰기예
getRawDataOfCustomers()[customerID].usages[year][month] = amount;


//데이터 구조안으로 들어가는 코드를 세터로 뽑아내는 작업(함수 추출하기)
//쓰기 예
setUsage(ustomerID, year, month, amount);
function setUsage(customerID, year, month, amount) {
    getRawDataOfCustomers()[customerID].usages[year][month] = amount;
}

//그런다음 이함수를 고객 데이터 클래스로 옮긴다.
//쓰기 예
getCustomerData().setUsage(CustomerID, year, month, amount);
//CustomerData클래스
class CustomerData {
    constructor(data) {
        this._data = data;
    }

    setUsage(customerID, year, month, amount) {
        getRawDataOfCustomers()[customerID].usages[year][month] = amount;
    }

}


//덩치 큰 데이터 구조를 다룰수록 쓰는 부분에 집중
//캡슐화에서는 값을 수정하는 부분을 명확하게 드러내고 한 곳에 모아두는 일이 굉장히 중요
//이렇게 쓰는 부분을 찾아 수정하다보면 빠진건없는지 궁금해짐
//확인하는 방법은 여러가지이고 깊은복사를 반환하는 방법을 써볼거임
//최상위
function getCustomerData() { return customerData; }
function getRawDataOfCustomers() { return customerData.data; }
function setRawDataOfCustomers(arg) { customerData = new CustomerData(arg); }
//CustomerData클래스
class CustomerData {
    constructor(data) {
        this._data = data;
    }

    setUsage(customerID, year, month, amount) {
        getRawDataOfCustomers()[customerID].usages[year][month] = amount;
    }

    get rawData() {
        return _.cloneDeep(this._data); //lodash라이브러리가 제공하는 cloneDeep()으로 깊은복사 처리
    }

    usage(customerID, year, month) {
        return this._data[customerID].usages[year][month];
    }
}


//최상위
function compareUsage(customerID, laterYear, month) {
    const later = getCustomerData().usage(customerID, laterYear, month);
    const earlier = getCustomerData().usage(customerID, laterYear - 1, month);
    return { laterAmount: later, change: later - earlier };
}

//rawData복사를 제공 > 클라이언트가 데이터를 직접 수정하지 못하게 막기위함
//rawData()를 활용한방법
function compareUsage(customerID, laterYear, month) {
    const later = getCustomerData().rawData[customerID].usages[laterYear][month]);
    const earlier = getCustomerData().rawData[customerID].usages[laterYear - 1][month]);
    return { laterAmount: later, change: later - earlier };
}
