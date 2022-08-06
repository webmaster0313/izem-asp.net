
let api_selectdatabyid = backlink + "employer/api/employee/employee_apiSelect";

app.controller("member-employeedetail-controller", ['$scope', 'httpService',
    function ($scope, httpService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemEmployeeId = localStorage.getItem("_izemEmployeeId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        function imageExists(url, callback) {
            var img = new Image();
            img.onload = function () { callback(true); };
            img.onerror = function () { callback(false); };
            img.src = url;
        }

        $scope.onLoad_ProfileDetail = () => {
            let req = {
                method: 'POST',
                url: api_selectdatabyid,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope._izemEmployeeId
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {

                        $scope._employeeJoiningDDMMYYYY = res.data.employeeJoiningDDMMYYYY;
                        $scope._totalYear = res.data.totalYear;

                        $scope._employerId = res.data.employerId;
                        $scope._memberName = res.data.memberName;
                        $scope._employeeEnroll = res.data.employeeEnroll;
                        $scope._memberMobile = res.data.memberMobile;
                        $scope._memberEmail = res.data.memberEmail;
                        $scope._memberNric = res.data.memberNric == "" ? "-" : res.data.memberNric;
                        $scope._memberPassport = res.data.memberPassport == "" ? "-" : res.data.memberPassport;
                        $scope._memberDobDDMMYYYY = res.data.memberDobDDMMYYYY;

                        $scope._memberGender = res.data.memberGender;
                        $scope._memberMaritalStatus = res.data.memberMaritalStatus;

                        $scope._masterrace = res.data.masterraceCode + ' - ' + res.data.masterraceTitle;
                        $scope._mastercitizenship = res.data.mastercitizenshipCode + ' - ' + res.data.mastercitizenshipTitle;

                        $scope._employeeDesignation = res.data.employeeDesignation;
                        $scope._employerbranchName = res.data.employerbranchName;
                        $scope._employerdepartmentTitle = res.data.employerdepartmentTitle;

                        $scope._memberFax = res.data.memberFax;
                        $scope._memberCity = res.data.memberCity;
                        $scope._masterstate = res.data.masterstateCode + ' - ' + res.data.masterstateTitle;
                        $scope._mastercountry = res.data.mastercountryCode + ' - ' + res.data.mastercountryTitle;
                        $scope._memberPostcode = res.data.memberPostcode;
                        $scope._memberAddress1 = res.data.memberAddress1;
                        $scope._memberAddress2 = res.data.memberAddress2;
                        $scope._memberAddress3 = res.data.memberAddress3;

                        $scope._memberBankName = res.data.memberBankName;
                        $scope._memberAccount = res.data.memberAccount;
                        $scope._employeesalarysetupCurrentBasicRound2 = res.data.employeesalarysetupCurrentBasicRound2;
                        $scope._employeesalarysetupPaymentRate = res.data.employeesalarysetupPaymentRate;
                        $scope._employeesalarysetupPaymentType = res.data.employeesalarysetupPaymentType;

                        $scope._memberEIS = res.data.memberEIS;
                        $scope._memberEPF = res.data.memberEPF;
                        $scope._memberSocso = res.data.memberSocso;
                        $scope._memberIncomeTax = res.data.memberIncomeTax;
                        $scope._memberPTPTN = res.data.memberPTPTN;
                        $scope._memberOther = res.data.memberOther;

                        $scope._memberPostcode = res.data.memberPostcode;

                        $("#searchModal").modal("show");

                    }
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onLoad_ProfileDetail();
    }]);
