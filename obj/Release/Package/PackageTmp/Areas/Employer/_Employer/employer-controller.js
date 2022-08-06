

app.controller("employer-controller", ['$rootScope', '$scope', '$http',
    function ($rootScope, $scope, $http) {

        $scope.onClick_Signout = () => {
            try {
                localStorage.removeItem("_izemFullName");
                localStorage.removeItem("_izemLoginEmail");
                localStorage.removeItem("_izemRole");
                localStorage.removeItem("_izemToken");
                localStorage.removeItem("_izemIsVerify");

                localStorage.removeItem("_izemEmployerId");
                localStorage.removeItem("_izemEmployeeId");
                localStorage.removeItem("_izemSignupId");

                localStorage.removeItem("_izemCompanyName");
                localStorage.removeItem("_izemCompanyContact");
                localStorage.removeItem("_izemAddress");

                localStorage.removeItem("_izemRights");

                window.location.href = "/";
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_Verification = () => {

            let verification = localStorage.getItem("_izemIsVerify");
            if (verification != null) {
                if (verification == "0")
                    $rootScope.verification = false;
                if (verification == "1")
                    $rootScope.verification = true;
            }
            else {
                $rootScope.verification = false;
            }
        };
        $scope.onLoad_Verification();

        $scope.redirectMember = false;

        onLoad_Rights = () => {
            try {

                let userRole = localStorage.getItem("_izemRole");
                if (userRole == 'employer') {
                    $scope._isMasterSetting = true;
                    $scope._companyProfile = true;
                    $scope._branch = true;
                    $scope._department = true;
                    $scope._setting = true;
                    $scope._entitlement = true;
                    $scope._facility = true;
                    $scope._subscription = true;
                    $scope._holiday = true;
                    $scope._employee = true;
                    //.
                    $scope._isAttendanceEntries = true;
                    $scope._device = true;
                    $scope._deviceOperation = true;
                    $scope._shift = true;
                    $scope._attendance = true;
                    $scope._attendanceReport = true;
                    //.
                    $scope._isLeaveEntries = true;
                    $scope._leaveType = true;
                    $scope._leaveApplication = true;
                    $scope._leaveReport = true;
                    //.
                    $scope._isPayrollProcess = true;
                    $scope._houlryProcess = true;
                    $scope._payroll = true;
                    $scope._payrollReport = true;
                    $scope._additionalPaySetup = true;
                    $scope._globalSetup = true;
                    $scope._overtimeSetup = true;
                    $scope._shiftSetup = true;
                    $scope._allowanceDeductionSetup = true;
                    //.
                    $scope._isUtility = true;

                }
                else if (userRole == 'member') {

                    $scope.redirectMember = true;

                    let localData = localStorage.getItem("_izemRights");
                    let pera = JSON.parse(localData);
                    if (pera.length > 0) {
                        //.
                        $scope._isMasterSetting = false;
                        let _masterSetting = pera.filter(x => x.menuName == 'Master entries');
                        $scope._companyProfile = false;
                        $scope._branch = false;
                        $scope._department = false;
                        $scope._setting = false;
                        $scope._entitlement = false;
                        $scope._facility = false;
                        $scope._subscription = false;
                        $scope._holiday = false;
                        $scope._employee = false;
                        if (_masterSetting.length > 0) {
                            for (let i = 0; i < _masterSetting.length; i++) {
                                if (_masterSetting[i].pageName == 'Company Profile') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._companyProfile = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Branch') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._branch = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Department') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._department = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Setting') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._setting = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Entitlement') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._entitlement = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Facility') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._facility = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Subscription') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._subscription = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Holiday') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._holiday = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                                if (_masterSetting[i].pageName == 'Employee') {
                                    if (_masterSetting[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._employee = true;
                                        $scope._isMasterSetting = true;
                                    }
                                }
                            }
                        }
                        //.
                        $scope._isAttendanceEntries = false;
                        let _attendanceEntries = pera.filter(x => x.menuName == 'Attendance entries');
                        $scope._device = false;
                        $scope._deviceOperation = false;
                        $scope._shift = false;
                        $scope._attendance = false;
                        $scope._attendanceReport = false;
                        if (_attendanceEntries.length > 0) {
                            for (let i = 0; i < _attendanceEntries.length; i++) {
                                if (_attendanceEntries[i].pageName == 'Device') {
                                    if (_attendanceEntries[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._device = true;
                                        $scope._isAttendanceEntries = true;
                                    }
                                }
                                if (_attendanceEntries[i].pageName == 'Device Operation') {
                                    if (_attendanceEntries[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._deviceOperation = true;
                                        $scope._isAttendanceEntries = true;
                                    }
                                }
                                if (_attendanceEntries[i].pageName == 'Shift') {
                                    if (_attendanceEntries[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._shift = true;
                                        $scope._isAttendanceEntries = true;
                                    }
                                }
                                if (_attendanceEntries[i].pageName == 'Attendance') {
                                    if (_attendanceEntries[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._attendance = true;
                                        $scope._isAttendanceEntries = true;
                                    }
                                }
                                if (_attendanceEntries[i].pageName == 'Attendance Report') {
                                    if (_attendanceEntries[i].isAccess.data[0] == 1 || _masterSetting[i].isFullAccess.data[0] == 1) {
                                        $scope._attendanceReport = true;
                                        $scope._isAttendanceEntries = true;
                                    }
                                }
                            }
                        }
                        //.
                        $scope._isLeaveEntries = false;
                        let _manageLeave = pera.filter(x => x.menuName == 'Leave entries');
                        $scope._leaveType = false;
                        $scope._leaveApplication = false;
                        $scope._leaveReport = false;
                        if (_manageLeave.length > 0) {
                            for (let i = 0; i < _manageLeave.length; i++) {
                                if (_manageLeave[i].pageName == 'Leave Type') {
                                    if (_manageLeave[i].isAccess.data[0] == 1 || _manageLeave[i].isFullAccess.data[0] == 1) {
                                        $scope._leaveType = true;
                                        $scope._isLeaveEntries = true;
                                    }
                                }
                                if (_manageLeave[i].pageName == 'Leave Application') {
                                    if (_manageLeave[i].isAccess.data[0] == 1 || _manageLeave[i].isFullAccess.data[0] == 1) {
                                        $scope._leaveApplication = true;
                                        $scope._isLeaveEntries = true;
                                    }
                                }
                                if (_manageLeave[i].pageName == 'Leave Report') {
                                    if (_manageLeave[i].isAccess.data[0] == 1 || _manageLeave[i].isFullAccess.data[0] == 1) {
                                        $scope._leaveReport = true;
                                        $scope._isLeaveEntries = true;
                                    }
                                }
                            }
                        }
                        //.
                        $scope._isPayrollProcess = false;
                        let _payrollProcess = pera.filter(x => x.menuName == 'Payroll Process');
                        $scope._houlryProcess = false;
                        $scope._payroll = false;
                        $scope._payrollReport = false;
                        $scope._additionalPaySetup = false;
                        $scope._globalSetup = false;
                        $scope._overtimeSetup = false;
                        $scope._shiftSetup = false;
                        $scope._allowanceDeductionSetup = false;
                        if (_payrollProcess.length > 0) {
                            for (let i = 0; i < _payrollProcess.length; i++) {
                                if (_payrollProcess[i].pageName == 'Houlry Process') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._houlryProcess = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'Payroll') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._payroll = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'Payroll Report') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._payrollReport = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'AdditionalPay Setup') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._additionalPaySetup = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'Global Setup') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._globalSetup = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'Overtime Setup') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._overtimeSetup = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'Shift Setup') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._shiftSetup = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                                if (_payrollProcess[i].pageName == 'Allowance Deduction Setup') {
                                    if (_payrollProcess[i].isAccess.data[0] == 1 || _payrollProcess[i].isFullAccess.data[0] == 1) {
                                        $scope._allowanceDeductionSetup = true;
                                        $scope._isPayrollProcess = true;
                                    }
                                }
                            }
                        }

                    }
                }
                else {
                    $scope.onClick_Signout();
                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.loginRecord = () => {
            let localData = localStorage.getItem("_izemToken");
            if (localData != null) {

                $rootScope.loginName = localStorage.getItem("_izemFullName");
                $rootScope.loginRole = localStorage.getItem("_izemRole");
                $rootScope.token = localStorage.getItem("_izemToken");

                $rootScope.report_companyName = localStorage.getItem("_izemCompanyName");
                $rootScope.report_companyContact = localStorage.getItem("companyContact");
                $rootScope.report_address = localStorage.getItem("_izemAddress");

                onLoad_Rights();

            }
            else {
                window.location.href = "/";
            }
        };
        $scope.loginRecord();

    }]);