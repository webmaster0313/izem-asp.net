
let api_selectdatabyid = backlink + "employer/api/employerleavetype/employerleavetype_apiSelect";
let api_filltabledata = backlink + "employer/api/employerleavetype/employerleavetype_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerleavetype/employerleavetype_apiInsert";
let api_updatedata = backlink + "employer/api/employerleavetype/employerleavetype_apiUpdate";
let api_deletedata = backlink + "employer/api/employerleavetype/employerleavetype_apiDelete_All";
//.
let api_selectdatabyid_list = backlink + "employer/api/employerleavetypeentitlement/employerleavetypeentitlement_apiSelect";
let api_filltabledata_list = backlink + "employer/api/employerleavetypeentitlement/employerleavetypeentitlement_apiSelectAll";
let api_insertdata_list = backlink + "employer/api/employerleavetypeentitlement/employerleavetypeentitlement_apiInsert";
let api_updatedata_list = backlink + "employer/api/employerleavetypeentitlement/employerleavetypeentitlement_apiUpdate";
let api_deletedata_list = backlink + "employer/api/employerleavetypeentitlement/employerleavetypeentitlement_apiDelete";

app.controller("employer-leavetype-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

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
                    let _layout = _subDiv.filter(x => x.menuName == 'Leave entries' && x.pageName == 'Leave Type');
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
            $scope.employerleavetypeId = 0;
            $scope.employerleavetypeLeaveCode = "";
            $scope.employerleavetypeLeaveType = "";
            $scope.employerleavetypeOnProrateBasis = "0";
            $scope.employerleavetypeEntitlementRounding = "1";
            $scope.employerleavetypeLeaveConfirmationDay = "0";
            $scope.employerleavetypeLeaveTypeColor = "";
            $scope.elt_Leaveselection = "";
            $scope.employerleavetypeIsActive = true;

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
            let SearchemployerleavetypeLeaveCode = $scope.SearchemployerleavetypeLeaveCode;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchemployerleavetypeLeaveCode": SearchemployerleavetypeLeaveCode,
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

                let employerleavetypeId = $scope.employerleavetypeId;
                let employerleavetypeLeaveCode = $scope.employerleavetypeLeaveCode;
                let employerleavetypeLeaveType = $scope.employerleavetypeLeaveType;
                let employerleavetypeOnProrateBasis = $scope.employerleavetypeOnProrateBasis;
                let employerleavetypeEntitlementRounding = $scope.employerleavetypeEntitlementRounding;
                let employerleavetypeLeaveConfirmationDay = $scope.employerleavetypeLeaveConfirmationDay;
                let employerleavetypeLeaveTypeColor = $scope.employerleavetypeLeaveTypeColor;
                let employerleavetypeIsAnnual = false;
                let employerleavetypeIsHospitalization = false;
                let employerleavetypeIsOther = false;
                let employerleavetypeIsMedical = false;
                let employerleavetypeIsUnpaid = false;
                if ($scope.elt_Leaveselection == "AL")
                    employerleavetypeIsAnnual = true;
                if ($scope.elt_Leaveselection == "HL")
                    employerleavetypeIsHospitalization = true;
                if ($scope.elt_Leaveselection == "OL")
                    employerleavetypeIsOther = true;
                if ($scope.elt_Leaveselection == "MC")
                    employerleavetypeIsMedical = true;
                if ($scope.elt_Leaveselection == "UL")
                    employerleavetypeIsUnpaid = true;

                let employerleavetypeIsActive = $scope.employerleavetypeIsActive;

                let req = {};
                if (employerleavetypeId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerleavetypeId": employerleavetypeId, "employerleavetypeLeaveCode": employerleavetypeLeaveCode, "employerleavetypeLeaveType": employerleavetypeLeaveType,
                    "employerleavetypeOnProrateBasis": employerleavetypeOnProrateBasis, "employerleavetypeEntitlementRounding": employerleavetypeEntitlementRounding,
                    "employerleavetypeLeaveConfirmationDay": employerleavetypeLeaveConfirmationDay, "employerleavetypeLeaveTypeColor": employerleavetypeLeaveTypeColor,
                    "employerleavetypeIsAnnual": employerleavetypeIsAnnual, "employerleavetypeIsHospitalization": employerleavetypeIsHospitalization,
                    "employerleavetypeIsOther": employerleavetypeIsOther, "employerleavetypeIsMedical": employerleavetypeIsMedical,
                    "employerleavetypeIsUnpaid": employerleavetypeIsUnpaid, "employerleavetypeIsActive": employerleavetypeIsActive
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerleavetypeId == 0)
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
                        "employerleavetypeId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerleavetypeId = res.data.employerleavetypeId;
                            $scope.employerleavetypeLeaveCode = res.data.employerleavetypeLeaveCode;
                            $scope.employerleavetypeLeaveType = res.data.employerleavetypeLeaveType;
                            $scope.employerleavetypeOnProrateBasis = res.data.employerleavetypeOnProrateBasis;
                            $scope.employerleavetypeEntitlementRounding = res.data.employerleavetypeEntitlementRounding;
                            $scope.employerleavetypeLeaveConfirmationDay = res.data.employerleavetypeLeaveConfirmationDay;
                            $scope.employerleavetypeLeaveTypeColor = res.data.employerleavetypeLeaveTypeColor;

                            $scope.employerleavetypeIsAnnual = res.data.employerleavetypeIsAnnual.data[0] == 1 ? true : false;
                            if ($scope.employerleavetypeIsAnnual)
                                $scope.elt_Leaveselection = "AL";

                            $scope.employerleavetypeIsHospitalization = res.data.employerleavetypeIsHospitalization.data[0] == 1 ? true : false;
                            if ($scope.employerleavetypeIsHospitalization)
                                $scope.elt_Leaveselection = "HL";

                            $scope.employerleavetypeIsOther = res.data.employerleavetypeIsOther.data[0] == 1 ? true : false;
                            if ($scope.employerleavetypeIsOther)
                                $scope.elt_Leaveselection = "OL";

                            $scope.employerleavetypeIsMedical = res.data.employerleavetypeIsMedical.data[0] == 1 ? true : false;
                            if ($scope.employerleavetypeIsMedical)
                                $scope.elt_Leaveselection = "MC";

                            $scope.employerleavetypeIsUnpaid = res.data.employerleavetypeIsUnpaid.data[0] == 1 ? true : false;
                            if ($scope.employerleavetypeIsUnpaid)
                                $scope.elt_Leaveselection = "UL";

                            $scope.employerleavetypeIsActive = res.data.employerleavetypeIsActive.data[0] == 1 ? true : false;

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
                            "employerleavetypeId": id
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

        $scope.UpdateColor = () => {
            $scope.employerleavetypeLeaveTypeColor = $scope.employerleavetypeLeaveTypeColorCode;
        };

        //. Records

        $scope.onClick_Load_MasterService_list = (x) => {
            let req = {
                method: 'POST',
                url: api_filltabledata_list,
                data: {
                    "employerId": $scope._izemEmployerId,
                    employerleavetypeId: x,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {

                        if (res.data.length > 0) {
                            let verb = {};
                            let Data = res.data[0];

                            verb.employerleavetypeId = x;
                            verb.employerleavetypeentitlementId = 0;
                            verb.employerleavetypeentitlementStart = parseFloat(Data.employerleavetypeentitlementEnd) + 1;
                            verb.employerleavetypeentitlementEnd = 0;
                            verb.employerleavetypeentitlementEntitleDay = 0;
                            verb.employerleavetypeentitlementMaxBnf = 0;

                            res.data.unshift(verb);
                        }

                        $scope.tableParams1 = res.data;
                    }
                    else {
                        $scope.employerleavetypeentitlementStart = 0;
                        $scope.tableParams1 = [{
                            employerleavetypeId: x,
                            employerleavetypeentitlementId: 0,
                            employerleavetypeentitlementStart: 0,
                            employerleavetypeentitlementEnd: 1,
                            employerleavetypeentitlementEntitleDay: 0,
                            employerleavetypeentitlementMaxBnf: 0
                        }];
                    }

                    $("#entitledModal").modal("show");
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_CloseList = () => {
            try {

                $("#entitledModal").modal("hide");
                $scope.onLoad_MasterService();
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_EditRecordEntitlement = (x) => {

            try {


                let employerleavetypeentitlementId = x.employerleavetypeentitlementId;
                let employerleavetypeId = x.employerleavetypeId;
                let employerleavetypeentitlementStart = x.employerleavetypeentitlementStart;
                let employerleavetypeentitlementEnd = x.employerleavetypeentitlementEnd;
                let employerleavetypeentitlementEntitleDay = x.employerleavetypeentitlementEntitleDay;
                let employerleavetypeentitlementMaxBnf = x.employerleavetypeentitlementMaxBnf;

                if (employerleavetypeentitlementStart >= employerleavetypeentitlementEnd) {
                    alert("Please enter valid entry")
                    return;
                }

                let req = {};
                if (employerleavetypeentitlementId == 0)
                    req = { method: 'POST', url: api_insertdata_list };
                else
                    req = { method: 'POST', url: api_updatedata_list };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerleavetypeentitlementId": employerleavetypeentitlementId, "employerleavetypeId": employerleavetypeId,
                    "employerleavetypeentitlementStart": employerleavetypeentitlementStart, "employerleavetypeentitlementEnd": employerleavetypeentitlementEnd,
                    "employerleavetypeentitlementEntitleDay": employerleavetypeentitlementEntitleDay, "employerleavetypeentitlementMaxBnf": employerleavetypeentitlementMaxBnf
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerleavetypeentitlementId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $scope.onClick_Load_MasterService_list(employerleavetypeId);
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_DeleteRecordEntitlement = (x) => {
            try {

                let value = deleteConfirm();
                if (value == "Yes") {

                    let req = {
                        method: 'POST',
                        url: api_deletedata_list,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employerleavetypeId": x.employerleavetypeId,
                            "employerleavetypeentitlementId": x.employerleavetypeentitlementId
                        }
                    };

                    httpService.httpRemoveData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                deleteMsg();
                                $scope.onClick_Load_MasterService_list(x.employerleavetypeId);
                            }
                        }, (err) => {
                            console.log(err);
                        });
                }

            } catch (e) {
                console.log(e);
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