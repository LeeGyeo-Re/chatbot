var User = require('./models/user.js');
var Coach = require('./models/coach.js');
var Record = require('./models/record.js');
var Game = require('./models/game.js');
var Lesson = require('./models/lesson.js');

module.exports = function(app, fs)
{
  var state = {};
  var dateCount = 0;
  var first = {};

	// 키보드
  app.get('/keyboard', (req, res) => {

      const menu = {
          message: {
            "text" : "안녕하세요 neehoot 입니다."
          },
          type: 'buttons',
          buttons: [
              "등록",
              "기록",
              "경기기록"
          ]
      };
      res.set({
        'content-type': 'application/json'
      }).send(JSON.stringify(menu));
  });


app.post('/message', (req, res) => {
  var resState = true;//나중에 API 분리해서 사용할때는 없애고 사용할것

  const _obj = {
      user_key: req.body.user_key,
      type: req.body.type,
      content: req.body.content
  };


  let massage = {
       "message": {
           "text": '탁구에오 :p'
       },
       "keyboard": {
           "type": "buttons",
           "buttons": [
               "등록",
               "기록",
               "경기기록",

           ]
       }
   };

  if(_obj.content=== "등록"){

   massage.message = {"text" : "반가워요:)"};
   massage.keyboard = { "type" : "buttons",
                        "buttons" : ["코치","회원"]};
                        resState=false;
  }
  else if(_obj.content==="회원"){
    state = _obj.content;
    massage.message = {"text" : "이름을 입력해주세요"};
    massage.keyboard = {"type" : "text"};
    resState=false;
  }
  else if(_obj.content === "코치"){
    state = _obj.content;
    massage.message = {"text" : "이름을 입력해주세요"};
    massage.keyboard = {"type" : "text"};
    resState=false;
  }
  else if(_obj.content==="기록"){
    massage.message = {"text" : "오늘 레슨 내용을 기록해 주세요"};
    massage.keyboard = { "type" : "buttons",
                         "buttons" : ["기록하기","기록보기"]};
                         resState=false;
  }
  else if(_obj.content==="경기기록"){
    massage.message = {"text" : "오늘 경기 내용을 기록해 주세요"};
    massage.keyboard = { "type" : "buttons",
                         "buttons" : ["오늘의경기","경기기록보기"]};
                         resState=false;
  }
  else if(_obj.content==="기록하기"){
    state = _obj.content;
    massage.message = {"text" : "키워드로 저장됩니다."};
    massage.keyboard = {"type" : "text"};
    resState=false;
  }
  else if(_obj.content==="기록보기"){
    var text = new Array();
    var result = "";
    var FindRecords = function func1(callback){
      Record.find({userId: req.body.user_key}, {_id: false, userId: false, __v: false},  function(err, record){
        if(err) {console.error(err);}

        //console.log(record);
        text = record;


        for(var i =0; i < text.length; i++){
          //console.log(text[i].records);

          result = result + "\n\n레슨 : " + text[i].records + "  \n날짜 : " + text[i].created;

        }
        return callback(result);

      });
    };

    FindRecords(function(items){
      console.log(items);
      massage.message = {"text" : items};
      if(resState === true){
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
    });

    //massage.message = {"text" : FindRecords};


    // for(var i = 0; i < text.length ; i++){
    //
    // }

  }
  else if(_obj.content==="오늘의경기"){
    state = _obj.content;
    massage.message = {"text" : "이름 부수 세트 스코어를 입력해주세요!"};
    massage.keyboard = {"type" : "text"};
    resState=false;
  }
  else if(_obj.content==="경기기록보기"){
    var text = new Array();
    var result = "";
    var FindGames = function func2(callback){
      Game.find({userId: req.body.user_key}, {_id: false, userId: false, __v: false},  function(err, game){
        if(err) {console.error(err);}

        text = game;
        for(var i =0; i < text.length; i++){
          result = result + "\n\n게임 : " + text[i].games + "  \n날짜 : " + text[i].created;
        }
        return callback(result);
      });
    };

    FindGames(function(items){
      console.log(items);
      massage.message = {"text" : items};
      if(resState === true){
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify(massage));
      }
    });

    //massage.message = {"text" : FindRecords};


    // for(var i = 0; i < text.length ; i++){
    //
    // }

  }
  else if(_obj.content==="레슨" && AreYouCoach){
    state = _obj.content;
    massage.message = {"text" : "이름을 입력해주세요"};
    massage.keyboard = {"type" : "text"};
    resState=false;
  }
  else if(state==="레슨"){
    console.log(_obj.content);
    User.findOneAndUpdate(
      {userName: _obj.content},
      {$inc: {count: -1} },
      {upsert: true},
      function(err){
        if(err){console.error(err);}
      });
    state = "";
    resState=false;
  }
  else if(_obj.content==="건의" && AreYouUser){
    massage.message = {"text" : "?"};
    resState=false;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  else if(state === '회원'){
    var user = new User();

    User.findOneAndUpdate(
           {userId: req.body.user_key}, /* query */
           {userName: _obj.content, userId: req.body.user_key, count: 8}, /* update */
           { upsert: true}, /* create if it doesn't exist */
           function(err){
             if(err){console.error(err);}
           });
          state = "회원지역";
          massage.message = {"text" : "지역을 입력해주세요"};
          massage.keyboard = {"type" : "text"};
          resState=false;
  }
  else if(state === '회원지역'){
    User.findOneAndUpdate(
           {userId: req.body.user_key}, /* query */
           {area : _obj.content}, /* update */
           { upsert: true}, /* create if it doesn't exist */
           function(err){
             if(err){console.error(err);}
           });
           massage.message = {"text" : "부수를 입력해주세요"};
           massage.keyboard = {"type" : "buttons",
          "buttons" : ["1","2","3","4","5","6","7"]};
          state = "회원부수"
          resState=false;

  }
  else if(state === "회원부수"){
    User.findOneAndUpdate(
           {userId: req.body.user_key}, /* query */
           {level : _obj.content}, /* update */
           { upsert: true}, /* create if it doesn't exist */
           function(err){
             if(err){console.error(err);}
           });
           massage.message = {"text" : "코치이름을 입력해주세요"};
           massage.keyboard = {"type" : "text"};
           state="회원코치입력";
           resState=false;
  }
  else if(state === "회원코치입력"){
    console.log("코치입력시작");
    var result = "";
    var area = function userArea(callback){
      User.find({userUd: req.body.user_key}, function(err,area){
        if(err){console.errer(err);}
        var temp = area;
        console.log("area");
        return callback(temp);
      })
    };
    area(function(item){
      var FindCoach = function userCouch(callback){
        Coach.find({name: _obj.content, area:item.area}, function(err, coach){
          if(err) {console.error(err);}
          var temp = coach;
          console.log(item.area);
          return callback(temp);
        });
      };

      FindCoach(function(coach){
        User.findOneAndUpdate(
               {userId: req.body.user_key}, /* query */
               {coachId : coach.coachId}, /* update */
               { upsert: true}, /* create if it doesn't exist */
               function(err){
                 if(err){console.error(err);}
               }
             );
      });

    });
    massage.message = {"text" : "레슨 요일을 선택해 주세요!"};
    massage.keyboard = { "type" : "buttons",
                         "buttons" : ["월요일","화요일","수요일","목요일","금요일","종료"]};

    first = false;
    state="회원레슨요일";
    resState = false;
  }
  else if(state === "회원레슨요일"){
    console.log(first);


    if(first){
      console.log("레슨2");
      User.findOneAndUpdate(
             {userId: req.body.user_key}, /* query */
             {second : _obj.content}, /* update */
             { upsert: true}, /* create if it doesn't exist */
             function(err){
               if(err){console.error(err);}
             }
           );
            second = true;
            first = false;
            massage.message={"text" : "등록되었습니다."};
            state = "";
            resState = false;
    }
    else{
      console.log("레슨1");
      User.findOneAndUpdate(
             {userId: req.body.user_key}, /* query */
             {first: _obj.content}, /* update */
             { upsert: true}, /* create if it doesn't exist */
             function(err){
               if(err){console.error(err);}
             }
           );
           massage.message = {"text" : "레슨 요일을 선택해 주세요!"};
           massage.keyboard = { "type" : "buttons",
                                "buttons" : ["월요일","화요일","수요일","목요일","금요일","종료"]};

          first = true;
    }

  }

//////////////////////////////////////////////////////////////////////////////////////////////////////


  // else if(_obj.content === "요일" || state === "요일"){
  else if(_obj.content === "요일" && AreYouUser){
    console.log(_obj.content);
    state = "요일";

    massage.message = {"text" : "레슨 요일을 선택해 주세요!"};
    massage.keyboard = { "type" : "buttons",
                         "buttons" : ["월요일","화요일","수요일","목요일","금요일"]};
                         resState=false;

  }
  else if(state === "요일"){
    console.log(_obj.content);
    console.log(dateCount);
    console.log(state);
    //레슨 횟수 조정 가능함
    dateCount = dateCount+1;
    if(dateCount === 1){
      var lesson = new Lesson();
      var text = _obj.content;

      lesson.userId = req.body.user_key;
      lesson.firstLesson = text;

      lesson.save(function(err,res){
        if(err) {console.error(err);}
      })
      resState=false;

      massage.message = {"text" : "레슨 요일을 선택해 주세요!"};
      massage.keyboard = { "type" : "buttons",
                           "buttons" : ["월요일","화요일","수요일","목요일","금요일"]};
                           resState=false;
    }
    if(dateCount === 2){
      var text = _obj.content;

      Lesson.findOneAndUpdate(
             {userId: req.body.user_key}, /* query */
             {secondLesson: text}, /* update */
             { upsert: true}, /* create if it doesn't exist */
             function(err){
               if(err){console.error(err);}
             });
      resState=false;
      state = "";
      dateCount = 0;

    }
  }
  else if(state === "코치"){
    var coach = new Coach();

    Coach.findOneAndUpdate(
      {userId: req.body.user_key},
      {userId: req.body.user_key, coach: _obj.content},
      {upsert:true},
      function(err){
        if(err){console.error(err);}
      }
    );
    state = "";
    resState=false;
  }
  else if(state === "기록하기"){
    var record = new Record();
    var result = "";
    var text = _obj.content;

    // mecab.extractNounMap(text,function(err,result){
    //    keywords.forEach(
    //      function addRecord(value){result = result + " " + value + " ";}
    //    );
    //
    //   console.log(result);
    // })
    record.userId = req.body.user_key;
    record.records = text;

    record.save(function(err,res){
      if(err) {console.error(err);}
    })
    state = "";
    resState=false;
  }

  else if(state === "오늘의경기"){
    var game = new Game();
    var result = "";
    var text = _obj.content;

    // mecab.extractNounMap(text,function(err,result){
    //    keywords.forEach(
    //      function addRecord(value){result = result + " " + value + " ";}
    //    );
    //
    //   console.log(result);
    // })
    game.userId = req.body.user_key;
    game.games = text;

    game.save(function(err,res){
      if(err) {console.error(err);}
    })
    state = "";
    resState=false;
  }

  if(resState===false){
    // AreYouUser = "";
    // AreYouCoach = "";
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(massage));
  }
});


app.post('/friend', (req, res) => {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 쳇팅방에 참가했습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});

app.delete('/friend', (req, res) => {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 쳇팅방을 차단했습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});
app.delete('/chat_room/:user_key', (req, res) => {
    const user_key = req.params.user_key;
    console.log(`${user_key}님이 쳇팅방에서 나갔습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({success:true}));
});
};
