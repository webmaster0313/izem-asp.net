
let api_selectcompanyprofilecount = backlink + "employer/api/companysetting/companysetting_apiSelectCount";

let api_selectbranchcount = backlink + "employer/api/employerbranch/employerbranch_apiSelectCount";
let api_selectdepartmentcount = backlink + "employer/api/employerdepartment/employerdepartment_apiSelectCount";
let api_selectentitlementcount = backlink + "employer/api/employerentitlement/employerentitlement_apiSelectCount";
let api_selectleavetypecount = backlink + "employer/api/employerleavetype/employerleavetype_apiSelectCount";
let api_selectshiftcount = backlink + "employer/api/employermastershift/employermastershift_apiSelectCount";

let api_selectadditionalsetupcount = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiSelectCount";
let api_selectglobalsetupcount = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiSelectCount";
let api_selectovertimesetupcount = backlink + "employer/api/employerotsetup/employerotsetup_apiSelectCount";
let api_selectshiftsetupcount = backlink + "employer/api/employershiftsetup/employershiftsetup_apiSelectCount";

let api_insertdataBranch = backlink + "employer/api/employerbranch/employerbranch_apiInsertDefaulValue";
let api_insertdataDepartment = backlink + "employer/api/employerdepartment/employerdepartment_apiInsertDefaulValue";
let api_insertdataEntitlement = backlink + "employer/api/employerentitlement/employerentitlement_apiInsertDefaulValue";
let api_insertdataLeavetype = backlink + "employer/api/employerleavetype/employerleavetype_apiInsertDefaulValue";

let api_insertdataAdditionalPaySetup = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiInsertDefaulValue";
let api_insertdataOtSetup = backlink + "employer/api/employerotsetup/employerotsetup_apiInsertDefaulValue";
let api_insertdataShiftSetup = backlink + "employer/api/employershiftsetup/employershiftsetup_apiInsertDefaulValue";
let api_insertdataGlobalSetup = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiInsertDefaulValue";

//.
let api_SelectCountEmployee = backlink + "employer/api/employee/employee_apiSelectCount";
let api_SelectCountLeaveApplication = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiSelectCount";


app.controller("client-dashboard-controller", ['$scope', '$window', 'httpService',
    function ($scope, $window, httpService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.onClick_ProceedAccount = () => {
            $window.location.href = '/employer/home/profile';
        };

        $scope.onLoad_CompanyProfile = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectcompanyprofilecount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._companyProfile = false;
                            else
                                $scope._companyProfile = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_BranchMaster = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectbranchcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._branch = false;
                            else
                                $scope._branch = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_DepartmentMaster = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectdepartmentcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._department = false;
                            else
                                $scope._department = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_EntitlementMaster = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectentitlementcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._entitlement = false;
                            else
                                $scope._entitlement = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_LeaveTypeMaster = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectleavetypecount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._leavetype = false;
                            else
                                $scope._leavetype = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_ShiftMaster = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectshiftcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._shift = false;
                            else
                                $scope._shift = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_AdditionalSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectadditionalsetupcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._additionalsetup = false;
                            else
                                $scope._additionalsetup = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_GlobalSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectglobalsetupcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._globalsetup = false;
                            else
                                $scope._globalsetup = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_OvertimeSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectovertimesetupcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._overtimesetup = false;
                            else
                                $scope._overtimesetup = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_ShiftSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectshiftsetupcount,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };


                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _count = res.data[0].cnt;
                            if (_count == 0)
                                $scope._shiftsetup = false;
                            else
                                $scope._shiftsetup = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultBranch = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataBranch,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_BranchMaster();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultDepartment = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataDepartment,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_DepartmentMaster();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultEntitlement = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataEntitlement,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_EntitlementMaster();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultLeavetype = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataLeavetype,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_LeaveTypeMaster();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultAdditionalPaySetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataAdditionalPaySetup,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_AdditionalSetup();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultOvertimeSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataOtSetup,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_OvertimeSetup();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultShiftSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataShiftSetup,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_ShiftSetup();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_AddDefaultGlobalSetup = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertdataGlobalSetup,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_GlobalSetup();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_CompanyProfile();
        $scope.onLoad_BranchMaster();
        $scope.onLoad_DepartmentMaster();
        $scope.onLoad_EntitlementMaster();
        $scope.onLoad_LeaveTypeMaster();
        $scope.onLoad_ShiftMaster();
        $scope.onLoad_AdditionalSetup();
        $scope.onLoad_GlobalSetup();
        $scope.onLoad_OvertimeSetup();
        $scope.onLoad_ShiftSetup();

        //.
        $scope.onLoad_CountEmployee = () => {

            try {

                let req = {
                    method: 'POST',
                    url: api_SelectCountEmployee,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.active = res.data[0][0].cnt;
                            $scope.inActive = res.data[1][0].cnt;
                            $scope.total = res.data[2][0].cnt;
                        }
                        else {
                            $scope.active = 0;
                            $scope.inActive = 0;
                            $scope.total = 0;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_CountEmployee();

        $scope.onLoad_CountLeave = () => {

            try {

                let req = {
                    method: 'POST',
                    url: api_SelectCountLeaveApplication,
                    data: {
                        "employerId": $scope._izemEmployerId,
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

        $scope._currentYearForLeaveSummary = moment(new Date()).format("YYYY");

        //$scope.onload = () => {
        //    $("#tblCustomers").table2excel({
        //        filename: "Table.xls"
        //    });
        //};
        //$scope.onload();

    }]);

