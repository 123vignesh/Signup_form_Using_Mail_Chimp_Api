const express= require("express");
const bodyParser =require("body-parser");

var request = require('superagent');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile( __dirname + "/index.html");
});


var mailchimpInstance   = '****',
    listUniqueId        = '************',
   mailchimpApiKey     = '*************************';

app.post('/', function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer.from('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
          'status': 'subscribed',
          'merge_fields': {
            "FNAME": req.body.fname,
            "LNAME": req.body.lname
            }
        })
        .end(function(err, response) {
         if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
          res.sendFile( __dirname + "/success.html");
          } else {
                res.sendFile( __dirname + "/failure.html");
              }
              console.log(req.body.email);
          });

    });


    app.post("/failure",function(req,res){
      res.redirect("/");
    })


app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});


