
let api_payrollPayslipReport = backlink + "payroll/api/payroll/payroll_apiPayrollPayslipReport";
let api_SelectCountLeaveApplication = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiSelectCount";

let api_selectdatabyid = backlink + "employer/api/employee/employee_apiSelect";
let api_insertdata = backlink + "employer/api/employeeattendance/employeeattendance_apiInsert";


app.controller("member-dashboard-controller", ['$scope', '$window', 'httpService', '$http',
    function ($scope, $window, httpService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemEmployeeId = localStorage.getItem("_izemEmployeeId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.manualAttendance = "1";

        var date = new Date();
        $scope.periodFrom = new Date(date.getFullYear(), date.getMonth(), 1);

        //. onClick_GenerateReport
        $scope.onLoad_PrintPayslip = (salary, earning, deduction, leaveSummary) => {
            try {

                $("body").addClass("loading");

                let salaryData = JSON.stringify(salary);
                let earningData = JSON.stringify(earning);
                let deductionData = JSON.stringify(deduction);
                let leaveSummaryData = JSON.stringify(leaveSummary);

                const firstDay = moment($scope.periodFrom).startOf('month').format('DD-MM-YYYY');
                const lastDay = moment($scope.periodFrom).endOf('month').format('DD-MM-YYYY');

                $http({
                    method: "POST",
                    url: "/employer/PayrollSetting/load_payrollPayslipReport",
                    responseType: "blob",
                    data: {
                        "companyName": localStorage.getItem("_izemCompanyName"),
                        "companyAddress": localStorage.getItem("_izemAddress"),
                        "reportTitle": "PaySlip",
                        "firstDay": firstDay,
                        "lastDay": lastDay,
                        "salaryData": salaryData,
                        "earningData": earningData,
                        "deductionData": deductionData,
                        "leaveSummaryData": leaveSummaryData
                    }
                }).then(function successCallback(response) {
                    var fileURL = URL.createObjectURL(response.data);
                    $("body").removeClass("loading");
                    window.open(fileURL, "PayrollPayslipReport.pdf");
                }, function errorCallback(response) {
                    console.log(response);
                    $("body").removeClass("loading");
                });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.pdfPayslip = () => {
            try {

                let payrollMonth = moment($scope.periodFrom).format("MM");
                let payrollYear = moment($scope.periodFrom).format("YYYY");

                let employeeId = $scope._izemEmployeeId;
                let employerbranchId = [];
                let employerdepartmentId = [];
                let sortBy = "";

                let req = {
                    method: 'POST',
                    url: api_payrollPayslipReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportMonth": payrollMonth,
                        "reportYear": payrollYear,
                        "sortBy": sortBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let salary = res.data[0].salary;
                            let npl = res.data[0].npl;
                            let allowancendeduction = res.data[0].allowancendeduction;
                            let additionalpay = res.data[0].additionalpay;
                            let overtime = res.data[0].overtime;
                            let shift = res.data[0].shift;
                            let loan = res.data[0].loan;
                            let leavereport = res.data[0].leavereport;

                            let earningArray = [];
                            let deductionArray = [];

                            //! salary
                            if (salary.length > 0) {
                                for (let i = 0; i < salary.length; i++) {
                                    earningArray.push({
                                        "payrollsalaryId": salary[i].payrollsalaryId,
                                        "title": "Basic",
                                        "value": salary[i].payrollsalaryGeneratedRound2
                                    });
                                }
                            }
                            //! allowancendeduction
                            if (allowancendeduction.length > 0) {
                                for (let i = 0; i < allowancendeduction.length; i++) {
                                    let amount = parseFloat(allowancendeduction[i].payrollallowancendeductionAmount);

                                    if (amount > 0) {
                                        earningArray.push({
                                            "payrollsalaryId": allowancendeduction[i].payrollsalaryId,
                                            "title": allowancendeduction[i].employerallowanceDescription,
                                            "value": allowancendeduction[i].payrollallowancendeductionAmountRound2
                                        });
                                    }
                                    if (amount < 0) {
                                        deductionArray.push({
                                            "payrollsalaryId": allowancendeduction[i].payrollsalaryId,
                                            "title": allowancendeduction[i].employerallowanceDescription,
                                            "value": allowancendeduction[i].payrollallowancendeductionAmountRound2.replace("-", "")
                                        });
                                    }
                                }
                            }
                            //!overtime
                            if (overtime.length > 0) {
                                for (let i = 0; i < overtime.length; i++) {
                                    if (overtime[i].payrollovertimeUnit != 0) {
                                        earningArray.push({
                                            "payrollsalaryId": overtime[i].payrollsalaryId,
                                            "title": overtime[i].employerotsetupDescription + " (Rate RM " + overtime[i].payrollovertimeRateRound4 + " * " + overtime[i].payrollovertimeUnit + ")",
                                            "value": overtime[i].totalOverTimeRound2
                                        });
                                    }
                                }
                            }
                            //!additionalpay
                            if (additionalpay.length > 0) {
                                for (let i = 0; i < additionalpay.length; i++) {
                                    if (additionalpay[i].payrolladditionalpayUnit != 0) {
                                        earningArray.push({
                                            "payrollsalaryId": additionalpay[i].payrollsalaryId,
                                            "title": additionalpay[i].employeradditionalpaysetupDescription + " (Rate RM " + additionalpay[i].payrolladditionalpayRateRound4 + " * " + additionalpay[i].payrolladditionalpayUnit + ")",
                                            "value": additionalpay[i].totalAdditionalPayRound2
                                        });
                                    }
                                }
                            }
                            //!shift
                            if (shift.length > 0) {
                                for (let i = 0; i < shift.length; i++) {
                                    if (shift[i].payrollShiftUnit != 0) {
                                        earningArray.push({
                                            "payrollsalaryId": shift[i].payrollsalaryId,
                                            "title": shift[i].employershiftsetupDescription + " (Rate RM " + shift[i].payrollShiftRateRound4 + " * " + shift[i].payrollShiftUnit + ")",
                                            "value": shift[i].totalShiftRound2
                                        });
                                    }
                                }
                            }
                            //!npl
                            if (npl.length > 0) {
                                for (let i = 0; i < npl.length; i++) {
                                    let amount = parseFloat(npl[i].payrollNplHourUnit);
                                    let amount1 = parseFloat(npl[i].payrollNplDayUnit);
                                    if (amount != 0) {
                                        deductionArray.push({
                                            "payrollsalaryId": npl[i].payrollsalaryId,
                                            "title": "Unpaid Hour (RM " + npl[i].payrollNplHourRateRound4 + " * " + npl[i].payrollNplHourUnit + ")",
                                            "value": npl[i].totalHourRound2
                                        });
                                    }
                                    if (amount1 != 0) {
                                        deductionArray.push({
                                            "payrollsalaryId": npl[i].payrollsalaryId,
                                            "title": "Unpaid Day (RM " + npl[i].payrollNplDaysRateRound4 + " * " + npl[i].payrollNplDayUnit + ")",
                                            "value": npl[i].totalDayRound2
                                        });
                                    }
                                }
                            }
                            //!loan
                            if (loan.length > 0) {
                                for (let i = 0; i < loan.length; i++) {
                                    deductionArray.push({
                                        "payrollsalaryId": loan[i].payrollsalaryId,
                                        "title": loan[i].employeeloanNote,
                                        "value": loan[i].payrollloanAmountRound2
                                    });
                                }
                            }

                            /* earningArray and deductionArray empty */
                            if (deductionArray.length == 0) {
                                deductionArray.push({
                                    "payrollsalaryId": 0,
                                    "title": '',
                                    "value": 0
                                });
                            }
                            if (earningArray.length == 0) {
                                earningArray.push({
                                    "payrollsalaryId": 0,
                                    "title": "",
                                    "value": 0
                                });
                            }

                            $scope.onLoad_PrintPayslip(salary, earningArray, deductionArray, leavereport)

                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_GenerateReport = () => {
            try {
                if ($scope.Payslip == true) {
                    $scope.pdfPayslip();
                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_CountLeave = () => {

            try {

                let req = {
                    method: 'POST',
                    url: api_SelectCountLeaveApplication,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": $scope._izemEmployeeId,
                        "currentDate": moment(new Date()).format("YYYY-MM-01")
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.pending = res.data[0][0].cnt;
                            $scope.approved = res.data[1][0].cnt;
                            $scope.rejected = res.data[2][0].cnt;
                        }
                        else {
                            $scope.pending = 0;
                            $scope.approved = 0;
                            $scope.rejected = 0;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_CountLeave();

        $scope.onClick_ProfileDetail = () => {
            let req = {
                method: 'POST',
                url: api_selectdatabyid,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope._izemEmployeeId
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.employeeEnroll = res.data.employeeEnroll;
                        $scope.employerbranchlatitude = res.data.employerbranchlatitude;
                        $scope.employerbranchlongitude = res.data.employerbranchlongitude;
                        $scope.employerbranchrange = res.data.employerbranchrange;
                        $scope.employeeIsManualAttendance = res.data.employeeIsManualAttendance.data[0];
                    }
                }, (err) => {
                    console.log(err)
                });
        };
        $scope.onClick_ProfileDetail();

        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };

        //. Check Location

        $scope.insertInto = (x) => {

            let employeeattendanceId = 0;
            let employeeEnroll = $scope.employeeEnroll;
            let employeeattendanceStatus = x;
            let employeeattendanceEntryTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            let req = { method: 'POST', url: api_insertdata };

            let pera = {
                "employerId": $scope._izemEmployerId,
                "createdBy": $scope._izemSignupId,
                "employeeattendanceId": employeeattendanceId,
                "employeeEnroll": employeeEnroll,
                "employeeattendanceStatus": employeeattendanceStatus,
                "employeeattendanceEntryTime": employeeattendanceEntryTime,
                "isManual": true
            };

            req.data = pera;

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        successMsg('Insert',"Time Punch Recorded");
                    }
                }, (err) => {
                    console.log(err);
                });
        };

        $scope.onClick_ManualPunch = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    let lat = position.coords.latitude;
                    let long = position.coords.longitude;

                    $.get({
                        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=` + lat + `,` + long + `&sensor=false&key=AIzaSyAZRdO-mCris349AwnBdX-3AGNKTDaiQqU`, success(data) {
                            let x = data.results[1].formatted_address;

                            $scope.insertInto(x);
                        }
                    });

                });
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        };

    }]);
