
let api_signinEmployer = backlink + "registration/api/signin/apiSignInEmployer";
let api_signinEmployee = backlink + "registration/api/signin/apiSignInEmployee";

app.controller("client-signin-controller", ['$scope', '$http', '$window',
    function ($scope, $http, $window) {

        $scope.selectedItem = 'employer';

        $scope.onClick_SetAsSelected = (x) => {
            try {

                if (x == 'employer') {
                    $("#_selectEmployer").addClass('badge-dark text-white');
                    $("#_selectEmployee").removeClass('badge-dark text-white');

                    $scope.selectedItem = 'employer';
                }
                else {
                    $("#_selectEmployee").addClass('badge-dark text-white');
                    $("#_selectEmployer").removeClass('badge-dark text-white');

                    $scope.selectedItem = 'member';
                }
            } catch (e) {
                console.log(e);
            }
        };

        employerLogin = () => {
            try {

                let userName = $scope.email;
                let password = $scope.password;

                $http({
                    method: 'POST',
                    url: api_signinEmployer,
                    data: {
                        "userName": userName, "password": password
                    }
                }).then(function success(response) {

                    let status = response.data.status;
                    let result = response.data.data;

                    if (status === 404) {
                        warningMsg("Login", "Authentication fail.");
                    }

                    if (status === 200) {
                        localStorage.setItem("_izemToken", result.token);
                        localStorage.setItem("_izemLoginEmail", userName);
                        localStorage.setItem("_izemFullName", result.name);
                        localStorage.setItem("_izemRole", result.role);
                        localStorage.setItem("_izemIsVerify", result.isVerify);

                        localStorage.setItem("_izemEmployerId", result.employerId);
                        localStorage.setItem("_izemSignupId", result.signupId);
                        localStorage.setItem("_izemEmployerEmail", result.employerEmail);
                        localStorage.setItem("_izemEmployerManagerEmail", "");

                        localStorage.setItem("_izemCompanyName", result.companyName);
                        localStorage.setItem("_izemCompanyContact", result.companyContact);
                        localStorage.setItem("_izemAddress", result.address);

                        localStorage.setItem("_employerbranchId", 0);

                        $window.location.href = '/employer';
                    }

                }, (err) => {
                    console.log(err);
                });

            } catch (e) {
                console.log(e);
            }
        };

        employeeLogin = () => {
            try {
                try {

                    let userName = $scope.email;
                    let password = $scope.password;

                    $http({
                        method: 'POST',
                        url: api_signinEmployee,
                        data: {
                            "userName": userName, "password": password
                        }
                    }).then(function success(response) {

                        let status = response.data.status;
                        let result = response.data.data;

                        if (status === 404) {
                            warningMsg("Login", "Authentication fail.");
                        }

                        if (status === 409) {
                            let signInInfo = {
                                "email": result.email,
                                "verificationMode": true
                            };
                            localStorage.setItem("signInInfo", JSON.stringify(signInInfo));

                            $window.location.href = '/verification';
                        }

                        if (status === 200) {
                            localStorage.setItem("_izemToken", result.token);
                            localStorage.setItem("_izemLoginEmail", userName);
                            localStorage.setItem("_izemFullName", result.name);
                            localStorage.setItem("_izemRole", result.role);
                            localStorage.setItem("_izemIsVerify", result.isVerify);

                            localStorage.setItem("_izemEmployerId", result.employerId);
                            localStorage.setItem("_izemEmployeeId", result.employeeId);
                            localStorage.setItem("_izemMemberId", result.memberId);
                            localStorage.setItem("_izemSignupId", result.signupId);
                            localStorage.setItem("_izemEmployerEmail", result.employerEmail);
                            localStorage.setItem("_izemEmployerManagerEmail", result.employerManagerEmail);

                            localStorage.setItem("_izemCompanyName", result.companyName);
                            localStorage.setItem("_izemCompanyContact", result.companyContact);
                            localStorage.setItem("_izemAddress", result.address);

                            localStorage.setItem("_employeeType", result.employeeType);
                            localStorage.setItem("_employerbranchId", result.employerbranchId);

                            let userRights = [];

                            if (result.userRights == undefined)
                                result.userRights = [];

                            if (result.userRights.length > 0) {
                                userRights = JSON.stringify(result.userRights);
                            }
                            else
                                userRights = JSON.stringify(userRights);

                            localStorage.setItem("_izemRights", userRights);

                            if (result.isEmployer == true)
                                $window.location.href = '/employer';
                            else
                                $window.location.href = '/member';
                        }

                    }, (err) => {
                        console.log(err);
                    });

                } catch (e) {
                    console.log(e);
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SignIn = () => {
            if ($scope.selectedItem == 'employer')
                employerLogin();
            else
                employeeLogin();
        };

    }]);