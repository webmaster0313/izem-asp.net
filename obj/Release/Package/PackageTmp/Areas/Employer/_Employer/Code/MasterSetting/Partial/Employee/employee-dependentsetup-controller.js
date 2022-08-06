
let api_selectdatabyid_employeedependent = backlink + "employer/api/employeedependent/employeedependent_apiSelect";
let api_filltabledata_employeedependent = backlink + "employer/api/employeedependent/employeedependent_apiSelectAll";
let api_insertdata_employeedependent = backlink + "employer/api/employeedependent/employeedependent_apiInsert";
let api_updatedata_employeedependent = backlink + "employer/api/employeedependent/employeedependent_apiUpdate_Relation";
let api_deletedata_employeedependent = backlink + "employer/api/employeedependent/employeedependent_apiDelete";
//.
let api_filltabledata_employeedependent_member = backlink + "member/api/member/member_apiSelectAll";

app.controller("employee-dependentsetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.loaded = false;

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.dependentTableParams = res.data;
                            $scope.dependentloaded = true;
                        }
                        else {
                            $scope.dependentTableParams = [];
                            $scope.dependentloaded = false;
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
                url: api_filltabledata_employeedependent,
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

        $scope.onLoad_MasterMemberService = () => {

            if ($scope.searchbypassport == "" && $scope.searchbynric == "") {
                alert("Please provide search value!")
                return;
            }

            let req = {
                method: 'POST',
                url: api_filltabledata_employeedependent_member,
                data: {
                    "employerId": $scope._izemEmployerId,
                    searchbypassport: $scope.searchbypassport,
                    searchbynric: $scope.searchbynric,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.memberTableParams = res.data;
                        $scope.memberloaded = true;
                    }
                    else {
                        $scope.memberTableParams = [];
                        $scope.memberloaded = false;
                    }
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_resetFromDependentForm = () => {
            $scope.searchbypassport = "";
            $scope.searchbynric = "";

            $scope.memberTableParams = [];
            $scope.memberloaded = false;
        };

        $scope.onClick_AddMemberToDependent = (x) => {

            let employeedependentId = 0;
            let employeeId = $scope.employeeId;
            let masterrelationshipId = "";
            let employeedependentMemberId = x.memberId;
            let employeedependentIsActive = true;

            let req = {
                method: 'POST',
                url: api_insertdata_employeedependent,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeedependentId": employeedependentId,
                    "employeeId": employeeId,
                    "masterrelationshipId": masterrelationshipId,
                    "employeedependentMemberId": employeedependentMemberId,
                    "employeedependentIsActive": employeedependentIsActive
                }
            };

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeedependentId == 0)
                            insertMsg();
                        else
                            updateMsg();
                    }
                    $scope.onClick_resetFromDependentForm();
                    $scope.onLoad_MasterService();

                }, (err) => {
                    console.log(err);
                });

        };

        $scope.onClick_DeleteDependentRecord = (x) => {

            try {

                let value = deleteConfirm();
                if (value == "Yes") {

                    let req = {
                        method: 'POST',
                        url: api_deletedata_employeedependent,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeedependentId": x
                        }
                    };

                    httpService.httpRemoveData(req)
                        .then((res) => {
                            if (res.status == 200)
                                $scope.onLoad_MasterService();
                        }, (err) => {
                            console.log(err);
                        });
                }

            } catch (e) {
                console.log(e);
            }

        };

        $scope.onLoad_Relationship = () => {
            try {

                httpCommonService.fill_backoffice_relationship()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masterrelationshipId = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChange_UpdateRelationShip = (x, id) => {

            let req = {
                method: 'POST',
                url: api_updatedata_employeedependent,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeedependentId": id,
                    "masterrelationshipId": x
                }
            };

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        updateMsg();
                        $scope.onLoad_FillDependentTable();
                    }
                }, (err) => {
                    console.log(err);
                });
        };

        $rootScope.onLoad_EmployeeDependentSetup = (employeeId) => {
            $scope.employeeId = employeeId;

            $scope.searchbypassport = "";
            $scope.searchbynric = "";

            $scope.onLoad_Relationship();
        };

    }]);