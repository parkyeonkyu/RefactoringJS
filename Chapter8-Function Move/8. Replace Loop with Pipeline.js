//반복문을 파이프라인으로 바꾸기

const names = [];
for (const i of input) {
    if (i.job === "programmer")
        names.push(i.name);
}


▽

const names = input.filter(i => i.job === "programmer")
    .map(i => i.name);



//배경
//프로그래머 대부분이 그렇듯 나도 객체 컬렉션을 순회할때 반복문을 사용하라고 배웠다.
//하지만 언어는 계속해서 더 나은 구조를 제공하는쪽으로 발전해왔다. 
//예컨대 이번 이야기의 주인공인 컬렉션 파이프라인을 이용하면 처리 과정을 일련의 연산으로 표현할 수 있다.
//이때 각 연산은 컬렉션을 입력받아 다른 컬렉션을 내뱉는다. 대표적인 연산은 map과 filter다.
//map은 함수를 사용해 입력 컬렉션의 각 원소를 변환하고, filter는 또 다른 함수를 사용해 입력 컬렉션을 필터링해 부분집합을 만든다.
//이 부분집합은 파이프라인의 다음 단계를 위한 컬렉션으로 쓰인다. 
//논리를 파이프라인으로 표현하면 이해하기 훨씬 쉬워진다. 객체가 파이프라인을 따라 흐르며 어떻게 처리되는지를 읽을 수 있기 때문이다.

//예시
//데이터 csv형태
office, country, telephone
Chicago, USA, +1 312 373 1000
Beijing, China, +86 4008 900 505
...(데이터 계속)


function acquireData(input) { //인도에 자리한 사무실을 찾아 도시명과 전화번호를 반환
    const lines = input.aplit("\n"); //컬렉션
    let firstLine = true;
    const result = [];
    for (const line of lines) {
        if (firstLine) {
            firstLine = false;
            continue;
        }
        if (line.trim() === "") continue;
        const record = line.split(",");
        if (record[1].trim() === "India") {
            result.input({ city: record[0].trim(), phone: record[2].trim() });
        }
    }
    return result;
}

▽

function acquireData(input) { //인도에 자리한 사무실을 찾아 도시명과 전화번호를 반환
    const lines = input.aplit("\n"); //컬렉션
    return lines
        .slice(1)
        .filter(line => line.trim() !== "")
        .map(line => line.split(","))
        .filter(fields => fields[1].trim() === "India")
        .map(fields => ({ city: fields[0].trim(), phone: fields[2].trim() }))
}

//line도 인라인할까했지만 그대로 두는 편이 수행하는일을 더 잘 설명해 준다고 판단하여 그대로 뒀다