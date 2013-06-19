var express = require('express');
var app = express();
var orm = require('orm');
var paging = require('orm-paging');
var server = require('http').createServer(app);
app.use(express.bodyParser({}));

app.use(orm.express("mysql://root:123456@localhost/microwin", {
    define: function (db, models) {
	
			db.use(paging);
	
			models.provinces = db.define("provinces", {
				id			:Number,
				provName	:String,
				provEname	:String,
				isValid		:Boolean
			});  //end of provinces
			
			models.users = db.define("users", {
				id			:Number,
				name		:String,
				password	:String,
				isValid		:Boolean,
				detail		:String
			});  //end of users
			
			models.tasks = db.define("tasks", {
				id			:Number,
				provID		:Number,
				postSTR		:String,
				partNumber	:String,
				nrPkg		:String,
				phoneModel 	:String,
				city		:String,
				url			:String,
				isRandom	:Boolean,
				beginTime	:Date,
				endTime		:Date,
				isUpdate	:Boolean,
				content		:String,
				isDelete	:Boolean
			});  //end of tasks
			
			models.logs = db.define("logs", {
				id			:Number,
				userName	:String,
				dateTime	:Date,
				log			:String
			});  //end of logs
			
    }//End of define:function...
}));//End of app.use.....................

app.get('/microWin.js',function(req,res){
	res.send("??@@@###@?");
});  //写在use之前  防止读取静态文件

app.use('/', express.static(__dirname + '/'));

server.listen(12345);

var itemsPerPage=10;

//=================================================主界面tasks.html的接口================================================
//监听来自抓取平台提交的内容,插入数据库
app.post("/insertTask", function(req, res){
	var task =  req.body.task;  console.log(task);
	req.models.tasks.create([
	{ 																//id 1个
	//	id			:task.id,
		provID		:task.provID,
		postSTR		:task.postSTR,
		partNumber	:task.partNumber,
		nrPkg		:task.nrPkg,
		phoneModel 	:task.phoneModel,
		city		:task.city,
		url			:task.url,
		isRandom	:task.isRandom,
		beginTime	:task.beginTime,
		endTime		:task.endTime,
		isUpdate	:task.isUpdate,
		content		:task.content,
		isDelete	:task.isDelete
	}
	], function(err, items){
//		res.header("Access-Control-Allow-Origin", "*");
//		res.header("Access-Control-Allow-Headers", "X-Requested_with");
		
		if(!err){
			res.send(items[0]);
		}else{
			res.send(err);  
		}
	})
});

//获取总页数
app.get("/pages", function(req, res){
	req.models.tasks.settings.set("pagination.perpage", itemsPerPage); // default is 20
	req.models.tasks.pages(function (err, pages) {
		res.send(JSON.stringify(pages));
    });
});

app.get("/paging", function(req, res){
		var p=req.param('p'); 

		req.models.tasks.settings.set("pagination.perpage", itemsPerPage); // default is 20			
		req.models.tasks.pages(function (err, pages) {
		if(p){
				req.models.tasks.page(p).order('id',"Z").run(function (err, tasks) {
					res.send(JSON.stringify(tasks));
				});//End of get tasks
		}else{
				req.models.tasks.page(1).order('id',"Z").run(function (err, tasks) {
					res.send(JSON.stringify(tasks));
				});//End of get tasks		
		}
    });//End of get pages
});//End of get pages...

//Todo:Update的接口
app.post("/updateTask", function(req, res){
	var task=req.body.task;
	console.log(task);
	req.models.tasks.get(task.id, function(err, resTask){
	
		resTask.provID		=task.provID;
		resTask.postSTR		=task.postSTR;
		resTask.partNumber	=task.partNumber;
		resTask.nrPkg		=task.nrPkg;
		resTask.phoneModel 	=task.phoneModel;
		resTask.city		=task.city;
		resTask.url			=task.url;
		resTask.isRandom	=task.isRandom;
		resTask.beginTime	=task.beginTime;
		resTask.endTime		=task.endTime;
		resTask.isUpdate	=task.isUpdate;
		resTask.content		=task.content;
		resTask.isDelete	=task.isDelete;

		resTask.save(function(err){
			if(err){
				console.log(err);
				res.send(JSON.stringify({'err':err}));
			}else{
				console.log(resTask);
				res.send(resTask);	
			}
		}); //End of Save
		
	}); //End of Get

}); //End of Update Get Request


app.get("/getTaskById", function(req, res){
	var id=req.param('id');
	req.models.tasks.get(id, function(err, task){
		res.send(task);
	}); //End of Get

}); //End of Update Get Request


app.post("/deleteById", function(req, res){
	var id=req.body.id;  console.log(id);
	req.models.tasks.find({'id':id }).remove(function (err) {
		if(!err){
			res.send({'id':id});
		}else{
		console.log(err);
			res.send(err);
		}
	}); //End of Remove

});//End of Get

//=================================================另一个页面modifyUsers.html的接口================================================
app.get("/users", function(req, res){
	req.models.users.find({},function(err, users) {
	console.log(users);
		res.send(JSON.stringify(users));
	});//End of get users
});//End of get pages...


//Todo:修改用户的激活属性  
app.post("/updateUserValidation", function(req, res){
	var id=req.body.id;
	var secret=req.body.secret;
	
	console.log(secret);
	
	req.models.users.get(id, function(err, resUser){
		resUser.secret=secret;   
		resUser.save(function(err){
			if(err){console.log(err);
				res.send(JSON.stringify({'err':err}));
			}else{
				console.log(resUser);
				res.send(resUser);	
			}
		}); //End of Save
		
	}); //End of Get

}); //End of Update Get Request

//============================================index.html(Login)接口===============================
//Todo: 需要检查isValid字段是否为true, 
app.post("/login", function(req, res){
//	console.log("req.body=="+req.body);
	
	var na=req.body.name;
	var password=req.body.password;
	console.log("姓名="+na+",密码="+password);
	
	req.models.users.find({name:na}, function (err, users){  console.log(users);
		if(err){
			res.send(JSON.stringify({error:err}));
		}else{
			if(users.length>0){//如果根据name找不到user
				if(users[0].password==password){
					if(users[0].isValid==1){
						var o={};
						o.name=users[0].name;
						o.isValid=users[0].isValid;  
						o.detail=users[0].detail;
						console.log(o);
						res.send(JSON.stringify(o));
					}else{
						res.send("User Invalid..");
					} //End of Valid
				}else{
					res.send("Password Error!");
				} //End of Password
			}else{
				res.send("No User Found ~~");
			}  //End of User Found
		}
		
	});  //End of find

}); //End of login get

//=============================================logs.html接口======================================
//获取总页数
app.get("/pages", function(req, res){
	req.models.logs.settings.set("pagination.perpage", itemsPerPage); // default is 20
	req.models.logs.pages(function (err, pages) {
		res.send(JSON.stringify(pages));
    });
});

app.get("/paging", function(req, res){
		var p=req.param('p'); 

		req.models.logs.settings.set("pagination.perpage", itemsPerPage); // default is 20			
		req.models.logs.pages(function (err, pages) {
		if(p){
				req.models.logs.page(p).order('id',"Z").run(function (err, logs) {
					res.send(JSON.stringify(logs));
				});//End of get logs
		}else{
				req.models.logs.page(1).order('id',"Z").run(function (err, logs) {
					res.send(JSON.stringify(logs));
				});//End of get logs		
		}
    });//End of get pages
});//End of get pages...

//=================================================modifyProvinces.html的接口================================================
app.get("/provinces", function(req, res){
	req.models.provinces.find({},function(err, provinces) {
	console.log(provinces);
		res.send(JSON.stringify(provinces));
	});//End of get provinces
});//End of get pages...

//Todo:修改省市的属性  
app.post("/updateProvinceValidation", function(req, res){
	var id=req.body.id;
	var secret=req.body.secret;
	
	console.log(secret);
	
	req.models.provinces.get(id, function(err, resUser){
		resUser.secret=secret;   
		resUser.save(function(err){
			if(err){console.log(err);
				res.send(JSON.stringify({'err':err}));
			}else{
				console.log(resUser);
				res.send(resUser);	
			}
		}); //End of Save
		
	}); //End of Get

}); //End of Update Get Request