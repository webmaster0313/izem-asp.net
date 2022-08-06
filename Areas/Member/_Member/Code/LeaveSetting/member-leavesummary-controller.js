
let api_selectAll = backlink + "employer/api/employeeleavereport/employeeleavereport_apiSelection";
let api_selectdatabyid = backlink + "employer/api/employeeleavereport/employeeleavereport_apiSelect";
let api_filltabledata = backlink + "employer/api/employeeleavereport/employeeleavereport_apiSelectAll";
let api_insertdata = backlink + "employer/api/employeeleavereport/employeeleavereport_apiInsert";
let api_updatedata = backlink + "employer/api/employeeleavereport/employeeleavereport_apiUpdate";
let api_deletedata = backlink + "employer/api/employeeleavereport/employeeleavereport_apiDelete";
//.
let api_reportLeave = backlink + "employer/api/employeeleavereport/employeeleavereport_apiReportLeave";
let api_reportEmployeeDetail = backlink + "employer/api/employeeleavereport/employeeleavereport_apiReportEmployeeDetail";
let api_reportCurrentYearSummary = backlink + "employer/api/employeeleavereport/employeeleavereport_apiReportCurrentYearSummary";
let api_reportLeaveDetail = backlink + "employer/api/employeeleavereport/employeeleavereport_apiReportLeaveDetail";
//.
let api_autoleavecalculation = backlink + "employer/api/employeeleaveapplication/employeeleaveapplication_apiAutoLeaveCalculation";
let api_selectEmployeeCalculation = backlink + "employer/api/employeeleavereport/employeeleavereport_apiEmployeeCurrentYearCalculation";

app.controller("member-leavesummary-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemEmployeeId = localStorage.getItem("_izemEmployeeId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");
        /* Assign EmployeeId */
        $scope.employeeId = $scope._izemEmployeeId;

        $scope.loaded = false;

        $scope.onLoad_Clear = () => {
            $scope.SearchEmployeeId = $scope.employeeId;
            $scope.SearchEmployerdepartmentId = "";
            $scope.SearchEmployerbranchId = "";

            $scope.SearchYear = moment().format("YYYY");
            $scope.isCurrentYear = true;

            $("#searchModal").modal("hide");
        };
        $scope.onLoad_Clear();

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

        $scope.onClick_ViewYearReport = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectEmployeeCalculation,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": $scope._izemEmployeeId,
                        "SearchYear": moment(new Date()).format("YYYY")
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let data = res.data;
                            console.log(data);
                            $scope.subtableParams = data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onClick_ViewYearReport();

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };
        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };
        $scope.onClick_SearchResult = () => {
            $scope.onLoad_MasterService();
        };
        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };
    }]);