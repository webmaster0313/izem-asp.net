
let api_selectdatabyid = backlink + "employer/api/employerentitlement/employerentitlement_apiSelect";
let api_filltabledata = backlink + "employer/api/employerentitlement/employerentitlement_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerentitlement/employerentitlement_apiInsert";
let api_updatedata = backlink + "employer/api/employerentitlement/employerentitlement_apiUpdate";
let api_deletedata = backlink + "employer/api/employerentitlement/employerentitlement_apiDelete";

app.controller("employer-entitlement-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Entitlement');
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
            $scope.employerentitlementId = 0;
            $scope.employerentitlementTitle = "";
            $scope.employerentitlementLimitCategroy1 = "";
            $scope.employerentitlementLimitEmployee1 = "";
            $scope.employerentitlementLimitDependent1 = "";
            $scope.employerentitlementVisitLimitEmployee1 = "";
            $scope.employerentitlementVisitLimitDependent1 = "";

            $scope.employerentitlementLimitCategroy2 = "";
            $scope.employerentitlementLimitEmployee2 = "";
            $scope.employerentitlementLimitDependent2 = "";
            $scope.employerentitlementVisitLimitEmployee2 = "";
            $scope.employerentitlementVisitLimitDependent2 = "";

            $scope.employerentitlementLimitCategroy3 = "";
            $scope.employerentitlementLimitEmployee3 = "";
            $scope.employerentitlementLimitDependent3 = "";
            $scope.employerentitlementVisitLimitEmployee3 = "";
            $scope.employerentitlementVisitLimitDependent3 = "";

            $scope.employerentitlementVisitAllowed = "0";
            $scope.employerentitlementVisitDuration = "";
            $scope.employerentitlementRemarks = "";
            $scope.employerentitlementIsActive = true;

            $scope.employerentitlementEslipGeneratingType = "No";
            /* search */
            $scope.SearchEmployerentitlementTitle = "";
            $scope.SearchEmployerentitlementIsActive = "true";
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
            let SearchEmployerentitlementTitle = $scope.SearchEmployerentitlementTitle;
            let SearchEmployerentitlementIsActive = $scope.SearchEmployerentitlementIsActive;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchEmployerentitlementTitle": SearchEmployerentitlementTitle,
                    "SearchEmployerentitlementIsActive": SearchEmployerentitlementIsActive,
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

                let employerentitlementId = $scope.employerentitlementId;
                let employerentitlementTitle = $scope.employerentitlementTitle;

                let employerentitlementLimitCategroy1 = $scope.employerentitlementLimitCategroy1;
                let employerentitlementLimitEmployee1 = $scope.employerentitlementLimitEmployee1;
                let employerentitlementLimitDependent1 = $scope.employerentitlementLimitDependent1;
                let employerentitlementVisitLimitEmployee1 = $scope.employerentitlementVisitLimitEmployee1;
                let employerentitlementVisitLimitDependent1 = $scope.employerentitlementVisitLimitDependent1;

                let employerentitlementLimitCategroy2 = $scope.employerentitlementLimitCategroy2;
                let employerentitlementLimitEmployee2 = $scope.employerentitlementLimitEmployee2;
                let employerentitlementLimitDependent2 = $scope.employerentitlementLimitDependent2;
                let employerentitlementVisitLimitEmployee2 = $scope.employerentitlementVisitLimitEmployee2;
                let employerentitlementVisitLimitDependent2 = $scope.employerentitlementVisitLimitDependent2;

                let employerentitlementLimitCategroy3 = $scope.employerentitlementLimitCategroy3;
                let employerentitlementLimitEmployee3 = $scope.employerentitlementLimitEmployee3;
                let employerentitlementLimitDependent3 = $scope.employerentitlementLimitDependent3;
                let employerentitlementVisitLimitEmployee3 = $scope.employerentitlementVisitLimitEmployee3;
                let employerentitlementVisitLimitDependent3 = $scope.employerentitlementVisitLimitDependent3;

                let employerentitlementVisitAllowed = $scope.employerentitlementVisitAllowed;
                let employerentitlementVisitDuration = $scope.employerentitlementVisitDuration;
                let employerentitlementRemarks = $scope.employerentitlementRemarks;
                let employerentitlementEslipGeneratingType = $scope.employerentitlementEslipGeneratingType;
                let employerentitlementIsActive = $scope.employerentitlementIsActive;

                if (employerentitlementLimitCategroy1 == "" && employerentitlementLimitCategroy2 == "" && employerentitlementLimitCategroy3 == "") {
                    alert("You must have to select any one category!")
                    return;
                }

                if (employerentitlementLimitCategroy1 != "") {
                    if (employerentitlementLimitEmployee1 == "" || employerentitlementLimitDependent1 == "" || employerentitlementVisitLimitEmployee1 == "" || employerentitlementVisitLimitDependent1 == "") {
                        alert("You must have to provide all the values!")
                        return;
                    }
                }

                if (employerentitlementLimitCategroy2 != "") {
                    if (employerentitlementLimitEmployee2 == "" || employerentitlementLimitDependent2 == "" || employerentitlementVisitLimitEmployee2 == "" || employerentitlementVisitLimitDependent2 == "") {
                        alert("You must have to provide all the values!")
                        return;
                    }
                }

                if (employerentitlementLimitCategroy3 != "") {
                    if (employerentitlementLimitEmployee3 == "" || employerentitlementLimitDependent3 == "" || employerentitlementVisitLimitEmployee3 == "" || employerentitlementVisitLimitDependent3 == "") {
                        alert("You must have to provide all the values!")
                        return;
                    }
                }

                let req = {};
                if (employerentitlementId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {};

                if (employerentitlementLimitCategroy1 == true) {
                    pera = {
                        "employerId": $scope._izemEmployerId,
                        "createdBy": $scope._izemSignupId,
                        "employerentitlementId": employerentitlementId, "employerentitlementTitle": employerentitlementTitle, "employerentitlementLimitCategroy": "0",
                        "employerentitlementLimitEmployee": employerentitlementLimitEmployee1, "employerentitlementLimitDependent": employerentitlementLimitDependent1,
                        "employerentitlementVisitLimitEmployee": employerentitlementVisitLimitEmployee1, "employerentitlementVisitLimitDependent": employerentitlementVisitLimitDependent1,
                        "employerentitlementVisitAllowed": employerentitlementVisitAllowed, "employerentitlementVisitDuration": employerentitlementVisitDuration,
                        "employerentitlementRemarks": employerentitlementRemarks, "employerentitlementEslipGeneratingType": employerentitlementEslipGeneratingType,
                        "employerentitlementIsActive": employerentitlementIsActive
                    }
                }
                if (employerentitlementLimitCategroy2 == true) {
                    pera = {
                        "employerId": $scope._izemEmployerId,
                        "createdBy": $scope._izemSignupId,
                        "employerentitlementId": employerentitlementId, "employerentitlementTitle": employerentitlementTitle, "employerentitlementLimitCategroy": "1",
                        "employerentitlementLimitEmployee": employerentitlementLimitEmployee2, "employerentitlementLimitDependent": employerentitlementLimitDependent2,
                        "employerentitlementVisitLimitEmployee": employerentitlementVisitLimitEmployee2, "employerentitlementVisitLimitDependent": employerentitlementVisitLimitDependent2,
                        "employerentitlementVisitAllowed": employerentitlementVisitAllowed, "employerentitlementVisitDuration": employerentitlementVisitDuration,
                        "employerentitlementRemarks": employerentitlementRemarks, "employerentitlementEslipGeneratingType": employerentitlementEslipGeneratingType,
                        "employerentitlementIsActive": employerentitlementIsActive
                    }
                }
                if (employerentitlementLimitCategroy3 == true) {
                    pera = {
                        "employerId": $scope._izemEmployerId,
                        "createdBy": $scope._izemSignupId,
                        "employerentitlementId": employerentitlementId, "employerentitlementTitle": employerentitlementTitle, "employerentitlementLimitCategroy": "2",
                        "employerentitlementLimitEmployee": employerentitlementLimitEmployee3, "employerentitlementLimitDependent": employerentitlementLimitDependent3,
                        "employerentitlementVisitLimitEmployee": employerentitlementVisitLimitEmployee3, "employerentitlementVisitLimitDependent": employerentitlementVisitLimitDependent3,
                        "employerentitlementVisitAllowed": employerentitlementVisitAllowed, "employerentitlementVisitDuration": employerentitlementVisitDuration,
                        "employerentitlementRemarks": employerentitlementRemarks, "employerentitlementEslipGeneratingType": employerentitlementEslipGeneratingType,
                        "employerentitlementIsActive": employerentitlementIsActive
                    }
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerentitlementId == 0)
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
                        "employerentitlementId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerentitlementId = res.data.employerentitlementId;
                            $scope.employerentitlementTitle = res.data.employerentitlementTitle;
                            $scope.employerentitlementVisitAllowed = res.data.employerentitlementVisitAllowed;
                            $scope.employerentitlementVisitDuration = res.data.employerentitlementVisitDuration;
                            $scope.employerentitlementRemarks = res.data.employerentitlementRemarks;
                            $scope.employerentitlementIsActive = res.data.employerentitlementIsActive.data[0] == 1 ? true : false;
                            $scope.employerentitlementEslipGeneratingType = res.data.employerentitlementEslipGeneratingType;

                            if (res.data.employerentitlementLimitCategroy == 0) {
                                $scope.employerentitlementLimitCategroy1 = true;
                                $scope.employerentitlementLimitEmployee1 = res.data.employerentitlementLimitEmployee;
                                $scope.employerentitlementLimitDependent1 = res.data.employerentitlementLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee1 = res.data.employerentitlementVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent1 = res.data.employerentitlementVisitLimitDependent;
                            }

                            if (res.data.employerentitlementLimitCategroy == 1) {
                                $scope.employerentitlementLimitCategroy2 = true;
                                $scope.employerentitlementLimitEmployee2 = res.data.employerentitlementLimitEmployee;
                                $scope.employerentitlementLimitDependent2 = res.data.employerentitlementLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee2 = res.data.employerentitlementVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent2 = res.data.employerentitlementVisitLimitDependent;
                            }

                            if (res.data.employerentitlementLimitCategroy == 2) {
                                $scope.employerentitlementLimitCategroy3 = true;
                                $scope.employerentitlementLimitEmployee3 = res.data.employerentitlementLimitEmployee;
                                $scope.employerentitlementLimitDependent3 = res.data.employerentitlementLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee3 = res.data.employerentitlementVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent3 = res.data.employerentitlementVisitLimitDependent;
                            }

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
                            "employerentitlementId": id
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

        //. custom reset

        $scope.onClick_ResetOnCheck = (x) => {
            if (x === 'a') {
                $scope.employerentitlementLimitCategroy1 = true;

                $scope.employerentitlementLimitCategroy2 = false;
                $scope.employerentitlementLimitEmployee2 = "";
                $scope.employerentitlementVisitLimitEmployee2 = "";
                $scope.employerentitlementLimitDependent2 = "";
                $scope.employerentitlementVisitLimitDependent2 = "";

                $scope.employerentitlementLimitCategroy3 = false;
                $scope.employerentitlementLimitEmployee3 = "";
                $scope.employerentitlementVisitLimitEmployee3 = "";
            }

            if (x === 'b') {
                $scope.employerentitlementLimitCategroy2 = true;

                $scope.employerentitlementLimitCategroy1 = false;
                $scope.employerentitlementLimitEmployee1 = "";
                $scope.employerentitlementVisitLimitEmployee1 = "";
                $scope.employerentitlementLimitDependent1 = "";
                $scope.employerentitlementVisitLimitDependent1 = "";

                $scope.employerentitlementLimitCategroy3 = false;
                $scope.employerentitlementLimitEmployee3 = "";
                $scope.employerentitlementVisitLimitEmployee3 = "";
            }

            if (x === 'c') {
                $scope.employerentitlementLimitCategroy3 = true;

                $scope.employerentitlementLimitCategroy1 = false;
                $scope.employerentitlementLimitEmployee1 = "";
                $scope.employerentitlementVisitLimitEmployee1 = "";
                $scope.employerentitlementLimitDependent1 = "";
                $scope.employerentitlementVisitLimitDependent1 = "";

                $scope.employerentitlementLimitCategroy2 = false;
                $scope.employerentitlementLimitEmployee2 = "";
                $scope.employerentitlementVisitLimitEmployee2 = "";
                $scope.employerentitlementLimitDependent2 = "";
                $scope.employerentitlementVisitLimitDependent2 = "";
            }
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