

let api_selectdatabyid_member = backlink + "member/api/member/member_apiSelect";
let api_filltabledata_member = backlink + "member/api/member/member_apiSelectAll";
let api_insertdata_member = backlink + "member/api/member/member_apiInsert";
let api_updatedata_member = backlink + "member/api/member/member_apiUpdate";
let api_deletedata_member = backlink + "member/api/member/member_apiDelete";

app.controller("employee-member-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        manageNRICpattern();

        $scope.onLoad_Clear = () => {
            $scope.memberId = 0;
            $scope.signupId = 0;
            $scope.memberName = "";
            $scope.memberNric = "";
            $scope.memberPassport = "";
            $scope.masterraceId = "";
            $scope.mastercitizenshipId = "";
            $scope.memberGender = "";
            $scope.memberMaritalStatus = "";
            $scope.memberAddress1 = "";
            $scope.memberAddress2 = "";
            $scope.memberAddress3 = "";
            $scope.memberPostcode = "";
            $scope.memberCity = "";
            $scope.mastercountryId = "";
            $scope.masterstateId = "";
            $scope.memberMobile = "";
            $scope.memberFax = "";
            $scope.memberEmail = "";
            $scope.memberDob = new Date();
            $scope.memberEPF = "";
            $scope.memberSocso = "";
            $scope.memberEIS = "";
            $scope.memberIncomeTax = "";
            $scope.memberPTPTN = "";
            $scope.memberOther = "";
            $scope.memberBankName = "";
            $scope.memberAccount = "";
            $scope.memberGoogleTag = "";

            $scope.ignoreValidation = false;
        };
        $scope.onLoad_Clear();

        $scope.onLoad_Country = () => {
            try {

                httpCommonService.fill_backoffice_country()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastercountryId = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Country();

        $scope.onLoad_EmployeeBank = () => {
            try {

                httpCommonService.fill_backoffice_employeebank()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastermemberBankName = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_EmployeeBank();

        $scope.onLoad_Race = () => {
            try {

                httpCommonService.fill_backoffice_race()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masterraceId = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Race();

        $scope.onLoad_Citizenship = () => {
            try {

                httpCommonService.fill_backoffice_citizenship()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastercitizenshipId = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Citizenship();

        $scope.fillState = () => {
            try {

                httpCommonService.fill_backoffice_state($scope.mastercountryId)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masterstateId = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onLoad_UpdateMember = (memberId) => {

            try {

                let req = {
                    method: 'POST',
                    url: api_selectdatabyid_member,
                    data: {
                        "memberId": memberId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            $scope.memberId = res.data.memberId;
                            $scope.signupId = res.data.signupId;
                            $scope.memberName = res.data.memberName;
                            $scope.memberNric = res.data.memberNric;
                            $scope.memberPassport = res.data.memberPassport;
                            $scope.masterraceId = res.data.masterraceId;
                            $scope.mastercitizenshipId = res.data.mastercitizenshipId;
                            $scope.memberGender = res.data.memberGender;
                            $scope.memberMaritalStatus = res.data.memberMaritalStatus;
                            $scope.memberAddress1 = res.data.memberAddress1;
                            $scope.memberAddress2 = res.data.memberAddress2;
                            $scope.memberAddress3 = res.data.memberAddress3;
                            $scope.memberPostcode = res.data.memberPostcode;
                            $scope.memberCity = res.data.memberCity;
                            $scope.mastercountryId = res.data.mastercountryId == 0 ? "" : res.data.mastercountryId;
                            if ($scope.mastercountryId != 0)
                                $scope.fillState();
                            $scope.masterstateId = res.data.masterstateId == 0 ? "" : res.data.masterstateId;
                            $scope.memberMobile = res.data.memberMobile;
                            $scope.memberFax = res.data.memberFax;
                            $scope.memberEmail = res.data.memberEmail;
                            $scope.memberDob = new Date(res.data.memberDob);
                            $scope.memberEPF = res.data.memberEPF;
                            $scope.memberSocso = res.data.memberSocso;
                            $scope.memberEIS = res.data.memberEIS;
                            $scope.memberIncomeTax = res.data.memberIncomeTax;
                            $scope.memberPTPTN = res.data.memberPTPTN;
                            $scope.memberOther = res.data.memberOther;
                            $scope.memberBankName = res.data.memberBankName;
                            $scope.memberAccount = res.data.memberAccount;
                            $scope.memberGoogleTag = res.data.memberGoogleTag;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SubmitMember = () => {
            try {

                let memberId = $scope.memberId;
                let memberName = $scope.memberName;
                let memberNric = $scope.memberNric;
                let memberPassport = $scope.memberPassport;
                let masterraceId = $scope.masterraceId;
                let mastercitizenshipId = $scope.mastercitizenshipId;
                let memberGender = $scope.memberGender;
                let memberMaritalStatus = $scope.memberMaritalStatus;
                let memberAddress1 = $scope.memberAddress1;
                let memberAddress2 = $scope.memberAddress2;
                let memberAddress3 = $scope.memberAddress3;
                let memberPostcode = $scope.memberPostcode;
                let memberCity = $scope.memberCity;
                let mastercountryId = $scope.mastercountryId;
                let masterstateId = $scope.masterstateId;
                let memberMobile = $scope.memberMobile;
                let memberFax = $scope.memberFax;
                let memberEmail = $scope.memberEmail;
                let memberDob = ConvertDateforDatabase($scope.memberDob);
                let memberBankName = $scope.memberBankName;
                let memberAccount = $scope.memberAccount;
                let memberEPF = $scope.memberEPF;
                let memberSocso = $scope.memberSocso;
                let memberEIS = $scope.memberEIS;
                let memberIncomeTax = $scope.memberIncomeTax;
                let memberPTPTN = $scope.memberPTPTN;
                let memberOther = $scope.memberOther;
                let memberGoogleTag = $scope.memberGoogleTag;

                if ($scope.employeeIsMultipleLogin == false) {
                    if (memberPassport == '' && memberNric == '') {
                        alert("You have to set Passport or NRIC any one!")
                        $("#nricpattern").focus();
                        return;
                    }
                }

                let req = {};
                if (memberId == 0)
                    req = { method: 'POST', url: api_insertdata_member };
                else
                    req = { method: 'POST', url: api_updatedata_member };

                let pera = {
                    "memberId": memberId, "memberName": memberName, "memberNric": memberNric, "memberPassport": memberPassport, "masterraceId": masterraceId,
                    "mastercitizenshipId": mastercitizenshipId, "memberGender": memberGender, "memberMaritalStatus": memberMaritalStatus, "memberAddress1": memberAddress1,
                    "memberAddress2": memberAddress2, "memberAddress3": memberAddress3, "memberPostcode": memberPostcode, "memberCity": memberCity, "mastercountryId": mastercountryId,
                    "masterstateId": masterstateId, "memberMobile": memberMobile, "memberFax": memberFax, "memberEmail": memberEmail, "memberDob": memberDob, "memberEPF": memberEPF,
                    "memberSocso": memberSocso, "memberEIS": memberEIS, "memberIncomeTax": memberIncomeTax, "memberPTPTN": memberPTPTN, "memberOther": memberOther,
                    "memberGoogleTag": memberGoogleTag, "memberBankName": memberBankName, "memberAccount": memberAccount
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (memberId == 0) {
                                insertMsg();
                                $rootScope.onLoad_AfterInsertProcess(memberPassport, memberNric, memberName);
                            }
                            else {
                                updateMsg();
                                $rootScope.onClick_CloseMemberForm();
                            }
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_AddMember = () => {
            $scope.onLoad_Clear();
        };

    }]);