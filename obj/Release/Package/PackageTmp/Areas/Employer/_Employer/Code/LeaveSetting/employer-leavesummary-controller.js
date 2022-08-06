//. Employee list
let api_filltabledata = backlink + "employer/api/employee/employee_apiSelectAll";

//. Employee Leave Report
let api_selectEmployeeCalculation = backlink + "employer/api/employeeleavereport/employeeleavereport_apiEmployeeCurrentYearCalculation";
let api_selectCalculation = backlink + "employer/api/employeeleavereport/employeeleavereport_apiCurrentYearCalculation";

app.controller("employer-leavesummary-controller", ['$scope', 'httpService', 'httpCommonService', '$http',
    function ($scope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;

        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Leave entries' && x.pageName == 'Leave Report');
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

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.SearchYear = moment().format("YYYY");

            $("#searchModal").modal("hide");
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

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "employerId": $scope._izemEmployerId,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_ViewYearReport = (x) => {
            try {

                if (x.employeeLeaving == null) {

                    let req = {
                        method: 'POST',
                        url: api_selectEmployeeCalculation,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employeeId": x.employeeId,
                            "SearchYear": moment(new Date()).format("YYYY")
                        }
                    };

                    httpService.httpFetchData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                let data = res.data;
                                $scope.subtableParams = data;
                                $("#yearModal").modal("show");
                            }
                        }, (err) => {
                            console.log(err)
                        });

                }
                else {
                    warningMsg("No records", "Employee is In-Active!");
                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_CloseYearProcess = () => {
            $("#yearModal").modal("hide");
        };

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };

        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");

            $scope.onLoad_Clear();
        };

        $scope.onClick_SearchResult = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_selectCalculation,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "SearchYear": $scope.SearchYear
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let result = res.data;
                            const uniqueEmployee = [...new Set(result.map(x => x.employeeId))];

                            var strstring = "";
                            if (uniqueEmployee.length > 0) {

                                let companyName = localStorage.getItem("_izemCompanyName");
                                let companyAddress = localStorage.getItem("_izemAddress");
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Leave Report for : " + $scope.SearchYear + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all' style = 'width: 300px;'><b> Employee Name </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'><b> Joined Date </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: right;'><b> Employee per Annum </b></td>";
                                strstring += "<td x:autofilter='all'><b> Leave Type </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Leave Entitled for the year </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Leave Earned up to date </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Leave b/f </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Leave </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Leave Taken </b></td>";
                                strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'><b> Total Balance </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < uniqueEmployee.length; i++) {
                                    let data = result.filter(x => x.employeeId == uniqueEmployee[i]);
                                    if (data.length > 0) {
                                        for (j = 0; j < data.length; j++) {
                                            strstring += "<tr>";
                                            if (j == 0) {
                                                strstring += "<td x:autofilter='all' style = 'width: 300px;'>" + data[j].memberName + "</td>";
                                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: center;'>" + data[j].employeeJoining + "</td>";
                                                strstring += "<td x:autofilter='all' style = 'width: 100px; text-align: right;'>" + data[j].employeesalarysetupCurrentBasic + "'</td>";
                                            }
                                            else {
                                                strstring += "<td x:autofilter='all'></td>";
                                                strstring += "<td x:autofilter='all'></td>";
                                                strstring += "<td x:autofilter='all'></td>";
                                            }
                                            strstring += "<td x:autofilter='all' style = 'width: 300px;'>" + data[j].employerleavetypeLeaveType + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'>" + data[j].totalEntitleForYear + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'>" + data[j].EntitleDay + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'>" + data[j].previousYearBnf + "</td>";
                                            let a = parseFloat(data[j].EntitleDay);
                                            let b = parseFloat(data[j].previousYearBnf);
                                            let c = a + b;
                                            strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'>" + c + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'>" + data[j].totalLeave + "</td>";
                                            strstring += "<td x:autofilter='all' style = 'width: 80px; text-align: center;'>" + data[j].totalLeaveBalance + "</td>";
                                            strstring += "</tr>";
                                        }
                                    }
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "<td x:autofilter='all'></td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Leave Summary Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                    }, (err) => {
                        console.log(err)
                    });

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
    }]);