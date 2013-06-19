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

function userT4Ctrl($scope,$http) {

	var user_cookies={};

	if(sessionStorage["audit_new"]){
		user_cookies=JSON.parse(sessionStorage["audit_new"]);
		$scope.user=user_cookies.user;
		$scope.priv=user_cookies.priv;
	}else{
		window.location="/";
	}
  
  var updatePages=function(start){
	  $http({
		url:"/users",
		method:"GET"
	  }).success(function(data){
			$scope.users=data;
      });//end of post success
  };
  
  $scope.save_user=function(user){
	$http({
			url:"/updateSecret",
			method:"POST",
			data:{'id':user.id, 'secret': user.secret}
		}).success(function(data){
			if(data.err){
				alert(data.err);
			}else{
				console.log(data);
				if(data.id){
					for(var i=0;i<$scope.users.length;i++){
						if($scope.users[i].id===user.id){
							$scope.users[i]=data;
						}
					}// End of for
				}
			} //End of If else
	  }); //End of Success
  }

	
  //数据的初始化
  //首先得到整个表的条目数量，取users[user_login].tasksList.length
  //然后根据每页面50，倒排得去服务器取数据
  //另外只能取该用户自身的数据，别人的数据他不应该能看到
  //当然power===admin的用户，就随便了
  updatePages();
  
}