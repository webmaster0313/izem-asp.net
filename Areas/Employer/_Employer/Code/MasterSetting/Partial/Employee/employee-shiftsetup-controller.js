

let api_selectdatabyid_shiftsetup = backlink + "employer/api/employeeassignshift/employeeassignshift_apiSelect";
let api_filltabledata_shiftsetup = backlink + "employer/api/employeeassignshift/employeeassignshift_apiSelectAll";
let api_insertdata_shiftsetup = backlink + "employer/api/employeeassignshift/employeeassignshift_apiInsert";
let api_updatedata_shiftsetup = backlink + "employer/api/employeeassignshift/employeeassignshift_apiUpdate";
let api_deletedata_shiftsetup = backlink + "employer/api/employeeassignshift/employeeassignshift_apiDelete";

//.

let apiUpdate_MultipleShiftStatus = backlink + "employer/api/employee/employee_apiUpdate_MultipleShiftStatus";

app.controller("employee-shiftsetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.loaded = false;

        $scope.onLoad_Clear = () => {
            $scope.employerMasterShiftId = "";
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

                            $scope.disabled = false;
                            if ($scope.ismultiShift == false) {
                                if ($scope.totalCount > 0) {
                                    $scope.disabled = true;
                                }
                            }
                        }
                        else {
                            $scope.totalCount = 0;
                            $scope.tableParams = [];
                            $scope.loaded = false;
                            $scope.disabled = false;
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
                url: api_filltabledata_shiftsetup,
                data: {
                    strWhere: strWhere,
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };
            $scope.onLoad_FillTable(req);
        };

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

        $scope.onClick_Submit = () => {
            try {

                let employerMasterShiftId = $scope.employerMasterShiftId;

                let req = { method: 'POST', url: api_insertdata_shiftsetup };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    "employermastershiftId": employerMasterShiftId
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();

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

        $scope.onClick_DeleteRecord = (id) => {
            try {

                let value = deleteConfirm();
                if (value == "Yes") {

                    let req = {
                        method: 'POST',
                        url: api_deletedata_shiftsetup,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeeassignshiftid": id
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

        $scope.onChange_UpdateStatus = () => {
            try {

                let status = $scope.ismultiShift;
                let employeeIsManualAttendance = $scope.employeeIsManualAttendance;

                let req = {
                    method: 'POST',
                    url: apiUpdate_MultipleShiftStatus,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": $scope.employeeId,
                        "status": status,
                        "employeeIsManualAttendance": employeeIsManualAttendance
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.ismultiShift = status;
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

        $rootScope.onLoad_EmployeeShiftSetup = (employeeId, ismultiShift, employeeIsManualAttendance) => {
            $scope.employeeId = employeeId;
            $scope.ismultiShift = ismultiShift;
            $scope.employeeIsManualAttendance = employeeIsManualAttendance;

            $scope.onLoad_Clear();
            $scope.onLoad_MasterShift();
            $scope.onLoad_MasterService();
        };

    }]);