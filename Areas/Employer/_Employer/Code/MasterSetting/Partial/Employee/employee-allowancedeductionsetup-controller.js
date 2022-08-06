

let api_selectdatabyid_allowancendeductionsetup = backlink + "employer/api/employeeallowancendeduction/employeeallowancendeduction_apiSelect";
let api_filltabledata_allowancendeductionsetup = backlink + "employer/api/employeeallowancendeduction/employeeallowancendeduction_apiSelectAll";
let api_insertdata_allowancendeductionsetup = backlink + "employer/api/employeeallowancendeduction/employeeallowancendeduction_apiInsert";
let api_updatedata_allowancendeductionsetup = backlink + "employer/api/employeeallowancendeduction/employeeallowancendeduction_apiUpdate";
let api_deletedata_allowancendeductionsetup = backlink + "employer/api/employeeallowancendeduction/employeeallowancendeduction_apiDelete";

app.controller("employee-allowancedeductionsetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;

        $scope.onLoad_Clear = () => {
            $scope.employeeallowancendeductionId = 0;
            $scope.employerallowanceId = "";
            $scope.employeeallowancendeductionAmount = 0.0;
            $scope.employeeallowancendeductionFromDate = new Date();
            $scope.employeeallowancendeductionToDate = new Date();
        };

        $scope.onLoad_EmployerAllowance = () => {

            try {

                httpCommonService.fill_employee_allowance1()
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
                url: api_filltabledata_allowancendeductionsetup,
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

        $scope.onClick_Submit = () => {
            try {

                let employeeallowancendeductionId = $scope.employeeallowancendeductionId;
                let employerallowanceId = $scope.employerallowanceId;
                let employeeallowancendeductionAmount = $scope.employeeallowancendeductionAmount;
                let employeeallowancendeductionFromDate = moment($scope.employeeallowancendeductionFromDate).format("YYYY-MM-01");
                let employeeallowancendeductionToDate = moment($scope.employeeallowancendeductionToDate).format("YYYY-MM-01");

                let req = {};
                if (employeeallowancendeductionId == 0)
                    req = { method: 'POST', url: api_insertdata_allowancendeductionsetup };
                else
                    req = { method: 'POST', url: api_updatedata_allowancendeductionsetup };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employeeallowancendeductionId": employeeallowancendeductionId, "employeeId": $scope.employeeId, "employerallowanceId": employerallowanceId,
                    "employeeallowancendeductionAmount": employeeallowancendeductionAmount, "employeeallowancendeductionFromDate": employeeallowancendeductionFromDate,
                    "employeeallowancendeductionToDate": employeeallowancendeductionToDate
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeeallowancendeductionId == 0)
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
                    url: api_selectdatabyid_allowancendeductionsetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeallowancendeductionId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employeeallowancendeductionId = res.data.employeeallowancendeductionId;
                            $scope.employerallowanceId = res.data.employerallowanceId;
                            $scope.employeeallowancendeductionAmount = res.data.employeeallowancendeductionAmount;
                            $scope.employeeallowancendeductionFromDate = new Date(res.data.employeeallowancendeductionFromDate);
                            $scope.employeeallowancendeductionToDate = new Date(res.data.employeeallowancendeductionToDate);
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
                        url: api_deletedata_allowancendeductionsetup,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeeallowancendeductionId": id
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

        $rootScope.onLoad_UpdateEmployeeAllowanceDeductionSetup = (employeeId) => {
            $scope.employeeId = employeeId;

            $scope.onLoad_Clear();
            $scope.onLoad_EmployerAllowance();
            $scope.onLoad_MasterService();
        };

    }]);