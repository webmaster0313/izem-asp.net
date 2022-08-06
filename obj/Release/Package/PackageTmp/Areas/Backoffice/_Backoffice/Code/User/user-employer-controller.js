
let api_selectdatabyid = backlink + "employer/api/employer/employer_apiSelect";
let api_filltabledata = backlink + "employer/api/employer/employer_apiSelectAll";
let api_insertdata = backlink + "employer/api/employer/employer_apiInsert";
let api_updatedata = backlink + "employer/api/employer/employer_apiUpdate";
let api_deletedata = backlink + "employer/api/employer/employer_apiDelete";
//.
let api_verifyFlag = backlink + "registration/api/signup/signup_apiVerifyFlag";

app.controller("user-employer-controller", ['$scope', 'httpService', 'httpCommonService', '$window',
    function ($scope, httpService, httpCommonService, $window) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.employerId = 0;
            $scope.signupId = 0;
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
            $scope.employerManagedBy = "";
            $scope.employerIsActive = false;
            $scope.isVerify = false;
            /* search */
            $scope.SearchMasterCountryTitle = "";
            $scope.SearchMastercountryIsActive = "true";
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

                let employerId = $scope.employerId;
                let signupId = $scope.signupId;
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
                    "employerAddress1": employerAddress1, "employerAddress2": employerAddress2, "employerAddress3": employerAddress3, "employerPostcode": employerPostcode,
                    "employerCity": employerCity, "mastercountryId": mastercountryId, "masterstateId": masterstateId, "employerContactno": employerContactno,
                    "employerFax": employerFax, "employerEmail": employerEmail, "employerInchargeName": employerInchargeName, "employerInchargeMobile": employerInchargeMobile,
                    "employerInchargeEmail": employerInchargeEmail, "employerGoogleTag": employerGoogleTag, "employerManagedBy": employerManagedBy,
                    "employerIsActive": employerIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerId == 0)
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
                        "employerId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerId = res.data.employerId;
                            $scope.employerName = res.data.employerName;
                            $scope.employerRegistration = res.data.employerRegistration;
                            $scope.employerAddress1 = res.data.employerAddress1;
                            $scope.employerAddress2 = res.data.employerAddress2;
                            $scope.employerAddress3 = res.data.employerAddress3;
                            $scope.employerPostcode = res.data.employerPostcode;
                            $scope.employerCity = res.data.employerCity;
                            $scope.mastercountryId = res.data.mastercountryId == 0 ? "" : res.data.mastercountryId;
                            if ($scope.mastercountryId != "")
                                $scope.fillState();
                            $scope.masterstateId = res.data.masterstateId == 0 ? "" : res.data.masterstateId;
                            $scope.employerContactno = res.data.employerContactno;
                            $scope.employerFax = res.data.employerFax;
                            $scope.employerEmail = res.data.employerEmail;
                            $scope.employerInchargeName = res.data.employerInchargeName;
                            $scope.employerInchargeMobile = res.data.employerInchargeMobile;
                            $scope.employerInchargeEmail = res.data.employerInchargeEmail;
                            $scope.employerGoogleTag = res.data.employerGoogleTag;
                            $scope.employerManagedBy = res.data.employerManagedBy;
                            $scope.employerIsActive = res.data.employerIsActive.data[0] == 1 ? true : false;

                            $scope.signupId = res.data.signupId;
                            $scope.isVerify = res.data.isVerify.data[0] == 1 ? true : false;

                            $scope.hideEntry = false;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_DeleteRecord = (id) => {
            try {

                let value = deleteConfirm();
                if (value == "Yes") {

                    let req = {
                        method: 'POST',
                        url: api_deletedata,
                        data: { "employerId": id }
                    };

                    httpService.httpRemoveData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                deleteMsg();
                                $scope.onLoad_MasterService();
                            }
                        }, (err) => {
                            console.log(err);
                        });
                }

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

        //.
        $scope.onClick_AccountVerified = () => {

            try {
                let value = processConfirm();
                if (value == "Yes") {

                    let req = {
                        method: 'POST', url: api_verifyFlag,
                        data: {
                            "signupId": $scope.signupId,
                            "email": $scope.employerEmail
                        }
                    };

                    httpService.httpOperationData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                updateMsg();
                                $window.location.href = '/backoffice/home/manage-exesetup';
                            }
                        }, (err) => {
                            console.log(err);
                        });
                }
                else {
                    if ($scope.isVerify == false)
                        $scope.isVerify = true;
                    else
                        $scope.isVerify = false;
                }

            } catch (e) {
                console.log(e);
            }
        };

    }]);