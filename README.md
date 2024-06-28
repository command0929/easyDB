# easyDB module v0.1

> # Description

```txt
해당 모듈은 .db 파일을 쉽게 사용하기 위해
제작된 테스트용 모듈입니다.

해당 모듈을 사용 중 발생하는 오류는
제보 시에 확인 후 고쳐드립니다.


단, 오류 제보 양식은 다음과 같습니다 ?
```

```js
예시 :

[ 환경 ] : pixel 3, msgbot 0.7.29a, module v0.1

[ 실행 코드 ] : testDB.getError();

[ 오류 알림 ] :
TypeError: Cannot find function getError in object [object easyDB]. #1

	at eval#48(eval):1
	at eval:48 (response)

[ 자세한 코드 첨부 ] :
eval('testDB.getError();');
```

> # How to use?

```js
let easyDB = require("easyDB");

let testDB = easyDB.open("sdcard/test.db", {
  create: true
});

testDB.reopen(); // 이전 설정으로 다시 열기
let logs = testDB.get("chat_logs", {
  key: "chat_id",
  value: sbn.tag,
  sort: "_id",
}); // 해당 테이블의 값 가져오기

testDB.put("test_table", {
  key: "PRIMARY KEY",
  data: "data1",
  data2: "data2",
}); // 값 넣기

testDB.remove("test_table", {
  key: "data",
  value: "data1",
  limit: 2,
  sort: "_id",
}); // 값 삭제

testDB.close(); // 닫기
```