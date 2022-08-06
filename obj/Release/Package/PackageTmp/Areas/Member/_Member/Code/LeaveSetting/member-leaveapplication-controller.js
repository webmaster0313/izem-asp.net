
let api_selectdatabyid = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiSelect";
let api_filltabledata = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiSelectAll";
let api_insertdata = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiInsert";
let api_updatedata = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiUpdate";
let api_deletedata = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiDelete";
//.
let api_leavecalculation = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiLeaveCalculation";
//.
let api_reportinsertmaster = backlink + "employer/api/employeeleavereport/employeeleavereport_apiInsertMaster";
//.
let api_selectEmployeeCalculation = backlink + "employer/api/employeeleavereport/employeeleavereport_apiEmployeeCurrentYearCalculation";

app.controller("member-leaveapplication-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemEmployeeId = localStorage.getItem("_izemEmployeeId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");
        /* Assign EmployeeId */
        $scope.employeeId = $scope._izemEmployeeId;

        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.employeeleaveapplicationId = 0;
            $scope.employerleavetypeId = "";
            $scope.employeeleaveapplicationLeaveApply = new Date();
            $scope.employeeleaveapplicationLeaveFrom = new Date();
            $scope.employeeleaveapplicationLeaveTo = new Date();

            $scope.employeeleaveapplicationNoOfDays = moment($scope.employeeleaveapplicationLeaveFrom).diff(moment($scope.employeeleaveapplicationLeaveTo), 'days') + 1;
            $scope.employeeleaveapplicationReason = "";
            $scope.employeeleaveapplicationDocumentRefNo = "";
            $scope.employeeleaveapplicationRemarks = "";
            $scope.employeeleaveapplicationIsPartialday = false;
            $scope.employeeleaveapplicationIsStartPartialday = false;
            $scope.employeeleaveapplicationIsEndPartialday = false;
            $scope.employeeleaveapplicationLeaveStatus = "Pending";
            $scope.employeeleaveapplicationIsEmergency = "0";
            $scope.employeeleaveapplicationReasonReject = "";

            $scope.lblEntitlementLeave = 0;
            $scope.lblTakenLeave = 0;
            $scope.lblBalanceLeave = 0;
            $scope.lblActualEntitle = 0;
            $scope.currentYearStart = '-';
            $scope.currentYearEnd = '-';

            $scope.isValueDate = false;


            /* search */

            var date = new Date();
            var firstDay = new Date(date.getFullYear(), 0, 1);
            var lastDay = new Date(date.getFullYear(), 12, 0);

            $scope.searchFromDate = firstDay;
            $scope.searchToDate = lastDay;
            $scope.searchMasterEmployeeId = $scope.employeeId;
            $scope.searchLeaveStatus = "Pending";
            $scope.searchEmergency = 'all';

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
            let searchFromDate = $scope.searchFromDate == null ? '' : moment($scope.searchFromDate).format("YYYY-MM-DD");
            let searchToDate = $scope.searchToDate == null ? '' : moment($scope.searchToDate).format("YYYY-MM-DD");
            let searchMasterEmployeeId = $scope.searchMasterEmployeeId;
            let searchLeaveStatus = $scope.searchLeaveStatus;
            let searchEmergency = $scope.searchEmergency;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    "strWhere": "",
                    "searchFromDate": searchFromDate,
                    "searchToDate": searchToDate,
                    "searchMasterEmployeeId": searchMasterEmployeeId,
                    "searchLeaveStatus": searchLeaveStatus,
                    "searchEmergency": searchEmergency,
                    "employerId": $scope._izemEmployerId,
                    "searchLeaveStatus": $scope.searchLeaveStatus,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_AddRecord = () => {
            $scope.hideEntry = false;
            $scope.onChange_Employee();
        };

        //. Pending
        $scope.pendingEmail = (_selectedEmployeeEmail, _izemLoginName, _selectedEmployeeName, _employeeleaveapplicationLeaveStatus,
            _employeeleaveapplicationLeaveFrom, _employeeleaveapplicationLeaveTo, _selectedLeaveType,
            _lblEntitlementLeave, _employeeleaveapplicationNoOfDays, _data) => {
            try {

                $http({
                    method: "POST",
                    url: "/employer/LeaveSetting/send_EmailForPendingLeaveApplication",
                    responseType: "blob",
                    data: {
                        "memberEmail": _selectedEmployeeEmail,
                        "loginName": _izemLoginName,
                        "memberName": _selectedEmployeeName,
                        "leaveStatus": _employeeleaveapplicationLeaveStatus,
                        "dateRange": _employeeleaveapplicationLeaveFrom + " to " + _employeeleaveapplicationLeaveTo,
                        "leaveType": _selectedLeaveType,
                        "leaveTotalDay": _lblEntitlementLeave,
                        "takenLeave": _employeeleaveapplicationNoOfDays,
                        "data": JSON.stringify(_data)
                    }
                });

            } catch (e) {
                console.log(e);
            }
        };
        /* Both same code repeat in all case */
        $scope.onClick_Submit = () => {
            try {

                let employeeleaveapplicationId = $scope.employeeleaveapplicationId;
                let employeeId = $scope.employeeId;
                let employerleavetypeId = $scope.employerleavetypeId;
                let employeeleaveapplicationLeaveApply = ConvertDateforDatabaseOnlyDate($scope.employeeleaveapplicationLeaveApply)
                let employeeleaveapplicationLeaveFrom = ConvertDateforDatabaseOnlyDate($scope.employeeleaveapplicationLeaveFrom);
                let employeeleaveapplicationLeaveTo = ConvertDateforDatabaseOnlyDate($scope.employeeleaveapplicationLeaveTo);
                let employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays;
                let employeeleaveapplicationReason = $scope.employeeleaveapplicationReason;
                let employeeleaveapplicationDocumentRefNo = $scope.employeeleaveapplicationDocumentRefNo;
                let employeeleaveapplicationRemarks = $scope.employeeleaveapplicationRemarks;
                let employeeleaveapplicationIsPartialday = $scope.employeeleaveapplicationIsPartialday;
                let employeeleaveapplicationIsStartPartialday = $scope.employeeleaveapplicationIsStartPartialday;
                let employeeleaveapplicationIsEndPartialday = $scope.employeeleaveapplicationIsEndPartialday;
                let employeeleaveapplicationLeaveStatus = $scope.employeeleaveapplicationLeaveStatus;
                let employeeleaveapplicationIsEmergency = $scope.employeeleaveapplicationIsEmergency;
                let employeeleaveapplicationReasonReject = $scope.employeeleaveapplicationReasonReject;

                if (employeeleaveapplicationIsEmergency == "false") {
                    alert("Please specify leave emergency status!");
                    return;
                }

                if (employeeleaveapplicationIsEmergency == "1") {
                    if (employeeleaveapplicationRemarks == "") {
                        alert("Please enter remarks!");
                        $("#txtRemark").focus();
                        return;
                    }
                }

                if (employeeleaveapplicationLeaveStatus == "Rejected") {
                    if (employeeleaveapplicationReasonReject == "") {
                        alert("Please enter rejection reason!");
                        $("#txtRemark").focus();
                        return;
                    }
                }

                let req = {};
                if (employeeleaveapplicationId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employeeleaveapplicationId": employeeleaveapplicationId,
                    "employeeId": employeeId,
                    "employerleavetypeId": employerleavetypeId,
                    "employeeleaveapplicationLeaveApply": employeeleaveapplicationLeaveApply,
                    "employeeleaveapplicationLeaveFrom": employeeleaveapplicationLeaveFrom,
                    "employeeleaveapplicationLeaveTo": employeeleaveapplicationLeaveTo,
                    "employeeleaveapplicationNoOfDays": employeeleaveapplicationNoOfDays,
                    "employeeleaveapplicationReason": employeeleaveapplicationReason,
                    "employeeleaveapplicationDocumentRefNo": employeeleaveapplicationDocumentRefNo,
                    "employeeleaveapplicationRemarks": employeeleaveapplicationRemarks,
                    "employeeleaveapplicationIsPartialday": employeeleaveapplicationIsPartialday,
                    "employeeleaveapplicationIsStartPartialday": employeeleaveapplicationIsStartPartialday,
                    "employeeleaveapplicationIsEndPartialday": employeeleaveapplicationIsEndPartialday,
                    "employeeleaveapplicationLeaveStatus": employeeleaveapplicationLeaveStatus,
                    "employeeleaveapplicationIsEmergency": employeeleaveapplicationIsEmergency,
                    "employeeleaveapplicationReasonReject": employeeleaveapplicationReasonReject
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeeleaveapplicationId == 0) {
                                insertMsg();

                                let _days = parseFloat($scope.lblTakenLeave) + parseFloat($scope.employeeleaveapplicationNoOfDays);
                                let _bal = parseFloat($scope.lblBalanceLeave) - parseFloat($scope.employeeleaveapplicationNoOfDays);

                                $scope.onClick_CheckSubmit(
                                    $scope.employeeId,
                                    $scope.employerleavetypeId,
                                    new Date($scope.currentYearStart),
                                    new Date($scope.currentYearEnd),
                                    $scope.lblActualEntitle, $scope.lblEntitlementLeave,
                                    _days,
                                    _bal
                                );

                                if (employeeleaveapplicationLeaveStatus == "Pending") {

                                    if ($scope._selectedEmployeeLeaving == null) {

                                        let req = {
                                            method: 'POST',
                                            url: api_selectEmployeeCalculation,
                                            data: {
                                                "employerId": $scope._izemEmployerId,
                                                "employeeId": $scope._selectedEmployeeId,
                                                "SearchYear": moment(new Date()).format("YYYY")
                                            }
                                        };

                                        httpService.httpFetchData(req)
                                            .then((res) => {
                                                if (res.status == 200) {
                                                    let data = res.data;

                                                    $scope.pendingEmail($scope._selectedEmployeeManagerEmail, $scope._izemLoginName, $scope._selectedEmployeeName,
                                                        employeeleaveapplicationLeaveStatus, employeeleaveapplicationLeaveFrom, employeeleaveapplicationLeaveTo,
                                                        $scope._selectedLeaveType, $scope.lblEntitlementLeave, employeeleaveapplicationNoOfDays, data);

                                                }
                                            }, (err) => {
                                                console.log(err)
                                            });
                                    }
                                }
                            }
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
        /* Both Same */
        $scope.onClick_EditRecord = (id) => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectdatabyid,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeleaveapplicationId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employeeleaveapplicationId = res.data.employeeleaveapplicationId;
                            $scope.employeeId = res.data.employeeId;

                            $scope.onLoad_LeaveEntitlement($scope.employeeId);

                            $scope.employerleavetypeId = res.data.employerleavetypeId;

                            $scope.isEmployeeSelected = false;

                            $scope.employeeleaveapplicationLeaveApply = new Date(res.data.employeeleaveapplicationLeaveApply);
                            $scope.employeeleaveapplicationLeaveFrom = new Date(res.data.employeeleaveapplicationLeaveFrom);
                            $scope.employeeleaveapplicationLeaveTo = new Date(res.data.employeeleaveapplicationLeaveTo);
                            $scope.employeeleaveapplicationNoOfDays = res.data.employeeleaveapplicationNoOfDays;
                            $scope.employeeleaveapplicationReason = res.data.employeeleaveapplicationReason;
                            $scope.employeeleaveapplicationDocumentRefNo = res.data.employeeleaveapplicationDocumentRefNo;
                            $scope.employeeleaveapplicationRemarks = res.data.employeeleaveapplicationRemarks;
                            $scope.employeeleaveapplicationIsPartialday = res.data.employeeleaveapplicationIsPartialday == 1 ? true : false;

                            if ($scope.employeeleaveapplicationIsPartialday == true)
                                $scope.isPartialDay = true;
                            else
                                $scope.isPartialDay = false;

                            $scope.employeeleaveapplicationIsStartPartialday = res.data.employeeleaveapplicationIsStartPartialday == 1 ? true : false;
                            $scope.employeeleaveapplicationIsEndPartialday = res.data.employeeleaveapplicationIsEndPartialday == 1 ? true : false;
                            $scope.employeeleaveapplicationLeaveStatus = res.data.employeeleaveapplicationLeaveStatus;
                            $scope.employeeleaveapplicationIsEmergency = res.data.employeeleaveapplicationIsEmergency == 1 ? "1" : "0";
                            $scope.employeeleaveapplicationReasonReject = res.data.employeeleaveapplicationReasonReject;

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
                            "employeeleaveapplicationId": id
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

        $scope.onLoad_Employee = () => {
            try {

                httpCommonService.fill_employee()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employeeId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Employee();

        $scope.onLoad_LeaveEntitlement = (employeeId) => {
            try {

                httpCommonService.fill_employer_leaveEntitlement(employeeId)
                    .then((res) => {
                        if (res.status == 200) {

                            let filterData = res.data.filter(x => x.employeeleaveentitlementIsActive == 1);
                            if (filterData.length == 0) {
                                warningMsg("Leave Type", "No Active Leave Type");
                            }
                            $scope.fill_employerleavetypeId = filterData;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChange_Employee = () => {
            try {
                $scope.employerleavetypeId = '';

                $scope.lblEntitlementLeave = 0;
                $scope.lblTakenLeave = 0;
                $scope.lblBalanceLeave = 0;
                $scope.lblActualEntitle = 0;
                $scope.currentYearStart = '-';
                $scope.currentYearEnd = '-';

                let employeeData = $scope.fill_employeeId.filter(x => x.employeeId == $scope.employeeId);
                if (employeeData.length > 0) {

                    if (employeeData[0].employeeIsFixJoining.data[0] == "0") {
                        alert("Please provide joining date first, Then only you can able to apply leave!");
                        $scope.onClick_Cancel();
                    } else {
                        //. Email
                        $scope._selectedEmployeeId = employeeData[0].employeeId;
                        $scope._selectedEmployerId = employeeData[0].employerId;
                        $scope._selectedEmployeeEmail = employeeData[0].memberEmail;
                        $scope._selectedEmployeeName = employeeData[0].memberName;
                        $scope._selectedEmployeeLeaving = employeeData[0].employeeLeaving;

                        $scope._selectedemployeeManagerId = employeeData[0].employeeManagerId;
                        let managerData = $scope.fill_employeeId.filter(x => x.employeeId == $scope._selectedemployeeManagerId);
                        if (managerData.length > 0) {
                            $scope._selectedEmployeeManagerEmail = employeeData[0].memberEmail;
                        }
                        else {
                            $scope._selectedEmployeeManagerEmail = $scope._izemLoginEmail;
                        }

                        $scope.onLoad_LeaveEntitlement($scope.employeeId);
                    }
                }

            } catch (e) {
                console.log(e);
            }
        };


        $scope.onClick_ShowReason = (x) => {
            try {

                $scope.leaveReasonList = x.employeeleaveapplicationReason;
                $scope.leaveRejectList = x.employeeleaveapplicationReasonReject;

                $("#reasonModal").modal('show');
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChange_LeaveCount = () => {

            let fromDateLeave = moment($scope.employeeleaveapplicationLeaveFrom);
            let toDateLeave = moment($scope.employeeleaveapplicationLeaveTo);

            let dateDiff = toDateLeave.diff(fromDateLeave, 'days');

            if (dateDiff >= 0) {
                $scope.employeeleaveapplicationNoOfDays = dateDiff + 1;
            }
            else {
                $scope.employeeleaveapplicationNoOfDays = 1;

                let applyDate = $scope.employeeleaveapplicationLeaveApply;

                $scope.employeeleaveapplicationLeaveFrom = new Date(applyDate);
                $scope.employeeleaveapplicationLeaveTo = new Date(applyDate);

                alert("Please provide valid date-range!");
            }

            $scope.isUpdateDate = true;
        };

        $scope.onClick_UpdateDateChange = () => {
            try {
                let applyDate = $scope.employeeleaveapplicationLeaveApply;
                if (applyDate != undefined) {
                    $scope.employeeleaveapplicationLeaveFrom = new Date(applyDate);
                    $scope.employeeleaveapplicationLeaveTo = new Date(applyDate);
                    $scope.onChange_LeaveCount();
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChecked_UpdateCount = (x) => {
            if (x == 1) {
                if ($scope.employeeleaveapplicationIsEndPartialday == true) {
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays + 0.5;
                }
                if ($scope.employeeleaveapplicationIsStartPartialday == true) {
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays - 0.5;
                    $scope.employeeleaveapplicationIsEndPartialday = false;
                }
                else
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays + 0.5;
            }
            else {
                if ($scope.employeeleaveapplicationIsStartPartialday == true) {
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays + 0.5;
                }
                if ($scope.employeeleaveapplicationIsEndPartialday == true) {
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays - 0.5;
                    $scope.employeeleaveapplicationIsStartPartialday = false;
                }
                else
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays + 0.5;
            }
        };

        $scope.onChecked_UpdateStatus = () => {
            if ($scope.employeeleaveapplicationIsPartialday == true) {
                $scope.isPartialDay = true;
            }
            else {
                $scope.isPartialDay = false;

                if ($scope.employeeleaveapplicationIsEndPartialday == true || $scope.employeeleaveapplicationIsStartPartialday == true)
                    $scope.employeeleaveapplicationNoOfDays = $scope.employeeleaveapplicationNoOfDays + 0.5;

                $scope.employeeleaveapplicationIsEndPartialday = false;
                $scope.employeeleaveapplicationIsStartPartialday = false;

            }
        };

        $scope.onChange_LeaveType = () => {

            try {

                let entitlementData = $scope.fill_employerleavetypeId.filter(x => x.employerleavetypeId == $scope.employerleavetypeId);
                let employeeData = $scope.fill_employeeId.filter(x => x.employeeId == $scope.employeeId);

                let confirmationDay = parseInt(entitlementData[0].employerleavetypeLeaveConfirmationDay);
                let employeeJoiningDate = employeeData[0].employeeJoining;

                //. Email
                $scope_selectedLeaveType = entitlementData[0].employerleavetypeLeaveCode;

                let days = parseInt(moment($scope.employeeleaveapplicationLeaveFrom).diff(moment(employeeJoiningDate), "days"));
                let value = confirmationDay - days;
                if (confirmationDay == 0) {
                    value = -1;
                }

                if (value < 0) {

                    $scope.isUpdateDate = false;
                    $scope.isValueDate = false;

                    let req = {
                        method: 'POST',
                        url: api_leavecalculation,
                        data: {
                            "employerleavetypeId": $scope.employerleavetypeId,
                            "employeeId": $scope.employeeId,
                            "selectedFromDate": moment($scope.employeeleaveapplicationLeaveFrom).format("YYYY-MM-DD")
                        }
                    };

                    httpService.httpFetchData(req)
                        .then((res) => {
                            if (res.status == 200) {

                                $scope.lblEntitlementLeave = res.data[0].EntitleDay;
                                $scope.lblTakenLeave = res.data[0].totalLeave;
                                $scope.lblBalanceLeave = res.data[0].totalLeaveBalance;
                                $scope.currentYearStart = res.data[0].currentStartYear;
                                $scope.currentYearEnd = res.data[0].currentEndYear;

                            }
                        }, (err) => {
                            console.log(err);
                        });
                }
                else {
                    $scope.isValueDays = confirmationDay - days;
                    $scope.isUpdateDate = false;
                    $scope.isValueDate = true;
                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };
        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };
        $scope.onClick_SearchResult = () => {
            $scope.onLoad_MasterService();
            $("#searchModal").modal("hide");
        };
        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        //. report

        $scope.onClick_CheckSubmit = (employeeId, employerleavetypeId, startYear, endYear, reportEntitlementDay,
            reportEntitlementGeneratedDay, reportTakenLeave, reportTotalBalanceLeave) => {

            try {

                let req = {
                    method: 'POST',
                    url: api_reportinsertmaster,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": employeeId,
                        "employerleavetypeId": employerleavetypeId,
                        "startYear": moment(startYear).format("YYYY-MM-DD"),
                        "endYear": moment(endYear).format("YYYY-MM-DD"),
                        "reportEntitlementDay": reportEntitlementDay,
                        "reportEntitlementGeneratedDay": reportEntitlementGeneratedDay,
                        "reportTakenLeave": reportTakenLeave,
                        "reportTotalBalanceLeave": reportTotalBalanceLeave
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {

                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }

        };

        //. PDF download
        $scope.load_Report = (obj) => {
            try {
                $("body").addClass("loading");
                let leaveApplicationData = JSON.stringify(obj);

                $http({
                    method: "POST",
                    url: "/employer/LeaveSetting/load_leaveApplicationReport",
                    responseType: "blob",
                    data: {
                        "companyName": localStorage.getItem("_izemCompanyName"),
                        "reportTitle": "Leave Application List",
                        "timePeriod": moment($scope.searchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.searchToDate).format("DD-MM-YYYY"),
                        "leaveApplicationData": leaveApplicationData
                    }
                }).then(function successCallback(response) {
                    var fileURL = URL.createObjectURL(response.data);
                    $("body").removeClass("loading");
                    window.open(fileURL, "LeaveApplicationReport.pdf");
                }, function errorCallback(response) {
                    console.log(response);
                    $("body").removeClass("loading");
                });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_GeneratePDF = () => {
            try {
                let searchFromDate = $scope.searchFromDate == null ? '' : moment($scope.searchFromDate).format("YYYY-MM-DD");
                let searchToDate = $scope.searchToDate == null ? '' : moment($scope.searchToDate).format("YYYY-MM-DD");
                let searchMasterEmployeeId = $scope.searchMasterEmployeeId;
                let searchLeaveStatus = $scope.searchLeaveStatus;
                let searchEmergency = $scope.searchEmergency;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        "searchFromDate": searchFromDate,
                        "searchToDate": searchToDate,
                        "searchMasterEmployeeId": searchMasterEmployeeId,
                        "searchLeaveStatus": searchLeaveStatus,
                        "searchEmergency": searchEmergency,
                        "employerId": $scope._izemEmployerId,
                        "searchLeaveStatus": $scope.searchLeaveStatus,
                        pageIndex: 1,
                        pageSize: 'all'
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;
                            for (let i = 0; i < obj.length; i++) {
                                obj[i].employeeleaveapplicationIsEmergency = obj[i].employeeleaveapplicationIsEmergency.data[0] == "1" ? "1" : "0";
                                obj[i].employeeleaveapplicationIsEndPartialday = obj[i].employeeleaveapplicationIsEndPartialday.data[0] == "1" ? "1" : "0";
                                obj[i].employeeleaveapplicationIsPartialday = obj[i].employeeleaveapplicationIsPartialday.data[0] == "1" ? "1" : "0";
                                obj[i].employeeleaveapplicationIsStartPartialday = obj[i].employeeleaveapplicationIsStartPartialday.data[0] == "1" ? "1" : "0";
                                obj[i].employerleavetypeIsAnnual = obj[i].employerleavetypeIsAnnual.data[0] == "1" ? "1" : "0";
                                obj[i].employerleavetypeIsHospitalization = obj[i].employerleavetypeIsHospitalization.data[0] == "1" ? "1" : "0";
                                obj[i].employerleavetypeIsMedical = obj[i].employerleavetypeIsMedical.data[0] == "1" ? "1" : "0";
                                obj[i].employerleavetypeIsOther = obj[i].employerleavetypeIsOther.data[0] == "1" ? "1" : "0";
                                obj[i].employerleavetypeIsUnpaid = obj[i].employerleavetypeIsUnpaid.data[0] == "1" ? "1" : "0";
                            }

                            $scope.load_Report(obj);
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);