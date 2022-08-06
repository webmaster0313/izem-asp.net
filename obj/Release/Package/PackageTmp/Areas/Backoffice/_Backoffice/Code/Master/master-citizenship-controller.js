
let api_selectdatabyid = backlink + "backoffice/api/citizenship/citizenship_apiSelect";
let api_filltabledata = backlink + "backoffice/api/citizenship/citizenship_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/citizenship/citizenship_apiInsert";
let api_updatedata = backlink + "backoffice/api/citizenship/citizenship_apiUpdate";
let api_deletedata = backlink + "backoffice/api/citizenship/citizenship_apiDelete";

app.controller("master-citizenship-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.mastercitizenshipId = 0;
            $scope.mastercitizenshipCode = "";
            $scope.mastercitizenshipTitle = "";
            $scope.mastercitizenshipIsActive = true;
            /* search */
            $scope.SearchMasterCitizenshipTitle = "";
            $scope.SearchMasterCitizenshipIsActive = "true";
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
            $scope.hideEntry = false;
        };

        $scope.onClick_Submit = () => {
            try {

                let mastercitizenshipId = $scope.mastercitizenshipId;
                let mastercitizenshipCode = $scope.mastercitizenshipCode;
                let mastercitizenshipTitle = $scope.mastercitizenshipTitle;
                let mastercitizenshipIsActive = $scope.mastercitizenshipIsActive;

                let req = {};
                if (mastercitizenshipId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "mastercitizenshipId": mastercitizenshipId,
                    "mastercitizenshipCode": mastercitizenshipCode,
                    "mastercitizenshipTitle": mastercitizenshipTitle,
                    "mastercitizenshipIsActive": mastercitizenshipIsActive
                }

                req.data = pera;
               
                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (mastercitizenshipId == 0)
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
                        "mastercitizenshipId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.mastercitizenshipId = res.data.mastercitizenshipId;
                            $scope.mastercitizenshipCode = res.data.mastercitizenshipCode;
                            $scope.mastercitizenshipTitle = res.data.mastercitizenshipTitle;
                            $scope.mastercitizenshipIsActive = res.data.mastercitizenshipIsActive.data[0] == 1 ? true : false;

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
                        data: { "mastercitizenshipId": id }
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
            let SearchMasterCitizenshipTitle = $scope.SearchMasterCitizenshipTitle;
            let SearchMasterCitizenshipIsActive = $scope.SearchMasterCitizenshipIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterCitizenshipTitle: SearchMasterCitizenshipTitle,
                    SearchMasterCitizenshipIsActive: SearchMasterCitizenshipIsActive,
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

    }]);