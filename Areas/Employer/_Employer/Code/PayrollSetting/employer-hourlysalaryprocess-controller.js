let api_selectdata = backlink + "payroll/api/payrollattendance/payrollattendance_apiSelect";

let api_filltabledata = backlink + "payroll/api/payrollattendance/payrollattendance_apiSelectAll";
let api_UpdateManual = backlink + "payroll/api/payrollattendance/payrollattendance_apiUpdateManual";

let api_insertAttendanceSalaryProcess = backlink + "payroll/api/payrollattendance/payrollattendance_apiInsertAttendanceSalaryProcess";

let api_reportAttendance = backlink + "payroll/api/payrollattendance/payrollattendance_apiReportAttendance";

app.controller("employer-hourlysalaryprocess-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;
        $scope.loaded1 = false;

        $scope.hideEntry = true;

        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Houlry Process');
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
            $scope.fromDate = new Date();
            $scope.toDate = new Date();

            $scope.employeeId = "";
            $scope.employerdepartmentId = "";
            $scope.employerbranchId = "";

            $scope.reportType = "employeewise";
            $("#searchModal").modal("hide");

            $scope.hideEntry = true;
        };
        $scope.onLoad_Clear();

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

        $scope.onLoad_MasterOneService = () => {

            var fromDate = moment($scope.fromDate).format("YYYY-MM-DD");
            var toDate = moment($scope.toDate).format("YYYY-MM-DD");

            let req = {
                method: 'POST',
                url: api_selectdata,
                data: {
                    "employerId": $scope._izemEmployerId,
                    fromDate: fromDate,
                    toDate: toDate,
                    employeeId: $scope.employeeId.toString(),
                    employerdepartmentId: $scope.employerdepartmentId.toString(),
                    employerbranchId: $scope.employerbranchId.toString()
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.tableParamsOne = res.data;
                        $scope.loaded = true;
                    }
                    else {
                        $scope.tableParamsOne = [];
                        $scope.loaded = false;
                    }
                }, (err) => {
                    console.log(err)
                });
        };
        $scope.onLoad_MasterOneService();

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.totalCount = res.count;
                            $scope.tableParams = res.data;
                            $scope.loaded1 = true;
                            $scope.hideEntry = false;
                        }
                        else {
                            $scope.totalCount = 0;
                            $scope.tableParams = [];
                            $scope.loaded1 = false;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_MasterService = (x) => {

            var dateMomentObject = moment(x, "DD/MM/YYYY");
            var dateObject = dateMomentObject.toDate();
            var date = moment(dateObject).format("YYYY-MM-DD");

            $scope._date = x;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    "employerId": $scope._izemEmployerId,
                    date: date,
                    employeeId: $scope.employeeId.toString(),
                    employerdepartmentId: $scope.employerdepartmentId.toString(),
                    employerbranchId: $scope.employerbranchId.toString(),
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };

        $scope.onClick_AddRecord = () => {
            $scope.hideEntry = false;
        };

        $scope.onClick_Submit = () => {
            try {

                let employerdepartmentId = $scope.employerdepartmentId;
                let employerdepartmentTitle = $scope.employerdepartmentTitle;
                let employerdepartmentIsActive = $scope.employerdepartmentIsActive;

                let req = {};
                if (employerdepartmentId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employerdepartmentId": employerdepartmentId,
                    "employerdepartmentTitle": employerdepartmentTitle,
                    "employerdepartmentIsActive": employerdepartmentIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerdepartmentId == 0)
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

        $scope.onClick_EditRecord = (x) => {
            try {

                let payrollAttendanceId = x.payrollAttendanceId;
                let payrollBasicSalary = x.payrollBasicSalaryRound4;
                let payrollNetSalary = x.payrollNetSalaryRound2;

                let req = {
                    method: 'POST',
                    url: api_UpdateManual,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "payrollAttendanceId": payrollAttendanceId,
                        "payrollBasicSalary": payrollBasicSalary,
                        "payrollNetSalary": payrollNetSalary
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            successMsg("Process", res.message);
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
                            "employerdepartmentId": id
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

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };
        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };
        $scope.onClick_SearchResult = () => {
            $scope.onLoad_MasterOneService();
        };
        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        $scope.onClick_BacktoMain = () => {
            try {
                $scope.hideEntry = true;
                $scope.onClick_SearchResult();
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

        excelEmployeewise = (data) => {
            try {

                let companyName = localStorage.getItem("_izemCompanyName");
                let companyAddress = localStorage.getItem("_izemAddress");

                let departmentList = [...new Set(data.map(x => x.employeeId))];

                let strstring = "";

                if (departmentList.length > 0) {
                    for (let i = 0; i < departmentList.length; i++) {
                        let filterDepartmentData = data.filter(x => x.employeeId == departmentList[i]);
                        if (filterDepartmentData.length > 0) {

                            strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Time period : " + moment($scope.fromDate).format("DD-MM-YYYY") + " To " + moment($scope.toDate).format("DD-MM-YYYY") + " </b></td></tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all' colspan='3' style = 'text-align: center;'><b> PAY TO </b></td>";
                            strstring += "<td x:autofilter='all' colspan='3' style = 'text-align: center;'><b> DAILY/HOURLY PAID WAGES VOUCHER </b></td>";
                            strstring += "</tr>";
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all' colspan='3'><b> Employee : " + filterDepartmentData[0].memberName + " </b></td>";
                            strstring += "<td x:autofilter='all'><b> NRIC : " + filterDepartmentData[0].memberNric + " </b></td>";
                            strstring += "<td x:autofilter='all'><b> Enroll No : " + filterDepartmentData[0].employeeEnroll + " </b></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "</tr>";
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all' colspan='3'><b> Email : " + filterDepartmentData[0].memberEmail + " </b></td>";
                            strstring += "<td x:autofilter='all'><b> Branch : " + filterDepartmentData[0].employerbranchName + " </b></td>";
                            strstring += "<td x:autofilter='all'><b> Department : " + filterDepartmentData[0].employerdepartmentTitle + " </b></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "</tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";

                            let netTotal = 0;

                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'><b> Date </b></td>";
                            strstring += "<td x:autofilter='all'><b> In-Time </b></td>";
                            strstring += "<td x:autofilter='all'><b> Out-Time </b></td>";
                            strstring += "<td x:autofilter='all'><b> Total Time </b></td>";
                            strstring += "<td x:autofilter='all'><b> Per Hour Rate </b></td>";
                            strstring += "<td x:autofilter='all'><b> Net Salary </b></td>";
                            strstring += "</tr>";

                            for (let k = 0; k < filterDepartmentData.length; k++) {
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollDateDDMMYYYY + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollInTimeDDMMYYYYHHMMSS + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollOutTimeDDMMYYYYHHMMSS + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].totalTime + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollBasicSalaryRound4 + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollNetSalaryRound4 + "</td>";
                                strstring += "</tr>";
                                netTotal += parseFloat(filterDepartmentData[k].payrollNetSalaryRound4);
                            }
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'><b> NET PAY </b></td>";
                            strstring += "<td x:autofilter='all'><b> " + netTotal + " </b></td>";
                            strstring += "</tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                            strstring += "<tr><td colspan = '6' x:autofilter='all' style = 'text-align: center;'> <b> ** computer generated voucher, no signature required ** </b> </td></tr>";
                            strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                        }
                    }

                    if (strstring != "") {
                        $("#tabledata").html("");
                        $("#tabledata").html(strstring);
                        tableToExcel('tabledata', 'Employee wise hourly report');
                    }
                    else {
                        warningMsg("Download", "No records found.");
                    }
                }
                else {
                    warningMsg("Download", "No records found.");
                }

            } catch (e) {
                console.log(e);
            }
        };

        excelPaymentmethod = (data) => {
            try {

                let companyName = localStorage.getItem("_izemCompanyName");
                let companyAddress = localStorage.getItem("_izemAddress");

                let departmentList = [...new Set(data.map(x => x.employeesalarysetupPaymentType))];

                let strstring = "";

                if (departmentList.length > 0) {
                    let grandTotal = 0;
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Time period : " + moment($scope.fromDate).format("DD-MM-YYYY") + " To " + moment($scope.toDate).format("DD-MM-YYYY") + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                    strstring += "<tr>";
                    strstring += "<td x:autofilter='all'><b> Employee Name </b></td>";
                    strstring += "<td x:autofilter='all'><b> Nric No </b></td>";
                    strstring += "<td x:autofilter='all'><b> Email </b></td>";
                    strstring += "<td x:autofilter='all'><b> Bank Name </b></td>";
                    strstring += "<td x:autofilter='all'><b> Account No </b></td>";
                    strstring += "<td x:autofilter='all'><b> Net-Pay </b></td>";
                    strstring += "</tr>";
                    for (let i = 0; i < departmentList.length; i++) {
                        let filterDepartmentData = data.filter(x => x.employeesalarysetupPaymentType == departmentList[i]);
                        if (filterDepartmentData.length > 0) {
                            let netTotal = 0;
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'><b> Payment Type : " + filterDepartmentData[0].employeesalarysetupPaymentType + "</b></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "</tr>";
                            for (let k = 0; k < filterDepartmentData.length; k++) {
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberName + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberNric + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberEmail + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberBankName + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberAccount + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollNetSalaryTotalRound4 + "</td>";
                                strstring += "</tr>";
                                netTotal += parseFloat(filterDepartmentData[k].payrollNetSalaryTotalRound4);
                            }
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'><b> Sub Total </b></td>";
                            strstring += "<td x:autofilter='all'><b>" + netTotal.toFixed(2) + "</b></td>";
                            strstring += "</tr>";
                            grandTotal += parseFloat(netTotal);
                        }
                    }
                    strstring += "<tr>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'><b> Grand Total </b></td>";
                    strstring += "<td x:autofilter='all'><b>" + grandTotal.toFixed(2) + "</b></td>";
                    strstring += "</tr>";

                    if (strstring != "") {
                        $("#tabledata").html("");
                        $("#tabledata").html(strstring);
                        tableToExcel('tabledata', 'Payment method hourly report');
                    }
                    else {
                        warningMsg("Download", "No records found.");
                    }
                }
                else {
                    warningMsg("Download", "No records found.");
                }

            } catch (e) {
                console.log(e);
            }
        };

        excelDepartmentwise = (data) => {
            try {

                let companyName = localStorage.getItem("_izemCompanyName");
                let companyAddress = localStorage.getItem("_izemAddress");

                let departmentList = [...new Set(data.map(x => x.employerdepartmentId))];

                let strstring = "";
                if (departmentList.length > 0) {
                    let grandTotal = 0;
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                    strstring += "<tr>";
                    strstring += "<td x:autofilter='all'><b> Date </b></td>";
                    strstring += "<td x:autofilter='all'><b> Name </b></td>";
                    strstring += "<td x:autofilter='all'><b> In-Time </b></td>";
                    strstring += "<td x:autofilter='all'><b> Out-Time </b></td>";
                    strstring += "<td x:autofilter='all'><b> Total-Time </b></td>";
                    strstring += "<td x:autofilter='all'><b> Hourly Rate </b></td>";
                    strstring += "<td x:autofilter='all'><b> Net Salary </b></td>";
                    strstring += "</tr>";
                    for (let i = 0; i < departmentList.length; i++) {
                        let filterDepartmentData = data.filter(x => x.employerdepartmentId == departmentList[i]);
                        if (filterDepartmentData.length > 0) {
                            let netTotal = 0;
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'><b>" + filterDepartmentData[0].employerdepartmentTitle + "</b></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "</tr>";
                            for (let k = 0; k < filterDepartmentData.length; k++) {
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollDateDDMMYYYY + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberName + "</td>";
                                if (filterDepartmentData[k].payrollInTimeDDMMYYYYHHMMSS != null)
                                    strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollInTimeDDMMYYYYHHMMSS + "</td>";
                                else
                                    strstring += "<td x:autofilter='all'></td>";
                                if (filterDepartmentData[k].payrollOutTimeDDMMYYYYHHMMSS != null)
                                    strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollOutTimeDDMMYYYYHHMMSS + "</td>";
                                else
                                    strstring += "<td x:autofilter='all'></td>";
                                if (filterDepartmentData[k].totalTime != null)
                                    strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].totalTime + "</td>";
                                else
                                    strstring += "<td x:autofilter='all'></td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollBasicSalaryRound4 + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollNetSalaryRound4 + "</td>";
                                strstring += "</tr>";
                                netTotal += parseFloat(filterDepartmentData[k].payrollNetSalaryRound4);
                            }
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'><b> Sub Total </b></td>";
                            strstring += "<td x:autofilter='all'><b>" + netTotal.toFixed(2) + "</b></td>";
                            strstring += "</tr>";
                            grandTotal += parseFloat(netTotal);
                        }
                    }
                    strstring += "<tr>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'></td>";
                    strstring += "<td x:autofilter='all'><b> Grand Total </b></td>";
                    strstring += "<td x:autofilter='all'><b>" + grandTotal.toFixed(2) + "</b></td>";
                    strstring += "</tr>";

                    if (strstring != "") {
                        $("#tabledata").html("");
                        $("#tabledata").html(strstring);
                        tableToExcel('tabledata', 'Deparment wise hourly report');
                    }
                    else {
                        warningMsg("Download", "No records found.");
                    }
                }
                else {
                    warningMsg("Download", "No records found.");
                }

            } catch (e) {
                console.log(e);
            }
        };

        excelBranchwise = (data) => {
            try {

                let companyName = localStorage.getItem("_izemCompanyName");
                let companyAddress = localStorage.getItem("_izemAddress");

                let departmentList = [...new Set(data.map(x => x.employerbranchId))];

                let strstring = "";
                if (departmentList.length > 0) {
                    let grandTotal = 0;
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                    strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                    strstring += "<tr>";
                    strstring += "<td x:autofilter='all'><b> Date </b></td>";
                    strstring += "<td x:autofilter='all'><b> Name </b></td>";
                    strstring += "<td x:autofilter='all'><b> In-Time </b></td>";
                    strstring += "<td x:autofilter='all'><b> Out-Time </b></td>";
                    strstring += "<td x:autofilter='all'><b> Total-Time </b></td>";
                    strstring += "<td x:autofilter='all'><b> Hourly Rate </b></td>";
                    strstring += "<td x:autofilter='all'><b> Net Salary </b></td>";
                    strstring += "</tr>";
                    for (let i = 0; i < departmentList.length; i++) {
                        let filterDepartmentData = data.filter(x => x.employerbranchId == departmentList[i]);
                        if (filterDepartmentData.length > 0) {
                            let netTotal = 0;
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'><b>" + filterDepartmentData[0].employerbranchName + "</b></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "</tr>";
                            for (let k = 0; k < filterDepartmentData.length; k++) {
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollDateDDMMYYYY + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].memberName + "</td>";
                                if (filterDepartmentData[k].payrollInTimeDDMMYYYYHHMMSS != null)
                                    strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollInTimeDDMMYYYYHHMMSS + "</td>";
                                else
                                    strstring += "<td x:autofilter='all'></td>";
                                if (filterDepartmentData[k].payrollOutTimeDDMMYYYYHHMMSS != null)
                                    strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollOutTimeDDMMYYYYHHMMSS + "</td>";
                                else
                                    strstring += "<td x:autofilter='all'></td>";
                                if (filterDepartmentData[k].totalTime != null)
                                    strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].totalTime + "</td>";
                                else
                                    strstring += "<td x:autofilter='all'></td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollBasicSalaryRound4 + "</td>";
                                strstring += "<td x:autofilter='all'>" + filterDepartmentData[k].payrollNetSalaryRound4 + "</td>";
                                strstring += "</tr>";
                                netTotal += parseFloat(filterDepartmentData[k].payrollNetSalaryRound4);
                            }
                            strstring += "<tr>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'></td>";
                            strstring += "<td x:autofilter='all'><b> Sub Total </b></td>";
                            strstring += "<td x:autofilter='all'><b>" + netTotal.toFixed(2) + "</b></td>";
                            strstring += "</tr>";
                            grandTotal += parseFloat(netTotal);
                        }
                        strstring += "<tr>";
                        strstring += "<td x:autofilter='all'></td>";
                        strstring += "<td x:autofilter='all'></td>";
                        strstring += "<td x:autofilter='all'></td>";
                        strstring += "<td x:autofilter='all'></td>";
                        strstring += "<td x:autofilter='all'></td>";
                        strstring += "<td x:autofilter='all'><b> Grand Total </b></td>";
                        strstring += "<td x:autofilter='all'><b>" + grandTotal.toFixed(2) + "</b></td>";
                        strstring += "</tr>";
                    }
                    if (strstring != "") {
                        $("#tabledata").html("");
                        $("#tabledata").html(strstring);
                        tableToExcel('tabledata', 'Branch wise hourly report');
                    }
                    else {
                        warningMsg("Download", "No records found.");
                    }
                }
                else {
                    warningMsg("Download", "No records found.");
                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_DownloadExcel = () => {
            try {

                var fromDate = moment($scope.fromDate).format("YYYY-MM-DD");
                var toDate = moment($scope.toDate).format("YYYY-MM-DD");

                let isPaymentMethod = false;
                if ($scope.excelReport == "paymentmethod")
                    isPaymentMethod = true;

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        fromDate: fromDate,
                        toDate: toDate,
                        employeeId: $scope.employeeId.toString(),
                        employerdepartmentId: $scope.employerdepartmentId.toString(),
                        employerbranchId: $scope.employerbranchId.toString(),
                        isPaymentMethod: isPaymentMethod
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            $("#searchModal").modal("hide");

                            if ($scope.excelReport == "employeewise") {
                                excelEmployeewise(obj);
                            }
                            if ($scope.excelReport == "paymentmethod") {
                                excelPaymentmethod(obj);
                            }
                            if ($scope.excelReport == "departmentwise") {
                                excelDepartmentwise(obj);
                            }
                            if ($scope.excelReport == "branchwise") {
                                excelBranchwise(obj);
                            }
                        }

                    }, (err) => {
                        console.log(err)
                    });


            } catch (e) {
                console.log(e);
            }
        };

        pdfEmployeewise = (data) => {
            try {

                if (data.length > 0) {
                    $("body").addClass("loading");
                    let hourlyData = JSON.stringify(data);

                    $http({
                        method: "POST",
                        url: "/employer/PayrollSetting/load_hourlyPayVoucherReport",
                        responseType: "blob",
                        data: {
                            "companyName": localStorage.getItem("_izemCompanyName"),
                            "reportTitle": "Daily/Hourly Paid Wages",
                            "hourlyData": hourlyData
                        }
                    }).then(function successCallback(response) {
                        var fileURL = URL.createObjectURL(response.data);
                        $("body").removeClass("loading");
                        window.open(fileURL, "PayVoucher.pdf");
                    }, function errorCallback(response) {
                        console.log(response);
                        $("body").removeClass("loading");
                    });
                }

            } catch (e) {
                console.log(e);
            }
        };

        pdfPaymentmethod = (data) => {
            try {

                if (data.length > 0) {
                    $("body").addClass("loading");
                    let hourlyData = JSON.stringify(data);

                    $http({
                        method: "POST",
                        url: "/employer/PayrollSetting/load_hourlyPaymentMethodReport",
                        responseType: "blob",
                        data: {
                            "companyName": localStorage.getItem("_izemCompanyName"),
                            "reportTitle": "Payment Method Report",
                            "timePeriod": moment($scope.fromDate).format("DD-MM-YYYY") + " to " + moment($scope.toDate).format("DD-MM-YYYY"),
                            "hourlyData": hourlyData
                        }
                    }).then(function successCallback(response) {
                        var fileURL = URL.createObjectURL(response.data);
                        $("body").removeClass("loading");
                        window.open(fileURL, "HourlyPaymentMethod.pdf");
                    }, function errorCallback(response) {
                        console.log(response);
                        $("body").removeClass("loading");
                    });
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_DownloadPDF = () => {
            try {

                var fromDate = moment($scope.fromDate).format("YYYY-MM-DD");
                var toDate = moment($scope.toDate).format("YYYY-MM-DD");

                let isPaymentMethod = false;
                if ($scope.pdfReport == "paymentmethod")
                    isPaymentMethod = true;

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        fromDate: fromDate,
                        toDate: toDate,
                        employeeId: $scope.employeeId.toString(),
                        employerdepartmentId: $scope.employerdepartmentId.toString(),
                        employerbranchId: $scope.employerbranchId.toString(),
                        isPaymentMethod: isPaymentMethod
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;

                            $("#searchModal").modal("hide");

                            if ($scope.pdfReport == "employeewise") {
                                pdfEmployeewise(obj);
                            }
                            if ($scope.pdfReport == "paymentmethod") {
                                pdfPaymentmethod(obj);
                            }
                        }

                    }, (err) => {
                        console.log(err)
                    });


            } catch (e) {
                console.log(e);
            }
        };

        //. Send Email
        $scope.onLoad_SendPayVoucher = (obj) => {

            alert("Process under exection, we send email via background process.");

            let hourlyData = JSON.stringify(obj);

            $http({
                method: "POST",
                url: "/employer/PayrollSetting/send_hourlyPayVoucherReport",
                responseType: "blob",
                data: {
                    "companyName": localStorage.getItem("_izemCompanyName"),
                    "reportTitle": "Daily/Hourly Paid Wages",
                    "hourlyData": hourlyData
                }
            });
        };

        $scope.onClick_SendEmail = () => {
            try {

                var fromDate = moment($scope.fromDate).format("YYYY-MM-DD");
                var toDate = moment($scope.toDate).format("YYYY-MM-DD");
                let isPaymentMethod = false;

                let req = {
                    method: 'POST',
                    url: api_reportAttendance,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        fromDate: fromDate,
                        toDate: toDate,
                        employeeId: $scope.employeeId.toString(),
                        employerdepartmentId: $scope.employerdepartmentId.toString(),
                        employerbranchId: $scope.employerbranchId.toString(),
                        isPaymentMethod: isPaymentMethod
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;
                            $scope.onLoad_SendPayVoucher(obj);
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //. Attendance Salary Process
        $scope.onClick_ExecuteAttendance = () => {
            try {

                let permission = customConfirm('This process override all the records.');
                if (permission == 'No')
                    return;

                var fromDate = moment($scope.fromDate).format("YYYY-MM-DD");
                var toDate = moment($scope.toDate).format("YYYY-MM-DD");

                let req = {
                    method: 'POST',
                    url: api_insertAttendanceSalaryProcess,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        fromDate: fromDate,
                        toDate: toDate,
                        employeeId: $scope.employeeId.toString()
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            successMsg("Process", res.message);
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);