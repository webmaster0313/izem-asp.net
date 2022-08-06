
let api_selectdatabyid = backlink + "backoffice/api/mastersubscriptiontype/mastersubscriptiontype_apiSelect";
let api_filltabledata = backlink + "backoffice/api/mastersubscriptiontype/mastersubscriptiontype_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/mastersubscriptiontype/mastersubscriptiontype_apiInsert";
let api_updatedata = backlink + "backoffice/api/mastersubscriptiontype/mastersubscriptiontype_apiUpdate";
let api_deletedata = backlink + "backoffice/api/mastersubscriptiontype/mastersubscriptiontype_apiDelete";

app.controller("master-subscription-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.mastersubscriptiontypeId = 0;
            $scope.mastersubscriptiontypeTitle = "";
            $scope.mastersubscriptiontypeMonth = "";
            $scope.mastersubscriptiontypeAmount = "";
            $scope.mastersubscriptiontypeIsActive = true;
            /* search */
            $scope.SearchMasterSubscriptionTypeTitle = "";
            $scope.SearchMastersubscriptiontypeIsActive = "true";
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

                let mastersubscriptiontypeId = $scope.mastersubscriptiontypeId;
                let mastersubscriptiontypeTitle = $scope.mastersubscriptiontypeTitle;
                let mastersubscriptiontypeMonth = $scope.mastersubscriptiontypeMonth;
                let mastersubscriptiontypeAmount = $scope.mastersubscriptiontypeAmount;
                let mastersubscriptiontypeIsActive = $scope.mastersubscriptiontypeIsActive;

                let req = {};
                if (mastersubscriptiontypeId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "mastersubscriptiontypeId": mastersubscriptiontypeId,
                    "mastersubscriptiontypeTitle": mastersubscriptiontypeTitle,
                    "mastersubscriptiontypeMonth": mastersubscriptiontypeMonth,
                    "mastersubscriptiontypeAmount": mastersubscriptiontypeAmount,
                    "mastersubscriptiontypeIsActive": mastersubscriptiontypeIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (mastersubscriptiontypeId == 0)
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
                        "mastersubscriptiontypeId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.mastersubscriptiontypeId = res.data.mastersubscriptiontypeId;
                            $scope.mastersubscriptiontypeTitle = res.data.mastersubscriptiontypeTitle;
                            $scope.mastersubscriptiontypeMonth = res.data.mastersubscriptiontypeMonth;
                            $scope.mastersubscriptiontypeAmount = res.data.mastersubscriptiontypeAmount;
                            $scope.mastersubscriptiontypeIsActive = res.data.mastersubscriptiontypeIsActive.data[0] == 1 ? true : false;

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
                        data: { "mastersubscriptiontypeId": id }
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
            let SearchMasterSubscriptionTypeTitle = $scope.SearchMasterSubscriptionTypeTitle;
            let SearchMastersubscriptiontypeIsActive = $scope.SearchMastersubscriptiontypeIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterSubscriptionTypeTitle: SearchMasterSubscriptionTypeTitle,
                    SearchMastersubscriptiontypeIsActive: SearchMastersubscriptiontypeIsActive,
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