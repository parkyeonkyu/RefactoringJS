//문장을 호출한곳으로 옮기기

result.concat(photoData(person.photo));
function photoData(aPhoto) {
    return [
        `<p>제목 : ${person.photo.title}</p>`,
        `<p>위치 : ${aPhoto.location}</p>`,
        `<p>날짜 : ${aPhoto.date.toDateString()}</p>`
    ];
}



▽


result.push(`<p>제목 : ${person.photo.title}</p>`);
result.concat(photoData(person.photo));

function photoData(aPhoto) {
    return [
        `<p>위치 : ${aPhoto.location}</p>`,
        `<p>날짜 : ${aPhoto.date.toDateString()}</p>`
    ];
}
