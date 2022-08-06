

let api_selectdatabyid_employeeentitlementsetup = backlink + "employer/api/employee/employee_apiSelect";
let api_selectdatabyid_employerentitlement = backlink + "employer/api/employerentitlement/employerentitlement_apiSelect";
let api_updatedata_employeeentitlementsetup = backlink + "employer/api/employee/employee_apiUpdateEntitlement";

app.controller("employee-entitlementsetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.onLoad_Clear = () => {
            $scope.employerentitlementLimitCategroy1 = false;
            $scope.employerentitlementLimitEmployee1 = '';
            $scope.employerentitlementLimitDependent1 = '';
            $scope.employerentitlementVisitLimitEmployee1 = '';
            $scope.employerentitlementVisitLimitDependent1 = '';

            $scope.employerentitlementLimitCategroy2 = false;
            $scope.employerentitlementLimitEmployee2 = '';
            $scope.employerentitlementLimitDependent2 = '';
            $scope.employerentitlementVisitLimitEmployee2 = '';
            $scope.employerentitlementVisitLimitDependent2 = '';

            $scope.employerentitlementLimitCategroy3 = false;
            $scope.employerentitlementLimitEmployee3 = '';
            $scope.employerentitlementVisitLimitEmployee3 = '';
        };

        $scope.onLoadView_Entitlement = () => {
            try {
                let req = {
                    method: 'POST',
                    url: api_selectdatabyid_employerentitlement,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employerentitlementId": $scope.employerentitlementId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let result = res.data;

                            $scope.employerentitlementTitle = result.employerentitlementTitle;
                            $scope.employerentitlementVisitAllowed = result.employerentitlementVisitAllowed;
                            $scope.employerentitlementVisitDuration = result.employerentitlementVisitDuration;
                            $scope.employerentitlementRemarks = result.employerentitlementRemarks;

                            if (result.employerentitlementLimitCategroy == 0) {
                                $scope.employerentitlementLimitCategroy1 = true;
                                $scope.employerentitlementLimitEmployee1 = result.employerentitlementLimitEmployee;
                                $scope.employerentitlementLimitDependent1 = result.employerentitlementLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee1 = result.employerentitlementVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent1 = result.employerentitlementVisitLimitDependent;
                            }
                            if (result.employerentitlementLimitCategroy == 1) {
                                $scope.employerentitlementLimitCategroy2 = true;
                                $scope.employerentitlementLimitEmployee2 = result.employerentitlementLimitEmployee;
                                $scope.employerentitlementLimitDependent2 = result.employerentitlementLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee2 = result.employerentitlementVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent2 = result.employerentitlementVisitLimitDependent;
                            }
                            if (result.employerentitlementLimitCategroy == 2) {
                                $scope.employerentitlementLimitCategroy3 = true;
                                $scope.employerentitlementLimitEmployee3 = result.employerentitlementLimitEmployee;
                                $scope.employerentitlementVisitLimitEmployee3 = result.employerentitlementVisitLimitEmployee;
                            }
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoadView_Employee = () => {
            try {
                let req = {
                    method: 'POST',
                    url: api_selectdatabyid_employeeentitlementsetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": $scope.employeeId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let result = res.data;

                            $scope.employerentitlementTitle = result.employerentitlementTitle;
                            $scope.employerentitlementVisitAllowed = result.employeeVisitAllowed;
                            $scope.employerentitlementVisitDuration = result.employeeVisitDuration;
                            $scope.employerentitlementRemarks = result.employeeEntitlementRemarks;

                            if (result.employeeLimitCategroy == 0) {
                                $scope.employerentitlementLimitCategroy1 = true;
                                $scope.employerentitlementLimitEmployee1 = result.employeeLimitEmployee;
                                $scope.employerentitlementLimitDependent1 = result.employeeLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee1 = result.employeeVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent1 = result.employeeVisitLimitDependent;
                            }
                            if (result.employeeLimitCategroy == 1) {
                                $scope.employerentitlementLimitCategroy2 = true;
                                $scope.employerentitlementLimitEmployee2 = result.employeeLimitEmployee;
                                $scope.employerentitlementLimitDependent2 = result.employeeLimitDependent;
                                $scope.employerentitlementVisitLimitEmployee2 = result.employeeVisitLimitEmployee;
                                $scope.employerentitlementVisitLimitDependent2 = result.employeeVisitLimitDependent;
                            }
                            if (result.employeeLimitCategroy == 2) {
                                $scope.employerentitlementLimitCategroy3 = true;
                                $scope.employerentitlementLimitEmployee3 = result.employeeLimitEmployee;
                                $scope.employerentitlementVisitLimitEmployee3 = result.employeeVisitLimitEmployee;
                            }
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_Submit = () => {
            let employeeId = $scope.employeeId;

            let employerentitlementLimitCategroy1 = $scope.employerentitlementLimitCategroy1;
            let employerentitlementLimitEmployee1 = $scope.employerentitlementLimitEmployee1;
            let employerentitlementLimitDependent1 = $scope.employerentitlementLimitDependent1;
            let employerentitlementVisitLimitEmployee1 = $scope.employerentitlementVisitLimitEmployee1;
            let employerentitlementVisitLimitDependent1 = $scope.employerentitlementVisitLimitDependent1;

            let employerentitlementLimitCategroy2 = $scope.employerentitlementLimitCategroy2;
            let employerentitlementLimitEmployee2 = $scope.employerentitlementLimitEmployee2;
            let employerentitlementLimitDependent2 = $scope.employerentitlementLimitDependent2;
            let employerentitlementVisitLimitEmployee2 = $scope.employerentitlementVisitLimitEmployee2;
            let employerentitlementVisitLimitDependent2 = $scope.employerentitlementVisitLimitDependent2;

            let employerentitlementLimitCategroy3 = $scope.employerentitlementLimitCategroy3;
            let employerentitlementLimitEmployee3 = $scope.employerentitlementLimitEmployee3;
            let employerentitlementLimitDependent3 = $scope.employerentitlementLimitDependent3;
            let employerentitlementVisitLimitEmployee3 = $scope.employerentitlementVisitLimitEmployee3;
            let employerentitlementVisitLimitDependent3 = $scope.employerentitlementVisitLimitDependent3;

            let employerentitlementVisitAllowed = $scope.employerentitlementVisitAllowed;
            let employerentitlementVisitDuration = $scope.employerentitlementVisitDuration;
            let employerentitlementRemarks = $scope.employerentitlementRemarks;

            let req = {}
            if (employerentitlementLimitCategroy1 == true) {
                req = {
                    method: 'POST',
                    url: api_updatedata_employeeentitlementsetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": employeeId, "employeeLimitCategroy": "0", "employeeLimitEmployee": employerentitlementLimitEmployee1,
                        "employeeLimitDependent": employerentitlementLimitDependent1, "employeeVisitLimitEmployee": employerentitlementVisitLimitEmployee1, "employeeVisitLimitDependent": employerentitlementVisitLimitDependent1,
                        "employeeVisitAllowed": employerentitlementVisitAllowed, "employeeVisitDuration": employerentitlementVisitDuration, "employeeEntitlementRemarks": employerentitlementRemarks, "employeeIsCustomEntitled": true
                    }
                };
            }
            if (employerentitlementLimitCategroy2 == true) {
                req = {
                    method: 'POST',
                    url: api_updatedata_employeeentitlementsetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": employeeId, "employeeLimitCategroy": "1", "employeeLimitEmployee": employerentitlementLimitEmployee2,
                        "employeeLimitDependent": employerentitlementLimitDependent2, "employeeVisitLimitEmployee": employerentitlementVisitLimitEmployee2, "employeeVisitLimitDependent": employerentitlementVisitLimitDependent2,
                        "employeeVisitAllowed": employerentitlementVisitAllowed, "employeeVisitDuration": employerentitlementVisitDuration, "employeeEntitlementRemarks": employerentitlementRemarks, "employeeIsCustomEntitled": true
                    }
                };
            }
            if (employerentitlementLimitCategroy3 == true) {
                req = {
                    method: 'POST',
                    url: api_updatedata_employeeentitlementsetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": employeeId, "employeeLimitCategroy": "2", "employeeLimitEmployee": employerentitlementLimitEmployee3,
                        "employeeLimitDependent": employerentitlementLimitDependent3, "employeeVisitLimitEmployee": employerentitlementVisitLimitEmployee3, "employeeVisitLimitDependent": employerentitlementVisitLimitDependent3,
                        "employeeVisitAllowed": employerentitlementVisitAllowed, "employeeVisitDuration": employerentitlementVisitDuration, "employeeEntitlementRemarks": employerentitlementRemarks, "employeeIsCustomEntitled": true
                    }
                };
            }

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        updateMsg();
                        $scope.onLoadView_Employee();
                    }
                }, (err) => {
                    console.log(err);
                });
        };

        $scope.onClick_ResetOnCheck = (x) => {
            if (x === 'a') {
                $scope.employerentitlementLimitCategroy1 = true;
                /* null all other */
                $scope.employerentitlementLimitCategroy2 = false;
                $scope.employerentitlementLimitEmployee2 = "";
                $scope.employerentitlementVisitLimitEmployee2 = "";
                $scope.employerentitlementLimitDependent2 = "";
                $scope.employerentitlementVisitLimitDependent2 = "";

                $scope.employerentitlementLimitCategroy3 = false;
                $scope.employerentitlementLimitEmployee3 = "";
                $scope.employerentitlementVisitLimitEmployee3 = "";
            }
            if (x === 'b') {
                $scope.employerentitlementLimitCategroy2 = true;
                /* null all other */
                $scope.employerentitlementLimitCategroy1 = false;
                $scope.employerentitlementLimitEmployee1 = "";
                $scope.employerentitlementVisitLimitEmployee1 = "";
                $scope.employerentitlementLimitDependent1 = "";
                $scope.employerentitlementVisitLimitDependent1 = "";

                $scope.employerentitlementLimitCategroy3 = false;
                $scope.employerentitlementLimitEmployee3 = "";
                $scope.employerentitlementVisitLimitEmployee3 = "";
            }
            if (x === 'c') {
                $scope.employerentitlementLimitCategroy3 = true;

                $scope.employerentitlementLimitCategroy1 = false;
                $scope.employerentitlementLimitEmployee1 = "";
                $scope.employerentitlementVisitLimitEmployee1 = "";
                $scope.employerentitlementLimitDependent1 = "";
                $scope.employerentitlementVisitLimitDependent1 = "";

                $scope.employerentitlementLimitCategroy2 = false;
                $scope.employerentitlementLimitEmployee2 = "";
                $scope.employerentitlementVisitLimitEmployee2 = "";
                $scope.employerentitlementLimitDependent2 = "";
                $scope.employerentitlementVisitLimitDependent2 = "";
            }
        };

        $rootScope.onLoad_UpdateEmployeeEntitlementsetup = (employeeId, employeeIsCustomEntitled, employerentitlementId) => {

            $scope.onLoad_Clear();

            $scope.employeeId = employeeId;
            $scope.employerentitlementId = employerentitlementId;
            $scope.employeeIsCustomEntitled = employeeIsCustomEntitled;

            if (employeeIsCustomEntitled == false) {
                $scope.onLoadView_Entitlement();
            }
            else {
                $scope.onLoadView_Employee();
            }
        };

    }]);