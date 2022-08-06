
let api_changePassword = backlink + "registration/api/signin/apiChangePassword";

app.controller("client-changepassword-controller", ['$scope', 'httpService',
    function ($scope, httpService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemsignUp = localStorage.getItem("_izemSignupId");

        $scope.onLoad_Clear = () => {
            $scope.newPassword = "";
        };
        $scope.onLoad_Clear();

        $scope.onClick_SubmitData = () => {

            try {

                let newPassword = $scope.newPassword;

                let req = {
                    method: 'POST',
                    url: api_changePassword,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "signupId": $scope._izemsignUp,
                        "password": newPassword
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            updateMsg();
                            $scope.onLoad_Clear();

                            localStorage.removeItem("_izemFullName");
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
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);

