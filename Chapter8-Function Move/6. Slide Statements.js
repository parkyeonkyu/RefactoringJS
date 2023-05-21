//문자 슬라이드하기

const pricingPlan = retrievePricingPlan();
const order = retreiveOrder();
let charge;
const chargePerUnit = pricingPlan.unit;

▽

const pricingPlan = retrievePricingPlan();
const chargePerUnit = pricingPlan.unit;
const order = retreiveOrder();
let charge;

//배경 관련된 코드들이 가까이 모여있다면 이해하기 더 쉽다.
//관련코드끼리 모으는 작업은 다른 리팩토링의 준비단계로 주로 행해진다
//관련있는 코드들을 명확히 구분되는 함수로 추출하는게 그저 문장들을 한데로 모으는것보다 나은 분리법이다.

