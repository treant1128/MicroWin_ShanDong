function UserCtrl($scope,$http) {
  var now_where_I_am=window.location;


  var user_cookies={};
  if(sessionStorage["microWin"]){
    user_cookies=JSON.parse(sessionStorage["microWin"]);
  }else{

  }

  if(now_where_I_am){
	  if(user_cookies.user!=null || user_cookies.user!=undefined){
	  		$scope.username=user_cookies.user;
	  }
	}else{
		
	}

  $scope.verfy_user=function(){

   var data={name:$scope.username,password:$scope.password};
  
   if ($scope.username!="" && $scope.password!="") {
   	console.log("hi.....I am not nulll......");
  	  $http.post('/login',data).success(function(data) {
							console.log(data);
			if(data.isValid){
  	  				sessionStorage["microWin"]=JSON.stringify(data);
    				window.location="taskList.html";
			}else{
				alert(data);
			} //End of user isValid
  	  });//end of http post method
  	}//end of if user and password input textbox not null

  }//end of verfy_user function

}