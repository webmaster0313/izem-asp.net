
let api_selectdatabyid = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiSelect";
let api_filltabledata = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiSelectAll";
let api_insertdata = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiInsert";
let api_updatedata = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiUpdate";
let api_deletedata = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiDelete";
//. Reports
let api_reportAttendance = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportAttendance";
let api_reportStartEnd1 = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportStartEnd1";
let api_reportStartEnd3 = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportStartEnd3";
let api_reportStartEnd4 = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportStartEnd4";
let api_reportStartEnd5 = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportStartEnd5";
let api_reportOvertime = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportOvertime";
let api_reportAddPay = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportAddPay";
let api_reportShift = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportShift";
let api_reportMonthlyStatistic = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportMonthlyStatistic";
let api_reportMonthlyAttendance = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportMonthlyAttendance";
let api_reportMultipleSheet = backlink + "employer/api/employeedailyattendance/employeedailyattendance_apiReportMultipleSheet";

app.controller("employer-attendancereport-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;

        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Attendance entries' && x.pageName == 'Attendance Report');
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

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.SearchFromDate = new Date();
            $scope.SearchToDate = new Date();
            $scope.SearchEmployeeId = "";
            $scope.SearchEmployerdepartmentId = "";
            $scope.SearchEmployerbranchId = "";
            $scope.SearchEmployerMasterShiftId = "";

            $scope.sortBy = "memberName";
            $scope.excelReport = "";
            $scope.pdfReport = "";

            let calculateData = localStorage.getItem("calculateData");
            if (calculateData != null) {
                let _calculateData = JSON.parse(calculateData);

                $scope.SearchFromDate = new Date(_calculateData.fromDate);
                $scope.SearchToDate = new Date(_calculateData.toDate);

                localStorage.removeItem("calculateData");
            }

            $("#searchModal").modal("hide");

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
            let SearchFromDate = moment($scope.SearchFromDate).format("YYYY-MM-DD");
            let SearchToDate = moment($scope.SearchToDate).format("YYYY-MM-DD");
            let SearchEmployeeId = $scope.SearchEmployeeId;
            let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;
            let SearchEmployerbranchId = $scope.SearchEmployerbranchId;
            let SearchEmployerMasterShiftId = $scope.SearchEmployerMasterShiftId;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchFromDate": SearchFromDate,
                    "SearchToDate": SearchToDate,
                    "SearchEmployeeId": SearchEmployeeId,
                    "SearchEmployerdepartmentId": SearchEmployerdepartmentId,
                    "SearchEmployerbranchId": SearchEmployerbranchId,
                    "SearchEmployerMasterShiftId": SearchEmployerMasterShiftId,
                    "employerId": $scope._izemEmployerId,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onLoad_Employee = () => {

            try {

                httpCommonService.fill_employee()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_SearchEmployeeId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Employee();

        $scope.onLoad_Branch = () => {

            try {

                httpCommonService.fill_employee_branch()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_SearchEmployerbranchId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Branch();

        $scope.onLoad_Department = () => {

            try {

                httpCommonService.fill_employee_department()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_SearchEmployerdepartmentId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Department();

        $scope.onLoad_MasterShift = () => {
            try {

                httpCommonService.fill_employer_shift()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employerMasterShift = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_MasterShift();

        $scope.onClick_Cancel = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        $scope.pageChanged = () => {
            $scope.onLoad_MasterService();
        };

        $scope.changePageSize = () => {
            $scope.pageIndex = 1;
            $scope.onLoad_MasterService();
        };

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

        $scope.onClick_ShowDetail = (x) => {
            try {

                $scope.inTime = x.inTime == null ? '00:00' : moment(x.inTime).format('HH:mm');
                $scope._actInTime = x._actInTime;

                $scope.outTime = x.outTime == null ? '00:00' : moment(x.outTime).format('HH:mm');
                $scope._actOutTime = x._actOutTime;

                $scope.outTime_Full = x.outTime_Full == null ? '00:00' : moment(x.outTime_Full).format('HH:mm');
                $scope._actOutTime_Full = x._actOutTime_Full;

                $scope.lunchInTime = x.lunchInTime == null ? '00:00' : moment(x.lunchInTime).format('HH:mm');
                $scope._actLunchInTime = x._actLunchInTime;
                $scope.lunchOutTime = x.lunchOutTime == null ? '00:00' : moment(x.lunchOutTime).format('HH:mm');
                $scope._actLunchOutTime = x._actLunchOutTime;

                $scope.breakInTime1 = x.breakInTime1 == null ? '00:00' : moment(x.breakInTime1).format('HH:mm');
                $scope._actBreakInTime1 = x._actBreakInTime1;
                $scope.breakOutTime1 = x.breakOutTime1 == null ? '00:00' : moment(x.breakOutTime1).format('HH:mm');
                $scope._actBreakOutTime1 = x._actBreakOutTime1;

                $scope.breakInTime2 = x.breakInTime2 == null ? '00:00' : moment(x.breakInTime2).format('HH:mm');
                $scope._actBreakInTime2 = x._actBreakInTime2;
                $scope.breakOutTime2 = x.breakOutTime2 == null ? '00:00' : moment(x.breakOutTime2).format('HH:mm');
                $scope._actBreakOutTime2 = x._actBreakOutTime2;

                $scope.finalOverTime = x.finalOverTime;
                $scope.finalOverTime_Full = x.finalOverTime_Full;

                $scope.finalOverTime_min = parseFloat(x.finalOverTime_min) + parseFloat(x.finalOverTime_Full_min);
                $scope.employeradditionalpaysetupCode_count = x.employeradditionalpaysetupCode_count;
                $scope.employershiftsetupCode_count = x.employershiftsetupCode_count;

                $("#listModal").modal("show");
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChange_Reports = (x) => {
            if (x == 'Excel') {
                $scope.isExcel = true;
                $scope.isPDF = false;
                $scope.pdfReport = '';
            }
            if (x == 'PDF') {
                $scope.isExcel = false;
                $scope.isPDF = true;
                $scope.excelReport = '';
            }
            if ($scope.pdfReport == '' && $scope.excelReport == '') {
                $scope.isExcel = false;
                $scope.isPDF = false;
            }
        };

        //. Excel Report
        excelAttendanceReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            let data = [];
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {
                                    data.push({});
                                    data[i].memberName = obj[i].memberName;
                                    data[i].employerdepartmentTitle = obj[i].employerdepartmentTitle;
                                    data[i].employerbranchName = obj[i].employerbranchName;
                                    data[i].shiftName = obj[i].shiftName;
                                    data[i].entryDate = obj[i].entryDateDDMMYYYY;

                                    let _date = moment(obj[i].entryDate).format("DD/MM/YYYY ddd");
                                    data[i].entryDateWithDay = _date;

                                    let _actInTime = obj[i].actInTime == null ? '00:00' : moment(obj[i].actInTime).format("HH:mm");
                                    data[i].actInTime = _actInTime == '00:00' ? '-' : _actInTime;

                                    let _actOutTime = '';
                                    if (obj[i].actOutTime != null)
                                        _actOutTime = moment(obj[i].actOutTime).format("HH:mm");
                                    else if (obj[i].actOutTime_Full != null)
                                        _actOutTime = moment(obj[i].actOutTime_Full).format("HH:mm");
                                    else
                                        _actOutTime = '00:00';
                                    data[i].actOutTime = _actOutTime == '00:00' ? '-' : _actOutTime;

                                    let _workingHour = '';
                                    if (obj[i].actOutTime != null)
                                        _workingHour = obj[i].workingHour;
                                    else if (obj[i].actOutTime_Full != null)
                                        _workingHour = obj[i].workingHour_Full;
                                    else
                                        _workingHour = '00:00';
                                    data[i].workingHour = _workingHour == '00:00' ? '-' : _workingHour;

                                    let OvertimeHour = '';
                                    if (obj[i].actOutTime != null)
                                        OvertimeHour = obj[i].finalOverTime;
                                    else if (obj[i].actOutTime_Full != null)
                                        OvertimeHour = obj[i].finalOverTime_Full;
                                    else
                                        OvertimeHour = '00:00';
                                    data[i].OvertimeHour = OvertimeHour == '00:00' ? '-' : OvertimeHour;
                                    /* */
                                    let OvertimeFinalHour = '';
                                    if (obj[i].actOutTime != null)
                                        OvertimeFinalHour = obj[i].finalOverTime_With_Early;
                                    else if (obj[i].actOutTime_Full != null)
                                        OvertimeFinalHour = obj[i].finalOverTime_Full_With_Early;
                                    else
                                        OvertimeFinalHour = '00:00';
                                    data[i].OvertimeFinalHour = OvertimeFinalHour == '00:00' ? '-' : OvertimeFinalHour;

                                    let LateIn = '';
                                    let lateSec = moment.duration(obj[i].lateIn).asSeconds();
                                    if (lateSec < 0) {
                                        LateIn = '00:00';
                                    }
                                    else {
                                        LateIn = obj[i].lateIn;
                                    }
                                    data[i].LateIn = LateIn == '00:00' ? '-' : LateIn;

                                    let EarlyOutTime = '';
                                    if (obj[i].actOutTime != null)
                                        EarlyOutTime = obj[i].earlyOutTime;
                                    else if (obj[i].actOutTime_Full != null)
                                        EarlyOutTime = obj[i].earlyOutTime_Full;
                                    else
                                        EarlyOutTime = '00:00';

                                    let sec = moment.duration(EarlyOutTime).asSeconds();
                                    if (sec < 0) {
                                        EarlyOutTime = '00:00';
                                    }
                                    data[i].EarlyOutTime = EarlyOutTime == '00:00' ? '-' : EarlyOutTime;
                                    data[i].holidayStatus = obj[i].holidayStatus;
                                    data[i].finalOverTimeEarly = obj[i].finalOverTimeEarly;
                                }
                            }

                            var strstring = "";
                            if (data.length > 0) {
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all' style = 'width: 300px;'><b> Employee Name </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Department </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Branch </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: center;'><b> Shift </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: center;'><b> Date </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time-In </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time-Out </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Hours </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Hours </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early Leave </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Holiday Status </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < data.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + data[i].memberName + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].employerdepartmentTitle + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].employerbranchName + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].shiftName + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; white-space: nowrap;'> " + data[i].entryDateWithDay + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].actInTime + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].actOutTime + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].workingHour + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].OvertimeHour + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].finalOverTimeEarly + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].OvertimeFinalHour + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].LateIn + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].EarlyOutTime + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + data[i].holidayStatus + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Attendance Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelStartEnd1Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd1,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Break Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Break In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Lunch Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Lunch In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Break Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Break In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Absent </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Applied Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Holiday Status </b></td>";
                                    strstring += "</tr>";

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].InTime + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].BreakOut1 + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].BreakIn1 + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].LunchOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].LunchIn + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].BreakOut2 + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].BreakIn2 + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].TimeOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorked + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorkedUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeHour + " </td>";
                                        if (obj[i].data[j].finalOverTimeEarly == '00:00' && obj[i].data[j].OvertimeHour == '-')
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>-</td>";
                                        else
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].finalOverTimeEarly + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeFinalHour + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeFinalHourUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Late + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].EarlyLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Absent + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].AppliedLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HolidayStatus + " </td>";
                                        strstring += "</tr>";
                                    }
                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'StartEnd-1 Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelStartEnd2Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd1,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Absent </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Applied Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Holiday Status </b></td>";
                                    strstring += "</tr>";

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].InTime + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].TimeOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorked + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorkedUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeHour + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].finalOverTimeEarly + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeFinalHour + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeFinalHourUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Late + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].EarlyLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Absent + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].AppliedLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HolidayStatus + " </td>";
                                        strstring += "</tr>";
                                    }
                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'StartEnd-2 Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelStartEnd3Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd3,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Lunch Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Lunch In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT5 </b></td>";

                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Absent </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Applied Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Holiday Status </b></td>";
                                    strstring += "</tr>";

                                    let count1 = 0;
                                    let count2 = 0;
                                    let count3 = 0;
                                    let count4 = 0;
                                    let count5 = 0;
                                    let count6 = 0;
                                    let count7 = 0;
                                    let count8 = 0;

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].InTime + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].LunchOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].LunchIn + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].TimeOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorked + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorkedUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeHourUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].finalOverTimeEarlyUnit + " </td>";

                                        let _a = 0;
                                        if (obj[i].data[j].OvertimeHourUnit != '-') {
                                            _a = obj[i].data[j].OvertimeHourUnit;
                                        }
                                        let _b = 0;
                                        if (obj[i].data[j].finalOverTimeEarlyUnit != '-') {
                                            _b = obj[i].data[j].finalOverTimeEarlyUnit;
                                        }

                                        let _sum = parseFloat(_a) + parseFloat(_b);
                                        if (_sum == 0) {
                                            _sum = '-';
                                        }

                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + _sum + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT5'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Late + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].EarlyLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Absent + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].AppliedLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HolidayStatus + " </td>";
                                        strstring += "</tr>";

                                        count1 += parseFloat(obj[i].data[j]["'OT1'"]);
                                        count2 += parseFloat(obj[i].data[j]["'OT2'"]);
                                        count3 += parseFloat(obj[i].data[j]["'OT3'"]);
                                        count4 += parseFloat(obj[i].data[j]["'OT4'"]);
                                        count5 += parseFloat(obj[i].data[j]["'OT5'"]);
                                        count6 += parseFloat(_a);
                                        count7 += parseFloat(_b);
                                        if (_sum == '-')
                                            count8 += 0;
                                        else
                                            count8 += parseFloat(_sum);
                                    }

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> Total </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count6 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count7 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count8 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count1 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count2 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count3 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count4 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count5 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += '</tr>';

                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'StartEnd-3 Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelStartEnd4Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd4,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> ShiftName </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Hours </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Absent </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Applied Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Holiday Status </b></td>";
                                    strstring += "</tr>";

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].shiftName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].InTime + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].TimeOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorked + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorkedUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeHour + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].finalOverTimeEarly + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeFinalHour + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeFinalHourUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Late + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].EarlyLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Absent + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].AppliedLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HolidayStatus + " </td>";
                                        strstring += "</tr>";
                                    }
                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'StartEnd-4 Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelStartEnd5Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd5,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Lunch Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Lunch In </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Time Out </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Hour Worked Unit </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #84d9d2;'><b> Overtime Hours Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #84d9d2;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #84d9d2;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #84d9d2;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #84d9d2;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #84d9d2;'><b> OT5 </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #b0d984;'><b> Early In Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #b0d984;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #b0d984;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #b0d984;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #b0d984;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #b0d984;'><b> OT5 </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #d0d984;'><b> Total Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #d0d984;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #d0d984;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #d0d984;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #d0d984;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center; background: #d0d984;'><b> OT5 </b></td>";

                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Absent </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Applied Leave </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Holiday Status </b></td>";
                                    strstring += "</tr>";

                                    /* OverTime */
                                    let count1 = 0;
                                    let count2 = 0;
                                    let count3 = 0;
                                    let count4 = 0;
                                    let count5 = 0;
                                    let count6 = 0;
                                    let count7 = 0;
                                    let count8 = 0;
                                    /* EarlyTime */
                                    let count9 = 0;
                                    let count10 = 0;
                                    let count11 = 0;
                                    let count12 = 0;
                                    let count13 = 0;
                                    let count14 = 0;
                                    let count15 = 0;
                                    let count16 = 0;
                                    /* Total-Time */
                                    let count17 = 0;
                                    let count18 = 0;
                                    let count19 = 0;
                                    let count20 = 0;
                                    let count21 = 0;
                                    let count22 = 0;
                                    let count23 = 0;
                                    let count24 = 0;

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].InTime + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].LunchOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].LunchIn + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].TimeOut + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorked + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HourWorkedUnit + " </td>";
                                        /*  */
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'> " + obj[i].data[j].OvertimeHourUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'> " + obj[i].data[j]["'O_OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'> " + obj[i].data[j]["'O_OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'> " + obj[i].data[j]["'O_OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'> " + obj[i].data[j]["'O_OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'> " + obj[i].data[j]["'O_OT5'"] + " </td>";
                                        /*  */
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'> " + obj[i].data[j].finalOverTimeEarlyUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'> " + obj[i].data[j]["'E_OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'> " + obj[i].data[j]["'E_OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'> " + obj[i].data[j]["'E_OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'> " + obj[i].data[j]["'E_OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'> " + obj[i].data[j]["'E_OT5'"] + " </td>";

                                        let _a = 0;
                                        if (obj[i].data[j].OvertimeHourUnit != '-') {
                                            _a = obj[i].data[j].OvertimeHourUnit;
                                        }
                                        let _b = 0;
                                        if (obj[i].data[j].finalOverTimeEarlyUnit != '-') {
                                            _b = obj[i].data[j].finalOverTimeEarlyUnit;
                                        }

                                        let _sum = parseFloat(_a) + parseFloat(_b);
                                        if (_sum == 0) {
                                            _sum = '-';
                                        }
                                        /*  */
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'> " + _sum + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'> " + obj[i].data[j]["'T_OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'> " + obj[i].data[j]["'T_OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'> " + obj[i].data[j]["'T_OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'> " + obj[i].data[j]["'T_OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'> " + obj[i].data[j]["'T_OT5'"] + " </td>";

                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Late + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].EarlyLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].Absent + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].AppliedLeave + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].HolidayStatus + " </td>";
                                        strstring += "</tr>";

                                        count1 += parseFloat(obj[i].data[j]["'O_OT1'"]);
                                        count2 += parseFloat(obj[i].data[j]["'O_OT2'"]);
                                        count3 += parseFloat(obj[i].data[j]["'O_OT3'"]);
                                        count4 += parseFloat(obj[i].data[j]["'O_OT4'"]);
                                        count5 += parseFloat(obj[i].data[j]["'O_OT5'"]);
                                        if (obj[i].data[j].OvertimeHourUnit != "-")
                                            count6 += parseFloat(obj[i].data[j].OvertimeHourUnit);
                                        /**/
                                        count9 += parseFloat(obj[i].data[j]["'E_OT1'"]);
                                        count10 += parseFloat(obj[i].data[j]["'E_OT2'"]);
                                        count11 += parseFloat(obj[i].data[j]["'E_OT3'"]);
                                        count12 += parseFloat(obj[i].data[j]["'E_OT4'"]);
                                        count13 += parseFloat(obj[i].data[j]["'E_OT5'"]);
                                        if (obj[i].data[j].finalOverTimeEarlyUnit != "-")
                                            count14 += parseFloat(obj[i].data[j].finalOverTimeEarlyUnit);
                                        /**/
                                        count17 += parseFloat(obj[i].data[j]["'T_OT1'"]);
                                        count18 += parseFloat(obj[i].data[j]["'T_OT2'"]);
                                        count19 += parseFloat(obj[i].data[j]["'T_OT3'"]);
                                        count20 += parseFloat(obj[i].data[j]["'T_OT4'"]);
                                        count21 += parseFloat(obj[i].data[j]["'T_OT5'"]);
                                        if (_sum != "-")
                                            count22 += parseFloat(_sum);
                                    }

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> Total </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'><b> " + count6 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'><b> " + count1 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'><b> " + count2 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'><b> " + count3 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'><b> " + count4 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #84d9d2;'><b> " + count5 + " </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'><b> " + count14 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'><b> " + count9 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'><b> " + count10 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'><b> " + count11 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'><b> " + count12 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #b0d984;'><b> " + count13 + " </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'><b> " + count22 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'><b> " + count17 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'><b> " + count18 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'><b> " + count19 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'><b> " + count20 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; background: #d0d984;'><b> " + count21 + " </b></td>";

                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'StartEnd-5 Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelOvertimeReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportOvertime,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Time period : " + moment($scope.SearchFromDate).format("DD-MM-YYYY") + " To " + moment($scope.SearchToDate).format("DD-MM-YYYY") + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>OT1</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>OT2</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>OT3</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>OT4</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>OT5</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>Remarks</b></td>";
                                    strstring += "</tr>";

                                    let count1 = 0;
                                    let count2 = 0;
                                    let count3 = 0;
                                    let count4 = 0;
                                    let count5 = 0;

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT5'"] + " </td>";
                                        strstring += "</tr>";

                                        count1 += parseFloat(obj[i].data[j]["'OT1'"]);
                                        count2 += parseFloat(obj[i].data[j]["'OT2'"]);
                                        count3 += parseFloat(obj[i].data[j]["'OT3'"]);
                                        count4 += parseFloat(obj[i].data[j]["'OT4'"]);
                                        count5 += parseFloat(obj[i].data[j]["'OT5'"]);
                                    }

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Total</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count1 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count2 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count3 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count4 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count5 + "</b></td>";
                                    strstring += '</tr>';

                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Overtime Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });


            } catch (e) {
                console.log(e);
            }
        };

        excelAddpayReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportAddPay,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Time period : " + moment($scope.SearchFromDate).format("DD-MM-YYYY") + " To " + moment($scope.SearchToDate).format("DD-MM-YYYY") + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>A1</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>A2</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>A3</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>A4</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>A5</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>Remarks</b></td>";
                                    strstring += "</tr>";

                                    let count1 = 0;
                                    let count2 = 0;
                                    let count3 = 0;
                                    let count4 = 0;
                                    let count5 = 0;

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'A1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'A2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'A3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'A4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'A5'"] + " </td>";
                                        strstring += "</tr>";

                                        count1 += parseFloat(obj[i].data[j]["'A1'"]);
                                        count2 += parseFloat(obj[i].data[j]["'A2'"]);
                                        count3 += parseFloat(obj[i].data[j]["'A3'"]);
                                        count4 += parseFloat(obj[i].data[j]["'A4'"]);
                                        count5 += parseFloat(obj[i].data[j]["'A5'"]);
                                    }

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Total</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count1 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count2 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count3 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count4 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count5 + "</b></td>";
                                    strstring += '</tr>';

                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'AddPay Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelShiftReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportShift,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Employee : " + obj[i].Name + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Department : " + obj[i].Department + " || Branch : " + obj[i].Branch + " || Shift : " + obj[i].shiftName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Time period : " + moment($scope.SearchFromDate).format("DD-MM-YYYY") + " To " + moment($scope.SearchToDate).format("DD-MM-YYYY") + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: left;'><b> Date </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>S1</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>S2</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>S3</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>S4</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>S5</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b>Remarks</b></td>";
                                    strstring += "</tr>";

                                    let count1 = 0;
                                    let count2 = 0;
                                    let count3 = 0;
                                    let count4 = 0;
                                    let count5 = 0;

                                    for (let j = 0; j < obj[i].data.length; j++) {
                                        strstring += "<tr>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: left;'> " + obj[i].data[j].DateWithName + "</td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'S1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'S2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'S3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'S4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'S5'"] + " </td>";
                                        strstring += "</tr>";

                                        count1 += parseFloat(obj[i].data[j]["'S1'"]);
                                        count2 += parseFloat(obj[i].data[j]["'S2'"]);
                                        count3 += parseFloat(obj[i].data[j]["'S3'"]);
                                        count4 += parseFloat(obj[i].data[j]["'S4'"]);
                                        count5 += parseFloat(obj[i].data[j]["'S5'"]);
                                    }

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Total</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count1 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count2 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count3 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count4 + "</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>" + count5 + "</b></td>";
                                    strstring += '</tr>';

                                    strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";

                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Shift Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelMonthlystatisticsReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportMonthlyStatistic,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-01"),
                        "SearchMonth": moment($scope.SearchFromDate).format("MM"),
                        "SearchYear": moment($scope.SearchFromDate).format("YYYY"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let _days = moment($scope.SearchFromDate).daysInMonth();
                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Monthly Statistic Report </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Time period : " + moment($scope.SearchFromDate).format("YYYY, MMM") + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'>Note: W = Worked | O = Off Day | A = Absent | L = Leave | Bold = Late | H = Holiday </td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'><b>Employee Name</b></td>";
                                strstring += "<td x:autofilter='all'><b>Department</b></td>";
                                strstring += "<td x:autofilter='all'><b>Branch</b></td>";
                                strstring += "<td x:autofilter='all'><b>Shift</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day1</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day2</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day3</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day4</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day5</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day6</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day7</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day8</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day9</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day10</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day11</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day12</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day13</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day14</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day15</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day16</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day17</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day18</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day19</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day20</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day21</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day22</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day23</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day24</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day25</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day26</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day27</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day28</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day29</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day30</b></td>";
                                strstring += "<td x:autofilter='all'><b>Day31</b></td>";
                                strstring += "</tr>";

                                for (let i = 0; i < obj.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].Name + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].Department + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].Branch + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].shiftName + " </td>";
                                    if (obj[i].Day01.isLate == 1)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + obj[i].Day01.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day01.status + " </td>";

                                    if (obj[i].Day02.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day02.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day02.status + " </td>";

                                    if (obj[i].Day03.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day03.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day03.status + " </td>";

                                    if (obj[i].Day04.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day04.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day04.status + " </td>";

                                    if (obj[i].Day05.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day05.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day05.status + " </td>";

                                    if (obj[i].Day06.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day06.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day06.status + " </td>";

                                    if (obj[i].Day07.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day07.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day07.status + " </td>";

                                    if (obj[i].Day08.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day08.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day08.status + " </td>";

                                    if (obj[i].Day09.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day09.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day09.status + " </td>";

                                    if (obj[i].Day10.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day10.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day10.status + " </td>";

                                    if (obj[i].Day11.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day11.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day11.status + " </td>";

                                    if (obj[i].Day12.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day12.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day12.status + " </td>";

                                    if (obj[i].Day13.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day13.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day13.status + " </td>";

                                    if (obj[i].Day14.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day14.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day14.status + " </td>";

                                    if (obj[i].Day15.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day15.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day15.status + " </td>";

                                    if (obj[i].Day16.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day16.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day16.status + " </td>";

                                    if (obj[i].Day17.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day17.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day17.status + " </td>";

                                    if (obj[i].Day18.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day18.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day18.status + " </td>";

                                    if (obj[i].Day19.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day19.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day19.status + " </td>";

                                    if (obj[i].Day20.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day20.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day20.status + " </td>";

                                    if (obj[i].Day21.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day21.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day21.status + " </td>";

                                    if (obj[i].Day22.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day22.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day22.status + " </td>";

                                    if (obj[i].Day23.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day23.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day23.status + " </td>";

                                    if (obj[i].Day24.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day24.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day24.status + " </td>";

                                    if (obj[i].Day25.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day25.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day25.status + " </td>";

                                    if (obj[i].Day26.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day26.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day26.status + " </td>";

                                    if (obj[i].Day27.isLate == 1)
                                        strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day27.status + " </b></td>";
                                    else
                                        strstring += "<td  style = 'text-align: center;'> " + obj[i].Day27.status + " </td>";
                                    if (_days >= 28) {
                                        if (obj[i].Day28.isLate == 1)
                                            strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day28.status + " </b></td>";
                                        else
                                            strstring += "<td  style = 'text-align: center;'> " + obj[i].Day28.status + " </td>";
                                    }
                                    if (_days >= 29) {
                                        if (obj[i].Day29.isLate == 1)
                                            strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day29.status + " </b></td>";
                                        else
                                            strstring += "<td  style = 'text-align: center;'> " + obj[i].Day29.status + " </td>";
                                    }
                                    if (_days >= 30) {
                                        if (obj[i].Day30.isLate == 1)
                                            strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day30.status + " </b></td>";
                                        else
                                            strstring += "<td  style = 'text-align: center;'> " + obj[i].Day30.status + " </td>";
                                    }
                                    if (_days >= 31) {
                                        if (obj[i].Day31.isLate == 1)
                                            strstring += "<td  style = 'text-align: center;'><b> " + obj[i].Day31.status + " </b></td>";
                                        else
                                            strstring += "<td  style = 'text-align: center;'> " + obj[i].Day31.status + " </td>";
                                    }
                                    strstring += '</tr>';
                                }
                                strstring += "<tr><td colspan = '16' x:autofilter='all'> </td></tr>";
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Monthly-statistics Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelMonthlyattendanceReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportMonthlyAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-01"),
                        "SearchMonth": moment($scope.SearchFromDate).format("MM"),
                        "SearchYear": moment($scope.SearchFromDate).format("YYYY"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let _days = moment($scope.SearchFromDate).daysInMonth();
                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {

                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Monthly Attendance Report </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += '<tr>';
                                    strstring += "<td colspan = '14' x:autofilter='all' style='background: #ffee57;'><b> Employee Name: " + obj[i].Name + "</b> </td>";
                                    strstring += '</tr>';
                                    strstring += '<tr>';
                                    strstring += "<td colspan = '14' x:autofilter='all'><b> Department: " + obj[i].Department + " || Department: " + obj[i].Department + " || Branch: " + obj[i].Branch + " || Shift Name: " + obj[i].shiftName + " </b></td>";
                                    strstring += '</tr>';
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                    strstring += '<tr>';
                                    strstring += "<td x:autofilter='all'><b>Status</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day1</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day2</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day3</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day4</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day5</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day6</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day7</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day8</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day9</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day10</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day11</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day12</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day13</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day14</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day15</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day16</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day17</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day18</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day19</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day20</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day21</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day22</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day23</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day24</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day25</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day26</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day27</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day28</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day29</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day30</b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b>Day31</b></td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Time In</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;' > " + obj[i].data.Day04["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Time-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Time-In"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Time-In"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Time-In"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Time-In"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Time-In"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Break Out</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Break-Out1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Break-Out1"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Break-Out1"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Break-Out1"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Break-Out1"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Break-Out1"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Break In</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Break-In1"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Break-In1"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Break-In1"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Break-In1"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Break-In1"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Break-In1"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Lunch Out</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Lunch-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Lunch-Out"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Lunch-Out"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Lunch-Out"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Lunch-Out"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Lunch-Out"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Lunch In</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Lunch-In"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Lunch-In"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Lunch-In"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Lunch-In"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Lunch-In"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Lunch-In"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Break Out</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Break-Out2"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Break-Out2"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Break-Out2"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Break-Out2"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Break-Out2"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Break-Out2"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Time Out</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Time-Out"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Time-Out"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Time-Out"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Time-Out"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Time-Out"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Time-Out"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Hours Worked</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Hours Worked"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Hours Worked"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Hours Worked"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Hours Worked"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Hours Worked"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Hours Worked"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Overtime Hours</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Overtime Hours"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Overtime Hours"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Overtime Hours"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Overtime Hours"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Overtime Hours"] + " </td>";
                                    strstring += '</tr>';
                                    //UNit
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Overtime Hours Unit</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Overtime Hours Unit"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Overtime Hours Unit"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Overtime Hours Unit"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Overtime Hours Unit"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Overtime Hours Unit"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Early Overtime Hours</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Early Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Early Overtime Hours"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Early Overtime Hours"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Early Overtime Hours"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Early Overtime Hours"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Early Overtime Hours"] + " </td>";
                                    strstring += '</tr>';
                                    //.Unit
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Early Overtime Hours Unit</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Early Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Early Overtime Hours Unit"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Early Overtime Hours Unit"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Early Overtime Hours Unit"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Early Overtime Hours Unit"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Early Overtime Hours Unit"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Final Overtime Hours</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Final Overtime Hours"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Final Overtime Hours"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Final Overtime Hours"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Final Overtime Hours"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Final Overtime Hours"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Final Overtime Hours"] + " </td>";
                                    strstring += '</tr>';
                                    //. Unit
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Final Overtime Hours Unit</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Final Overtime Hours Unit"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Final Overtime Hours Unit"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Final Overtime Hours Unit"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Final Overtime Hours Unit"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Final Overtime Hours Unit"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Final Overtime Hours Unit"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Late</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Late"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Late"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Late"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Late"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Late"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Late"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Early Leave</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Early Leave"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Early Leave"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Early Leave"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Early Leave"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Early Leave"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Early Leave"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Leave Applied</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Leave Applied"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Leave Applied"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Leave Applied"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Leave Applied"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Leave Applied"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Leave Applied"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>Holiday Status</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day01["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day02["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day03["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day04["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day05["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day06["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day07["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day08["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day09["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day10["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day11["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day12["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day13["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day14["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day15["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day16["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day17["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day18["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day19["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day20["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day21["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day22["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day23["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day24["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day25["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day26["Holiday Status"] + " </td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day27["Holiday Status"] + " </td>";
                                    if (_days >= 28)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day28["Holiday Status"] + " </td>";
                                    if (_days >= 29)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day29["Holiday Status"] + " </td>";
                                    if (_days >= 30)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day30["Holiday Status"] + " </td>";
                                    if (_days >= 31)
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data.Day31["Holiday Status"] + " </td>";
                                    strstring += '</tr>';

                                    strstring += '<tr>';
                                    strstring += "<td colspan = '14' x:autofilter='all'><b> Employee Name: " + obj[i].Name + "</b> </td>";
                                    strstring += '</tr>';
                                    strstring += '<tr>';
                                    strstring += "<td colspan = '14' x:autofilter='all'><b> Department: " + obj[i].Department + " || Department: " + obj[i].Department + " || Branch: " + obj[i].Branch + " || Shift Name: " + obj[i].shiftName + " </b></td>";
                                    strstring += '</tr>';
                                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                                }
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Monthly-Attendance Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelLateInEntriesReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            let data = [];
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {
                                    data.push({});
                                    data[i].memberName = obj[i].memberName;
                                    data[i].employerdepartmentTitle = obj[i].employerdepartmentTitle;
                                    data[i].employerbranchName = obj[i].employerbranchName;
                                    data[i].shiftName = obj[i].shiftName;
                                    data[i].entryDate = obj[i].entryDateDDMMYYYY;
                                    data[i].employeeId = obj[i].employeeId;

                                    let LateIn = '';
                                    let lateSec = moment.duration(obj[i].lateIn).asSeconds();
                                    if (lateSec < 0) {
                                        LateIn = '00:00';
                                    }
                                    else {
                                        LateIn = obj[i].lateIn;
                                    }
                                    data[i].LateIn = LateIn == '00:00' ? '-' : LateIn;
                                }
                                data = data.filter(x => x.LateIn != '-');
                            }

                            var strstring = "";
                            if (data.length > 0) {
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all' style = 'width: 300px;'><b> Employee Name </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Department </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Branch </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Shift </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: center;'><b> Date </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Late </b></td>";
                                strstring += "</tr>";

                                let _filterEmployeeId = [...new Set(data.map(item => item.employeeId))];
                                if (_filterEmployeeId.length > 0) {
                                    for (let j = 0; j < _filterEmployeeId.length; j++) {
                                        let filterData = data.filter(x => x.employeeId == _filterEmployeeId[j]);

                                        if (filterData.length > 0) {
                                            strstring += "<tr>";
                                            strstring += "<td x:autofilter='all'> " + filterData[0].memberName + " </td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[0].employerdepartmentTitle + " </td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[0].employerbranchName + " </td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[0].shiftName + " </td>";
                                            strstring += "<td x:autofilter='all' colspan = '2' style = 'text-align: center;'><b> No of List: " + filterData.length + " </b></td>";
                                            strstring += "</tr>";
                                            for (let i = 0; i < filterData.length; i++) {
                                                if (filterData[i].LateIn != '-') {
                                                    strstring += "<tr>";
                                                    strstring += "<td x:autofilter='all'> " + filterData[i].memberName + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].employerdepartmentTitle + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].employerbranchName + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].shiftName + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].entryDate + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].LateIn + " </td>";
                                                    strstring += "</tr>";
                                                }
                                            }
                                        }
                                        strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    }
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'LateIn Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelEarlyOutEntriesReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            let data = [];
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {
                                    data.push({});
                                    data[i].memberName = obj[i].memberName;
                                    data[i].employerdepartmentTitle = obj[i].employerdepartmentTitle;
                                    data[i].employerbranchName = obj[i].employerbranchName;
                                    data[i].shiftName = obj[i].shiftName;
                                    data[i].entryDate = obj[i].entryDateDDMMYYYY;
                                    data[i].employeeId = obj[i].employeeId;

                                    let EarlyOutTime = '';
                                    if (obj[i].actOutTime != null)
                                        EarlyOutTime = obj[i].earlyOutTime;
                                    else if (obj[i].actOutTime_Full != null)
                                        EarlyOutTime = obj[i].earlyOutTime_Full;
                                    else
                                        EarlyOutTime = '00:00';

                                    let sec = moment.duration(EarlyOutTime).asSeconds();
                                    if (sec < 0) {
                                        EarlyOutTime = '00:00';
                                    }
                                    data[i].EarlyOutTime = EarlyOutTime == '00:00' ? '-' : EarlyOutTime;
                                }
                                data = data.filter(x => x.EarlyOutTime != '-');
                            }

                            var strstring = "";
                            if (data.length > 0) {
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all' style = 'width: 300px;'><b> Employee Name </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Department </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Branch </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Shift </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 150px; text-align: center;'><b> Date </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early-Out </b></td>";
                                strstring += "</tr>";

                                let _filterEmployeeId = [...new Set(data.map(item => item.employeeId))];
                                if (_filterEmployeeId.length > 0) {
                                    for (let j = 0; j < _filterEmployeeId.length; j++) {
                                        let filterData = data.filter(x => x.employeeId == _filterEmployeeId[j]);

                                        if (filterData.length > 0) {
                                            strstring += "<tr>";
                                            strstring += "<td x:autofilter='all'> " + filterData[0].memberName + " </td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[0].employerdepartmentTitle + " </td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[0].employerbranchName + " </td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[0].shiftName + " </td>";
                                            strstring += "<td x:autofilter='all' colspan = '2' style = 'text-align: center;'><b> No of List: " + filterData.length + " </b></td>";
                                            strstring += "</tr>";
                                            for (let i = 0; i < filterData.length; i++) {
                                                if (filterData[i].EarlyOutTime != '-') {
                                                    strstring += "<tr>";
                                                    strstring += "<td x:autofilter='all'> " + filterData[i].memberName + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].employerdepartmentTitle + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].employerbranchName + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].shiftName + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].entryDate + " </td>";
                                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + filterData[i].EarlyOutTime + " </td>";
                                                    strstring += "</tr>";
                                                }
                                            }
                                        }
                                        strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                    }
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Early-Out Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelMultipleReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportMultipleSheet,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;
                            let tableData = [];
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {
                                    tableData.push({});
                                    tableData[i].sheetName = i.toString();
                                    tableData[i].data = [
                                        [
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" },
                                            {
                                                "merge": { "c": 1 },
                                                "text": "Day Shift",
                                                "style": {
                                                    "Font": {
                                                        "bold": true
                                                    }
                                                },

                                            },
                                            { "text": "" },
                                            {
                                                "merge": { "c": 1 },
                                                "text": "Night Shift"
                                            },
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" },
                                            { "text": "" }
                                        ],
                                        [
                                            { "text": "Name" },
                                            { "text": "Department" },
                                            { "text": "Branch" },
                                            { "text": "Entry" },
                                            { "text": "InTime" },
                                            { "text": "OutTime" },
                                            { "text": "InTime" },
                                            { "text": "OutTime" },
                                            { "text": "Total Shift" },
                                            { "text": "Total Hrs" },
                                            { "text": "OT Hrs" },
                                            { "text": "Late Hrs" },
                                            { "text": "PH" },
                                            { "text": "Leave" }
                                        ]];
                                    let _data = obj[i].data;
                                    if (_data.length > 0) {

                                        for (let j = 0; j < _data.length; j++) {
                                            let _dataSub = [];
                                            _dataSub = [
                                                { "text": obj[i].Name },
                                                { "text": obj[i].Department },
                                                { "text": obj[i].Branch },
                                                { "text": _data[j].Date },
                                                { "text": _data[j].InTime1 },
                                                { "text": _data[j].TimeOut1 },
                                                { "text": _data[j].InTime2 },
                                                { "text": _data[j].TimeOut2 },
                                                { "text": "" },
                                                { "text": "" },
                                                { "text": "" },
                                                { "text": "" },
                                                { "text": "" },
                                                { "text": "" }
                                            ];

                                            tableData[i].data.push(_dataSub);
                                        }
                                    }
                                }
                                var options = { fileName: "Multiple Sheet Earlyout" };
                                Jhxlsx.export(tableData, options);
                            }
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        excelCustomReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd3,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            var strstring = "";
                            if (obj.length > 0) {
                                let totalDay = moment($scope.SearchToDate).diff(moment($scope.SearchFromDate), 'days') + 1;
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'></td>";
                                for (let j = 0; j < totalDay; j++) {
                                    let _date = moment($scope.SearchFromDate).add(j, 'days').format("DD/MM/YYYY ddd");
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;' colspan='11'><b> " + _date + " </b></td>";
                                }
                                strstring += "</tr>";

                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'>Name</td>";

                                let masterOne = obj[0].data[0];

                                for (let j = 0; j < totalDay; j++) {
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>Time-In</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>Time-Out</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>OT1 - " + masterOne["'OT1_Rate'"] + "</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>OT2 - " + masterOne["'OT2_Rate'"] + "</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>OT3 - " + masterOne["'OT3_Rate'"] + "</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>OT4 - " + masterOne["'OT4_Rate'"] + "</td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center; width: 80px;'>Absent</td>";
                                    strstring += "<td x:autofilter='all' style = 'background: #f9f966; text-align: center; width: 80px;'>Late</td>";
                                    strstring += "<td x:autofilter='all' style = 'background: #f9f966; text-align: center; width: 80px;'>Early</td>";
                                    strstring += "<td x:autofilter='all' style = 'background: #f9f966; text-align: center; width: 80px;'>Total Overt Time Unit</td>";
                                    strstring += "<td x:autofilter='all' style = 'background: #6f6fcb; text-align: center; width: 150px;'>Remark</td>";
                                }
                                strstring += "</tr>";

                                /* Data */

                                for (let i = 0; i < obj.length; i++) {

                                    let employeeName = obj[i].Name;
                                    let subData = obj[i].data;

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'>" + employeeName + "</td>";

                                    let totalDay = moment($scope.SearchToDate).diff(moment($scope.SearchFromDate), 'days') + 1;
                                    for (let j = 0; j < totalDay; j++) {
                                        let _date = moment($scope.SearchFromDate).add(j, 'days').format("DD-MM-YYYY");
                                        let _filterData = subData.filter(x => x.Date == _date);
                                        if (_filterData.length == 0) {
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                            strstring += "<td x:autofilter='all'>-</td>";
                                        } else {
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0].InTime + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0].TimeOut + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0]["'OT1'"] + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0]["'OT2'"] + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0]["'OT3'"] + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0]["'OT4'"] + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0].Absent + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0].Late + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0].EarlyLeave + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'text-align: center;'>" + _filterData[0].OvertimeFinalHourUnit + "</td>";
                                            strstring += "<td x:autofilter='all'></td>";
                                        }
                                    }
                                    strstring += "</tr>";
                                }

                                strstring += "<tr><td></td></tr>";
                                strstring += "<tr><td></td></tr>";
                                strstring += "<tr><td></td></tr>";
                                strstring += "<tr><td></td></tr>";

                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'><b> Approved by : </b></td>";
                                strstring += "</tr>";
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Custom Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_DownloadExcel = () => {
            try {

                if ($scope.excelReport == "") {
                    warningMsg("Excel Report", "Please select excel report.");
                }
                else {

                    $("#searchModal").modal("hide");

                    if ($scope.excelReport == "attendance") {
                        excelAttendanceReport();
                    }
                    if ($scope.excelReport == "startend1") {
                        excelStartEnd1Report();
                    }
                    if ($scope.excelReport == "startend2") {
                        excelStartEnd2Report();
                    }
                    if ($scope.excelReport == "startend3") {
                        excelStartEnd3Report();
                    }
                    if ($scope.excelReport == "startend4") {
                        excelStartEnd4Report();
                    }
                    if ($scope.excelReport == "startend5") {
                        excelStartEnd5Report();
                    }
                    if ($scope.excelReport == "overtime") {
                        excelOvertimeReport();
                    }
                    if ($scope.excelReport == "addpay") {
                        excelAddpayReport();
                    }
                    if ($scope.excelReport == "shift") {
                        excelShiftReport();
                    }
                    if ($scope.excelReport == "monthlystatistics") {
                        excelMonthlystatisticsReport();
                    }
                    if ($scope.excelReport == "monthlyattendance") {
                        excelMonthlyattendanceReport();
                    }
                    if ($scope.excelReport == "lateinentries") {
                        excelLateInEntriesReport();
                    }
                    if ($scope.excelReport == "earlyoutentries") {
                        excelEarlyOutEntriesReport();
                    }
                    if ($scope.excelReport == "multiple") {
                        excelMultipleReport();
                    }
                    if ($scope.excelReport == "custom") {
                        excelCustomReport();
                    }


                }
            } catch (e) {
                console.log(e);
            }
        };

        /* PDF */
        pdfAttendanceReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let data = [];
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {
                                    data.push({});
                                    data[i].memberName = obj[i].memberName;
                                    data[i].employerdepartmentTitle = obj[i].employerdepartmentTitle;
                                    data[i].employerbranchName = obj[i].employerbranchName;
                                    data[i].shiftName = obj[i].shiftName;
                                    data[i].entryDate = obj[i].entryDateDDMMYYYY;

                                    let _actInTime = obj[i].actInTime == null ? '00:00' : moment(obj[i].actInTime).format("HH:mm");
                                    data[i].actInTime = _actInTime == '00:00' ? '-' : _actInTime;

                                    let _actOutTime = '';
                                    if (obj[i].actOutTime != null)
                                        _actOutTime = moment(obj[i].actOutTime).format("HH:mm");
                                    else if (obj[i].actOutTime_Full != null)
                                        _actOutTime = moment(obj[i].actOutTime_Full).format("HH:mm");
                                    else
                                        _actOutTime = '00:00';
                                    data[i].actOutTime = _actOutTime == '00:00' ? '-' : _actOutTime;

                                    let _workingHour = '';
                                    if (obj[i].actOutTime != null)
                                        _workingHour = obj[i].workingHour;
                                    else if (obj[i].actOutTime_Full != null)
                                        _workingHour = obj[i].workingHour_Full;
                                    else
                                        _workingHour = '00:00';
                                    data[i].workingHour = _workingHour == '00:00' ? '-' : _workingHour;

                                    let OvertimeHour = '';
                                    if (obj[i].actOutTime != null)
                                        OvertimeHour = obj[i].finalOverTime;
                                    else if (obj[i].actOutTime_Full != null)
                                        OvertimeHour = obj[i].finalOverTime_Full;
                                    else
                                        OvertimeHour = '00:00';
                                    data[i].OvertimeHour = OvertimeHour == '00:00' ? '-' : OvertimeHour;

                                    let LateIn = '';
                                    let lateSec = moment.duration(obj[i].lateIn).asSeconds();
                                    if (lateSec < 0) {
                                        LateIn = '00:00';
                                    }
                                    else {
                                        LateIn = obj[i].lateIn;
                                    }
                                    data[i].LateIn = LateIn == '00:00' ? '-' : LateIn;

                                    let EarlyOutTime = '';
                                    if (obj[i].actOutTime != null)
                                        EarlyOutTime = obj[i].earlyOutTime;
                                    else if (obj[i].actOutTime_Full != null)
                                        EarlyOutTime = obj[i].earlyOutTime_Full;
                                    else
                                        EarlyOutTime = '00:00';

                                    let sec = moment.duration(EarlyOutTime).asSeconds();
                                    if (sec < 0) {
                                        EarlyOutTime = '00:00';
                                    }
                                    data[i].EarlyOutTime = EarlyOutTime == '00:00' ? '-' : EarlyOutTime;
                                    data[i].holidayStatus = obj[i].holidayStatus;
                                }
                            }

                            if (data.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(data);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceReport",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Timing List",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        pdfStartEnd1Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd1,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let masterData = [];
                            for (let i = 0; i < obj.length; i++) {
                                let subData = obj[i].data;

                                if (subData.length > 0) {
                                    for (let j = 0; j < subData.length; j++) {

                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            InTime: subData[j].InTime,
                                            BreakOut1: subData[j].BreakOut1,
                                            BreakIn1: subData[j].BreakIn1,
                                            LunchOut: subData[j].LunchOut,
                                            LunchIn: subData[j].LunchIn,
                                            BreakOut2: subData[j].BreakOut2,
                                            BreakIn2: subData[j].BreakIn2,
                                            TimeOut: subData[j].TimeOut,
                                            HourWorked: subData[j].HourWorked,
                                            HourWorkedUnit: subData[j].HourWorkedUnit,
                                            OvertimeHour: subData[j].OvertimeHour,
                                            finalOverTimeEarly: subData[j].finalOverTimeEarly,
                                            OvertimeFinalHour: subData[j].OvertimeFinalHour,
                                            OvertimeFinalHourUnit: subData[j].OvertimeFinalHourUnit,
                                            Late: subData[j].Late,
                                            EarlyLeave: subData[j].EarlyLeave,
                                            Absent: subData[j].Absent,
                                            AppliedLeave: subData[j].AppliedLeave,
                                            HolidayStatus: subData[j].HolidayStatus,
                                            Employee: obj[i].Name,
                                            Department: obj[i].Department,
                                            Branch: obj[i].Branch
                                        };
                                        masterData.push(pera);
                                    }
                                }
                            }

                            if (masterData.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(masterData);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceStartEnd1Report",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Start-End 1 Report",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        pdfStartEnd2Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd1,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let masterData = [];
                            for (let i = 0; i < obj.length; i++) {
                                let subData = obj[i].data;
                                if (subData.length > 0) {
                                    for (let j = 0; j < subData.length; j++) {

                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            InTime: subData[j].InTime,
                                            TimeOut: subData[j].TimeOut,
                                            HourWorked: subData[j].HourWorked,
                                            HourWorkedUnit: subData[j].HourWorkedUnit,
                                            OvertimeHour: subData[j].OvertimeHour,
                                            finalOverTimeEarly: subData[j].finalOverTimeEarly,
                                            OvertimeFinalHour: subData[j].OvertimeFinalHour,
                                            OvertimeFinalHourUnit: subData[j].OvertimeFinalHourUnit,
                                            Late: subData[j].Late,
                                            EarlyLeave: subData[j].EarlyLeave,
                                            Absent: subData[j].Absent,
                                            AppliedLeave: subData[j].AppliedLeave,
                                            HolidayStatus: subData[j].HolidayStatus,
                                            Employee: obj[i].Name,
                                            Department: obj[i].Department,
                                            Branch: obj[i].Branch
                                        };
                                        masterData.push(pera);
                                    }
                                }
                            }

                            if (masterData.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(masterData);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceStartEnd2Report",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Start-End 2 Report",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        pdfStartEnd3Report = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportStartEnd3,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let masterData = [];
                            for (let i = 0; i < obj.length; i++) {
                                let subData = obj[i].data;

                                if (subData.length > 0) {
                                    for (let j = 0; j < subData.length; j++) {


                                        let _a = 0;
                                        if (subData[j].OvertimeHourUnit != '-') {
                                            _a = subData[j].OvertimeHourUnit;
                                        }
                                        let _b = 0;
                                        if (subData[j].finalOverTimeEarlyUnit != '-') {
                                            _b = subData[j].finalOverTimeEarlyUnit;
                                        }

                                        let _sum = parseFloat(_a) + parseFloat(_b);
                                        if (_sum == 0) {
                                            _sum = '-';
                                        }

                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            InTime: subData[j].InTime,
                                            LunchOut: subData[j].LunchOut,
                                            LunchIn: subData[j].LunchIn,
                                            TimeOut: subData[j].TimeOut,
                                            HourWorked: subData[j].HourWorked,
                                            HourWorkedUnit: subData[j].HourWorkedUnit,
                                            OvertimeHourUnit: subData[j].OvertimeHourUnit,
                                            finalOverTimeEarlyUnit: subData[j].finalOverTimeEarlyUnit,
                                            finalOverTimeEarly: _sum,
                                            OT1: subData[j]["'OT1'"].toString(),
                                            OT2: subData[j]["'OT2'"].toString(),
                                            OT3: subData[j]["'OT3'"].toString(),
                                            OT4: subData[j]["'OT4'"].toString(),
                                            OT5: subData[j]["'OT5'"].toString(),
                                            Late: subData[j].Late,
                                            EarlyLeave: subData[j].EarlyLeave,
                                            Absent: subData[j].Absent,
                                            AppliedLeave: subData[j].AppliedLeave,
                                            HolidayStatus: subData[j].HolidayStatus,
                                            Employee: obj[i].Name,
                                            Department: obj[i].Department,
                                            Branch: obj[i].Branch
                                        };
                                        masterData.push(pera);
                                    }
                                }
                            }

                            if (masterData.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(masterData);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceStartEnd3Report",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Start-End 3 Report",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        pdfOvertimeReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportOvertime,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let masterData = [];
                            for (let i = 0; i < obj.length; i++) {
                                let subData = obj[i].data;
                                let _keys = Object.keys(obj[i].data[0]);

                                if (subData.length > 0) {
                                    for (let j = 0; j < subData.length; j++) {
                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            OT1: subData[j]["'OT1'"].toString(),
                                            OT2: subData[j]["'OT2'"].toString(),
                                            OT3: subData[j]["'OT3'"].toString(),
                                            OT4: subData[j]["'OT4'"].toString(),
                                            OT5: subData[j]["'OT5'"].toString(),
                                            Employee: obj[i].Name,
                                            Department: obj[i].Department,
                                            Branch: obj[i].Branch
                                        };
                                        masterData.push(pera);
                                    }
                                }
                            }

                            if (masterData.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(masterData);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceOvertimeReport",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Overtime Report",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });


            } catch (e) {
                console.log(e);
            }
        };

        pdfAddpayReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportAddPay,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let masterData = [];
                            for (let i = 0; i < obj.length; i++) {
                                let subData = obj[i].data;
                                if (subData.length > 0) {
                                    for (let j = 0; j < subData.length; j++) {
                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            A1: subData[j]["'A1'"].toString(),
                                            A2: subData[j]["'A2'"].toString(),
                                            A3: subData[j]["'A3'"].toString(),
                                            A4: subData[j]["'A4'"].toString(),
                                            A5: subData[j]["'A5'"].toString(),
                                            Employee: obj[i].Name,
                                            Department: obj[i].Department,
                                            Branch: obj[i].Branch
                                        };
                                        masterData.push(pera);
                                    }
                                }
                            }

                            if (masterData.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(masterData);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceAddPayReport",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Add-Pay Report",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        pdfShiftReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_reportShift,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": $scope.SearchEmployeeId.toString(),
                        "SearchEmployerbranchId": $scope.SearchEmployerbranchId.toString(),
                        "SearchEmployerdepartmentId": $scope.SearchEmployerdepartmentId.toString(),
                        "SearchEmployerMasterShiftId": $scope.SearchEmployerMasterShiftId.toString(),
                        "SearchFromDate": moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        "SearchToDate": moment($scope.SearchToDate).format("YYYY-MM-DD"),
                        "sortBy": $scope.sortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            let masterData = [];
                            for (let i = 0; i < obj.length; i++) {
                                let subData = obj[i].data;
                                if (subData.length > 0) {
                                    for (let j = 0; j < subData.length; j++) {
                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            S1: subData[j]["'S1'"].toString(),
                                            S2: subData[j]["'S2'"].toString(),
                                            S3: subData[j]["'S3'"].toString(),
                                            S4: subData[j]["'S4'"].toString(),
                                            S5: subData[j]["'S5'"].toString(),
                                            Employee: obj[i].Name,
                                            Department: obj[i].Department,
                                            Branch: obj[i].Branch
                                        };
                                        masterData.push(pera);
                                    }
                                }
                            }

                            if (masterData.length > 0) {
                                $("body").addClass("loading");
                                let attendanceData = JSON.stringify(masterData);

                                $http({
                                    method: "POST",
                                    url: "/employer/AttendanceSetting/load_attendanceShiftReport",
                                    responseType: "blob",
                                    data: {
                                        "companyName": localStorage.getItem("_izemCompanyName"),
                                        "reportTitle": "Attendance Shift Report",
                                        "timePeriod": moment($scope.SearchFromDate).format("DD-MM-YYYY") + " to " + moment($scope.SearchToDate).format("DD-MM-YYYY"),
                                        "attendanceData": attendanceData
                                    }
                                }).then(function successCallback(response) {
                                    var fileURL = URL.createObjectURL(response.data);
                                    $("body").removeClass("loading");
                                    window.open(fileURL, "AttendanceReport.pdf");
                                }, function errorCallback(response) {
                                    console.log(response);
                                    $("body").removeClass("loading");
                                });
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_DownloadPDF = () => {
            try {

                if ($scope.pdfReport == "") {
                    warningMsg("Excel Report", "Please select pdf report.");
                }
                else {

                    $("#searchModal").modal("hide");

                    if ($scope.pdfReport == "attendance") {
                        pdfAttendanceReport();
                    }
                    if ($scope.pdfReport == "startend1") {
                        pdfStartEnd1Report();
                    }
                    if ($scope.pdfReport == "startend2") {
                        pdfStartEnd2Report();
                    }
                    if ($scope.pdfReport == "startend3") {
                        pdfStartEnd3Report();
                    }
                    if ($scope.pdfReport == "overtime") {
                        pdfOvertimeReport();
                    }
                    if ($scope.pdfReport == "addpay") {
                        pdfAddpayReport();
                    }
                    if ($scope.pdfReport == "shift") {
                        pdfShiftReport();
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

    }]);