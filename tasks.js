var myApp = angular.module('myApp', []).filter('weDontLike', function(){
    
    return function(items, name){
        
        var arrayToReturn = [];
        //console.log(items);
        for (var key in items) {
           if(items[key]){
            arrayToReturn.push(key);
           }
        }
        return arrayToReturn;
    };
});

function TasksCtrl($scope,$http) {

	$scope.operationTask={};
	
	var initOperationTask=function(){
		$scope.operationTask.id=0;
		$scope.operationTask.provID=0;
		$scope.operationTask.postSTR="";
		$scope.operationTask.partNumber="";
		$scope.operationTask.nrPkg="";
		$scope.operationTask.phoneModel="";
		$scope.operationTask.city="";
		$scope.operationTask.url="";
		$scope.operationTask.isRandom=false;
		$scope.operationTask.beginTime="2013-12-24 23:43:55";
		$scope.operationTask.endTime="2013-12-24 23:43:55";
		$scope.operationTask.isUpdate=false;
		$scope.operationTask.content="";
		$scope.operationTask.isDelete=false;
	};
	
	var toMySQLDate=function(d){
		var result="";
		if(d instanceof Date){
			var year=d.getFullYear();
			var month=d.getMonth()+1;
			var day=d.getDate();
			var hour=d.getHours();
			var minute=d.getMinutes();
			var second=d.getSeconds();
			result=year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second; 
		}
		return result;
	}
	
	initOperationTask();

	
	var user_cookies={};
	
	if(sessionStorage["microWin"]){
		user_cookies=JSON.parse(sessionStorage["microWin"]);
		$scope.name=user_cookies.name;
//		$scope.priv=user_cookies.priv;
		$scope.detail=user_cookies.detail;           console.log($scope.detail);
	}else{
		window.location="/";
	}


  
  var updatePages=function(start){

//      $http.get('/paging',{'p':start}).
//         success(function(data){
//			$scope.tasks = data;  
//      });//end of post success
	  
	  
	  $http({
		url:"/paging",
		method:"GET",
		params:{p:start}
	  }).success(function(data){
	  
		for(var i=0;i<data.length;i++){
			console.log(new Date((data[i].beginTime)));
			data[i].beginTime=toMySQLDate(new Date((data[i].beginTime)));
			data[i].endTime=toMySQLDate(new Date((data[i].endTime)));
		}
	  
		$scope.tasks=data;
	  });  //Pagination
	  
	  $http.get('/pages').
          success(function(data){
		  $scope.pages=[];
		  for(var i=1;i<=data;i++){
			$scope.pages.push(i);
		  }
//			console.log($scope.pages);
      });//end of post success
	    
  };

  //分页查看，响应用户点击分页按钮
  $scope.loadPage=function(start){
//	console.log(start);
    updatePages(start);
  };
 
  $scope.executeAudit=function(id, status){
		$http({
			url:"/updateStatus",
			method:"GET",
			params:{'id':id, 'status': status}
		}).success(function(data){
			if(data.err){
				alert(data.err);
			}else{
				console.log(data);
				if(data.id){
					for(var i=0;i<$scope.tasks.length;i++){
						if($scope.tasks[i].id===id){
							$scope.tasks[i]=data;
						}
					}// End of for
					console.log(window.frames[0]);
//					window.frames[0].postMessage(data, '*');
				}
			} //End of If else
	  }); //End of Success
  };
  
  $scope.auditSugg=function(task){
			window.frames[1].postMessage(task, '*');
//			console.log("MM="+message.id+message.title);	
  }
  
  //父窗口收到修改意见后判定task.id->修改scope.tasks
  //隐藏Modal
  	window.onmessage = function(event) {
		var task=event.data;
		console.log(task);
		if(task.id){
			$scope.$apply(function(){
				for(var i=0; i<$scope.tasks.length; i++){
					if($scope.tasks[i].id===task.id){
						$scope.tasks[i] = task; //更新绑定的数据
						$('#myModal').modal('hide');
					}
				}// End of for
			});	//End of scope.apply
		}//End of if	
			
		if(task.return2List){
			$("#myModal").modal("hide");
		} //Hide modal when 'return to list' button click
	};  //End of OnMessage
	
	$scope.logout=function(){
		if(confirm("确定退出吗?")){
			window.location="/"; 
			console.log($scope.username);
		}
	}
	
	$scope.addTask=function(){
		var newTask=$scope.operationTask;
		
		$http.post('/insertTask', {'task':newTask}).success(function(data){
			if(data){   console.log(data);
				$scope.tasks.unshift(data);
				initOperationTask();  //内存数据复位
			}
		});
	}; //End of addSendPlan
	
	$scope.viewTask=function(task){
		var o=JSON.stringify(task);
		$scope.operationTask=JSON.parse(o);
		$('#myModal').modal('show');
//		initOperationTask();
	};
	
	$scope.toUpdateTask=function(task){

		var o=JSON.stringify(task);
		$scope.operationTask=JSON.parse(o);
		$('#myModal').modal('show');
	
//		initOperationTask();
	};
	
	$scope.updateTask=function(){
		var newTask=$scope.operationTask;
		
		$http.post('/updateTask', {'task':newTask}).success(function(data){
			if(data){   console.log(data);
				for(var i=0; i<$scope.tasks.length; i++){
					if($scope.tasks[i].id==data.id){
						$scope.tasks[i]=data;
					} 
				} //End of for
				initOperationTask();  //内存数据复位
			}
		});
	};
	$scope.deleteTask=function(id){
		$http.post('/deleteById', {'id':id}).success(function(data){
			if(data.id){//  console.log(data.id);
				for(var i=0; i<$scope.tasks.length; i++){
					if($scope.tasks[i].id==id){
						console.log("ddge");
						$scope.tasks.splice(i, 1);
				//		console.log($scope.tasks);
					}
				}  //End of For
			}
		});
	
	};

  //数据的初始化
  //首先得到整个表的条目数量，取users[user_login].tasksList.length
  //然后根据每页面50，倒排得去服务器取数据
  //另外只能取该用户自身的数据，别人的数据他不应该能看到
  //当然power===admin的用户，就随便了
  updatePages();
  
}