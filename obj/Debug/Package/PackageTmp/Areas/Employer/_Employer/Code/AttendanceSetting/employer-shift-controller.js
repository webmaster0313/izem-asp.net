
let api_selectdatabyid = backlink + "employer/api/employermastershift/employermastershift_apiSelect";
let api_filltabledata = backlink + "employer/api/employermastershift/employermastershift_apiSelectAll";
let api_insertdata = backlink + "employer/api/employermastershift/employermastershift_apiInsert";
let api_updatedata = backlink + "employer/api/employermastershift/employermastershift_apiUpdate";
let api_deletedata = backlink + "employer/api/employermastershift/employermastershift_apiDelete";

app.controller("employer-shift-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Attendance entries' && x.pageName == 'Shift');
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

        $scope.onLoad_OvertimeSetting = () => {

            try {

                httpCommonService.fill_employer_otsetup()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_OvertimeSetting = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_OvertimeSetting();

        $scope.onLoad_Clear = () => {
            $scope.employerMasterShiftId = 0;
            $scope.shiftName = "";
            $scope.weeklyHour = "";
            $scope.dayHour = "";
            $scope.halfHour = 0;
            $scope.inTime = "";
            $scope.rangeInTime1 = "";
            $scope.rangeInTime2 = "";
            $scope.allowLateInTime = "";

            $scope.outTime = null;
            $scope.rangeOutTime1 = null;
            $scope.rangeOutTime2 = null;
            $scope.allowEarlyOutTime = null;
            $scope.overtimeStartTime = null;

            $scope.outTime_Full = null;
            $scope.rangeOutTime1_Full = null;
            $scope.rangeOutTime2_Full = null;
            $scope.allowEarlyOutTime_Full = null;
            $scope.overtimeStartTime_Full = null;

            $scope.lunchInTime = null;
            $scope.rangelunchInTime1 = null;
            $scope.rangelunchInTime2 = null;
            $scope.lunchOutTime = null;
            $scope.rangelunchOutTime1 = null;
            $scope.rangelunchOutTime2 = null;

            $scope.breakInTime1 = null;
            $scope.rangebreakInTime1_1 = null;
            $scope.rangebreakInTime1_2 = null;
            $scope.breakOutTime1 = null;
            $scope.rangebreakOutTime1_1 = null;
            $scope.rangebreakOutTime1_2 = null;

            $scope.breakInTime2 = null;
            $scope.rangebreakInTime2_1 = null;
            $scope.rangebreakInTime2_2 = null;
            $scope.breakOutTime2 = null;
            $scope.rangebreakOutTime2_1 = null;
            $scope.rangebreakOutTime2_2 = null;

            $scope.isOverTime = "";
            $scope.isOverTimeEarly = "";

            $scope.isMonday = false;
            $scope.isTuesday = false;
            $scope.isWednesday = false;
            $scope.isThursday = false;
            $scope.isFriday = false;
            $scope.isSaturday = false;
            $scope.isSunday = false;
            $scope.mondayType = '';
            $scope.tuesdayType = '';
            $scope.wednesdayType = '';
            $scope.thursdayType = '';
            $scope.fridayType = '';
            $scope.saturdayType = '';
            $scope.sundayType = '';

            $scope.employerotsetupId = "";
            $scope.shiftType = 'day';
            /* search */
            $scope.SearchshiftName = "";
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
            let SearchshiftName = $scope.SearchshiftName;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchshiftName": SearchshiftName,
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

                let employerMasterShiftId = $scope.employerMasterShiftId;
                let shiftName = $scope.shiftName;
                let weeklyHour = $scope.weeklyHour;
                let dayHour = $scope.dayHour;
                let halfHour = $scope.halfHour;
                let inTime = $scope.inTime == null ? null : moment($scope.inTime).format("YYYY-MM-DD HH:mm:ss");
                let rangeInTime1 = $scope.rangeInTime1 == null ? null : moment($scope.rangeInTime1).format("YYYY-MM-DD HH:mm:ss");
                let rangeInTime2 = $scope.rangeInTime2 == null ? null : moment($scope.rangeInTime2).format("YYYY-MM-DD HH:mm:ss");
                let allowLateInTime = $scope.allowLateInTime == null ? null : moment($scope.allowLateInTime).format("YYYY-MM-DD HH:mm:ss");
                let outTime = $scope.outTime == null ? null : moment($scope.outTime).format("YYYY-MM-DD HH:mm:ss");
                let rangeOutTime1 = $scope.rangeOutTime1 == null ? null : moment($scope.rangeOutTime1).format("YYYY-MM-DD HH:mm:ss");
                let rangeOutTime2 = $scope.rangeOutTime2 == null ? null : moment($scope.rangeOutTime2).format("YYYY-MM-DD HH:mm:ss");
                let allowEarlyOutTime = $scope.allowEarlyOutTime == null ? null : moment($scope.allowEarlyOutTime).format("YYYY-MM-DD HH:mm:ss");
                let overtimeStartTime = $scope.overtimeStartTime == null ? null : moment($scope.overtimeStartTime).format("YYYY-MM-DD HH:mm:ss");
                let outTime_Full = $scope.outTime_Full == null ? null : moment($scope.outTime_Full).format("YYYY-MM-DD HH:mm:ss");
                let rangeOutTime1_Full = $scope.rangeOutTime1_Full == null ? null : moment($scope.rangeOutTime1_Full).format("YYYY-MM-DD HH:mm:ss");
                let rangeOutTime2_Full = $scope.rangeOutTime2_Full == null ? null : moment($scope.rangeOutTime2_Full).format("YYYY-MM-DD HH:mm:ss");
                let allowEarlyOutTime_Full = $scope.allowEarlyOutTime_Full == null ? null : moment($scope.allowEarlyOutTime_Full).format("YYYY-MM-DD HH:mm:ss");
                let overtimeStartTime_Full = $scope.overtimeStartTime_Full == null ? null : moment($scope.overtimeStartTime_Full).format("YYYY-MM-DD HH:mm:ss");
                let lunchInTime = $scope.lunchInTime == null ? null : moment($scope.lunchInTime).format("YYYY-MM-DD HH:mm:ss");
                let rangelunchInTime1 = $scope.rangelunchInTime1 == null ? null : moment($scope.rangelunchInTime1).format("YYYY-MM-DD HH:mm:ss");
                let rangelunchInTime2 = $scope.rangelunchInTime2 == null ? null : moment($scope.rangelunchInTime2).format("YYYY-MM-DD HH:mm:ss");
                let lunchOutTime = $scope.lunchOutTime == null ? null : moment($scope.lunchOutTime).format("YYYY-MM-DD HH:mm:ss");
                let rangelunchOutTime1 = $scope.rangelunchOutTime1 == null ? null : moment($scope.rangelunchOutTime1).format("YYYY-MM-DD HH:mm:ss");
                let rangelunchOutTime2 = $scope.rangelunchOutTime2 == null ? null : moment($scope.rangelunchOutTime2).format("YYYY-MM-DD HH:mm:ss");
                let breakInTime1 = $scope.breakInTime1 == null ? null : moment($scope.breakInTime1).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakInTime1_1 = $scope.rangebreakInTime1_1 == null ? null : moment($scope.rangebreakInTime1_1).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakInTime1_2 = $scope.rangebreakInTime1_2 == null ? null : moment($scope.rangebreakInTime1_2).format("YYYY-MM-DD HH:mm:ss");
                let breakOutTime1 = $scope.breakOutTime1 == null ? null : moment($scope.breakOutTime1).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakOutTime1_1 = $scope.rangebreakOutTime1_1 == null ? null : moment($scope.rangebreakOutTime1_1).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakOutTime1_2 = $scope.rangebreakOutTime1_2 == null ? null : moment($scope.rangebreakOutTime1_2).format("YYYY-MM-DD HH:mm:ss");
                let breakInTime2 = $scope.breakInTime2 == null ? null : moment($scope.breakInTime2).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakInTime2_1 = $scope.rangebreakInTime2_1 == null ? null : moment($scope.rangebreakInTime2_1).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakInTime2_2 = $scope.rangebreakInTime2_2 == null ? null : moment($scope.rangebreakInTime2_2).format("YYYY-MM-DD HH:mm:ss");
                let breakOutTime2 = $scope.breakOutTime2 == null ? null : moment($scope.breakOutTime2).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakOutTime2_1 = $scope.rangebreakOutTime2_1 == null ? null : moment($scope.rangebreakOutTime2_1).format("YYYY-MM-DD HH:mm:ss");
                let rangebreakOutTime2_2 = $scope.rangebreakOutTime2_2 == null ? null : moment($scope.rangebreakOutTime2_2).format("YYYY-MM-DD HH:mm:ss");
                let isOverTime30 = false;
                let isOverTime60 = false;
                if ($scope.isOverTime == '30min') {
                    isOverTime30 = true;
                } else if ($scope.isOverTime == '60min') {
                    isOverTime60 = true;
                }
                /* */
                let isOverTimeEarly30 = false;
                let isOverTimeEarly60 = false;
                if ($scope.isOverTimeEarly == '30min') {
                    isOverTimeEarly30 = true;
                } else if ($scope.isOverTimeEarly == '60min') {
                    isOverTimeEarly60 = true;
                }

                let isMonday = $scope.isMonday;
                let isTuesday = $scope.isTuesday;
                let isWednesday = $scope.isWednesday;
                let isThursday = $scope.isThursday;
                let isFriday = $scope.isFriday;
                let isSaturday = $scope.isSaturday;
                let isSunday = $scope.isSunday;
                let mondayType = $scope.mondayType;
                let tuesdayType = $scope.tuesdayType;
                let wednesdayType = $scope.wednesdayType;
                let thursdayType = $scope.thursdayType;
                let fridayType = $scope.fridayType;
                let saturdayType = $scope.saturdayType;
                let sundayType = $scope.sundayType;
                let employerotsetupId = $scope.employerotsetupId;
                let shiftType = $scope.shiftType;

                let req = {};
                if (employerMasterShiftId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerMasterShiftId": employerMasterShiftId, "shiftName": shiftName, "weeklyHour": weeklyHour, "dayHour": dayHour, "halfHour": halfHour,
                    "inTime": inTime, "rangeInTime1": rangeInTime1, "rangeInTime2": rangeInTime2, "allowLateInTime": allowLateInTime,
                    "outTime": outTime, "rangeOutTime1": rangeOutTime1, "rangeOutTime2": rangeOutTime2, "allowEarlyOutTime": allowEarlyOutTime, "overtimeStartTime": overtimeStartTime,
                    "outTime_Full": outTime_Full, "rangeOutTime1_Full": rangeOutTime1_Full, "rangeOutTime2_Full": rangeOutTime2_Full, "allowEarlyOutTime_Full": allowEarlyOutTime_Full, "overtimeStartTime_Full": overtimeStartTime_Full,
                    "lunchInTime": lunchInTime, "rangelunchInTime1": rangelunchInTime1, "rangelunchInTime2": rangelunchInTime2, "lunchOutTime": lunchOutTime, "rangelunchOutTime1": rangelunchOutTime1, "rangelunchOutTime2": rangelunchOutTime2,
                    "breakInTime1": breakInTime1, "rangebreakInTime1_1": rangebreakInTime1_1, "rangebreakInTime1_2": rangebreakInTime1_2, "breakOutTime1": breakOutTime1, "rangebreakOutTime1_1": rangebreakOutTime1_1, "rangebreakOutTime1_2": rangebreakOutTime1_2,
                    "breakInTime2": breakInTime2, "rangebreakInTime2_1": rangebreakInTime2_1, "rangebreakInTime2_2": rangebreakInTime2_2, "breakOutTime2": breakOutTime2, "rangebreakOutTime2_1": rangebreakOutTime2_1, "rangebreakOutTime2_2": rangebreakOutTime2_2,
                    "isOverTime30": isOverTime30, "isOverTime60": isOverTime60,
                    "isMonday": isMonday, "isTuesday": isTuesday, "isWednesday": isWednesday, "isThursday": isThursday, "isFriday": isFriday, "isSaturday": isSaturday, "isSunday": isSunday,
                    "mondayType": mondayType, "tuesdayType": tuesdayType, "wednesdayType": wednesdayType, "thursdayType": thursdayType, "fridayType": fridayType, "saturdayType": saturdayType, "sundayType": sundayType,
                    "employerotsetupId": employerotsetupId, "shiftType": shiftType,
                    "isOverTimeEarly30": isOverTimeEarly30, "isOverTimeEarly60": isOverTimeEarly60,
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerMasterShiftId == 0)
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
                        "employerMasterShiftId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerMasterShiftId = res.data.employerMasterShiftId;
                            $scope.employerId = res.data.employerId;
                            $scope.shiftName = res.data.shiftName;
                            $scope.weeklyHour = res.data.weeklyHour;
                            $scope.dayHour = res.data.dayHour;
                            $scope.halfHour = res.data.halfHour;
                            $scope.inTime = res.data.inTime == null ? null : new Date(res.data.inTime);
                            $scope.rangeInTime1 = res.data.rangeInTime1 == null ? null : new Date(res.data.rangeInTime1);
                            $scope.rangeInTime2 = res.data.rangeInTime2 == null ? null : new Date(res.data.rangeInTime2);
                            $scope.allowLateInTime = res.data.allowLateInTime == null ? null : new Date(res.data.allowLateInTime);
                            $scope.outTime = res.data.outTime == null ? null : new Date(res.data.outTime);
                            $scope.rangeOutTime1 = res.data.rangeOutTime1 == null ? null : new Date(res.data.rangeOutTime1);
                            $scope.rangeOutTime2 = res.data.rangeOutTime2 == null ? null : new Date(res.data.rangeOutTime2);
                            $scope.allowEarlyOutTime = res.data.allowEarlyOutTime == null ? null : new Date(res.data.allowEarlyOutTime);
                            $scope.overtimeStartTime = res.data.overtimeStartTime == null ? null : new Date(res.data.overtimeStartTime);
                            $scope.outTime_Full = res.data.outTime_Full == null ? null : new Date(res.data.outTime_Full);
                            $scope.rangeOutTime1_Full = res.data.rangeOutTime1_Full == null ? null : new Date(res.data.rangeOutTime1_Full);
                            $scope.rangeOutTime2_Full = res.data.rangeOutTime2_Full == null ? null : new Date(res.data.rangeOutTime2_Full);
                            $scope.allowEarlyOutTime_Full = res.data.allowEarlyOutTime_Full == null ? null : new Date(res.data.allowEarlyOutTime_Full);
                            $scope.overtimeStartTime_Full = res.data.overtimeStartTime_Full == null ? null : new Date(res.data.overtimeStartTime_Full);
                            $scope.lunchInTime = res.data.lunchInTime == null ? null : new Date(res.data.lunchInTime);
                            $scope.rangelunchInTime1 = res.data.rangelunchInTime1 == null ? null : new Date(res.data.rangelunchInTime1);
                            $scope.rangelunchInTime2 = res.data.rangelunchInTime2 == null ? null : new Date(res.data.rangelunchInTime2);
                            $scope.lunchOutTime = res.data.lunchOutTime == null ? null : new Date(res.data.lunchOutTime);
                            $scope.rangelunchOutTime1 = res.data.rangelunchOutTime1 == null ? null : new Date(res.data.rangelunchOutTime1);
                            $scope.rangelunchOutTime2 = res.data.rangelunchOutTime2 == null ? null : new Date(res.data.rangelunchOutTime2);
                            $scope.breakInTime1 = res.data.breakInTime1 == null ? null : new Date(res.data.breakInTime1);
                            $scope.rangebreakInTime1_1 = res.data.rangebreakInTime1_1 == null ? null : new Date(res.data.rangebreakInTime1_1);
                            $scope.rangebreakInTime1_2 = res.data.rangebreakInTime1_2 == null ? null : new Date(res.data.rangebreakInTime1_2);
                            $scope.breakOutTime1 = res.data.breakOutTime1 == null ? null : new Date(res.data.breakOutTime1);
                            $scope.rangebreakOutTime1_1 = res.data.rangebreakOutTime1_1 == null ? null : new Date(res.data.rangebreakOutTime1_1);
                            $scope.rangebreakOutTime1_2 = res.data.rangebreakOutTime1_2 == null ? null : new Date(res.data.rangebreakOutTime1_2);
                            $scope.breakInTime2 = res.data.breakInTime2 == null ? null : new Date(res.data.breakInTime2);
                            $scope.rangebreakInTime2_1 = res.data.rangebreakInTime2_1 == null ? null : new Date(res.data.rangebreakInTime2_1);
                            $scope.rangebreakInTime2_2 = res.data.rangebreakInTime2_2 == null ? null : new Date(res.data.rangebreakInTime2_2);
                            $scope.breakOutTime2 = res.data.breakOutTime2 == null ? null : new Date(res.data.breakOutTime2);
                            $scope.rangebreakOutTime2_1 = res.data.rangebreakOutTime2_1 == null ? null : new Date(res.data.rangebreakOutTime2_1);
                            $scope.rangebreakOutTime2_2 = res.data.rangebreakOutTime2_2 == null ? null : new Date(res.data.rangebreakOutTime2_2);
                            if (res.data.isOverTime30.data[0] == 1) {
                                $scope.isOverTime = "30min";
                            } else if (res.data.isOverTime60.data[0] == 1) {
                                $scope.isOverTime = "60min";
                            }
                            else {
                                $scope.isOverTime = "";
                            }
                            /* */
                            if (res.data.isOverTimeEarly30.data[0] == 1) {
                                $scope.isOverTimeEarly = "30min";
                            } else if (res.data.isOverTimeEarly60.data[0] == 1) {
                                $scope.isOverTimeEarly = "60min";
                            }
                            else {
                                $scope.isOverTimeEarly = "";
                            }

                            $scope.isMonday = res.data.isMonday == 1 ? true : false;
                            $scope.isTuesday = res.data.isTuesday == 1 ? true : false;
                            $scope.isWednesday = res.data.isWednesday == 1 ? true : false;
                            $scope.isThursday = res.data.isThursday == 1 ? true : false;
                            $scope.isFriday = res.data.isFriday == 1 ? true : false;
                            $scope.isSaturday = res.data.isSaturday == 1 ? true : false;
                            $scope.isSunday = res.data.isSunday == 1 ? true : false;
                            $scope.mondayType = res.data.mondayType;
                            $scope.tuesdayType = res.data.tuesdayType;
                            $scope.wednesdayType = res.data.wednesdayType;
                            $scope.thursdayType = res.data.thursdayType;
                            $scope.fridayType = res.data.fridayType;
                            $scope.saturdayType = res.data.saturdayType;
                            $scope.sundayType = res.data.sundayType;
                            $scope.employerotsetupId = res.data.employerotsetupId == 0 ? "" : res.data.employerotsetupId;
                            $scope.shiftType = res.data.shiftType;

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
                            "employerMasterShiftId": id
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