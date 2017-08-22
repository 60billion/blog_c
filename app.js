var express = require('express');
var app = express();
app.listen(2000, function(req,res){
  console.log("Connected Port 2000!");
});
var fs = require('fs');
var fs = require('fs');
var bodyParser =require('body-parser');
var mysql = require('mysql');
var ps = '12345';
app.use(bodyParser.urlencoded({extended:false}));
app.set('views','./views');
app.set('view engine', 'jade');
app.locals.pretty = true;


var conn = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'111311',
  database:'public'
});
conn.connect();


app.get('/email/:id',function(req,res){
  var id = req.params.id;
  var sql ='select * from temp where id=?';
  var sqlu = 'insert into blogc(title,name,email,phone,password,contents) values(?,?,?,?,?,?)';
  conn.query(sql,id,function(err,rows){
    if(err){
      console.log(err);
    }//console.log(rows[0].title);
    //res.send("Hello")

    var params=[rows[0].title,rows[0].name,rows[0].email,rows[0].phone,'1234',rows[0].contents];
    conn.query(sqlu,params,function(err,row){
      if(err){
        console.log(err);
      }res.redirect('/');

    })
});
});

app.get('/msg',function(req,res){
  res.render('msg');
});



app.get('/',function(req,res){

  var sql = 'select * from blogc';
  var sql1 = 'select * from blogc where id=?';
  conn.query(sql,function(err,rows1,fields){
    if(err){
      console.log(err);
    }var kid = rows1[rows1.length-1].id;
      res.redirect('/'+kid);
    });
});

app.get('/new',function(req,res){
  var sql = 'select * from blogc';
  conn.query(sql,function(err,rows,fields){
    if(err){
      console.log(err);
    }res.render('new',{list:rows.reverse()});
  });
});

app.get('/:id',function(req,res){
  var id = req.params.id;
  var sql1 = 'select * from blogc where id=?';
  var sql = 'select * from blogc';
  conn.query(sql,function(err,rows1,fields){
    if(err){
      console.log(err);
    }
    conn.query(sql1,id,function(err,rows,fields){
      if(err){
        console.log(err);
      }//res.send(rows)
      res.render('table',{list1:rows[0] , list:rows1.reverse(), id:id});
    });
  });

})

app.post('/',function(req,res){
  var title = req.body.title;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var contents = req.body.contents;
  var sql = 'insert into blogc(title,name,email,phone,password,contents) values(?,?,?,?,?,?)';
  var params = [title,name,email,phone,password,contents];
  conn.query(sql,params,function(err,rows,fields){
    if(err)console.log(err);
    else res.redirect('/'+rows.insertId);
  });
})

app.get('/:id'+'/edit',function(req,res){
  var id = req.params.id;
  var sql1 = 'select * from blogc where id=?';
  var sql = 'select * from blogc';
  conn.query(sql,function(err,rows1,fields){
    if(err){
      console.log(err);
    }
    conn.query(sql1,id,function(err,rows,fields){
      if(err){
        console.log(err);
      }
      res.render('edit',{list1:rows[0] , list:rows1.reverse()});
    });
  });

})

app.post('/:id',function(req,res){
  var id = req.params.id;
  var title = req.body.title;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var contents = req.body.contents;
  var sql = 'update blogc set title=?, name=?, email=?, phone=?, password=?, contents=? where id=?';
  var sql1 = 'select password,id from blogc where id=?';
  conn.query(sql1,id,function(err,rows,fields){
    if(err){
      console.log(err);
    }if(password==rows[0].password || password==ps){
      var params = [title,name,email,phone,password,contents,id]
      conn.query(sql,params,function(err,rows,fields){
        if(err)console.log(err);
        else res.redirect('/'+id);
      });
      }else{
        var sql11 = 'select * from blogc where id=?';
        var sql0 = 'select * from blogc';
        conn.query(sql0,function(err,rows1,fields){
          if(err){
            console.log(err);
          }
          conn.query(sql11,id,function(err,rows,fields){
            if(err){
              console.log(err);
            }
            res.render('check',{list1:rows[0] , list:rows1});
          });
        });

    }
  });
});

app.get('/:id'+'/delete',function(req,res){
  var id = req.params.id;
  var sql11 = 'select * from blogc where id=?';
  var sql0 = 'select * from blogc';
  conn.query(sql0,function(err,rows1,fields){
    if(err){
      console.log(err);
    }
    conn.query(sql11,id,function(err,rows,fields){
      if(err){
        console.log(err);
      }
      res.render('delete',{list1:rows[0] , list:rows1.reverse(), id:id});
    });
  });
});

app.post('/:id'+'/delete/m',function(req,res){
  var id = req.params.id;
  var password = req.body.password;
  var sql = 'select * from blogc where id=?';
  conn.query(sql,id,function(err,rows,fields){
    if(err){
      console.log(err);
    }
    if(password==rows[0].password || password==ps){
      var sql5 = 'delete from blogc where id=?';
      conn.query(sql5,id,function(err,rows,fields){
        if(err)console.log(err);
        res.redirect('/');
      });
    }else {
      var sql11 = 'select * from blogc where id=?';
      var sql0 = 'select * from blogc';
      conn.query(sql0,function(err,rows1,fields){
        if(err){
          console.log(err);
        }
        conn.query(sql11,id,function(err,rows,fields){
          if(err){
            console.log(err);
          }
          res.render('check',{list1:rows[0] , list:rows1});
        });
      });
    }
  });
  });
