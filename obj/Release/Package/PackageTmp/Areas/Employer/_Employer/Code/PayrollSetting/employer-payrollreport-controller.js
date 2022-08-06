
let api_selectdatabyid = backlink + "employer/api/employeedailyattendance/";
//. Reports
let api_payrollPayslipReport = backlink + "payroll/api/payroll/payroll_apiPayrollPayslipReport";
let api_payrollDetailReport = backlink + "payroll/api/payroll/payroll_apiPayrollDetailReport";
let api_payrollOvertimeReport = backlink + "payroll/api/payroll/payroll_apiPayrollOvertimeReport";
let api_payrollAdditionalPayReport = backlink + "payroll/api/payroll/payroll_apiPayrollAdditionalPayReport";
let api_payrollShiftReport = backlink + "payroll/api/payroll/payroll_apiPayrollShiftReport";
//. Payment Method and Gov. Report
let api_payrollGovReport = backlink + "payroll/api/payroll/payroll_apiPayrollGovReport";
let api_payrollGovCP38Report = backlink + "payroll/api/payroll/payroll_apiPayrollGovCP38Report";
let api_payrollBankReport = backlink + "payroll/api/payroll/payroll_apibankReport";

app.controller("employer-payrollreport-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        //. Rights
        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Payroll Report');
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

        $scope.reset = () => {

            $scope.sortBy = 'memberName';
            $scope.activeBy = '';

            var date = new Date();
            $scope.periodFrom = new Date(date.getFullYear(), date.getMonth(), 1);
            $scope.periodTo = new Date(date.getFullYear(), date.getMonth(), 1);

            $scope.employeeId = [];
            $scope.employerbranchId = [];
            $scope.employerdepartmentId = [];

            $scope.isPeriodTo = false;
        };
        $scope.reset();

        $scope.clearAll = () => {
            $scope.Payslip = false;
            $scope.PayslipDetails = false;
            $scope.PayslipDetailsDepartmentWise = false;
            $scope.PayslipDetailsBranchWise = false;
            $scope.BankReport = false;
            $scope.BankReportReport = false;
            $scope.OvertimeDetails = false;
            $scope.AdditionalPayDetails = false;
            $scope.ShiftDetails = false;
            //.
            $scope.KWSP_EPF_Form_A = false;
            $scope.KWSP_EPF_CSV_File = false;
            $scope.Perkeso_Socso_Form_A = false;
            $scope.Perkeso_Socso_Text_File = false;
            $scope.Perkeso_EIS_Form_A = false;
            $scope.Perkeso_EIS_Text_File = false;
            $scope.Income_Tax_Form_PCB39 = false;
            //.
            $scope.HRDF_CSV = false;
            $scope.HRDF_Form = false;
        };
        $scope.clearAll();

        $scope.Payslip = true;
        $scope.isPeriodTo = true;

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
        //. Section 1
        $scope.onCheck_Payslip = () => {
            try {
                $scope.clearAll();
                $scope.Payslip = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_PayslipDetails = () => {
            try {
                $scope.clearAll();
                $scope.PayslipDetails = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_PayslipDetailsDepartmentWise = () => {
            try {
                $scope.clearAll();
                $scope.PayslipDetailsDepartmentWise = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_PayslipDetailsBranchWise = () => {
            try {
                $scope.clearAll();
                $scope.PayslipDetailsBranchWise = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_PaymentMethodReport = () => {
            try {
                $scope.clearAll();
                $scope.PaymentMethodReport = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_BankReport = () => {
            try {
                $scope.clearAll();
                $scope.BankReport = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_OvertimeDetails = () => {
            try {
                $scope.clearAll();
                $scope.OvertimeDetails = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_AdditionalPayDetails = () => {
            try {
                $scope.clearAll();
                $scope.AdditionalPayDetails = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_ShiftDetails = () => {
            try {
                $scope.clearAll();
                $scope.ShiftDetails = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        //. Section 2
        $scope.onCheck_KWSP_EPF_Form_A = () => {
            try {
                $scope.clearAll();
                $scope.KWSP_EPF_Form_A = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_KWSP_EPF_CSV_File = () => {
            try {
                $scope.clearAll();
                $scope.KWSP_EPF_CSV_File = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_Perkeso_Socso_Form_A = () => {
            try {
                $scope.clearAll();
                $scope.Perkeso_Socso_Form_A = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_Perkeso_Socso_Text_File = () => {
            try {
                $scope.clearAll();
                $scope.Perkeso_Socso_Text_File = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_Perkeso_EIS_Form_A = () => {
            try {
                $scope.clearAll();
                $scope.Perkeso_EIS_Form_A = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_Perkeso_EIS_Text_File = () => {
            try {
                $scope.clearAll();
                $scope.Perkeso_EIS_Text_File = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_Income_Tax_Form_PCB39 = () => {
            try {
                $scope.clearAll();
                $scope.Income_Tax_Form_PCB39 = true;
                $scope.isPeriodTo = true;
            } catch (e) {
                console.log(e);
            }
        };
        //.Section 3
        $scope.onCheck_HRDF_CSV = () => {
            try {
                $scope.clearAll();
                $scope.HRDF_CSV = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };
        $scope.onCheck_HRDF_Form = () => {
            try {
                $scope.clearAll();
                $scope.HRDF_Form = true;
                $scope.isPeriodTo = false;
            } catch (e) {
                console.log(e);
            }
        };

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

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

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
                        "sortBy": sortBy,
                        "activeBy": activeBy
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

        $scope.onload_PrintPayrollDetail = (salaryArray, earningArray, deductionArray, reportType) => {
            try {

                $("body").addClass("loading");

                let salaryData = JSON.stringify(salaryArray);
                let earningData = JSON.stringify(earningArray);
                let deductionData = JSON.stringify(deductionArray);

                const firstDay = moment($scope.periodFrom).format('MMM-YYYY');
                const lastDay = moment($scope.periodTo).format('MMM-YYYY');

                $http({
                    method: "POST",
                    url: "/employer/PayrollSetting/load_payrollDetailReport",
                    responseType: "blob",
                    data: {
                        "companyName": localStorage.getItem("_izemCompanyName"),
                        "companyAddress": localStorage.getItem("_izemAddress"),
                        "reportTitle": "Payroll Detail Report",
                        "firstDay": firstDay,
                        "lastDay": lastDay,
                        "salaryData": salaryData,
                        "earningData": earningData,
                        "deductionData": deductionData,
                        "reportType": reportType
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
        $scope.pdfPayrollDetail = (reportType) => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollDetailReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let salary = res.data[0].salary;
                            let npl = res.data[0].npl;
                            if (npl.length > 0) {
                                for (let i = 0; i < npl.length; i++) {
                                    npl[i].totalPayrollNplDayUnit = npl[i].totalPayrollNplDayUnit.toString();
                                    npl[i].totalPayrollNplHourUnit = npl[i].totalPayrollNplHourUnit.toString();
                                }
                            }
                            let additionalpay = res.data[0].additionalpay;
                            let overtime = res.data[0].overtime;
                            let shift = res.data[0].shift;
                            let allowancendeduction = res.data[0].allowancendeduction;
                            let loan = res.data[0].loan;

                            let salaryArray = [];
                            let earningArray = [];
                            let deductionArray = [];

                            if (salary.length > 0) {
                                for (let i = 0; i < salary.length; i++) {
                                    let obj = {};

                                    obj.payrollsalaryId = salary[i].payrollsalaryId;
                                    obj.employerId = salary[i].employerId;
                                    obj.employeeId = salary[i].employeeId;
                                    obj.employeeName = salary[i].memberName;
                                    obj.memberNric = salary[i].memberNric;

                                    obj.employerbranchName = salary[i].employerbranchName;
                                    obj.employerdepartmentTitle = salary[i].employerdepartmentTitle;

                                    obj.totalPayrollsalaryBasicRound2 = salary[i].totalPayrollsalaryBasicRound2;
                                    obj.totalPayrollsalaryGrossRound2 = salary[i].totalPayrollsalaryGrossRound2;
                                    obj.totalPayrollsalaryNetRound2 = salary[i].totalPayrollsalaryNetRound2;
                                    obj.totalPayrollsalaryGeneratedRound2 = salary[i].totalPayrollsalaryGeneratedRound2;

                                    obj.totalPayrollstatutoryEISEmployeeRound2 = salary[i].totalPayrollstatutoryEISEmployeeRound2;
                                    obj.totalPayrollstatutoryEISEmployerRound2 = salary[i].totalPayrollstatutoryEISEmployerRound2;
                                    obj.totalPayrollstatutoryEpfEmployeeRound2 = salary[i].totalPayrollstatutoryEpfEmployeeRound2;
                                    obj.totalPayrollstatutoryEpfEmployerRound2 = salary[i].totalPayrollstatutoryEpfEmployerRound2;
                                    obj.totalPayrollstatutorySocsoEmployeeRound2 = salary[i].totalPayrollstatutorySocsoEmployeeRound2;
                                    obj.totalPayrollstatutorySocsoEmployerRound2 = salary[i].totalPayrollstatutorySocsoEmployerRound2;
                                    obj.totalPayrollstatutoryPcbEmployeeRound2 = salary[i].totalPayrollstatutoryPcbEmployeeRound2;
                                    obj.totalPayrollstatutoryPcbEmployerRound2 = salary[i].totalPayrollstatutoryPcbEmployerRound2;
                                    obj.totalPayrollstatutoryHrdfEmployeeRound2 = salary[i].totalPayrollstatutoryHrdfEmployeeRound2;
                                    obj.totalPayrollstatutoryHrdfEmployerRound2 = salary[i].totalPayrollstatutoryHrdfEmployerRound2;

                                    /* npl calculation */
                                    if (npl.length > 0) {
                                        var data = npl.filter(x => x.employeeId == obj.employeeId);
                                        if (data.length > 0) {
                                            obj.totalPayrollNplDayUnit = data[0].totalPayrollNplDayUnit;
                                            obj.totalPayrollNplHourUnit = data[0].totalPayrollNplHourUnit;
                                            obj.totalNPLRound2 = data[0].totalNPLRound2;
                                        }
                                        else {
                                            obj.totalPayrollNplDayUnit = 0.00;
                                            obj.totalPayrollNplHourUnit = 0.00;
                                            obj.totalNPLRound2 = "0.00";
                                        }
                                    } else {
                                        obj.totalPayrollNplDayUnit = 0.00;
                                        obj.totalPayrollNplHourUnit = 0.00;
                                        obj.totalNPLRound2 = "0.00";

                                    }

                                    /* additional calculation */
                                    if (additionalpay.length > 0) {
                                        var data = additionalpay.filter(x => x.employeeId == obj.employeeId);
                                        if (data.length > 0) {
                                            obj.totalPayrolladditionalpayUnit = data[0].totalPayrolladditionalpayUnit;
                                            obj.totalAdditionalPayRound2 = data[0].totalAdditionalPayRound2;
                                        } else {
                                            obj.totalPayrolladditionalpayUnit = 0.00;
                                            obj.totalAdditionalPayRound2 = 0.00;
                                        }
                                    }
                                    else {
                                        obj.totalPayrolladditionalpayUnit = 0.00;
                                        obj.totalAdditionalPayRound2 = 0.00;
                                    }

                                    /* overtime calculation */
                                    if (overtime.length > 0) {
                                        var data = overtime.filter(x => x.employeeId == obj.employeeId);
                                        if (data.length > 0) {
                                            obj.totalPayrollovertimeUnit = data[0].totalPayrollovertimeUnit;
                                            obj.totalOverTimeRound2 = data[0].totalOverTimeRound2;
                                        } else {
                                            obj.totalPayrollovertimeUnit = 0.00;
                                            obj.totalOverTimeRound2 = 0.00;
                                        }

                                    } else {
                                        obj.totalPayrollovertimeUnit = 0.00;
                                        obj.totalOverTimeRound2 = 0.00;
                                    }

                                    /* shift calculation */
                                    if (shift.length > 0) {
                                        var data = shift.filter(x => x.employeeId == obj.employeeId);
                                        if (data.length > 0) {
                                            obj.totalpayrollShiftUnit = data[0].totalpayrollShiftUnit;
                                            obj.totalShiftRound2 = data[0].totalShiftRound2;
                                        } else {
                                            obj.totalpayrollShiftUnit = 0.00;
                                            obj.totalShiftRound2 = 0.00;
                                        }
                                    } else {
                                        obj.totalpayrollShiftUnit = 0.00;
                                        obj.totalShiftRound2 = 0.00;
                                    }

                                    /* allowancen deduction calculation */
                                    if (allowancendeduction.length > 0) {
                                        var data = allowancendeduction.filter(x => x.employeeId == obj.employeeId);
                                        if (data.length > 0) {
                                            for (let ad = 0; ad < data.length; ad++) {
                                                if (data[ad].payrollallowancendeductionAmount > 0) {
                                                    let _otherEarning = {
                                                        employeeId: obj.employeeId,
                                                        employerbranchName: obj.employerbranchName,
                                                        employerdepartmentTitle: obj.employerdepartmentTitle,
                                                        payrollallowance: data[ad].totalPayrollallowancendeductionAmountRound2,
                                                        payrollallowanceKey: data[ad].employerallowanceCode
                                                    };

                                                    earningArray.push(_otherEarning);
                                                }
                                                if (data[ad].payrollallowancendeductionAmount < 0) {
                                                    let _otherDeduction = {
                                                        employeeId: obj.employeeId,
                                                        employerbranchName: obj.employerbranchName,
                                                        employerdepartmentTitle: obj.employerdepartmentTitle,
                                                        payrolldeduction: data[ad].totalPayrollallowancendeductionAmountRound2.toString().replace("-", ""),
                                                        payrolldeductionKey: data[ad].employerallowanceCode
                                                    };

                                                    deductionArray.push(_otherDeduction);
                                                }
                                            }
                                        }
                                    }

                                    /* loan calculation */
                                    if (loan.length > 0) {
                                        var data = loan.filter(x => x.employeeId == obj.employeeId);
                                        if (data.length > 0) {
                                            for (let ad = 0; ad < data.length; ad++) {
                                                let _otherDeduction = {
                                                    employeeId: obj.employeeId,
                                                    employerbranchName: obj.employerbranchName,
                                                    employerdepartmentTitle: obj.employerdepartmentTitle,
                                                    payrolldeduction: data[ad].totalPayrollloanAmountRound2,
                                                    payrolldeductionKey: data[ad].employeeloanNote
                                                };

                                                deductionArray.push(_otherDeduction);
                                            }
                                        }
                                    }
                                    salaryArray.push(obj);
                                }

                            }

                            if (earningArray.length == 0) {
                                let _otherEarning = {
                                    employeeId: 0,
                                    employerbranchName: '-',
                                    employerdepartmentTitle: '-',
                                    payrollallowance: 0,
                                    payrollallowanceKey: '-'
                                };
                                earningArray.push(_otherEarning);
                            }

                            if (deductionArray.length == 0) {
                                let _otherDeduction = {
                                    employeeId: 0,
                                    employerbranchName: '-',
                                    employerdepartmentTitle: '-',
                                    payrolldeduction: 0,
                                    payrolldeductionKey: '-'
                                };

                                deductionArray.push(_otherDeduction);
                            }

                            $scope.onload_PrintPayrollDetail(salaryArray, earningArray, deductionArray, reportType);
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfPayrollOvertimeDetails = () => {
            try {

                let payrollMonth = moment($scope.periodFrom).format("MM");
                let payrollYear = moment($scope.periodFrom).format("YYYY");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollOvertimeReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportMonth": payrollMonth,
                        "reportYear": payrollYear,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let data = res.data;
                            let payrollData = JSON.stringify(data);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollOvertimeReport",
                                responseType: "blob",
                                data: {
                                    "companyName": localStorage.getItem("_izemCompanyName"),
                                    "reportTitle": "Overtime Report",
                                    "timePeriod": moment($scope.periodFrom).format("MMM") + ", " + moment($scope.periodFrom).format("YYYY"),
                                    "payrollData": payrollData
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "PayrollOvertimeReport.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });

                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfPayrollAdditionalPayDetails = () => {
            try {

                let payrollMonth = moment($scope.periodFrom).format("MM");
                let payrollYear = moment($scope.periodFrom).format("YYYY");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollAdditionalPayReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportMonth": payrollMonth,
                        "reportYear": payrollYear,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let data = res.data;
                            let payrollData = JSON.stringify(data);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollAdditionalPayReport",
                                responseType: "blob",
                                data: {
                                    "companyName": localStorage.getItem("_izemCompanyName"),
                                    "reportTitle": "AdditionalPay Report",
                                    "timePeriod": moment($scope.periodFrom).format("MMM") + ", " + moment($scope.periodFrom).format("YYYY"),
                                    "payrollData": payrollData
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "PayrollAdditionalPayReport.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfPayrollShiftDetails = () => {
            try {

                let payrollMonth = moment($scope.periodFrom).format("MM");
                let payrollYear = moment($scope.periodFrom).format("YYYY");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollShiftReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportMonth": payrollMonth,
                        "reportYear": payrollYear,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let data = res.data;
                            let payrollData = JSON.stringify(data);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollShiftReport",
                                responseType: "blob",
                                data: {
                                    "companyName": localStorage.getItem("_izemCompanyName"),
                                    "reportTitle": "AdditionalPay Report",
                                    "timePeriod": moment($scope.periodFrom).format("MMM") + ", " + moment($scope.periodFrom).format("YYYY"),
                                    "payrollData": payrollData
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "PayrollShiftReport.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfPayrollMethodReport = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let obj = res.data[0].salary;
                            let payrollData = JSON.stringify(obj);

                            $("body").addClass("loading");

                            let startMonthYear = moment($scope.periodFrom).format("MMM") + ", " + moment($scope.periodFrom).format("YYYY");
                            let toMonthYear = moment($scope.periodTo).format("MMM") + ", " + moment($scope.periodTo).format("YYYY");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollPaymentMethodReport",
                                responseType: "blob",
                                data: {
                                    "companyName": localStorage.getItem("_izemCompanyName"),
                                    "reportTitle": "Payroll Payment Method Report",
                                    "timePeriod": startMonthYear + " to " + toMonthYear,
                                    "payrollData": payrollData
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "PayrollPaymentMethodReport.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });
            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfBankReport = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let req = {
                    method: 'POST',
                    url: api_payrollBankReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let data = res.data;

                            var strstring = "";
                            if (data.length > 0) {
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'><b> Beneficiary Name </b></td>";
                                strstring += "<td x:autofilter='all'><b> Beneficiary ID </b></td>";
                                strstring += "<td x:autofilter='all'><b> BNM Code </b></td>";
                                strstring += "<td x:autofilter='all'><b> Account Number </b></td>";
                                strstring += "<td x:autofilter='all'><b> Payment Amount </b></td>";
                                strstring += "<td x:autofilter='all'><b> Reference Number </b></td>";
                                strstring += "<td x:autofilter='all'><b> Payment Description </b></td>";
                                strstring += "<td x:autofilter='all'><b> Beneficiary Email Address </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < data.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + data[i].memberName + " </td>";
                                    if (data[i].memberNric == "")
                                        strstring += "<td x:autofilter='all'> " + data[i].memberPassport + " </td>";
                                    else
                                        strstring += "<td x:autofilter='all'> " + data[i].memberNric + " </td>";
                                    strstring += "<td x:autofilter='all'> " + data[i].memberBankCode + " </td>";
                                    strstring += "<td x:autofilter='all'> '" + data[i].memberAccount + " </td>";
                                    strstring += "<td x:autofilter='all'> " + data[i].payrollsalaryNetRound2 + " </td>";
                                    strstring += "<td x:autofilter='all'>  </td>";
                                    strstring += "<td x:autofilter='all'>  </td>";
                                    strstring += "<td x:autofilter='all'> " + data[i].memberEmail + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Bank Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                    }, (err) => {
                        console.log(err);
                    });


            } catch (e) {
                console.log(e);
            }
        };

        //. Gov. Report

        $scope.csvKWSP_EPF_CSV_File = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            var strstring = "";
                            if (obj.length > 0) {
                                strstring = "<tr>";
                                strstring += "<td x:autofilter='all'>Member</td>";
                                strstring += "<td x:autofilter='all'>Ic No.</td>";
                                strstring += "<td x:autofilter='all'>Name</td>";
                                strstring += "<td x:autofilter='all'>Salary</td>";
                                strstring += "<td x:autofilter='all'>Emp</td>";
                                strstring += "<td x:autofilter='all'>Employee</td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {
                                    if (obj[i].payrollstatutoryEpfEmployer != 0 || obj[i].payrollstatutoryEpfEmployee != 0) {
                                        strstring += '<tr>';
                                        strstring += '<td>' + obj[i].memberEPF + '</td>';
                                        strstring += '<td>' + obj[i].memberNric.toString().replaceAll("-", "") + '</td>';
                                        strstring += '<td>' + obj[i].memberName + '</td>';
                                        strstring += '<td>' + obj[i].payrollstatutoryEpfWagesRound0 + '</td>';
                                        strstring += '<td>' + obj[i].payrollstatutoryEpfEmployerRound0 + '</td>';
                                        strstring += '<td>' + obj[i].payrollstatutoryEpfEmployeeRound0 + '</td>';
                                        strstring += '</tr>';
                                    }
                                }
                            }
                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                export_table_to_csv("#tabledata", "EPF_Data.csv");
                            }
                            else {
                                toastr.warning("No Data Selected!");
                            }
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });
            } catch (e) {
                console.log(e);
            }
        };

        $scope.textPerkeso_Socso_Text_File = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": "",
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let objFilter = obj.filter(x => x.payrollstatutorySocsoEmployer_sum != 0 || x.payrollstatutorySocsoEmployee_sum != 0);

                            let _objFilter = JSON.stringify(objFilter);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollTextPerkeso_Socso_Report",
                                responseType: "blob",
                                data: {
                                    "payrollYear": moment($scope.periodFrom).format("YYYY"),
                                    "payrollMonth": moment($scope.periodFrom).format("MM"),
                                    "objFilter": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                let link = document.createElement('a');

                                link.href = window.URL.createObjectURL(response.data);

                                link.download = 'Socso_Data.txt';
                                document.body.appendChild(link);
                                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                                link.remove();
                                window.URL.revokeObjectURL(link.href);

                                $("body").removeClass("loading");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });


                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.textPerkeso_EIS_Text_File = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": "",
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let objFilter = obj.filter(x => x.payrollstatutoryEISEmployeeRound2 != "0.00" || x.payrollstatutoryEISEmployerRound2 != "0.00")

                            let _objFilter = JSON.stringify(objFilter);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollTextPerkeso_Eis_Report",
                                responseType: "blob",
                                data: {
                                    "payrollYear": moment($scope.periodFrom).format("YYYY"),
                                    "payrollMonth": moment($scope.periodFrom).format("MM"),
                                    "objFilter": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                let link = document.createElement('a');

                                link.href = window.URL.createObjectURL(response.data);

                                link.download = 'EIS_Data.txt';
                                document.body.appendChild(link);
                                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                                link.remove();
                                window.URL.revokeObjectURL(link.href);

                                $("body").removeClass("loading");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });


                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfKWSP_EPF_Form_A = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let objFilter = obj.filter(x => x.totalPayrollstatutoryEpfEmployeeRound2 != "0.00" || x.totalPayrollstatutoryEpfEmployerRound2 != "0.00")

                            let _objFilter = JSON.stringify(objFilter);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            let _a = moment($scope.periodFrom).add(1, 'M').format('DD-MM-YYYY');
                            let valueDate = moment(_a).format("MM/YYYY");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollKWSP_EPF_FormA",
                                responseType: "blob",
                                data: {
                                    "timePeriod": valueDate,
                                    "objFilter": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "KWSP_EPF_FormA.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfPerkeso_Socso_Form_A = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let objFilter = obj.filter(x => x.payrollstatutorySocsoEmployeeRound2 != "0.00" || x.payrollstatutorySocsoEmployerRound2 != "0.00")

                            let _objFilter = JSON.stringify(objFilter);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollPerkeso_Socso_Form_A",
                                responseType: "blob",
                                data: {
                                    "month": moment($scope.periodFrom).format("MM"),
                                    "year": moment($scope.periodFrom).format("YYYY"),
                                    "objFilter": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "Perkeso_Socso_FormA.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfPerkeso_EIS_Form_A = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let objFilter = obj.filter(x => x.payrollstatutoryEISEmployeeRound2 != "0.00" || x.payrollstatutoryEISEmployerRound2 != "0.00")

                            let _objFilter = JSON.stringify(objFilter);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollPerkeso_EIS_Form_A",
                                responseType: "blob",
                                data: {
                                    "month": moment($scope.periodFrom).format("MM"),
                                    "year": moment($scope.periodFrom).format("YYYY"),
                                    "objFilter": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "Perkeso_Eis_FormA.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfIncome_Tax_Form_PCB39 = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovCP38Report,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": "",
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let _objFilter = JSON.stringify(obj);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payrollIncome_Tax_Form_PCB39",
                                responseType: "blob",
                                data: {
                                    "companyName": localStorage.getItem("_izemCompanyName"),
                                    "companyAddress": localStorage.getItem("_izemAddress"),
                                    "month": moment($scope.periodFrom).format("MM"),
                                    "year": moment($scope.periodFrom).format("YYYY"),
                                    "obj": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "Perkeso_Eis_FormA.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //. HRDF

        $scope.csvHRDF_CSV = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            var strstring = "";
                            if (obj.length > 0) {
                                strstring = "<tr>";
                                strstring += "<td x:autofilter='all'>Member</td>";
                                strstring += "<td x:autofilter='all'>Ic No.</td>";
                                strstring += "<td x:autofilter='all'>Name</td>";
                                strstring += "<td x:autofilter='all'>Salary</td>";
                                strstring += "<td x:autofilter='all'>Emp</td>";
                                strstring += "<td x:autofilter='all'>Employee</td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {
                                    if (obj[i].payrollstatutoryHrdfEmployer != 0 || obj[i].payrollstatutoryHrdfEmployee != 0) {
                                        strstring += '<tr>';
                                        strstring += '<td>' + obj[i].memberOther + '</td>';
                                        strstring += '<td>' + obj[i].memberNric.toString().replaceAll("-", "") + '</td>';
                                        strstring += '<td>' + obj[i].memberName + '</td>';
                                        strstring += '<td>' + obj[i].payrollstatutoryHrdfWagesRound2 + '</td>';
                                        strstring += '<td>' + obj[i].payrollstatutoryHrdfEmployerRound2 + '</td>';
                                        strstring += '<td>' + obj[i].payrollstatutoryHrdfEmployeeRound2 + '</td>';
                                        strstring += '</tr>';
                                    }
                                }
                            }
                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                export_table_to_csv("#tabledata", "HRDF_Data.csv");
                            }
                            else {
                                toastr.warning("No Data Selected!");
                            }
                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.pdfHRDF_Form = () => {
            try {

                let reportStartMonth = moment($scope.periodFrom).format("YYYY-MM-01");
                let reportToMonth = moment($scope.periodTo).format("YYYY-MM-01");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

                let req = {
                    method: 'POST',
                    url: api_payrollGovReport,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeIds": employeeId.toString(),
                        "employerbranchIds": employerbranchId.toString(),
                        "employerdepartmentIds": employerdepartmentId.toString(),
                        "reportStartMonth": reportStartMonth,
                        "reportToMonth": reportToMonth,
                        "sortBy": sortBy,
                        "activeBy": activeBy
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data[0].salary;
                            let objSetting = res.data[0].salarySetting;

                            let objFilter = obj.filter(x => x.totalPayrollstatutoryHrdfEmployeeRound2 != "0.00" || x.totalPayrollstatutoryHrdfEmployerRound2 != "0.00")

                            let _objFilter = JSON.stringify(objFilter);
                            let _objSetting = JSON.stringify(objSetting);

                            $("body").addClass("loading");

                            let _a = moment($scope.periodFrom).add(1, 'M').format('DD-MM-YYYY');
                            let valueDate = moment(_a).format("MM/YYYY");

                            $http({
                                method: "POST",
                                url: "/employer/PayrollSetting/load_payroll_HRDF_Form",
                                responseType: "blob",
                                data: {
                                    "timePeriod": valueDate,
                                    "companyName": localStorage.getItem("_izemCompanyName"),
                                    "objFilter": _objFilter,
                                    "objSetting": _objSetting
                                }
                            }).then(function successCallback(response) {
                                var fileURL = URL.createObjectURL(response.data);
                                $("body").removeClass("loading");
                                window.open(fileURL, "HRDF_FormA.pdf");
                            }, function errorCallback(response) {
                                console.log(response);
                                $("body").removeClass("loading");
                            });
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
                if ($scope.PayslipDetails == true) {
                    $scope.pdfPayrollDetail('Normal');
                }
                if ($scope.PayslipDetailsDepartmentWise == true) {
                    $scope.pdfPayrollDetail('Department');
                }
                if ($scope.PayslipDetailsBranchWise == true) {
                    $scope.pdfPayrollDetail('Branch');
                }
                if ($scope.OvertimeDetails == true) {
                    $scope.pdfPayrollOvertimeDetails();
                }
                if ($scope.AdditionalPayDetails == true) {
                    $scope.pdfPayrollAdditionalPayDetails();
                }
                if ($scope.ShiftDetails == true) {
                    $scope.pdfPayrollShiftDetails();
                }
                if ($scope.PaymentMethodReport == true) {
                    $scope.pdfPayrollMethodReport();
                }
                if ($scope.BankReport == true) {
                    $scope.pdfBankReport();
                }
                //.
                if ($scope.KWSP_EPF_Form_A == true) {
                    $scope.pdfKWSP_EPF_Form_A();
                }
                if ($scope.KWSP_EPF_CSV_File == true) {
                    $scope.csvKWSP_EPF_CSV_File();
                }
                if ($scope.Perkeso_Socso_Form_A == true) {
                    $scope.pdfPerkeso_Socso_Form_A();
                }
                if ($scope.Perkeso_Socso_Text_File == true) {
                    $scope.textPerkeso_Socso_Text_File();
                }
                if ($scope.Perkeso_EIS_Form_A == true) {
                    $scope.pdfPerkeso_EIS_Form_A();
                }
                if ($scope.Perkeso_EIS_Text_File == true) {
                    $scope.textPerkeso_EIS_Text_File();
                }
                if ($scope.Income_Tax_Form_PCB39 == true) {
                    $scope.pdfIncome_Tax_Form_PCB39();
                }
                //.
                if ($scope.HRDF_CSV == true) {
                    $scope.csvHRDF_CSV();
                }
                if ($scope.HRDF_Form == true) {
                    $scope.pdfHRDF_Form();
                }

            } catch (e) {
                console.log(e);
            }
        };

        //. Send Email
        $scope.onLoad_SendPayslip = (salary, earning, deduction, leaveSummary) => {
            try {

                let salaryData = JSON.stringify(salary);
                let earningData = JSON.stringify(earning);
                let deductionData = JSON.stringify(deduction);
                let leaveSummaryData = JSON.stringify(leaveSummary);

                const firstDay = moment($scope.periodFrom).startOf('month').format('DD-MM-YYYY');
                const lastDay = moment($scope.periodFrom).endOf('month').format('DD-MM-YYYY');

                $http({
                    method: "POST",
                    url: "/employer/PayrollSetting/send_payrollPayslipReport",
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
                });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onClick_SendEmail = () => {
            try {

                alert("Process under exection, we send email via background process.");

                let payrollMonth = moment($scope.periodFrom).format("MM");
                let payrollYear = moment($scope.periodFrom).format("YYYY");

                let employeeId = $scope.employeeId;
                let employerbranchId = $scope.employerbranchId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let sortBy = $scope.sortBy;
                let activeBy = $scope.activeBy;

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
                        "sortBy": sortBy,
                        "activeBy": activeBy
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
                                    if (amount != 0) {
                                        deductionArray.push({
                                            "payrollsalaryId": npl[i].payrollsalaryId,
                                            "title": "Unpaid Hour (RM " + npl[i].payrollNplHourRateRound4 + " * " + npl[i].payrollNplHourUnit + ")",
                                            "value": npl[i].totalHourRound2
                                        });
                                    }
                                    if (amount != 0) {
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

                            $scope.onLoad_SendPayslip(salary, earningArray, deductionArray, leavereport)

                        }
                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };
    }]);