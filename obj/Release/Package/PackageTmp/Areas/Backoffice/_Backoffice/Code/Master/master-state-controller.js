
let api_selectdatabyid = backlink + "backoffice/api/state/state_apiSelect";
let api_filltabledata = backlink + "backoffice/api/state/state_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/state/state_apiInsert";
let api_updatedata = backlink + "backoffice/api/state/state_apiUpdate";
let api_deletedata = backlink + "backoffice/api/state/state_apiDelete";

app.controller("master-state-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.masterstateId = 0;
            $scope.mastercountryId = "";
            $scope.masterstateCode = "";
            $scope.masterstateTitle = "";
            $scope.masterstateIsActive = true;
            /* search */
            $scope.SearchMasterCountryId = "";
            $scope.SearchMasterStateTitle = "";
            $scope.SearchMasterstateIsActive = "true";
            $("#searchModal").modal("hide");

            $scope.hideEntry = true;
        };
        $scope.onLoad_Clear();

        $scope.onLoad_Country = () => {
            try {
                httpCommonService.fill_backoffice_country()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastercountryId = res.data;
                            $scope.fill_SearchMasterCountryId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Country();

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

                let masterstateId = $scope.masterstateId;
                let mastercountryId = $scope.mastercountryId;
                let masterstateCode = $scope.masterstateCode;
                let masterstateTitle = $scope.masterstateTitle;
                let masterstateIsActive = $scope.masterstateIsActive;

                let req = {};
                if (masterstateId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "masterstateId": masterstateId,
                    "mastercountryId": mastercountryId,
                    "masterstateCode": masterstateCode,
                    "masterstateTitle": masterstateTitle,
                    "masterstateIsActive": masterstateIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masterstateId == 0)
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
                        "masterstateId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.masterstateId = res.data.masterstateId;
                            $scope.mastercountryId = res.data.mastercountryId;
                            $scope.masterstateCode = res.data.masterstateCode;
                            $scope.masterstateTitle = res.data.masterstateTitle;
                            $scope.masterstateIsActive = res.data.masterstateIsActive.data[0] == 1 ? true : false;

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
                        data: { "masterstateId": id }
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
            let SearchMasterCountryId = $scope.SearchMasterCountryId;
            let SearchMasterStateTitle = $scope.SearchMasterStateTitle;
            let SearchMasterstateIsActive = $scope.SearchMasterstateIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterCountryId: SearchMasterCountryId,
                    SearchMasterStateTitle: SearchMasterStateTitle,
                    SearchMasterstateIsActive: SearchMasterstateIsActive,
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