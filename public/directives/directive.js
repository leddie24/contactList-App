myApp.directive('autoComplete',['$http',function($http){
    return {
        restrict:'AE',
        scope:{
            selectedTags:'=model'
        },
        templateUrl:'/views/autocomplete-template.html',
        link:function(scope,elem,attrs){
            console.log(scope);
            scope.suggestions=[];

            scope.selectedTags=[];

            scope.selectedIndex=-1;
            var listusers = []; 

            scope.removeTag=function(index){
                scope.selectedTags.splice(index,1);
            }

            scope.search=function(){
                $http.get(attrs.url+'?term='+scope.searchContact).success(function(data){
                    console.log("run search");
                    listusers=[];
                    for (var index in data) {
                        console.log(data[index]);
                        listusers.push(data[index]["name"]);
                    }
                    console.log(listusers);
                    scope.suggestions=listusers;
                    scope.selectedIndex=-1;
                });
            }

            scope.setSearchValue=function(suggestion){
                if(scope.selectedTags.indexOf(suggestion)===-1){
                    scope.$parent.searchContact = suggestion;
                    scope.searchContact = suggestion;
                    scope.suggestions=[];
                    listusers = [];
                }
            }

            scope.checkKeyDown=function(event){
                if(event.keyCode===40){
                    event.preventDefault();
                    if(scope.selectedIndex+1 !== listusers.length){
                        scope.selectedIndex++;
                    }
                }
                else if(event.keyCode===38){
                    event.preventDefault();
                    if(scope.selectedIndex-1 !== -1){
                        scope.selectedIndex--;
                    }
                }
                else if(event.keyCode===13){
                    scope.addToSelectedTags(scope.selectedIndex);
                }
            }

            scope.$watch('selectedIndex',function(val){
                if(val!==-1) {
                    scope.searchText = listusers[scope.selectedIndex];
                }
            });
        }
    }
}]);