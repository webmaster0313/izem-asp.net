let api_selectdata = backlink + "employer/api/employertemplatepage/employertemplatepage_apiSelect";
let api_insertdata = backlink + "employer/api/employertemplatepage/employertemplatepage_apiInsert";
let api_deletedata = backlink + "employer/api/employertemplatepage/employertemplatepage_apiDelete";

app.controller("employer-templatepermission-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;

        $scope.onLoad_MasterTemplate = () => {
            try {

                httpCommonService.fill_employerTemplate()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employerMasterTemplate = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_MasterTemplate();

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.totalCount = res.count;
                            if (res.data.length > 0) {
                                for (let i = 0; i < res.data.length; i++) {
                                    if (res.data[i].isAccess == 1)
                                        res.data[i].isAccess = true;
                                    if (res.data[i].isAdd == 1)
                                        res.data[i].isAdd = true;
                                    if (res.data[i].isEdit == 1)
                                        res.data[i].isEdit = true;
                                    if (res.data[i].isDelete == 1)
                                        res.data[i].isDelete = true;
                                    if (res.data[i].isReport == 1)
                                        res.data[i].isReport = true;
                                }
                            }
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
                url: api_selectdata,
                data: {
                    "employerId": $scope._izemEmployerId,
                    employerTemplateId: $scope.employerTemplateId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };
            $scope.onLoad_FillTable(req);
        };

        $scope.onChange_Template = () => {
            if ($scope.employerTemplateId != "" && $scope.employerTemplateId != undefined)
                $scope.onLoad_MasterService();
            else {
                $scope.totalCount = 0;
                $scope.tableParams = [];
                $scope.loaded = false;
            }
        };

        $scope.onLoad_Clear = () => {
            $scope.employerTemplateId = "";
        };
        $scope.onLoad_Clear();

        $scope.onClick_Submit = () => {

            try {

                let tableData = $scope.tableParams;
                let employerTemplateId = $scope.employerTemplateId;

                let req = { method: 'POST', url: api_insertdata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerTemplateId": employerTemplateId,
                    "tableData": JSON.stringify(tableData)
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            updateMsg();
                            $scope.onLoad_MasterService();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_Delete = () => {

            try {

                let employerTemplateId = $scope.employerTemplateId;

                let value = deleteConfirm();
                if (value == "Yes") {

                    let req = {
                        method: 'POST',
                        url: api_deletedata,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employerTemplateId": employerTemplateId
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

    }]);