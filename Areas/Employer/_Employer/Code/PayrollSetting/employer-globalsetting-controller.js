
let api_selectdatabyid = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiSelect";
let api_filltabledata = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiInsert";
let api_updatedata = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiUpdate";
let api_deletedata = backlink + "employer/api/employerglobalpayroll/employerglobalpayroll_apiDelete";

app.controller("employer-globalsetting-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        //. Rights
        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Global Setup');
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
        //.

        $scope.onLoad_Clear = () => {
            $scope.employerglobalpayrollId = 0;
            $scope.employerglobalpayrollEPFNumber = "";
            $scope.employerglobalpayrollSocsoNumber = "";
            $scope.employerglobalpayrollPCBNumber = "";
            $scope.employerglobalpayrollEISNumber = "";
            $scope.employerglobalpayrollIncomeTaxNumber = "";
            $scope.employerglobalpayrollOther1 = "";
            $scope.employerglobalpayrollOther2 = "";
            $scope.employerglobalpayrollPayslipTemplateType = "0";
        };
        $scope.onLoad_Clear();

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerglobalpayrollId = res.data[0].employerglobalpayrollId;
                            $scope.employerglobalpayrollEPFNumber = res.data[0].employerglobalpayrollEPFNumber;
                            $scope.employerglobalpayrollSocsoNumber = res.data[0].employerglobalpayrollSocsoNumber;
                            $scope.employerglobalpayrollPCBNumber = res.data[0].employerglobalpayrollPCBNumber;
                            $scope.employerglobalpayrollEISNumber = res.data[0].employerglobalpayrollEISNumber;
                            $scope.employerglobalpayrollIncomeTaxNumber = res.data[0].employerglobalpayrollIncomeTaxNumber;
                            $scope.employerglobalpayrollOther1 = res.data[0].employerglobalpayrollOther1;
                            $scope.employerglobalpayrollOther2 = res.data[0].employerglobalpayrollOther2;
                            $scope.employerglobalpayrollPayslipTemplateType = res.data[0].employerglobalpayrollPayslipTemplateType.toString();
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
                url: api_filltabledata,
                data: {
                    strWhere: strWhere,
                    "employerId": $scope._izemEmployerId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_Submit = () => {
            try {

                let employerglobalpayrollId = $scope.employerglobalpayrollId;
                let employerglobalpayrollEPFNumber = $scope.employerglobalpayrollEPFNumber;
                let employerglobalpayrollSocsoNumber = $scope.employerglobalpayrollSocsoNumber;
                let employerglobalpayrollPCBNumber = $scope.employerglobalpayrollPCBNumber;
                let employerglobalpayrollEISNumber = $scope.employerglobalpayrollEISNumber;
                let employerglobalpayrollIncomeTaxNumber = $scope.employerglobalpayrollIncomeTaxNumber;
                let employerglobalpayrollOther1 = $scope.employerglobalpayrollOther1;
                let employerglobalpayrollOther2 = $scope.employerglobalpayrollOther2;
                let employerglobalpayrollPayslipTemplateType = $scope.employerglobalpayrollPayslipTemplateType;

                let req = {};
                if (employerglobalpayrollId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerglobalpayrollId": employerglobalpayrollId,
                    "employerglobalpayrollEPFNumber": employerglobalpayrollEPFNumber,
                    "employerglobalpayrollSocsoNumber": employerglobalpayrollSocsoNumber,
                    "employerglobalpayrollPCBNumber": employerglobalpayrollPCBNumber,
                    "employerglobalpayrollEISNumber": employerglobalpayrollEISNumber,
                    "employerglobalpayrollIncomeTaxNumber": employerglobalpayrollIncomeTaxNumber,
                    "employerglobalpayrollOther1": employerglobalpayrollOther1,
                    "employerglobalpayrollOther2": employerglobalpayrollOther2,
                    "employerglobalpayrollPayslipTemplateType": employerglobalpayrollPayslipTemplateType
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerglobalpayrollId == 0)
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

    }]);