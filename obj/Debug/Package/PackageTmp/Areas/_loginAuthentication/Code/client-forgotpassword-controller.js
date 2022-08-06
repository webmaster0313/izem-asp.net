
let api_sendPasswordUrl = backlink + "registration/api/signin/apiSendPasswordUrl";
let api_resetPassword = backlink + "registration/api/signin/apiResetPassword";

app.controller("client-forgotpassword-controller", ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.isURLType = false;

    $scope.onClick_ResetPassword = () => {

        try {

            $http({
                method: 'POST',
                url: api_sendPasswordUrl,
                data: {
                    "email": $scope.email
                }
            }).then(function success(res) {
                let status = res.data.status;
                let message = res.data.message;

                if (status == "200") {
                    successMsg("Password", message);

                    setTimeout(function () {
                        $window.location.href = '/';
                    }, 1000);
                }

                if (status == "404") {
                    warningMsg("Password", message);
                }

            }, (err) => {
                console.log(err);
            });

        } catch (e) {
            console.log(e);
        }
    };

    $scope.onClick_ResetMasterPassword = () => {
        try {

            $http({
                method: 'POST',
                url: api_resetPassword,
                data: {
                    "email": $scope.urlEmail,
                    "password": $scope.password
                }
            }).then(function success(res) {

                let status = res.data.status;
                let message = res.data.message;

                if (status == "200") {
                    successMsg("Password", message);

                    setTimeout(function () {
                        $window.location.href = '/';
                    }, 1000);
                }
                if (status == "404") {
                    warningMsg("Password", message);
                }

            }, (err) => {
                console.log(err);
            });

        } catch (e) {
            console.log(e);
        }
    };

    $scope.onChange_confirmPassword = () => {

        if ($scope.password == $scope.su_ConfirmPassword) {
            $scope.passwordIsConfirm = false;
            $scope.isShowMessage = false;
        }
        else {
            $scope.passwordIsConfirm = true;
            $scope.isShowMessage = true;
            $scope.message = "Password not matched!";
        }

    };

    var searchObject = getQueryStringValue($window.location.search);

    if (searchObject["type"]) {
        $scope.isURLType = true;
        $scope.urlEmail = searchObject["type"];
    }
    else
        $scope.isURLType = false;

}]);