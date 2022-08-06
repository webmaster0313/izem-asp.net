

let api_selectdatabyid_loansetup = backlink + "employer/api/employeeloan/employeeloan_apiSelect";
let api_filltabledata_loansetup = backlink + "employer/api/employeeloan/employeeloan_apiSelectAll";
let api_insertdata_loansetup = backlink + "employer/api/employeeloan/employeeloan_apiInsert";
let api_updatedata_loansetup = backlink + "employer/api/employeeloan/employeeloan_apiUpdate";
let api_deletedata_loansetup = backlink + "employer/api/employeeloan/employeeloan_apiDelete";

app.controller("employee-loansetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.loaded = false;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.employeeloanId = 0;
            $scope.employeeloanNote = "";
            $scope.employeeloanTakenDate = new Date();
            $scope.employeeloanAmount = 0.0;
            $scope.employeeloanFromDate = new Date();
            $scope.employeeloanToDate = new Date();
            $scope.employeeloanDeductionAmount = 0.0;
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
                url: api_filltabledata_loansetup,
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

                let employeeloanId = $scope.employeeloanId;
                let employeeloanNote = $scope.employeeloanNote;
                let employeeloanTakenDate = ConvertDateforDatabase($scope.employeeloanTakenDate);
                let employeeloanAmount = $scope.employeeloanAmount;
                let employeeloanFromDate = ConvertDateforDatabase($scope.employeeloanFromDate);
                let employeeloanToDate = ConvertDateforDatabase($scope.employeeloanToDate);
                let employeeloanDeductionAmount = $scope.employeeloanDeductionAmount;

                let req = {};
                if (employeeloanId == 0)
                    req = { method: 'POST', url: api_insertdata_loansetup };
                else
                    req = { method: 'POST', url: api_updatedata_loansetup };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employeeloanId": employeeloanId, "employeeId": $scope.employeeId, "employeeloanNote": employeeloanNote,
                    "employeeloanTakenDate": employeeloanTakenDate, "employeeloanAmount": employeeloanAmount, "employeeloanFromDate": employeeloanFromDate,
                    "employeeloanToDate": employeeloanToDate, "employeeloanDeductionAmount": employeeloanDeductionAmount
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeeloanId == 0)
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
                    url: api_selectdatabyid_loansetup,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": $scope.employeeId,
                        "employeeloanId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employeeloanId = res.data.employeeloanId;
                            $scope.employeeloanNote = res.data.employeeloanNote;
                            $scope.employeeloanTakenDate = new Date(res.data.employeeloanTakenDate);
                            $scope.employeeloanAmount = res.data.employeeloanAmount;
                            $scope.employeeloanFromDate = new Date(res.data.employeeloanFromDate);
                            $scope.employeeloanToDate = new Date(res.data.employeeloanToDate);
                            $scope.employeeloanDeductionAmount = res.data.employeeloanDeductionAmount;
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
                        url: api_deletedata_loansetup,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeeId": $scope.employeeId,
                            "employeeloanId": id
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

        $scope.pageChanged = () => {
            $scope.onLoad_MasterService();
        };

        $scope.changePageSize = () => {
            $scope.pageIndex = 1;
            $scope.onLoad_MasterService();
        };

        $rootScope.onLoad_UpdateEmployeeLoanSetup = (employeeId) => {
            $scope.employeeId = employeeId;

            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

    }]);