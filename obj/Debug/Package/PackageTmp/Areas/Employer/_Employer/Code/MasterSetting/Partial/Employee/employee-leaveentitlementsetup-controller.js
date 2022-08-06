
let api_selectdatabyid_leaveentitlementsetup = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiSelect";
let api_filltabledata_leaveentitlementsetup = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiSelectAll";
let api_insertdata_leaveentitlementsetup = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiInsert";
let api_updatedata_leaveentitlementsetup = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiUpdate";
let api_deletedata_leaveentitlementsetup = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiDelete";
//.
let api_selectdatabyid_entitlementcalculation = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiEntitlementCalculation";
let api_apiUpdateStatus = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiUpdateStatus";


app.controller("employee-leaveentitlementsetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.loaded = false;

        $scope.onLoad_Clear = () => {
            $scope.employeeleaveentitlementId = 0;
            $scope.employerleavetypeId = "";
            $scope.employeeleaveentitlementAllowendbnf = 0;
            $scope.employeeleaveentitlementEntitled = 0;
            $scope.employeeleaveentitlementPreviousYearBnf = 0;
            $scope.employeeleaveentitlementAllowedbnfOverride = 0;
            $scope.employeeleaveentitlementPreviousYearBalance = 0;
        };

        $scope.onLoad_LeaveType = () => {
            try {
                httpCommonService.fill_employer_leavetype()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employerleavetypeId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }
        };

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
            let strWhere = "";
            let req = {
                method: 'POST',
                url: api_filltabledata_leaveentitlementsetup,
                data: {
                    strWhere: strWhere,
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };

        $scope.onClick_Submit = () => {
            try {

                let employeeleaveentitlementId = $scope.employeeleaveentitlementId;
                let employeeId = $scope.employeeId;
                let employerleavetypeId = $scope.employerleavetypeId;
                let employeeleaveentitlementAllowendbnf = $scope.employeeleaveentitlementAllowendbnf;
                let employeeleaveentitlementEntitled = $scope.employeeleaveentitlementEntitled;
                let employeeleaveentitlementPreviousYearBnf = $scope.employeeleaveentitlementPreviousYearBnf;
                let employeeleaveentitlementAllowedbnfOverride = $scope.employeeleaveentitlementAllowedbnfOverride;
                let employeeleaveentitlementPreviousYearBalance = $scope.employeeleaveentitlementPreviousYearBalance;

                let req = {};
                if (employeeleaveentitlementId == 0)
                    req = { method: 'POST', url: api_insertdata_leaveentitlementsetup };
                else
                    req = { method: 'POST', url: api_updatedata_leaveentitlementsetup };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employeeleaveentitlementId": employeeleaveentitlementId, "employeeId": employeeId, "employerleavetypeId": employerleavetypeId,
                    "employeeleaveentitlementAllowendbnf": employeeleaveentitlementAllowendbnf, "employeeleaveentitlementEntitled": employeeleaveentitlementEntitled,
                    "employeeleaveentitlementPreviousYearBnf": employeeleaveentitlementPreviousYearBnf,
                    "employeeleaveentitlementAllowedbnfOverride": employeeleaveentitlementAllowedbnfOverride,
                    "employeeleaveentitlementPreviousYearBalance": employeeleaveentitlementPreviousYearBalance
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeeleaveentitlementId == 0)
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
                    url: api_selectdatabyid_leaveentitlementsetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeleaveentitlementId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employeeleaveentitlementId = res.data.employeeleaveentitlementId;
                            $scope.employerleavetypeId = res.data.employerleavetypeId;
                            $scope.employeeleaveentitlementAllowendbnf = res.data.employeeleaveentitlementAllowendbnf;
                            $scope.employeeleaveentitlementEntitled = res.data.employeeleaveentitlementEntitled;
                            $scope.employeeleaveentitlementPreviousYearBnf = res.data.employeeleaveentitlementPreviousYearBnf;
                            $scope.employeeleaveentitlementAllowedbnfOverride = res.data.employeeleaveentitlementAllowedbnfOverride;
                            $scope.employeeleaveentitlementPreviousYearBalance = res.data.employeeleaveentitlementPreviousYearBalance;

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
                        url: api_deletedata_leaveentitlementsetup,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeeleaveentitlementId": id
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

        $scope.onChange_LeaveType = () => {
            try {

                $scope.employeeleaveentitlementEntitled = 0;
                $scope.employeeleaveentitlementPreviousYearBnf = 0;
                $scope.employeeleaveentitlementAllowendbnf = 0;

                //let req = {
                //    method: 'POST',
                //    url: api_selectdatabyid_entitlementcalculation,
                //    data: {
                //        "employerId": $scope._izemEmployerId,
                //        "employeeId": $scope.employeeId,
                //        "employerleavetypeId": $scope.employerleavetypeId
                //    }
                //};

                //try {
                //    httpService.httpFetchData(req)
                //        .then((res) => {
                //            if (res.status == 200) {
                //                $scope.employeeleaveentitlementEntitled = res.data[0].entitlementDay;
                //                $scope.employeeleaveentitlementPreviousYearBnf = res.data[0].previousYearBnf;
                //                $scope.employeeleaveentitlementAllowendbnf = res.data[0].maxBnf;
                //            }
                //        }, (err) => {
                //            console.log(err)
                //        });

                //} catch (e) {
                //    console.log(e);
                //}
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onLoad_EmployeeLeaveEntitlementSetup = (employeeId) => {
            $scope.employeeId = employeeId;

            $scope.onLoad_Clear();
            $scope.onLoad_LeaveType();
            $scope.onLoad_MasterService();
        };

        //.

        $scope.onClick_UpdateStatusRecord = (id, status) => {
            try {

                let req = {
                    method: 'POST',
                    url: api_apiUpdateStatus,
                    data: {
                        "employeeleaveentitlementId": id,
                        "status": status
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.onLoad_MasterService();
                        }
                    }, (err) => {
                        console.log(err)
                    });


            } catch (e) {
                console.log(e);
            }
        };

    }]);