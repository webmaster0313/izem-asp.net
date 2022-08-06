let api_selectdatabyid = backlink + "payroll/api/payroll/payroll_apiSelect";
let api_filltabledata = backlink + "payroll/api/payroll/payroll_apiSelectAll";
let api_insertdata = backlink + "payroll/api/payroll/payroll_apiInsert";
let api_updatedata = backlink + "payroll/api/payroll/payroll_apiUpdate";
let api_deletedata = backlink + "payroll/api/payroll/payroll_apiDeleteAll";
let api_salaryProcessExection = backlink + "payroll/api/payroll/payroll_apiSalaryProcessExection";
let api_salaryProcessRecalculation = backlink + "payroll/api/payroll/payroll_apiSalaryProcessRecalculation";
let api_salaryInsertProcessExection = backlink + "payroll/api/payroll/payroll_apiSalaryInsertProcessExection";
let api_salaryDownloadData = backlink + "payroll/api/payroll/payroll_apiExportSalary";

let api_salaryUploadSalary = backlink + "payroll/api/payroll/payroll_apiUploadSalary";
let api_salaryLockedSalary = backlink + "payroll/api/payroll/payroll_apiLockedSalary";

let api_filltabledata_salary = backlink + "payroll/api/payrollsalary/payrollsalary_apiSelectAll";
let api_filltabledata_salarydetail = backlink + "payroll/api/payrollsalary/payrollsalary_apiSelectAll_Detail";

let api_filltabledata_employee = backlink + "employer/api/employee/employee_apiSelectAll";

let api_deletedata_payrollallowancendeduction = backlink + "payroll/api/payrollallowancendeduction/payrollallowancendeduction_apiDelete";

app.controller("employer-payrollprocess-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Payroll');
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

        $scope.isMasterList = true;
        $scope.isSubMasterList = false;
        $scope.isSubMasterListDetail = false;
        $scope.loaded = false;

        $scope.onLoad_ClearAll = (x) => {
            try {

                $scope.isShowDepartment = false;
                $scope.isShowBranch = false;

                if (x == 0) {
                    var date = new Date();
                    $scope.processDate = new Date(date.getFullYear(), date.getMonth(), 1);
                }
                $scope.salaryProcessType = "all";

                $scope.SearchEmployerdepartmentId = "";
                $scope.SearchEmployerbranchId = "";

                $scope._SearchEmployeeId = "";
                $scope._SearchEmployerdepartmentId = "";
                $scope._SearchEmployerbranchId = "";
                $scope._sortBy = "memberName";

                $scope.confirmPassword = "";
                $scope._unlockPayrollId = "";
                $scope._unlockflag = "";

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_ClearAll(0);

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.payrollData = res.data;
                        }
                        else {
                            $scope.payrollData = [];
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_MasterService = () => {

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "payrollDate": moment($scope.processDate).format("YYYY-MM-01"),
                    "employerId": $scope._izemEmployerId,
                    pageSize: 'all'
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onLoad_Branch = () => {

            try {

                httpCommonService.fill_employee_branch()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_SearchEmployerbranchId = res.data;
                            $scope._fill_SearchEmployerbranchId = res.data;
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
                            $scope._fill_SearchEmployerdepartmentId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Department();

        $scope.onLoad_Employee = () => {

            try {

                httpCommonService.fill_employee()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope._fill_SearchEmployeeId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Employee();

        $scope.onLoad_EmployeeService = () => {
            let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;
            let SearchEmployerbranchId = $scope.SearchEmployerbranchId;

            let req = {
                method: 'POST',
                url: api_filltabledata_employee,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "SearchEmployerbranchId": SearchEmployerbranchId,
                    "SearchEmployerdepartmentId": SearchEmployerdepartmentId,
                    "SearchEmployeeIsActive": 'all',
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.tableParams_Employee = res.data;
                    }
                }, (err) => {
                    console.log(err)
                });
        };
        $scope.onLoad_EmployeeService();

        $scope.onChange_SelectionType = () => {
            try {
                $scope.onLoad_EmployeeService();
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChange_SalaryProcessType = () => {
            try {

                $scope.isShowDepartment = false;
                $scope.isShowBranch = false;

                $scope.SearchEmployerdepartmentId = "";
                $scope.SearchEmployerbranchId = "";

                if ($scope.salaryProcessType == 'employeewise') {
                    $scope.onLoad_EmployeeService();
                    $("#employeeListModal").modal("show");
                }

                if ($scope.salaryProcessType == 'departmentwise') {
                    $scope.isShowDepartment = true;

                    $scope.onLoad_EmployeeService();
                    $("#employeeListModal").modal("show");
                }
                if ($scope.salaryProcessType == 'branchwise') {
                    $scope.isShowBranch = true;

                    $scope.onLoad_EmployeeService();
                    $("#employeeListModal").modal("show");
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.toggleAll = () => {
            let value = false;
            if ($scope.masterCheckBox == true)
                value = true;
            else
                value = false;

            for (var i = 0; i < $scope.tableParams_Employee.length; i++) {
                $scope.tableParams_Employee[i].flag = value;
            }
        };

        $scope.onClick_EmployeeListModalClose = () => {
            $("#employeeListModal").modal("hide");

            $scope.salaryProcessType = "all";
            $scope.onChange_SalaryProcessType();
        };

        $scope.onClick_RemovePayroll = (x) => {
            try {

                let permission = customConfirm('Are you sure, You want remove the salary records?');
                if (permission == 'No')
                    return;

                let req = {
                    method: 'POST',
                    url: api_deletedata,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "payrollId": x,
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            deleteMsg();
                            $scope.onLoad_MasterService();
                        }

                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });
            } catch (e) {
                console.log(e);
            }
        };

        //. Execution process

        $scope.onClick_CheckDate = () => {
            console.log($scope.processDate);
        };

        SalaryProcessExection = (type) => {
            try {

                if ($scope.processDate == undefined) {
                    alert("Please provide valid process date!");
                }

                let employeeList = [];
                var firstDay = moment($scope.processDate).format("YYYY-MM-01");
                var payrollYear = moment($scope.processDate).format("YYYY");
                var payrollMonth = moment($scope.processDate).format("MM");

                let data = $scope.tableParams_Employee.filter(x => x.flag === true);
                if (data.length > 0)
                    employeeList = data.map(x => x.employeeId);
                else
                    employeeList = $scope.tableParams_Employee.map(x => x.employeeId);

                let req = {
                    method: 'POST',
                    url: api_salaryProcessExection,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        employeeWise: employeeList.toString(),
                        payrollDate: firstDay,
                        payrollMonth: payrollMonth,
                        payrollYear: payrollYear,
                        processType: type
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (res.message == "Salary exection stoped, Month is locked!")
                                warningMsg("Warning", res.message);
                            $scope.onLoad_MasterService();
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SalaryProcessExection = () => {
            try {

                let permission = customConfirm('Are you sure, You want to continue?');
                if (permission == 'No')
                    return;

                let Year = moment($scope.processDate).format("YYYY");
                let Month = moment($scope.processDate).format("MM");

                let req = {
                    method: 'POST',
                    url: api_selectdatabyid,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "payrollYear": Year,
                        "payrollMonth": Month
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let value = salaryConfirm();
                            if (value == 'Yes') {
                                successMsg("Process", "Salary process under execution!");
                                SalaryProcessExection("override");

                                $scope.onClick_EmployeeListModalClose();
                            }
                        }
                        else {
                            successMsg("Process", "Salary process under execution!");
                            SalaryProcessExection("override");

                            $scope.onClick_EmployeeListModalClose();
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //. Salary employe summary list

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.pageChanged = () => {
            $scope.onClick_ShowSalaryDetail($scope.payrollId, $scope._dateClicked, $scope._isLocked);
        };

        $scope.changePageSize = () => {
            $scope.pageIndex = 1;
            $scope.onClick_ShowSalaryDetail($scope.payrollId, $scope._dateClicked, $scope._isLocked);
        };

        $scope.onClick_ShowSalaryDetail = (payrollId, date, isLocked) => {
            try {

                let SearchEmployeeId = $scope._SearchEmployeeId;
                let SearchEmployerdepartmentId = $scope._SearchEmployerdepartmentId;
                let SearchEmployerbranchId = $scope._SearchEmployerbranchId;
                let SortBy = $scope._sortBy;

                $scope.payrollId = payrollId;
                $scope._dateClicked = date;
                $scope._isLocked = isLocked;

                $scope.displayDate = moment(date).format("MMM, YYYY");

                let req = {
                    method: 'POST',
                    url: api_filltabledata_salary,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": SearchEmployeeId,
                        "SearchEmployerdepartmentId": SearchEmployerdepartmentId,
                        "SearchEmployerbranchId": SearchEmployerbranchId,
                        "SortBy": SortBy,
                        "payrollId": payrollId,
                        pageIndex: $scope.pageIndex,
                        pageSize: $scope.pageSizeSelected
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.totalCount = res.count;
                            $scope.tableParams = res.data;
                            $scope.loaded = true;

                            $scope.isMasterList = false;
                            $scope.isSubMasterList = true;
                            $scope.isSubMasterListDetail = false;
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

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };

        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };

        $scope.onClick_SearchResult = () => {
            $scope.onClick_ShowSalaryDetail($scope.payrollId, $scope._dateClicked, $scope._isLocked);
        };

        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_ClearAll(0);
            $scope.onClick_ShowSalaryDetail($scope.payrollId, $scope._dateClicked, $scope._isLocked);
        };

        $scope.onClick_Backtomain = () => {
            $scope.isMasterList = true;
            $scope.isSubMasterList = false;
            $scope.isSubMasterListDetail = false;

            $scope.onLoad_ClearAll(1);
            $scope.onLoad_MasterService();
        };

        //. Salary details

        $scope.onClick_ShowSalaryListDetail = (x) => {
            try {

                $scope.payrollsalaryId = x.payrollsalaryId;
                $scope.employeeId = x.employeeId;

                let req = {
                    method: 'POST',
                    url: api_filltabledata_salarydetail,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "payrollsalaryId": $scope.payrollsalaryId,
                        "employeeId": $scope.employeeId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let PayrollSalary = res.data.PayrollSalary;
                            let PayrollStatutory = res.data.PayrollStatutory;
                            let PayrollNPL = res.data.PayrollNPL;
                            let PayrollAdditionalPay = res.data.payrollAdditionalpay;
                            let PayrollOvertime = res.data.payrollOvertime;
                            let PayrollShift = res.data.payrollShift;
                            let PayrollLoan = res.data.payrollLoan;
                            let PayrollAllowancenDeduction = res.data.payrollAllowancenDeduction;

                            //. Payroll Salary
                            if (PayrollSalary.length > 0) {
                                $scope.memberName = PayrollSalary[0].memberName;
                                $scope.basicpay = PayrollSalary[0].payrollsalaryBasicRound4;
                                $scope.generated = PayrollSalary[0].payrollsalaryGeneratedRound4;
                                $scope.grosspay = PayrollSalary[0].payrollsalaryGrossRound4;
                                $scope.netpay = PayrollSalary[0].payrollsalaryNetRound4;
                                $scope.paymentType = PayrollSalary[0].employeesalarysetupPaymentRate;
                                $scope.payrollsalaryWorkingDay = PayrollSalary[0].payrollsalaryWorkingDay;
                                $scope._statutoryManualUpdate = PayrollSalary[0].payrollIsStatutory == 1 ? true : false;
                                $scope._otherManualUpdate = PayrollSalary[0].payrollIsPaidLeave == 1 ? true : false;
                            }

                            //. Payroll Statutory
                            if (PayrollStatutory.length > 0) {
                                $scope.epfWages = PayrollStatutory[0].payrollstatutoryEpfWagesRound4;
                                $scope.epfEmployee = PayrollStatutory[0].payrollstatutoryEpfEmployeeRound4;
                                $scope.epfEmployer = PayrollStatutory[0].payrollstatutoryEpfEmployerRound4;

                                $scope.socsoWages = PayrollStatutory[0].payrollstatutorySocsoWagesRound4;
                                $scope.socsoEmployee = PayrollStatutory[0].payrollstatutorySocsoEmployeeRound4;
                                $scope.socsoEmployer = PayrollStatutory[0].payrollstatutorySocsoEmployerRound4;

                                $scope.esiWages = PayrollStatutory[0].payrollstatutoryEISWagesRound4;
                                $scope.esiEmployee = PayrollStatutory[0].payrollstatutoryEISEmployeeRound4;
                                $scope.esiEmployer = PayrollStatutory[0].payrollstatutoryEISEmployerRound4;

                                $scope.pcbEmployee = PayrollStatutory[0].payrollstatutoryPcbEmployeeRound4;

                                $scope.hrdfWages = PayrollStatutory[0].payrollstatutoryHrdfWagesRound4;
                                $scope.hrdfEmployee = PayrollStatutory[0].payrollstatutoryHrdfEmployeeRound4;
                                $scope.hrdfEmployer = PayrollStatutory[0].payrollstatutoryHrdfEmployerRound4;
                            }

                            //. Payroll NPL
                            if (PayrollNPL.length > 0) {
                                $scope.nplDays = PayrollNPL[0].payrollNplDaysRateRound4;
                                $scope.nplHours = PayrollNPL[0].payrollNplHourRateRound4;
                                $scope.nplDaysUnit = PayrollNPL[0].payrollNplDayUnit;
                                $scope.nplHoursUnit = PayrollNPL[0].payrollNplHourUnit;
                            }

                            $scope.PayrollAdditionalPayMaster = PayrollAdditionalPay;
                            $scope.PayrollOvertimeMaster = PayrollOvertime;
                            $scope.PayrollShiftMaster = PayrollShift;

                            $scope.AllowanceMaster = [];
                            if (PayrollAllowancenDeduction.length > 0) {
                                for (let i = 0; i < PayrollAllowancenDeduction.length; i++) {
                                    $scope.AllowanceMaster.push({
                                        payrollallowancendeductionId: PayrollAllowancenDeduction[i].payrollallowancendeductionId,
                                        employerallowanceId: PayrollAllowancenDeduction[i].employerallowanceId,
                                        Description: PayrollAllowancenDeduction[i].employerallowanceCode,
                                        Amount: PayrollAllowancenDeduction[i].payrollallowancendeductionAmountRound4,
                                        employerallowanceEpf: PayrollAllowancenDeduction[i].employerallowanceEpf,
                                        employerallowanceSocso: PayrollAllowancenDeduction[i].employerallowanceSocso,
                                        employerallowancePCB: PayrollAllowancenDeduction[i].employerallowancePCB,
                                        employerallowanceEIS: PayrollAllowancenDeduction[i].employerallowanceEIS,
                                        employerallowanceNPL: PayrollAllowancenDeduction[i].employerallowanceNPL,
                                        employerallowanceCP8A: PayrollAllowancenDeduction[i].employerallowanceCP8A,
                                        employerallowanceCP22A: PayrollAllowancenDeduction[i].employerallowanceCP22A,
                                        employerallowanceCP38Tax: PayrollAllowancenDeduction[i].employerallowanceCP38Tax,
                                        employerallowanceShift: PayrollAllowancenDeduction[i].employerallowanceShift,
                                        employerallowanceAddPay: PayrollAllowancenDeduction[i].employerallowanceAddPay,
                                        employerallowancePTPTN: PayrollAllowancenDeduction[i].employerallowancePTPTN,
                                        employerallowanceZakat: PayrollAllowancenDeduction[i].employerallowanceZakat,
                                        employerallowanceTabungHaji: PayrollAllowancenDeduction[i].employerallowanceTabungHaji,
                                        employerallowanceHRDF: PayrollAllowancenDeduction[i].employerallowanceHRDF,
                                        isLoanRecord: false
                                    });
                                }
                            }

                            if (PayrollLoan.length > 0) {
                                for (let i = 0; i < PayrollLoan.length; i++) {
                                    $scope.AllowanceMaster.push({
                                        payrollallowancendeductionId: PayrollLoan[i].payrollloanId,
                                        employerallowanceId: PayrollLoan[i].employeeloanId,
                                        Description: PayrollLoan[i].employeeloanNote,
                                        Amount: PayrollLoan[i].payrollloanAmountRound4,
                                        employerallowanceEpf: false,
                                        employerallowanceSocso: false,
                                        employerallowancePCB: false,
                                        employerallowanceEIS: false,
                                        employerallowanceNPL: false,
                                        employerallowanceCP8A: false,
                                        employerallowanceCP22A: false,
                                        employerallowanceCP38Tax: false,
                                        employerallowanceShift: false,
                                        employerallowanceAddPay: false,
                                        employerallowancePTPTN: false,
                                        employerallowanceZakat: false,
                                        employerallowanceTabungHaji: false,
                                        employerallowanceHRDF: false,
                                        isLoanRecord: true
                                    })
                                }
                            }
                        }

                        $scope.isMasterList = false;
                        $scope.isSubMasterList = false;
                        $scope.isSubMasterListDetail = true;

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_EmployerAllowance = () => {

            try {

                httpCommonService.fill_employee_allowance()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employerallowanceId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };

        $scope.onClick_AddNewAllowance = () => {
            $scope.onLoad_EmployerAllowance();
            $("#allowanceModal").modal("show");
        };

        $scope.onLoad_ClearAllowance = () => {
            $scope.payrollallowancendeductionId = 0;
            $scope.employerallowanceId = "";
            $scope.payrollallowancendeductionAmount = 0;
            $scope.isManual = false;
            $("#allowanceModal").modal("hide");
        };
        $scope.onLoad_ClearAllowance();

        $scope.onClick_InsertAllowance = () => {

            try {

                let employerallowanceId = $scope.employerallowanceId;
                let payrollallowancendeductionAmount = $scope.payrollallowancendeductionAmount;

                let dataMaster = $scope.AllowanceMaster.filter(x => x.employerallowanceId == employerallowanceId);
                if (dataMaster.length > 0) {
                    $scope.onLoad_ClearAllowance();
                    warningMsg("Warning", "Data has been already inserted!");
                    return;
                }

                let Allowance = $scope.fill_employerallowanceId.filter(x => x.employerallowanceId == employerallowanceId);

                $scope.AllowanceMaster.push({
                    payrollallowancendeductionId: 0,
                    employerallowanceId: Allowance[0].employerallowanceId,
                    Description: Allowance[0].employerallowanceCode,
                    Amount: parseFloat(payrollallowancendeductionAmount).toFixed(4),
                    employerallowanceEpf: Allowance[0].employerallowanceEpf,
                    employerallowanceSocso: Allowance[0].employerallowanceSocso,
                    employerallowancePCB: Allowance[0].employerallowancePCB,
                    employerallowanceEIS: Allowance[0].employerallowanceEIS,
                    employerallowanceNPL: Allowance[0].employerallowanceNPL,
                    employerallowanceCP8A: Allowance[0].employerallowanceCP8A,
                    employerallowanceCP22A: Allowance[0].employerallowanceCP22A,
                    employerallowanceCP38Tax: Allowance[0].employerallowanceCP38Tax,
                    employerallowanceShift: Allowance[0].employerallowanceShift,
                    employerallowanceAddPay: Allowance[0].employerallowanceAddPay,
                    employerallowancePTPTN: Allowance[0].employerallowancePTPTN,
                    employerallowanceZakat: Allowance[0].employerallowanceZakat,
                    employerallowanceTabungHaji: Allowance[0].employerallowanceTabungHaji,
                    employerallowanceHRDF: Allowance[0].employerallowanceHRDF,
                    isLoanRecord: false
                });
                insertMsg();
                $scope.onLoad_ClearAllowance();

            } catch (e) {
                console.log(e);
            }

        };

        $scope.onClick_RemoveAllowanceDeduction = (id, index) => {

            try {
                let value = deleteConfirm();
                if (value == "Yes") {

                    if (id == 0) {
                        $scope.AllowanceMaster.splice(index, 1);
                    } else {
                        let req = {
                            method: 'POST',
                            url: api_deletedata_payrollallowancendeduction,
                            data: {
                                "payrollallowancendeductionId": id
                            }
                        };

                        httpService.httpRemoveData(req)
                            .then((res) => {
                                if (res.status == 200) {
                                    $scope.AllowanceMaster.splice(index, 1);
                                }
                            }, (err) => {
                                console.log(err);
                            });
                    }
                }

            } catch (e) {
                console.log(e);
            }

        };

        $scope.onClick_SalarySubmit = () => {
            try {

                let payrollsalaryId = $scope.payrollsalaryId;
                let employeeId = $scope.employeeId;

                let basicpay = $scope.basicpay;
                let generated = $scope.generated;
                let grosspay = $scope.grosspay;
                let netpay = $scope.netpay;
                let isStatutory = $scope._statutoryManualUpdate;
                let isPaidLeave = $scope._otherManualUpdate;
                let payrollsalaryWorkingDay = $scope.payrollsalaryWorkingDay;

                let epfWages = $scope.epfWages;
                let epfEmployee = $scope.epfEmployee;
                let epfEmployer = $scope.epfEmployer;

                let socsoWages = $scope.socsoWages;
                let socsoEmployee = $scope.socsoEmployee;
                let socsoEmployer = $scope.socsoEmployer;

                let esiWages = $scope.esiWages;
                let esiEmployee = $scope.esiEmployee;
                let esiEmployer = $scope.esiEmployer;

                let pcbEmployee = $scope.pcbEmployee;

                let hrdfWages = $scope.hrdfWages;
                let hrdfEmployee = $scope.hrdfEmployee;
                let hrdfEmployer = $scope.hrdfEmployer;

                let nplDays = $scope.nplDays;
                let nplHours = $scope.nplHours;
                let nplDaysUnit = $scope.nplDaysUnit;
                let nplHoursUnit = $scope.nplHoursUnit;

                let AdditionalPay = $scope.PayrollAdditionalPayMaster;
                let Overtime = $scope.PayrollOvertimeMaster;
                let Shift = $scope.PayrollShiftMaster;

                let Allowance = $scope.AllowanceMaster.filter(x => x.isLoanRecord == false);

                let req = {
                    method: 'POST',
                    url: api_salaryInsertProcessExection,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "payrollId": $scope.payrollId,
                        "payrollsalaryId": payrollsalaryId,
                        "employeeId": employeeId,
                        "basicpay": basicpay,
                        "generated": generated,
                        "grosspay": grosspay,
                        "netpay": netpay,
                        "isStatutory": isStatutory,
                        "isPaidLeave": isPaidLeave,
                        "payrollsalaryWorkingDay": payrollsalaryWorkingDay,
                        "epfWages": epfWages,
                        "epfEmployee": epfEmployee,
                        "epfEmployer": epfEmployer,
                        "socsoWages": socsoWages,
                        "socsoEmployee": socsoEmployee,
                        "socsoEmployer": socsoEmployer,
                        "esiWages": esiWages,
                        "esiEmployee": esiEmployee,
                        "esiEmployer": esiEmployer,
                        "pcbEmployee": pcbEmployee,
                        "hrdfWages": hrdfWages,
                        "hrdfEmployee": hrdfEmployee,
                        "hrdfEmployer": hrdfEmployer,
                        "nplDays": nplDays,
                        "nplHours": nplHours,
                        "nplDaysUnit": nplDaysUnit,
                        "nplHoursUnit": nplHoursUnit,
                        "AdditionalPay": JSON.stringify(AdditionalPay),
                        "Overtime": JSON.stringify(Overtime),
                        "Shift": JSON.stringify(Shift),
                        "Allowance": JSON.stringify(Allowance)
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onClick_gotosalarylist();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SalaryRecalculation = (x) => {
            try {

                let _totalDaysPayrollDate = moment($scope._dateClicked).daysInMonth();
                let _workingDays = $scope.payrollsalaryWorkingDay;
                let _basicpay = $scope.basicpay;

                let masterGrossPay = 0;
                let masterEPFWages = 0;
                let masterSOCSOWages = 0;
                let masterESIWages = 0;
                let masterHRDFWages = 0;

                let masterDaysCalculate = $scope.nplDays * $scope.nplDaysUnit;
                let masterHoursCalculate = $scope.nplHours * $scope.nplHoursUnit;

                if ($scope.paymentType == "Daily") {
                    $scope.generated = (_workingDays * _basicpay).toFixed(4);
                } else {
                    $scope.generated = (_workingDays * (_basicpay / _totalDaysPayrollDate)).toFixed(4);
                }

                let originalPrice = $scope.generated - (masterDaysCalculate + masterHoursCalculate);

                masterGrossPay = originalPrice;
                masterEPFWages = originalPrice;
                masterSOCSOWages = originalPrice;
                masterESIWages = originalPrice;
                masterHRDFWages = originalPrice;

                $scope.additionalpayCalculateTotal = 0.0000;
                if ($scope.PayrollAdditionalPayMaster.length > 0) {
                    for (let i = 0; i < $scope.PayrollAdditionalPayMaster.length; i++) {
                        let additionalpayCalculate = $scope.PayrollAdditionalPayMaster[i].payrolladditionalpayRate * $scope.PayrollAdditionalPayMaster[i].payrolladditionalpayUnit;

                        if ($scope.PayrollAdditionalPayMaster[i].employeradditionalpaysetupEPF.data[0] == 1) {
                            masterEPFWages += additionalpayCalculate;
                        }

                        if ($scope.PayrollAdditionalPayMaster[i].employeradditionalpaysetupEIS.data[0] == 1) {
                            masterESIWages += additionalpayCalculate;
                        }

                        if ($scope.PayrollAdditionalPayMaster[i].employeradditionalpaysetupSocso.data[0] == 1) {
                            masterSOCSOWages += additionalpayCalculate;
                        }

                        if ($scope.PayrollAdditionalPayMaster[i].employeradditionalpaysetupPCB.data[0] == 1) {

                        }

                        if ($scope.PayrollAdditionalPayMaster[i].employeradditionalpaysetupHRDF.data[0] == 1) {
                            masterHRDFWages += additionalpayCalculate;
                        }
                        $scope.additionalpayCalculateTotal += additionalpayCalculate;
                    }
                    $scope.additionalpayCalculateTotal = $scope.additionalpayCalculateTotal.toFixed(4);
                }
                /**/
                let AdditionalPay = $scope.PayrollAdditionalPayMaster;
                if (AdditionalPay.length > 0) {
                    for (let i = 0; i < AdditionalPay.length; i++) {
                        AdditionalPay[i].payrolladditionalpayRate = AdditionalPay[i].payrolladditionalpayRateRound4;
                        AdditionalPay[i].payrolladditionalpayRateRound2 = AdditionalPay[i].payrolladditionalpayRateRound4;
                    }
                }

                let Overtime = $scope.PayrollOvertimeMaster;
                if (Overtime.length > 0) {
                    for (let i = 0; i < Overtime.length; i++) {
                        Overtime[i].payrollovertimeRate = Overtime[i].payrollovertimeRateRound4;
                        Overtime[i].payrollovertimeRateRound2 = Overtime[i].payrollovertimeRateRound4;
                    }
                }

                let Shift = $scope.PayrollShiftMaster;
                if (Shift.length > 0) {
                    for (let i = 0; i < Shift.length; i++) {
                        Shift[i].payrollShiftRate = Shift[i].payrollShiftRateRound4;
                        Shift[i].payrollShiftRateRound2 = Shift[i].payrollShiftRateRound4;
                    }
                }
                /**/
                $scope.overtimeCalculateTotal = 0.0000;
                if ($scope.PayrollOvertimeMaster.length > 0) {
                    for (let i = 0; i < $scope.PayrollOvertimeMaster.length; i++) {
                        let overtimeCalculate = $scope.PayrollOvertimeMaster[i].payrollovertimeRate * $scope.PayrollOvertimeMaster[i].payrollovertimeUnit;

                        if ($scope.PayrollOvertimeMaster[i].employerotsetupEPF.data[0] == 1) {
                            masterEPFWages += overtimeCalculate;
                        }

                        if ($scope.PayrollOvertimeMaster[i].employerotsetupEIS.data[0] == 1) {
                            masterESIWages += overtimeCalculate;
                        }

                        if ($scope.PayrollOvertimeMaster[i].employerotsetupSocso.data[0] == 1) {
                            masterSOCSOWages += overtimeCalculate;
                        }

                        if ($scope.PayrollOvertimeMaster[i].employerotsetupPCB.data[0] == 1) {

                        }

                        if ($scope.PayrollOvertimeMaster[i].employerotsetupHRDF.data[0] == 1) {
                            masterHRDFWages += overtimeCalculate;
                        }
                        $scope.overtimeCalculateTotal += overtimeCalculate;
                    }
                    $scope.overtimeCalculateTotal = $scope.overtimeCalculateTotal.toFixed(4);
                }

                $scope.shiftCalculateTotal = 0.0000;
                if ($scope.PayrollShiftMaster.length > 0) {
                    for (let i = 0; i < $scope.PayrollShiftMaster.length; i++) {
                        let shiftCalculate = $scope.PayrollShiftMaster[i].payrollShiftRate * $scope.PayrollShiftMaster[i].payrollShiftUnit;

                        if ($scope.PayrollShiftMaster[i].employershiftsetupEPF.data[0] == 1) {
                            masterEPFWages += shiftCalculate;
                        }

                        if ($scope.PayrollShiftMaster[i].employershiftsetupEIS.data[0] == 1) {
                            masterESIWages += shiftCalculate;
                        }

                        if ($scope.PayrollShiftMaster[i].employershiftsetupSocso.data[0] == 1) {
                            masterSOCSOWages += shiftCalculate;
                        }

                        if ($scope.PayrollShiftMaster[i].employershiftsetupPCB.data[0] == 1) {

                        }

                        if ($scope.PayrollShiftMaster[i].employershiftsetupHRDF.data[0] == 1) {
                            masterHRDFWages += shiftCalculate;
                        }
                        $scope.shiftCalculateTotal += shiftCalculate;
                    }
                    $scope.shiftCalculateTotal = $scope.shiftCalculateTotal.toFixed(4);
                }

                $scope.allowanceCalculateTotal = 0.0000;
                if ($scope.AllowanceMaster.length > 0) {
                    for (let i = 0; i < $scope.AllowanceMaster.length; i++) {
                        if ($scope.AllowanceMaster[i].isLoanRecord == false) {
                            let allowanceCalculate = parseFloat($scope.AllowanceMaster[i].Amount);
                            if (allowanceCalculate > 0) {
                                if ($scope.AllowanceMaster[i].employerallowanceEpf.data[0] == 1) {
                                    masterEPFWages += allowanceCalculate;
                                }

                                if ($scope.AllowanceMaster[i].employerallowanceEIS.data[0] == 1) {
                                    masterESIWages += allowanceCalculate;
                                }

                                if ($scope.AllowanceMaster[i].employerallowanceSocso.data[0] == 1) {
                                    masterSOCSOWages += allowanceCalculate;
                                }

                                if ($scope.AllowanceMaster[i].employerallowancePCB.data[0] == 1) {

                                }

                                if ($scope.AllowanceMaster[i].employerallowanceHRDF.data[0] == 1) {
                                    masterHRDFWages += allowanceCalculate;
                                }
                                $scope.allowanceCalculateTotal += allowanceCalculate;
                            }
                        }
                    }
                    $scope.allowanceCalculateTotal = $scope.allowanceCalculateTotal.toFixed(4);
                }

                $scope._allowanceCalculateTotal = 0.0000;
                if ($scope.AllowanceMaster.length > 0) {
                    for (let i = 0; i < $scope.AllowanceMaster.length; i++) {
                        if ($scope.AllowanceMaster[i].isLoanRecord == false) {
                            let allowanceCalculate = parseFloat($scope.AllowanceMaster[i].Amount);
                            if (allowanceCalculate < 0) {
                                allowanceCalculate = Math.abs(allowanceCalculate);
                                if ($scope.AllowanceMaster[i].employerallowanceEpf.data[0] == 1) {
                                    masterEPFWages -= allowanceCalculate;
                                }

                                if ($scope.AllowanceMaster[i].employerallowanceEIS.data[0] == 1) {
                                    masterESIWages -= allowanceCalculate;
                                }

                                if ($scope.AllowanceMaster[i].employerallowanceSocso.data[0] == 1) {
                                    masterSOCSOWages -= allowanceCalculate;
                                }

                                if ($scope.AllowanceMaster[i].employerallowancePCB.data[0] == 1) {

                                }

                                if ($scope.AllowanceMaster[i].employerallowanceHRDF.data[0] == 1) {
                                    masterHRDFWages -= allowanceCalculate;
                                }
                                $scope._allowanceCalculateTotal += allowanceCalculate;
                            }
                        }
                    }
                    $scope._allowanceCalculateTotal = $scope._allowanceCalculateTotal.toFixed(4);
                }

                $scope.LoanCalculateTotal = 0;
                if ($scope.AllowanceMaster.length > 0) {
                    for (let i = 0; i < $scope.AllowanceMaster.length; i++) {
                        if ($scope.AllowanceMaster[i].isLoanRecord == true) {
                            $scope.LoanCalculateTotal += parseFloat($scope.AllowanceMaster[i].Amount);
                        }
                    }
                }

                masterGrossPay = masterGrossPay +
                    parseFloat($scope.additionalpayCalculateTotal) +
                    parseFloat($scope.overtimeCalculateTotal) +
                    parseFloat($scope.shiftCalculateTotal) +
                    parseFloat($scope.allowanceCalculateTotal) -
                    parseFloat($scope._allowanceCalculateTotal);

                if ($scope._statutoryManualUpdate == true) {

                    let valueCount = parseFloat($scope.epfEmployee) +
                        parseFloat($scope.socsoEmployee) +
                        parseFloat($scope.esiEmployee) +
                        parseFloat($scope.pcbEmployee) +
                        parseFloat($scope.hrdfEmployee);

                    let netPay = (masterGrossPay - valueCount) - $scope.LoanCalculateTotal;

                    let _aa = masterGrossPay.toFixed(4);
                    let _aa_a = parseFloat(_aa).toFixed(2);
                    $scope.grosspay = parseFloat(_aa_a).toFixed(4);

                    let _ab = netPay.toFixed(4);
                    let _ab_a = parseFloat(_ab).toFixed(2);
                    $scope.netpay = parseFloat(_ab_a).toFixed(4);

                    if (x == 'save') {
                        $scope.onClick_SalarySubmit();
                    }
                }
                else {

                    let req = {
                        method: 'POST',
                        url: api_salaryProcessRecalculation,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeeId": $scope.employeeId,
                            "_epfWageTotal": masterEPFWages,
                            "_esiWageTotal": masterESIWages,
                            "_socsoWageTotal": masterSOCSOWages,
                            "_hrdfWageTotal": masterHRDFWages
                        }
                    };

                    httpService.httpFetchData(req)
                        .then((res) => {

                            let result = res.data;

                            $scope.epfWages = result.epfWageTotal;
                            if ($scope.epfWages > 0) {
                                $scope.epfEmployee = result.EpfERate;
                                $scope.epfEmployer = result.EpfRRate;
                            }
                            else {
                                $scope.epfEmployee = 0;
                                $scope.epfEmployer = 0;
                            }

                            $scope.socsoWages = result.socsoWageTotal;
                            if ($scope.socsoWages > 0) {
                                $scope.socsoEmployee = result.SocsoERate;
                                $scope.socsoEmployer = result.SocsoRRate;
                            }
                            else {
                                $scope.socsoEmployee = 0;
                                $scope.socsoEmployer = 0;
                            }

                            $scope.esiWages = result.esiWageTotal;
                            if ($scope.esiWages > 0) {
                                $scope.esiEmployee = result.EISERate;
                                $scope.esiEmployer = result.EISRRate;
                            }
                            else {
                                $scope.esiEmployee = 0;
                                $scope.esiEmployer = 0;
                            }

                            $scope.hrdfWages = result.hrdfWageTotal;
                            if ($scope.esiWages > 0) {
                                $scope.hrdfEmployee = result.HRDFERate;
                                $scope.hrdfEmployer = result.HRDFRRate;
                            }
                            else {
                                $scope.hrdfEmployee = 0;
                                $scope.hrdfEmployer = 0;
                            }

                            let valueCount = parseFloat($scope.epfEmployee) +
                                parseFloat($scope.socsoEmployee) +
                                parseFloat($scope.esiEmployee) +
                                parseFloat($scope.pcbEmployee) +
                                parseFloat($scope.hrdfEmployee);

                            let netPay = (masterGrossPay - valueCount) - $scope.LoanCalculateTotal;

                            let _aa = masterGrossPay.toFixed(4);
                            let _aa_a = parseFloat(_aa).toFixed(2);
                            $scope.grosspay = parseFloat(_aa_a).toFixed(4);

                            let _ab = netPay.toFixed(4);
                            let _ab_a = parseFloat(_ab).toFixed(2);
                            $scope.netpay = parseFloat(_ab_a).toFixed(4);

                            if (x == 'save') {
                                $scope.onClick_SalarySubmit();
                            }

                        }, (err) => {
                            console.log(err)
                        });

                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_gotosalarylist = () => {
            $scope.isMasterList = false;
            $scope.isSubMasterList = true;
            $scope.isSubMasterListDetail = false;

            $scope.onClick_ShowSalaryDetail($scope.payrollId, $scope._dateClicked, $scope._isLocked);
        };

        //. Download salary excel file 
        $scope.onClick_DownloadExcelFile = () => {
            try {

                let SearchEmployeeId = $scope._SearchEmployeeId;
                let SearchEmployerdepartmentId = $scope._SearchEmployerdepartmentId;
                let SearchEmployerbranchId = $scope._SearchEmployerbranchId;
                let SortBy = $scope._sortBy;

                let req = {
                    method: 'POST',
                    url: api_salaryDownloadData,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchEmployeeId": SearchEmployeeId,
                        "SearchEmployerdepartmentId": SearchEmployerdepartmentId,
                        "SearchEmployerbranchId": SearchEmployerbranchId,
                        "payrollId": $scope.payrollId,
                        "sortBy": SortBy
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let PayrollSalary = res.data[0].salary;
                            let PayrollNPL = res.data[0].npl;
                            let PayrollAdditionalPay = res.data[0].additionalpay;
                            let PayrollOvertime = res.data[0].overtime;
                            let PayrollShift = res.data[0].shift;
                            let PayrollAllowancenDeduction = res.data[0].allowancendeduction;
                            let EmployerAllowancenDeduction = res.data[0].employerallowancededuction;

                            let masterResult = [];
                            let _employeeList = PayrollSalary.map(x => x.employeeId);

                            if (_employeeList.length > 0) {

                                for (let i = 0; i < _employeeList.length; i++) {

                                    let filterSalary = PayrollSalary.filter(x => x.employeeId == _employeeList[i]);
                                    if (filterSalary.length > 0) {

                                        let pera = {};

                                        let employeeId = filterSalary[0].employeeId;
                                        let payrollId = filterSalary[0].payrollId;
                                        let payrollsalaryId = filterSalary[0].payrollsalaryId;
                                        let processDate = moment($scope._dateClicked).format("YYYY-MM-01");

                                        let memberNric = filterSalary[0].memberNric;
                                        let memberName = filterSalary[0].memberName;
                                        let employeeEnroll = filterSalary[0].employeeEnroll;

                                        let payrollsalaryGenerated = filterSalary[0].payrollsalaryGenerated;
                                        let payrollsalaryWorkingDay = filterSalary[0].payrollsalaryWorkingDay;

                                        pera.processDate = processDate;
                                        pera.Z_employeeId = employeeId;
                                        pera.Z_payrollId = payrollId;
                                        pera.Z_payrollsalaryId = payrollsalaryId;
                                        pera.Z_memberNric = memberNric;
                                        pera.Z_memberName = memberName;
                                        pera.Z_employeeEnroll = employeeEnroll;
                                        pera.Z_payrollsalaryGenerated = payrollsalaryGenerated;
                                        pera.Z_dailyPayDay = payrollsalaryWorkingDay;
                                        pera.Z_dailyPayHour = 0;

                                        let filterNPL = PayrollNPL.filter(x => x.payrollsalaryId == payrollsalaryId);
                                        if (filterNPL.length > 0) {
                                            pera.Z_nplDay = filterNPL[0].payrollNplDayUnit;
                                            pera.Z_nplHour = filterNPL[0].payrollNplHourUnit;
                                        }

                                        let filterOvertime = PayrollOvertime.filter(x => x.payrollsalaryId == payrollsalaryId);
                                        if (filterOvertime.length > 0) {
                                            for (let j = 0; j < filterOvertime.length; j++) {
                                                pera["A_" + filterOvertime[j].employerotsetupOTCode + ""] = filterOvertime[j].payrollovertimeUnit;
                                            }
                                        }

                                        let filterAdditionalPay = PayrollAdditionalPay.filter(x => x.payrollsalaryId == payrollsalaryId);
                                        if (filterAdditionalPay.length > 0) {
                                            for (let j = 0; j < filterAdditionalPay.length; j++) {
                                                pera["B_" + filterAdditionalPay[j].employeradditionalpaysetupCode + ""] = filterAdditionalPay[j].payrolladditionalpayUnit;
                                            }
                                        }

                                        let filterShift = PayrollShift.filter(x => x.payrollsalaryId == payrollsalaryId);
                                        if (filterShift.length > 0) {
                                            for (let j = 0; j < filterShift.length; j++) {
                                                pera["C_" + filterShift[j].employershiftsetupCode + ""] = filterShift[j].payrollShiftUnit == "undefined" ? 0 : filterShift[j].payrollShiftUnit;
                                            }
                                        }

                                        let filterAllowanceDeduction = PayrollAllowancenDeduction.filter(x => x.payrollsalaryId == payrollsalaryId);
                                        if (EmployerAllowancenDeduction.length > 0) {

                                            for (let j = 0; j < EmployerAllowancenDeduction.length; j++) {
                                                let employerallowanceId = EmployerAllowancenDeduction[j].employerallowanceId;

                                                let _AllowanceDeduction = filterAllowanceDeduction.filter(x => x.employerallowanceId == employerallowanceId);

                                                if (_AllowanceDeduction.length > 0) {
                                                    pera["D_" + EmployerAllowancenDeduction[j].employerallowanceCode + ""] = _AllowanceDeduction[0].payrollallowancendeductionAmount;
                                                } else {
                                                    pera["D_" + EmployerAllowancenDeduction[j].employerallowanceCode + ""] = 0;
                                                }


                                            }
                                        }

                                        masterResult.push(pera);
                                    }
                                }
                            }

                            if (masterResult.length > 0) {
                                var strstring = "";
                                let _keys = Object.keys(masterResult[0]);

                                let startsOvertime = _keys.filter(x => x.startsWith("A"));
                                let startsAdditionalPay = _keys.filter(x => x.startsWith("B"));
                                let startsShift = _keys.filter(x => x.startsWith("C"));
                                let startsAllowanceDeduction = _keys.filter(x => x.startsWith("D"));

                                strstring = "<tr>";
                                strstring += "<td x:autofilter='all'>processDate</td>";
                                strstring += "<td x:autofilter='all'>PayrollId</td>";
                                strstring += "<td x:autofilter='all'>PayrollSalaryId</td>";
                                strstring += "<td x:autofilter='all'>EmployeeId</td>";
                                strstring += "<td x:autofilter='all'>NricNo</td>";
                                strstring += "<td x:autofilter='all'>EmployeeName</td>";
                                strstring += "<td x:autofilter='all'>EnrollNo</td>";
                                strstring += "<td x:autofilter='all'>BasicPay</td>";
                                strstring += "<td x:autofilter='all'>DailyPayDay</td>";
                                strstring += "<td x:autofilter='all'>NplDay</td>";
                                strstring += "<td x:autofilter='all'>NplHour</td>";
                                if (startsOvertime.length > 0) {
                                    for (let k = 0; k < startsOvertime.length; k++) {
                                        strstring += "<td x:autofilter='all'>" + startsOvertime[k] + "</td>";
                                    }
                                }
                                if (startsAdditionalPay.length > 0) {
                                    for (let k = 0; k < startsAdditionalPay.length; k++) {
                                        strstring += "<td x:autofilter='all'>" + startsAdditionalPay[k] + "</td>";
                                    }
                                }
                                if (startsShift.length > 0) {
                                    for (let k = 0; k < startsShift.length; k++) {
                                        strstring += "<td x:autofilter='all'>" + startsShift[k] + "</td>";
                                    }
                                }
                                if (startsAllowanceDeduction.length > 0) {
                                    for (let k = 0; k < startsAllowanceDeduction.length; k++) {
                                        strstring += "<td x:autofilter='all'>" + startsAllowanceDeduction[k] + "</td>";
                                    }
                                }
                                strstring += "</tr>";

                                for (let i = 0; i < masterResult.length; i++) {
                                    strstring += '<tr>';
                                    strstring += '<td>' + masterResult[i].processDate + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_payrollId + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_payrollsalaryId + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_employeeId + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_memberNric + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_memberName + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_employeeEnroll + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_payrollsalaryGenerated + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_dailyPayDay + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_nplDay + '</td>';
                                    strstring += '<td>' + masterResult[i].Z_nplHour + '</td>';
                                    if (startsOvertime.length > 0) {
                                        for (let k = 0; k < startsOvertime.length; k++) {
                                            strstring += "<td x:autofilter='all'>" + masterResult[i]["" + startsOvertime[k] + ""] + "</td>";
                                        }
                                    }
                                    if (startsAdditionalPay.length > 0) {
                                        for (let k = 0; k < startsAdditionalPay.length; k++) {
                                            strstring += "<td x:autofilter='all'>" + masterResult[i]["" + startsAdditionalPay[k] + ""] + "</td>";
                                        }
                                    }

                                    if (startsShift.length > 0) {
                                        for (let k = 0; k < startsShift.length; k++) {
                                            if (masterResult[i]["" + startsShift[k] + ""] == undefined)
                                                masterResult[i]["" + startsShift[k] + ""] = 0;
                                            strstring += "<td x:autofilter='all'>" + masterResult[i]["" + startsShift[k] + ""] + "</td>";
                                        }
                                    }

                                    if (startsAllowanceDeduction.length > 0) {
                                        for (let k = 0; k < startsAllowanceDeduction.length; k++) {
                                            strstring += "<td x:autofilter='all'>" + masterResult[i]["" + startsAllowanceDeduction[k] + ""] + "</td>";
                                        }
                                    }
                                    strstring += '</tr>';
                                }
                                if (strstring != "") {
                                    $("#tabledata").html("");
                                    $("#tabledata").html(strstring);
                                    tableToExcel('tabledata', 'SalaryReport');
                                }
                            }
                        }
                        else {

                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        var reader = new FileReader();

        $(function () {
            $('input[type=file]').change(function () {
                if (typeof (FileReader) != "undefined") {
                    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                    $($(this)[0].files).each(function () {
                        var file = $(this);
                        if (regex.test(file[0].name.toLowerCase())) {
                            reader.readAsDataURL(file[0]);
                        } else {
                            alert(file[0].name + " is not a valid image file.");
                            return false;
                        }
                    });
                } else {
                    alert("This browser does not support HTML5 FileReader.");
                }
            });
        });

        $scope.onClick_UploadExcelFile = () => {
            try {

                $("#id_UploadExcelFile").modal("show");
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_UploadExcel = () => {
            try {
                var byteData = reader.result;
                if (byteData != null) {
                    $("#id_UploadExcelFile").modal("hide");
                    byteData = byteData.split(';')[1].replace("base64,", "");
                    $.ajax({
                        type: "POST",
                        url: "/employer/home/GetExcelData1",
                        data: { "byteData": byteData },

                        success: function (response) {
                            if (response != "") {
                                var xmlDoc = $.parseXML(response);
                                var xml = $(xmlDoc);
                                var customers = xml.find("Table");
                                let result = [];

                                let masterChild = customers[0].children;
                                if (masterChild.length > 0) {
                                    for (let i = 0; i < masterChild.length; i++) {
                                        result.push(masterChild[i].nodeName);
                                    }
                                }

                                let _data = [];

                                $.each(customers, function () {
                                    let _result = [];
                                    for (let i = 0; i < result.length; i++) {
                                        let title = result[i];
                                        let _data = {
                                            [title]: $(this).find("" + title + "").text()
                                        }
                                        _result.push(_data);
                                    }

                                    let value = _result.reduce(function (result, current) {
                                        return Object.assign(result, current);
                                    }, {});

                                    _data.push(value);
                                });

                                $scope._Data = _data;

                                let req = {
                                    method: 'POST',
                                    url: api_salaryUploadSalary,
                                    data: {
                                        "employerId": $scope._izemEmployerId,
                                        "rowData": JSON.stringify($scope._Data)
                                    }
                                };

                                httpService.httpOperationData(req)
                                    .then((res) => {
                                        if (res.status == 200) {
                                            insertMsg();
                                        }
                                        $scope._Data = [];
                                        $("#id_attendanceRowData").modal("hide");
                                        $scope.onClick_ShowSalaryDetail($scope.payrollId, $scope._dateClicked, $scope._isLocked);
                                        $scope.onClick_CloseBulkUpload();
                                    }, (err) => {
                                        console.log(err);
                                    });
                            }
                            else {
                                warningMsg("Upload Problem", "Please check file format!")
                            }
                        },
                        error: function (response) {
                            console.log(response);
                        }
                    });
                }
                else
                    alert("Please select excel file.");

            } catch (e) {
                $("body").removeClass("loading");
                console.log(e);
            }
        };

        $scope.onClick_CloseBulkUpload = () => {
            try {

                var file = document.getElementById("fuUpload");
                file.value = file.defaultValue;
                reader = new FileReader();

                $("#id_UploadExcelFile").modal("hide");

            } catch (e) {
                console.log(e);
            }
        };

        //. Lock and unlock the salary month

        $scope.onClick_UnlockData = () => {
            try {

                if ($scope.confirmPassword == "") {
                    alert("Please provide password!");
                    return;
                }

                let req = {
                    method: 'POST',
                    url: api_salaryLockedSalary,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "payrollId": $scope._unlockPayrollId,
                        "flag": $scope._unlockflag,
                        "payrollPassword": $scope.confirmPassword
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            warningMsg("Validation", res.message);
                            $scope.onClick_CloseUnlockData();
                            $scope.onLoad_MasterService();
                        }
                    }, (err) => {
                        console.log(err);
                    });
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_LockPayroll = (id, x) => {
            try {

                $scope._unlockPayrollId = id;
                $scope._unlockflag = x;
                if (x != 'true')
                    $("#id_DataUnlock").modal("show");
                else {
                    let req = {
                        method: 'POST',
                        url: api_salaryLockedSalary,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "payrollId": $scope._unlockPayrollId,
                            "flag": $scope._unlockflag
                        }
                    };

                    httpService.httpOperationData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                warningMsg("Validation", res.message);
                                $scope.onClick_CloseUnlockData();
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

        $scope.onClick_CloseUnlockData = () => {
            try {

                $scope.confirmPassword = "";
                $scope._unlockPayrollId = "";
                $scope._unlockflag = "";

                $("#id_DataUnlock").modal("hide");

            } catch (e) {
                console.log(e);
            }
        };

    }]);