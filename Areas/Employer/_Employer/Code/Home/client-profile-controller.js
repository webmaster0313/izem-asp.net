
let api_selectdatabyid = backlink + "employer/api/employer/employer_apiSelect";
let api_filltabledata = backlink + "employer/api/employer/employer_apiSelectAll";
let api_insertdata = backlink + "employer/api/employer/employer_apiInsert";
let api_updatedata = backlink + "employer/api/employer/employer_apiUpdate";
let api_deletedata = backlink + "employer/api/employer/employer_apiDelete";
//.
let api_EmployerDetail = backlink + "employer/api/employer/employer_apiEmployerDetail";

app.controller("client-profile-controller", ['$scope', '$window', 'httpService', 'httpCommonService',
    function ($scope, $window, httpService, httpCommonService) {

        let signupId = localStorage.getItem("_izemSignupId");

        $scope.onLoad_Clear = () => {
            $scope.employerId = 0;
            $scope.employerName = "";
            $scope.employerRegistration = "";
            $scope.employerAddress1 = "";
            $scope.employerAddress2 = "";
            $scope.employerAddress3 = "";
            $scope.employerPostcode = "";
            $scope.employerCity = "";
            $scope.mastercountryId = "";
            $scope.masterstateId = "";
            $scope.employerContactno = "";
            $scope.employerFax = "";
            $scope.employerEmail = "";
            $scope.employerInchargeName = "";
            $scope.employerInchargeMobile = "";
            $scope.employerInchargeEmail = "";
            $scope.employerGoogleTag = "";
            $scope.employerManagedBy = "employer";
            $scope.employerIsActive = false;
        };
        $scope.onLoad_Clear();

        $scope.onClick_EditRecord = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_EmployerDetail,
                    data: {
                        "signupId": signupId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let signup = res.data[0];
                            let employer = res.data[1];

                            $scope.name = signup[0].name;
                            $scope.email = signup[0].email;
                            $scope.mobile = signup[0].mobile;
                            $scope.role = signup[0].role;

                            if (employer.length > 0) {
                                $scope.employerId = employer[0].employerId;
                                $scope.employerName = employer[0].employerName;
                                $scope.employerRegistration = employer[0].employerRegistration;
                                $scope.employerAddress1 = employer[0].employerAddress1;
                                $scope.employerAddress2 = employer[0].employerAddress2;
                                $scope.employerAddress3 = employer[0].employerAddress3;
                                $scope.employerPostcode = employer[0].employerPostcode;
                                $scope.employerCity = employer[0].employerCity;
                                $scope.mastercountryId = employer[0].mastercountryId == 0 ? "" : employer[0].mastercountryId;
                                if ($scope.mastercountryId != "")
                                    $scope.fillState();
                                $scope.masterstateId = employer[0].masterstateId == 0 ? "" : employer[0].masterstateId;
                                $scope.employerContactno = employer[0].employerContactno;
                                $scope.employerFax = employer[0].employerFax;
                                $scope.employerEmail = employer[0].employerEmail;
                                $scope.employerInchargeName = employer[0].employerInchargeName;
                                $scope.employerInchargeMobile = employer[0].employerInchargeMobile;
                                $scope.employerInchargeEmail = employer[0].employerInchargeEmail;
                                $scope.employerGoogleTag = employer[0].employerGoogleTag;
                                $scope.employerManagedBy = employer[0].employerManagedBy;
                                $scope.employerIsActive = employer[0].employerIsActive.data[0] == 1 ? true : false;
                            }
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onClick_EditRecord();

        //. dropdown

        $scope.onLoad_Country = () => {
            try {
                httpCommonService.fill_backoffice_country()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastercountryId = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    })

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Country();

        $scope.fillState = () => {

            try {

                httpCommonService.fill_backoffice_state($scope.mastercountryId)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masterstateId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }
        };

        //.

        $scope.updateFromSignIn = (value) => {
            if (value === 'name') {
                $scope.employerName = $scope.name;

            }
            else if (value === 'email') {
                $scope.employerEmail = $scope.email;

            }
            else if (value === 'mobile') {
                $scope.employerContactno = $scope.mobile;
            }
        };

        $scope.onClick_Submit = () => {
            try {

                let employerId = $scope.employerId;
                let employerName = $scope.employerName;
                let employerRegistration = $scope.employerRegistration;
                let employerAddress1 = $scope.employerAddress1;
                let employerAddress2 = $scope.employerAddress2;
                let employerAddress3 = $scope.employerAddress3;
                let employerPostcode = $scope.employerPostcode;
                let employerCity = $scope.employerCity;
                let mastercountryId = $scope.mastercountryId;
                let masterstateId = $scope.masterstateId;
                let employerContactno = $scope.employerContactno;
                let employerFax = $scope.employerFax;
                let employerEmail = $scope.employerEmail;
                let employerInchargeName = $scope.employerInchargeName;
                let employerInchargeMobile = $scope.employerInchargeMobile;
                let employerInchargeEmail = $scope.employerInchargeEmail;
                let employerGoogleTag = $scope.employerGoogleTag;
                let employerManagedBy = $scope.employerManagedBy;
                let employerIsActive = $scope.employerIsActive;

                let req = {};
                if (employerId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": employerId, "signupId": signupId, "employerName": employerName, "employerRegistration": employerRegistration,
                    "employerAddress1": employerAddress1, "employerAddress2": employerAddress2, "employerAddress3": employerAddress3,
                    "employerPostcode": employerPostcode, "employerCity": employerCity, "mastercountryId": mastercountryId, "masterstateId": masterstateId,
                    "employerContactno": employerContactno, "employerFax": employerFax, "employerEmail": employerEmail,
                    "employerInchargeName": employerInchargeName, "employerInchargeMobile": employerInchargeMobile, "employerInchargeEmail": employerInchargeEmail,
                    "employerGoogleTag": employerGoogleTag, "employerManagedBy": employerManagedBy, "employerIsActive": employerIsActive
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerId == 0)
                                insertMsg();
                            else
                                updateMsg();
                            $scope.onClick_EditRecord();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SendToVerify = () => {
            try {

                $scope.employerIsActive = true;
                $scope.onClick_Submit();
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_CancelData = () => {
            $window.location.href = '/employer';
        };

        $scope.onClick_SignOut = () => {
            localStorage.removeItem("_izemFullName");
            localStorage.removeItem("_izemRole");
            localStorage.removeItem("_izemToken");
            localStorage.removeItem("_izemIsVerify");

            localStorage.removeItem("_izemEmployerId");
            localStorage.removeItem("_izemSignupId");

            localStorage.removeItem("_izemCompanyName");
            localStorage.removeItem("_izemCompanyContact");
            localStorage.removeItem("_izemAddress");

            window.location.href = "/";
        };

    }]);