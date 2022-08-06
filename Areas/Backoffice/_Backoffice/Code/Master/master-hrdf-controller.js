
let api_selectdatabyid = backlink + "backoffice/api/hrdf/hrdf_apiSelect";
let api_filltabledata = backlink + "backoffice/api/hrdf/hrdf_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/hrdf/hrdf_apiInsert";
let api_updatedata = backlink + "backoffice/api/hrdf/hrdf_apiUpdate";
let api_deletedata = backlink + "backoffice/api/hrdf/hrdf_apiDelete";
let api_uploadExcel = backlink + "backoffice/api/hrdf/hrdf_apiUploadExcelFile";
/* list */
let api_filltabledata_list = backlink + "backoffice/api/hrdflist/hrdflist_apiSelectAll";
let api_listinsertdata = backlink + "backoffice/api/hrdflist/hrdflist_apiInsert";
let api_listupdatedata = backlink + "backoffice/api/hrdflist/hrdflist_apiUpdate";

app.controller("master-hrdf-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.masterhrdfId = 0;
            $scope.masterhrdfCode = "";
            $scope.masterhrdfTitle = "";
            $scope.masterhrdfEmployeePer = 0;
            $scope.masterhrdfEmployerPer = 0;
            $scope.masterhrdfIsActive = true;
            /* search */
            $scope.SearchMasterhrdfTitle = "";
            $scope.SearchMasterhrdfIsActive = "true";
            $("#searchModal").modal("hide");

            $scope.hideEntry = true;
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
            let strWhere = "";
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: strWhere,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_AddRecord = () => {
            $scope.onLoad_Clear();
            $scope.hideEntry = false;
        };

        $scope.onClick_Submit = () => {
            try {

                let masterhrdfId = $scope.masterhrdfId;
                let masterhrdfCode = $scope.masterhrdfCode;
                let masterhrdfTitle = $scope.masterhrdfTitle;
                let masterhrdfEmployeePer = $scope.masterhrdfEmployeePer;
                let masterhrdfEmployerPer = $scope.masterhrdfEmployerPer;
                let masterhrdfIsActive = $scope.masterhrdfIsActive;

                let req = {};
                if (masterhrdfId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "masterhrdfId": masterhrdfId,
                    "masterhrdfCode": masterhrdfCode,
                    "masterhrdfTitle": masterhrdfTitle,
                    "masterhrdfEmployeePer": masterhrdfEmployeePer,
                    "masterhrdfEmployerPer": masterhrdfEmployerPer,
                    "masterhrdfIsActive": masterhrdfIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masterhrdfId == 0)
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
                        "masterhrdfId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.masterhrdfId = res.data.masterhrdfId;
                            $scope.masterhrdfCode = res.data.masterhrdfCode;
                            $scope.masterhrdfTitle = res.data.masterhrdfTitle;
                            $scope.masterhrdfEmployeePer = res.data.masterhrdfEmployeePer;
                            $scope.masterhrdfEmployerPer = res.data.masterhrdfEmployerPer;
                            $scope.masterhrdfIsActive = res.data.masterhrdfIsActive.data[0] == 1 ? true : false;

                            $scope.hideEntry = false;
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
                            "masterhrdfId": id
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

        $scope.pageChanged = () => {
            $scope.onLoad_MasterService();
        };

        $scope.changePageSize = () => {
            $scope.pageIndex = 1;
            $scope.onLoad_MasterService();
        };

        //. search result .

        $scope.onClick_OpenSearch = () => {
            $("#searchModal").modal("show");
        };

        $scope.onClick_CloseSearch = () => {
            $("#searchModal").modal("hide");
        };

        $scope.onClick_SearchResult = () => {
            let SearchMasterhrdfTitle = $scope.SearchMasterhrdfTitle;
            let SearchMasterhrdfIsActive = $scope.SearchMasterhrdfIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterhrdfTitle: SearchMasterhrdfTitle,
                    SearchMasterhrdfIsActive: SearchMasterhrdfIsActive,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
            $scope.onLoad_Clear();
        };

        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        /* hrdf list  */

        $scope.onClick_CancelhrdfList = () => {
            $("#hrdfList").modal("hide");
            $scope.onClick_Cancel();
        };

        $scope.onClick_LoadhrdfListRecord = (x) => {
            try {

                $scope.masterhrdfId = x;

                let req = {
                    method: 'POST',
                    url: api_filltabledata_list,
                    data: {
                        masterhrdfId: $scope.masterhrdfId,
                        pageIndex: 0,
                        pageSize: 'all'
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            if (res.data.length > 0) {
                                let verb = {};
                                let Data = res.data[0];

                                verb.masterhrdflistId = 0;
                                verb.masterhrdflistFrom = parseFloat(Data.masterhrdflistTo) + 0.01;
                                verb.masterhrdflistTo = '';
                                verb.masterhrdflistDifference = '';
                                verb.masterhrdflistEmploeePercentage = '';
                                verb.masterhrdflistEmployerPercentage = '';

                                res.data.unshift(verb);
                            }

                            $scope.tableParamsList = res.data;
                        }
                        else {
                            let res = [];

                            let verb = {};
                            verb.masterhrdflistId = 0;
                            verb.masterhrdflistFrom = 0.01;
                            verb.masterhrdflistTo = '';
                            verb.masterhrdflistDifference = '';
                            verb.masterhrdflistEmploeePercentage = '';
                            verb.masterhrdflistEmployerPercentage = '';

                            res.unshift(verb);

                            $scope.tableParamsList = res;
                        }
                        $("#hrdfList").modal("show");
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_InsertUpdateListRecord = (x) => {
            try {

                let masterhrdflistId = x.masterhrdflistId;
                let masterhrdfId = $scope.masterhrdfId;
                let masterhrdflistFrom = x.masterhrdflistFrom;
                let masterhrdflistTo = x.masterhrdflistTo;
                let masterhrdflistDifference = 0;
                let masterhrdflistEmploeePercentage = x.masterhrdflistEmploeePercentage;
                let masterhrdflistEmployerPercentage = x.masterhrdflistEmployerPercentage;
                let masterhrdflistIsActive = true;

                let req = {};
                if (masterhrdflistId == 0)
                    req = {
                        method: 'POST',
                        url: api_listinsertdata,
                        data: {
                            "masterhrdflistId": masterhrdflistId,
                            "masterhrdfId": masterhrdfId,
                            "masterhrdflistFrom": masterhrdflistFrom,
                            "masterhrdflistTo": masterhrdflistTo,
                            "masterhrdflistDifference": masterhrdflistDifference,
                            "masterhrdflistEmploeePercentage": masterhrdflistEmploeePercentage,
                            "masterhrdflistEmployerPercentage": masterhrdflistEmployerPercentage,
                            "masterhrdflistIsActive": masterhrdflistIsActive
                        }
                    };
                else
                    req = {
                        method: 'POST',
                        url: api_listupdatedata,
                        data: {
                            "masterhrdflistId": masterhrdflistId,
                            "masterhrdfId": masterhrdfId,
                            "masterhrdflistFrom": masterhrdflistFrom,
                            "masterhrdflistTo": masterhrdflistTo,
                            "masterhrdflistDifference": masterhrdflistDifference,
                            "masterhrdflistEmploeePercentage": masterhrdflistEmploeePercentage,
                            "masterhrdflistEmployerPercentage": masterhrdflistEmployerPercentage,
                            "masterhrdflistIsActive": masterhrdflistIsActive
                        }
                    };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masterhrdflistId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $scope.onClick_LoadhrdfListRecord($scope.masterhrdfId);
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);