
let api_signin = backlink + "registration/api/signin/apiSignInBackoffice";

app.controller("backoffice-authentication-controller", ['$rootScope', '$scope', '$http', '$window',
    function ($rootScope, $scope, $http, $window) {

        $scope.onClick_SignIn = () => {

            let userName = $scope.email;
            let password = $scope.password;

            try {

                $http({
                    method: 'POST',
                    url: api_signin,
                    data: {
                        "userName": userName, "password": password
                    }
                }).then(function success(response) {

                    console.log(response);
                    let status = response.data.status;
                    let result = response.data.data;

                    if (status === 404) {
                        warningMsg("Login", "Authentication fail.");
                    }

                    if (status === 200) {
                        localStorage.setItem("_izemToken", result.token);
                        localStorage.setItem("_izemFullName", result.name);
                        localStorage.setItem("_izemRole", result.role);

                        $window.location.href = '/backoffice/dashboard';
                    }

                }, (err) => {
                    console.log(err);
                });

            } catch (e) {
                console.log(e);
            }
        };

    }]);