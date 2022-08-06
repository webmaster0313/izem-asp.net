
let api_selectdatabyid = backlink + "member/api/member/member_apiSelect";
let api_filltabledata = backlink + "member/api/member/member_apiSelectAll";
let api_insertdata = backlink + "member/api/member/member_apiInsert";
let api_updatedata = backlink + "member/api/member/member_apiUpdate";
let api_deletedata = backlink + "member/api/member/member_apiDelete";

app.controller("user-member-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

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
            $scope.memberDob = "";
            $scope.memberEPF = "";
            $scope.memberSocso = "";
            $scope.memberEIS = "";
            $scope.memberIncomeTax = "";
            $scope.memberPTPTN = "";
            $scope.memberOther = "";
            $scope.memberBankName = "";
            $scope.memberAccount = "";
            $scope.memberGoogleTag = "";
            /* search */
            $scope.searchMastercountryId = "";
            $scope.searchMasterstateId = "";
            $scope.searchMemberName = "";
            $scope.searchmemberEmail = "";
            $scope.searchMemberNric = "";
            $scope.searchMemberPassport = "";
            $("#searchModal").modal("hide");

            $scope.hideEntry = true;
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

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.totalCount = res.count;
                            $scope.tableParams = res.data;
                            $scope.loaded = true;
                        }
                        else {
                            $scope.totalCount = 0;
                            $scope.tableParams = [];
                            $scope.loaded = false;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_MasterService = () => {
            let strWhere = "";
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: strWhere,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_AddRecord = () => {
            $scope.hideEntry = false;
        };

        $scope.onClick_Submit = () => {
            try {

                let memberId = $scope.memberId;
                let signupId = $scope.signupId;
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
                let memberEPF = $scope.memberEPF;
                let memberSocso = $scope.memberSocso;
                let memberEIS = $scope.memberEIS;
                let memberIncomeTax = $scope.memberIncomeTax;
                let memberPTPTN = $scope.memberPTPTN;
                let memberOther = $scope.memberOther;
                let memberBankName = $scope.memberBankName;
                let memberAccount = $scope.memberAccount;
                let memberGoogleTag = $scope.memberGoogleTag;

                let req = {};
                if (memberId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "memberId": memberId,
                    "signupId": signupId,
                    "memberName": memberName,
                    "memberNric": memberNric,
                    "memberPassport": memberPassport,
                    "masterraceId": masterraceId,
                    "mastercitizenshipId": mastercitizenshipId,
                    "memberGender": memberGender,
                    "memberMaritalStatus": memberMaritalStatus,
                    "memberAddress1": memberAddress1,
                    "memberAddress2": memberAddress2,
                    "memberAddress3": memberAddress3,
                    "memberPostcode": memberPostcode,
                    "memberCity": memberCity,
                    "mastercountryId": mastercountryId,
                    "masterstateId": masterstateId,
                    "memberMobile": memberMobile,
                    "memberFax": memberFax,
                    "memberEmail": memberEmail,
                    "memberDob": memberDob,
                    "memberEPF": memberEPF,
                    "memberSocso": memberSocso,
                    "memberEIS": memberEIS,
                    "memberIncomeTax": memberIncomeTax,
                    "memberPTPTN": memberPTPTN,
                    "memberOther": memberOther,
                    "memberBankName": memberBankName,
                    "memberAccount": memberAccount,
                    "memberGoogleTag": memberGoogleTag
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (memberId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $scope.onLoad_MasterService();
                            $scope.onLoad_Clear();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_EditRecord = (id) => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectdatabyid,
                    data: {
                        "memberId": id
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

                            $scope.hideEntry = false;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_Cancel = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();

            $scope.hideEntry = true;
        };

        $scope.pageChanged = () => {
            $scope.onLoad_MasterService();
        };

        $scope.changePageSize = () => {
            $scope.pageIndex = 1;
            $scope.onLoad_MasterService();
        };

        //. search result .

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };

        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };

        $scope.onClick_SearchResult = () => {
            $scope.onLoad_MasterService();
        };

        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

    }]);