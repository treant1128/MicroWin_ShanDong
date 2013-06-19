var myApp = angular.module('myApp2', []).filter('weDontLike', function(){
    
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

function AuditsCtrl($scope,$http) {
  
    $scope.task={};
    
	window.onmessage = function(event) {
		var task=event.data;
		if(task.id){
			$scope.$apply(function(){
				$scope.task=task;
			});	//scope apply
		}	
			
	};  //End of OnMessage
	
	
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
	
	  $scope.saveSugg=function(task){
		task.audit_time=toMySQLDate(new Date());   
		$http({
			url:"/updateSuggestion",
			method:"POST",
			data:{"task":task}
		}).success(function(data){
			if(data.err){
				alert(data.err);
			}else{
	//			console.log(data);
				if(data.id){
					window.parent.postMessage(data, '*');
				}
			} //End of If else
	  }); //End of Success
  };
  
	$scope.return2List=function(){
		var data={};
		data.return2List=888;
		window.parent.postMessage(data, '*');
	}
}