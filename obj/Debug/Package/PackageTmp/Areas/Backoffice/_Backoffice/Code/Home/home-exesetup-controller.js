
let api_selectdatabyid = backlink + "backoffice/api/companyauth/companyauth_apiSelect";
let api_filltabledata = backlink + "backoffice/api/companyauth/companyauth_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/companyauth/companyauth_apiInsert";
let api_updatedata = backlink + "backoffice/api/companyauth/companyauth_apiUpdate";
let api_deletedata = backlink + "backoffice/api/companyauth/companyauth_apiDelete";
//.
let api_countdata = backlink + "backoffice/api/companyauth/companyauth_apiCountData";

app.controller("home-exesetup-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.companyAuthId = 0;
            $scope.employerId = "";
            $scope.employerIdEncrypt = "";
            $scope.companyAuthUser = "";
            $scope.companyAuthPassword = "";
            $scope.enrollNoPattern = "";
            $scope.location = "";
            $scope.downloadEmail = "";
            /* search */
            $("#searchModal").modal("hide");

            $scope.hideEntry = true;
        };
        $scope.onLoad_Clear();

        $scope.onLoad_Employer = () => {
            try {
                httpCommonService.fill_master_employer()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employer = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Employer();

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

                let companyAuthId = $scope.companyAuthId;
                let employerId = $scope.employerId;
                let employerIdEncrypt = $scope.employerIdEncrypt;
                let companyAuthUser = $scope.companyAuthUser;
                let companyAuthPassword = $scope.companyAuthPassword;
                let enrollNoPattern = $scope.enrollNoPattern;
                let location = $scope.location;
                let downloadEmail = $scope.downloadEmail;

                let req = {};
                if (companyAuthId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "companyAuthId": companyAuthId,
                    "employerId": employerId,
                    "employerIdEncrypt": employerIdEncrypt,
                    "companyAuthUser": companyAuthUser,
                    "companyAuthPassword": companyAuthPassword,
                    "enrollNoPattern": enrollNoPattern,
                    "location": location,
                    "downloadEmail": downloadEmail
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (companyAuthId == 0)
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
                        "companyAuthId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.companyAuthId = res.data.companyAuthId;
                            $scope.employerId = res.data.employerId;
                            $scope.companyAuthUser = res.data.companyAuthUser;
                            $scope.companyAuthPassword = res.data.companyAuthPassword;
                            $scope.enrollNoPattern = res.data.enrollNoPattern;
                            $scope.location = res.data.location;
                            $scope.downloadEmail = res.data.downloadEmail;

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
                        data: { "companyAuthId": id }
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
            $scope.onLoad_MasterService();
        };

        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        //.
        $scope.onChanged_UpdatePattern = (id) => {

            if (id != 'undefined') {

                let employeeData = $scope.fill_employer.filter(x => x.employerId == id);
                let machineEnroll = employeeData[0].employerName.charAt(0).toUpperCase();

                let req = {
                    method: 'POST',
                    url: api_countdata,
                    data: {
                        charValue: machineEnroll
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        let count = 000;
                        if (res.status == 200) {
                            count = pad(res.data.cnt + 1, 3);
                        }
                        $scope.enrollNoPattern = machineEnroll + count + 'E00001';
                    }, (err) => {
                        console.log(err)
                    });
            }

        };

    }]);