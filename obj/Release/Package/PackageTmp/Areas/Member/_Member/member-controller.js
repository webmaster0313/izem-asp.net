

app.controller("member-controller", ['$rootScope', '$scope', '$http',
    function ($rootScope, $scope, $http) {

        $scope.onClick_Signout = () => {
            try {
                localStorage.removeItem("_izemFullName");
                localStorage.removeItem("_izemLoginEmail");
                localStorage.removeItem("_izemRole");
                localStorage.removeItem("_izemToken");
                localStorage.removeItem("_izemIsVerify");

                localStorage.removeItem("_izemEmployerId");
                localStorage.removeItem("_izemEmployeeId");
                localStorage.removeItem("_izemSignupId");

                localStorage.removeItem("_izemCompanyName");
                localStorage.removeItem("_izemCompanyContact");
                localStorage.removeItem("_izemAddress");

                localStorage.removeItem("_izemRights");

                window.location.href = "/";
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

                $rootScope.report_companyName = localStorage.getItem("_izemCompanyName");
                $rootScope.report_companyContact = localStorage.getItem("companyContact");
                $rootScope.report_address = localStorage.getItem("_izemAddress");
            }
            else {
                window.location.href = "/";
            }
        };
        $scope.loginRecord();

    }]);