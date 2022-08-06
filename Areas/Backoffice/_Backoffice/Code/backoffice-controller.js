

app.controller("backoffice-controller", ['$rootScope', '$scope', '$http',
    function ($rootScope, $scope, $http) {

        $scope.onClick_Signout = () => {
            try {
                localStorage.removeItem("_izemFullName");
                localStorage.removeItem("_izemRole");
                localStorage.removeItem("_izemToken");
                window.location.href = "/backoffice";
            } catch (e) {
                console.log(e);
            }
        };

        $scope.loginRecord = () => {
            let localData = localStorage.getItem("_izemToken");
            if (localData != null) {
                $rootScope.loginName = localStorage.getItem("_izemFullName");
                $rootScope.loginRole = localStorage.getItem("_izemRole");
                $rootScope.token = localStorage.getItem("_izemToken");

                if ($rootScope.loginRole != 'SuperAdmin') {
                    $scope.onClick_Signout();
                }
            }
            else {
                window.location.href = "/backoffice";
            }
        };
        $scope.loginRecord();

    }]);