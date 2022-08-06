
let api_selectdatabyid = backlink + "backoffice/api/eis/eis_apiSelect";
let api_filltabledata = backlink + "backoffice/api/eis/eis_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/eis/eis_apiInsert";
let api_updatedata = backlink + "backoffice/api/eis/eis_apiUpdate";
let api_deletedata = backlink + "backoffice/api/eis/eis_apiDelete";
let api_uploadExcel = backlink + "backoffice/api/eis/eis_apiUploadExcelFile";
/* list */
let api_filltabledata_list = backlink + "backoffice/api/eislist/eislist_apiSelectAll";
let api_listinsertdata = backlink + "backoffice/api/eislist/eislist_apiInsert";
let api_listupdatedata = backlink + "backoffice/api/eislist/eislist_apiUpdate";

app.controller("master-eis-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.masteresiId = 0;
            $scope.masteresiCode = "";
            $scope.masteresiTitle = "";
            $scope.masteresiIsActive = true;
            /* search */
            $scope.SearchMasterESITitle = "";
            $scope.SearchMasteresiIsActive = "true";
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

                let masteresiId = $scope.masteresiId;
                let masteresiCode = $scope.masteresiCode;
                let masteresiTitle = $scope.masteresiTitle;
                let masteresiIsActive = $scope.masteresiIsActive;

                let req = {};
                if (masteresiId == 0)
                    req = {
                        method: 'POST',
                        url: api_insertdata,
                        data: {
                            "masteresiId": masteresiId,
                            "masteresiCode": masteresiCode,
                            "masteresiTitle": masteresiTitle,
                            "masteresiIsActive": masteresiIsActive
                        }
                    };
                else
                    req = {
                        method: 'POST',
                        url: api_updatedata,
                        data: {
                            "masteresiId": masteresiId,
                            "masteresiCode": masteresiCode,
                            "masteresiTitle": masteresiTitle,
                            "masteresiIsActive": masteresiIsActive
                        }
                    };


                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masteresiId == 0)
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
                        "masteresiId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.masteresiId = res.data.masteresiId
                            $scope.masteresiCode = res.data.masteresiCode
                            $scope.masteresiTitle = res.data.masteresiTitle
                            $scope.masteresiIsActive = res.data.masteresiIsActive.data[0] == 1 ? true : false;

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
                            "masteresiId": id
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
            let SearchMasterESITitle = $scope.SearchMasterESITitle;
            let SearchMasteresiIsActive = $scope.SearchMasteresiIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterESITitle: SearchMasterESITitle,
                    SearchMasteresiIsActive: SearchMasteresiIsActive,
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

        $scope.onClick_UploadRecord = (x) => {

            try {
                $scope.masteresiId = x;
                $("#excelUpload").modal("show");

            } catch (e) {
                console.log(e);
            }

        };

        //. file update process

        var reader = new FileReader();
        $scope.fileUploading = false;
        $scope.fileUploadedList = false;
        $scope.subDataResult = [];

        $(function () {
            $('input[type=file]').change(function () {
                if (typeof (FileReader) != "undefined") {
                    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                    $($(this)[0].files).each(function () {
                        var file = $(this);
                        if (regex.test(file[0].name.toLowerCase())) {
                            reader.readAsDataURL(file[0]);
                        } else {
                            alert(file[0].name + " is not a valid image file.");
                            return false;
                        }
                    });
                } else {
                    alert("This browser does not support HTML5 FileReader.");
                }
            });
        });

        $scope.onClick_UploadExcel = () => {
            $scope.fileUploading = true;
            var byteData = reader.result;
            if (byteData != null) {
                byteData = byteData.split(';')[1].replace("base64,", "");
                $.ajax({
                    type: "POST",
                    url: "/backoffice/home/GetExcelData",
                    data: { "byteData": byteData },

                    success: function (response) {
                        $scope.fileUploading = false;
                        let result = JSON.parse(response);
                        if (result.length > 0) {
                            $scope.fileUploadedList = true;
                            $scope.$apply(function () {
                                $scope.subDataResult = result;
                            });
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
            else {
                warningMsg("File Status", "Please select file for upload");
                $scope.fileUploading = false;
            }
        };

        $scope.onClick_CancelExcelProcess = (x) => {
            try {

                $scope.fileUploading = false;
                $scope.fileUploadedList = false;

                var file = document.getElementById("fuUpload");
                file.value = file.defaultValue;
                reader = new FileReader();

                $scope.subDataResult = [];

                if (x != 'reset')
                    $("#excelUpload").modal("hide");

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SubmitExcelProcess = () => {
            try {

                if ($scope.subDataResult.length > 0) {

                    let req = {
                        method: 'POST',
                        url: api_uploadExcel,
                        data: {
                            "masteresiId": $scope.masteresiId,
                            "strQueryString": JSON.stringify($scope.subDataResult)
                        }
                    };

                    httpService.httpOperationData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                insertMsg();

                                $scope.onLoad_MasterService();
                                $scope.onClick_CancelExcelProcess();
                            }
                        }, (err) => {
                            console.log(err)
                        });
                }
                else {
                    warningMsg("File Status", "Please select file for upload");
                }
            } catch (e) {
                console.log(e);
            }
        };

        /* Epf list  */

        $scope.onClick_CancelEisList = () => {
            $("#EisList").modal("hide");
            $scope.onClick_Cancel();
        };

        $scope.onClick_LoadEisListRecord = (x) => {
            try {

                $scope.masteresiId = x;

                let req = {
                    method: 'POST',
                    url: api_filltabledata_list,
                    data: {
                        masteresiId: $scope.masteresiId,
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

                                verb.masteresilistId = 0;
                                verb.masteresilistFrom = parseFloat(Data.masteresilistTo) + 0.01;
                                verb.masteresilistTo = '';
                                verb.masteresilistEmployerContribution = '';
                                verb.masteresilistEmployeeContribution = '';
                                verb.masteresilistTotalContribution = '';
                                verb.masteresilistEmployerContribution1 = '';

                                res.data.unshift(verb);
                            }

                            $scope.tableParamsList = res.data;
                        }
                        else {
                            let res = [];

                            let verb = {};
                            verb.masteresilistId = 0;
                            verb.masteresilistFrom = 0.01;
                            verb.masteresilistTo = '';
                            verb.masteresilistEmployerContribution = '';
                            verb.masteresilistEmployeeContribution = '';
                            verb.masteresilistTotalContribution = '';
                            verb.masteresilistEmployerContribution1 = '';

                            res.unshift(verb);

                            $scope.tableParamsList = res;
                        }
                        $("#EisList").modal("show");
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_InsertUpdateListRecord = (x) => {
            try {

                let masteresilistId = x.masteresilistId;
                let masteresiId = $scope.masteresiId;
                let masteresilistFrom = x.masteresilistFrom;
                let masteresilistTo = x.masteresilistTo;
                let masteresilistEmployerContribution = x.masteresilistEmployerContribution;
                let masteresilistEmployeeContribution = x.masteresilistEmployeeContribution;
                let masteresilistTotalContribution = x.masteresilistTotalContribution;
                let masteresilistEmployerContribution1 = x.masteresilistEmployerContribution1 == '' ? 0 : x.masteresilistEmployerContribution1;
                let masteresilistIsActive = true;

                let req = {};
                if (masteresilistId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "masteresilistId": masteresilistId,
                    "masteresiId": masteresiId,
                    "masteresilistFrom": masteresilistFrom,
                    "masteresilistTo": masteresilistTo,
                    "masteresilistEmployerContribution": masteresilistEmployerContribution,
                    "masteresilistEmployeeContribution": masteresilistEmployeeContribution,
                    "masteresilistTotalContribution": masteresilistTotalContribution,
                    "masteresilistEmployerContribution1": masteresilistEmployerContribution1,
                    "masteresilistIsActive": masteresilistIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masteresilistId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $scope.onClick_LoadEisListRecord($scope.masteresiId);
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);