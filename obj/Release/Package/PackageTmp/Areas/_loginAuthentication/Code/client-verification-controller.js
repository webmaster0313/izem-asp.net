
let api_verification = backlink + "registration/api/signin/apiSignAccessCode";

app.controller("client-verification-controller", ['$scope', '$http', '$window',
    function ($scope, $http, $window) {

        $scope.onClick_Verification = () => {
            let email = $scope.email;
            let accessCode = $scope.accessCode;

            try {

                $http({
                    method: 'POST',
                    url: api_verification,
                    data: {
                        "email": email, "accessCode": accessCode
                    }
                }).then(function success(response) {
                    if (response.data.status === 200) {
                        successMsg('Success', response.data.message);
                        $window.location.href = '/';
                    }
                    if (response.data.status === 404) {
                        warningMsg('Fail', response.data.message)
                    }

                }, (err) => {
                    console.log(err);
                });

            } catch (e) {
                console.log(e);
            }
        };


        let signInInfo = localStorage.getItem("signInInfo");
        if (signInInfo != null) {
            signInInfo = JSON.parse(signInInfo);
            $scope.email = signInInfo.email;
        }

    }]);