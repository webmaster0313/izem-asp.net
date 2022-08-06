
let api_signup = backlink + "registration/api/signin/apiSignRegistration";

app.controller("client-registration-controller", ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.onClick_SignUp = () => {
        if (!$scope.checkTerms) {
            $scope.showMsg = true;
            $scope.message = "You must have to accept Terms & Conditions!";
            return;
        }
        let name = $scope.name;
        let mobile = $scope.mobile;
        let email = $scope.email;
        let password = $scope.password;
        let isReadTerm = $scope.isReadTerm;

        try {

            $http({
                method: 'POST',
                url: api_signup,
                data: {
                    "name": name, "mobile": mobile, "email": email,
                    "role": 'employer', "password": password, "isReadTerm": isReadTerm
                }
            }).then(function success(response) {
                if (response.status === 200) {
                    let result = response.data;
                    if (result.status == '409') {
                        warningMsg("Warning", result.message);
                    }
                    if (result.status == '200') {
                        let signInInfo = {
                            "email": email,
                            "verificationMode": true
                        };
                        localStorage.setItem("signInInfo", JSON.stringify(signInInfo));

                        $window.location.href = '/verification';
                    }
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
            $scope.showMsg = false;
        }
        else {
            $scope.passwordIsConfirm = true;
            $scope.showMsg = true;
            $scope.message = "Password not matched!";
        }

    };

}]);