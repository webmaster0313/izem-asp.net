
let api_selectdatabyid = backlink + "employer/api/employersubscription/employersubscription_apiSelect";
let api_filltabledata = backlink + "employer/api/employersubscription/employersubscription_apiSelectAll";
let api_insertdata = backlink + "employer/api/employersubscription/employersubscription_apiInsert";
let api_updatedata = backlink + "employer/api/employersubscription/employersubscription_apiUpdate";
let api_deletedata = backlink + "employer/api/employersubscription/employersubscription_apiDelete";

app.controller("employer-subscription-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;
        $scope.hideEntry = true;

        //. Rights
        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Subscription');
                    if (_layout.length > 0) {
                        if (_layout[0].isFullAccess.data[0] == 1) {
                            $scope.isAddPermit = true;
                            $scope.isEditPermit = true;
                            $scope.isDeletePermit = true;
                            $scope.isReportPermit = true;
                        } else {
                            if (_layout[0].isAdd.data[0] == 1)
                                $scope.isAddPermit = true;
                            if (_layout[0].isEdit.data[0] == 1)
                                $scope.isEditPermit = true;
                            if (_layout[0].isDelete.data[0] == 1)
                                $scope.isDeletePermit = true;
                            if (_layout[0].isReport.data[0] == 1)
                                $scope.isReportPermit = true;
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_Permission = () => {
            try {

                let _userRole = localStorage.getItem("_izemRole");
                if (_userRole == "employer") {
                    $scope.isAddPermit = true;
                    $scope.isEditPermit = true;
                    $scope.isDeletePermit = true;
                    $scope.isReportPermit = true;
                } else {
                    let localData = localStorage.getItem("_izemRights");
                    if (localData != null)
                        $scope.onLoad_Access(localData);
                    else {
                        warningMsg("Issue with rights.");
                    }
                }

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Permission();
        //.

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.employersubscriptionId = 0;
            $scope.mastersubscriptiontypeId = "";
            $scope.employersubscriptionPurchaseDate = new Date();
            $scope.employersubscriptionActivationDate = new Date();
            $scope.employersubscriptionValidUpto = "";
            $scope.employersubscriptionAmount = "";
            $scope.employersubscriptionPaymodeMode = "cash";
            $scope.employersubscriptionRefNo = "";
            $scope.employersubscriptionNoOfEmployee = 0;
            $scope.employersubscriptionPaymentDate = new Date();
            $scope.employersubscriptionIsActive = true;
            $scope.employersubscriptionIsVerified = false;
            /* search */
            $scope.SearchEmployersubscriptionIsActive = "true";
            $("#searchModal").modal("hide");

            $scope.hideEntry = true;
        };
        $scope.onLoad_Clear();

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
                    "employerId": $scope._izemEmployerId,
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

                let employersubscriptionId = $scope.employersubscriptionId;
                let mastersubscriptiontypeId = $scope.mastersubscriptiontypeId;
                let employersubscriptionPurchaseDate = moment($scope.employersubscriptionPurchaseDate).format("YYYY-MM-DD");
                let employersubscriptionActivationDate = moment($scope.employersubscriptionActivationDate).format("YYYY-MM-DD");
                let employersubscriptionValidUpto = moment($scope.employersubscriptionValidUpto).format("YYYY-MM-DD");
                let employersubscriptionAmount = $scope.employersubscriptionAmount;
                let employersubscriptionPaymodeMode = $scope.employersubscriptionPaymodeMode;
                let employersubscriptionRefNo = $scope.employersubscriptionRefNo;
                let employersubscriptionNoOfEmployee = $scope.employersubscriptionNoOfEmployee;
                let employersubscriptionPaymentDate = moment($scope.employersubscriptionPaymentDate).format("YYYY-MM-DD");
                let employersubscriptionIsActive = $scope.employersubscriptionIsActive;
                let employersubscriptionIsVerified = $scope.employersubscriptionIsVerified;

                let req = {};
                if (employersubscriptionId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employersubscriptionId": employersubscriptionId,
                    "mastersubscriptiontypeId": mastersubscriptiontypeId,
                    "employersubscriptionPurchaseDate": employersubscriptionPurchaseDate,
                    "employersubscriptionActivationDate": employersubscriptionActivationDate,
                    "employersubscriptionValidUpto": employersubscriptionValidUpto,
                    "employersubscriptionAmount": employersubscriptionAmount,
                    "employersubscriptionPaymodeMode": employersubscriptionPaymodeMode,
                    "employersubscriptionRefNo": employersubscriptionRefNo,
                    "employersubscriptionNoOfEmployee": employersubscriptionNoOfEmployee,
                    "employersubscriptionPaymentDate": employersubscriptionPaymentDate,
                    "employersubscriptionIsActive": employersubscriptionIsActive,
                    "employersubscriptionIsVerified": employersubscriptionIsVerified
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employersubscriptionId == 0)
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
                        "employerId": $scope._izemEmployerId,
                        "employersubscriptionId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employersubscriptionId = res.data.employersubscriptionId;
                            $scope.mastersubscriptiontypeId = res.data.mastersubscriptiontypeId;
                            $scope.employersubscriptionPurchaseDate = new Date(res.data.employersubscriptionPurchaseDate);
                            $scope.employersubscriptionActivationDate = new Date(res.data.employersubscriptionActivationDate);
                            $scope.employersubscriptionValidUpto = new Date(res.data.employersubscriptionValidUpto);
                            $scope.employersubscriptionAmount = res.data.employersubscriptionAmount;
                            $scope.employersubscriptionPaymodeMode = res.data.employersubscriptionPaymodeMode;
                            $scope.employersubscriptionRefNo = res.data.employersubscriptionRefNo;
                            $scope.employersubscriptionNoOfEmployee = res.data.employersubscriptionNoOfEmployee;
                            $scope.employersubscriptionPaymentDate = new Date(res.data.employersubscriptionPaymentDate);
                            $scope.employersubscriptionIsActive = res.data.employersubscriptionIsActive.data[0] == 1 ? true : false;
                            $scope.employersubscriptionIsVerified = res.data.employersubscriptionIsVerified.data[0] == 1 ? true : false;

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
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employersubscriptionId": id
                        }
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

        //. Dropdown

        $scope.onLoad_subscriptiontype = () => {

            try {

                httpCommonService.fill_backoffice_subscriptiontype()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastersubscriptiontypeId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_subscriptiontype();

        //. search result .

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };

        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };

        $scope.onClick_SearchResult = () => {
            let SearchEmployersubscriptionIsActive = $scope.SearchEmployersubscriptionIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchEmployersubscriptionIsActive: SearchEmployersubscriptionIsActive,
                    employerId: $scope._izemEmployerId,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };

        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        //. Update Month and calculate salary

        $scope.onChange_UpdateMonth = () => {
            let filterData = $scope.fill_mastersubscriptiontypeId.filter(x => x.mastersubscriptiontypeId == $scope.mastersubscriptiontypeId);
            if (filterData.length > 0) {
                let mastersubscriptiontypeMonth = parseInt(filterData[0].mastersubscriptiontypeMonth);
                $scope.employersubscriptionValidUpto = new Date(new Date($scope.employersubscriptionActivationDate).setMonth(new Date($scope.employersubscriptionActivationDate).getMonth() + mastersubscriptiontypeMonth));

            }
            $scope.employersubscriptionNoOfEmployee = 0;
            $scope.employersubscriptionAmount = 0;
        };

        $scope.onKeypress_CalculateAmount = () => {
            let filterData = $scope.fill_mastersubscriptiontypeId.filter(x => x.mastersubscriptiontypeId == $scope.mastersubscriptiontypeId);
            if (filterData.length > 0) {
                let mastersubscriptiontypeAmount = filterData[0].mastersubscriptiontypeAmount;
                $scope.employersubscriptionAmount = $scope.employersubscriptionNoOfEmployee * mastersubscriptiontypeAmount;

            }
        };

    }]);