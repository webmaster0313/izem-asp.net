
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

app.controller("member-attendancereport-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemEmployeeId = localStorage.getItem("_izemEmployeeId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");
        /* Assign EmployeeId */
        $scope.employeeId = $scope._izemEmployeeId;

        $scope.loaded = false;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.SearchFromDate = new Date();
            $scope.SearchToDate = new Date();
            $scope.SearchEmployeeId = $scope.employeeId;
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
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT5 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Overtime Unit </b></td>";
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
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'OT5'"] + " </td>";
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
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count1 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count2 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count3 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count4 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count5 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count6 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count7 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count8 + " </b></td>";
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
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Overtime Hours Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT5 </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Early In Overtime Unit </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT1 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT2 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT3 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT4 </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> OT5 </b></td>";
                                    /* */
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
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].OvertimeHourUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'O_OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'O_OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'O_OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'O_OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'O_OT5'"] + " </td>";
                                        /*  */
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j].finalOverTimeEarlyUnit + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'E_OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'E_OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'E_OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'E_OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'E_OT5'"] + " </td>";

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
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + _sum + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'T_OT1'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'T_OT2'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'T_OT3'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'T_OT4'"] + " </td>";
                                        strstring += "<td x:autofilter='all' style = 'text-align: center;'> " + obj[i].data[j]["'T_OT5'"] + " </td>";

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
                                        /**/
                                        count9 += parseFloat(obj[i].data[j]["'E_OT1'"]);
                                        count10 += parseFloat(obj[i].data[j]["'E_OT2'"]);
                                        count11 += parseFloat(obj[i].data[j]["'E_OT3'"]);
                                        count12 += parseFloat(obj[i].data[j]["'E_OT4'"]);
                                        count13 += parseFloat(obj[i].data[j]["'E_OT5'"]);
                                        /**/
                                        count17 += parseFloat(obj[i].data[j]["'T_OT1'"]);
                                        count18 += parseFloat(obj[i].data[j]["'T_OT2'"]);
                                        count19 += parseFloat(obj[i].data[j]["'T_OT3'"]);
                                        count20 += parseFloat(obj[i].data[j]["'T_OT4'"]);
                                        count21 += parseFloat(obj[i].data[j]["'T_OT5'"]);
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
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count1 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count2 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count3 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count4 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count5 + " </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count9 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count10 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count11 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count12 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count13 + " </b></td>";
                                    /* */
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count17 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count18 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count19 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count20 + " </b></td>";
                                    strstring += "<td x:autofilter='all' style = 'text-align: center;'><b> " + count21 + " </b></td>";

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

        $scope.onClick_DownloadExcel = () => {
            try {

                if ($scope.excelReport == "") {
                    warningMsg("Excel Report", "Please select excel report.");
                }
                else {

                    $("#searchModal").modal("hide");
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
                    if ($scope.excelReport == "lateinentries") {
                        excelLateInEntriesReport();
                    }
                    if ($scope.excelReport == "earlyoutentries") {
                        excelEarlyOutEntriesReport();
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
                                            OvertimeHour: subData[j].OvertimeHour,
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
                                            OvertimeHour: subData[j].OvertimeHour,
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
                                        let pera = {
                                            Date: subData[j].DateWithName,
                                            InTime: subData[j].InTime,
                                            LunchOut: subData[j].LunchOut,
                                            LunchIn: subData[j].LunchIn,
                                            TimeOut: subData[j].TimeOut,
                                            HourWorked: subData[j].HourWorked,
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