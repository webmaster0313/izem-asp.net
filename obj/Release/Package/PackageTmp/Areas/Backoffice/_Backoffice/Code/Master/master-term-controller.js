
let api_selectdatabyid = backlink + "backoffice/api/masterterms/masterterms_apiSelect";
let api_filltabledata = backlink + "backoffice/api/masterterms/masterterms_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/masterterms/masterterms_apiInsert";
let api_updatedata = backlink + "backoffice/api/masterterms/masterterms_apiUpdate";
let api_deletedata = backlink + "backoffice/api/masterterms/masterterms_apiDelete";

app.controller("master-term-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.mastertermsId = 0;
            $scope.mastertermsCode = "";
            $scope.mastertermsTitle = "";
            $scope.mastertermsType = "";
            $scope.mastertermsDays = "";
            $scope.mastertermsIsActive = true;
            /* search */
            $scope.SearchMastertermsTitle = "";
            $scope.SearchMastertermsIsActive = "true";
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

                let mastertermsId = $scope.mastertermsId;
                let mastertermsCode = $scope.mastertermsCode;
                let mastertermsTitle = $scope.mastertermsTitle;
                let mastertermsType = $scope.mastertermsType;
                let mastertermsDays = $scope.mastertermsDays;
                let mastertermsIsActive = $scope.mastertermsIsActive;

                let req = {};
                if (mastertermsId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "mastertermsId": mastertermsId,
                    "mastertermsCode": mastertermsCode,
                    "mastertermsTitle": mastertermsTitle,
                    "mastertermsType": mastertermsType,
                    "mastertermsDays": mastertermsDays,
                    "mastertermsIsActive": mastertermsIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (mastertermsId == 0)
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
                        "mastertermsId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.mastertermsId = res.data.mastertermsId;
                            $scope.mastertermsCode = res.data.mastertermsCode;
                            $scope.mastertermsTitle = res.data.mastertermsTitle;
                            $scope.mastertermsType = res.data.mastertermsType;
                            $scope.mastertermsDays = res.data.mastertermsDays;
                            $scope.mastertermsIsActive = res.data.mastertermsIsActive.data[0] == 1 ? true : false;

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
                        data: { "mastertermsId": id }
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
            let SearchMastertermsTitle = $scope.SearchMastertermsTitle;
            let SearchMastertermsIsActive = $scope.SearchMastertermsIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMastertermsTitle: SearchMastertermsTitle,
                    SearchMastertermsIsActive: SearchMastertermsIsActive,
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