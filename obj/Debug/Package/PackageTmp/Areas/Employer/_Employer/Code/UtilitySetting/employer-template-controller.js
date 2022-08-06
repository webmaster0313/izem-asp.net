
let api_selectdatabyid = backlink + "employer/api/employertemplate/employertemplate_apiSelect";
let api_filltabledata = backlink + "employer/api/employertemplate/employertemplate_apiSelectAll";
let api_insertdata = backlink + "employer/api/employertemplate/employertemplate_apiInsert";
let api_updatedata = backlink + "employer/api/employertemplate/employertemplate_apiUpdate";
let api_deletedata = backlink + "employer/api/employertemplate/employertemplate_apiDelete";

app.controller("employer-template-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.onLoad_Clear = () => {
            $scope.employerTemplateId = 0;
            $scope.templateName = "";
            $scope.isFullAccess = false;
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
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_Submit = () => {
            try {

                let employerTemplateId = $scope.employerTemplateId;
                let templateName = $scope.templateName;
                let isFullAccess = $scope.isFullAccess;

                let req = {};
                if (employerTemplateId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerTemplateId": employerTemplateId,
                    "templateName": templateName,
                    "isFullAccess": isFullAccess
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerTemplateId == 0)
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
                    url: api_selectdatabyid,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employerTemplateId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerTemplateId = res.data.employerTemplateId;
                            $scope.templateName = res.data.templateName;
                            $scope.isFullAccess = res.data.isFullAccess.data[0] == 1 ? true : false;
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
                        url: api_deletedata,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "employerTemplateId": id
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
        };

    }]);