
let api_selectdatabyid = backlink + "backoffice/api/epf/epf_apiSelect";
let api_filltabledata = backlink + "backoffice/api/epf/epf_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/epf/epf_apiInsert";
let api_updatedata = backlink + "backoffice/api/epf/epf_apiUpdate";
let api_deletedata = backlink + "backoffice/api/epf/epf_apiDelete";
let api_uploadExcel = backlink + "backoffice/api/epf/epf_apiUploadExcelFile";
/* list */
let api_filltabledata_list = backlink + "backoffice/api/epflist/epflist_apiSelectAll";
let api_listinsertdata = backlink + "backoffice/api/epflist/epflist_apiInsert";
let api_listupdatedata = backlink + "backoffice/api/epflist/epflist_apiUpdate";

app.controller("master-epf-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.masterepfId = 0;
            $scope.masterepfCode = "";
            $scope.masterepfTitle = "";
            $scope.masterepfEmployeePer = 0;
            $scope.masterepfEmployerPer = 0;
            $scope.masterepfIsActive = true;
            /* search */
            $scope.SearchMasterEPFTitle = "";
            $scope.SearchMasterepfIsActive = "true";
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

                let masterepfId = $scope.masterepfId;
                let masterepfCode = $scope.masterepfCode;
                let masterepfTitle = $scope.masterepfTitle;
                let masterepfEmployeePer = $scope.masterepfEmployeePer;
                let masterepfEmployerPer = $scope.masterepfEmployerPer;
                let masterepfIsActive = $scope.masterepfIsActive;

                let req = {};
                if (masterepfId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "masterepfId": masterepfId,
                    "masterepfCode": masterepfCode,
                    "masterepfTitle": masterepfTitle,
                    "masterepfEmployeePer": masterepfEmployeePer,
                    "masterepfEmployerPer": masterepfEmployerPer,
                    "masterepfIsActive": masterepfIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masterepfId == 0)
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
                        "masterepfId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.masterepfId = res.data.masterepfId;
                            $scope.masterepfCode = res.data.masterepfCode;
                            $scope.masterepfTitle = res.data.masterepfTitle;
                            $scope.masterepfEmployeePer = res.data.masterepfEmployeePer;
                            $scope.masterepfEmployerPer = res.data.masterepfEmployerPer;
                            $scope.masterepfIsActive = res.data.masterepfIsActive.data[0] == 1 ? true : false;

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
                            "masterepfId": id
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
            let SearchMasterEPFTitle = $scope.SearchMasterEPFTitle;
            let SearchMasterepfIsActive = $scope.SearchMasterepfIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterEPFTitle: SearchMasterEPFTitle,
                    SearchMasterepfIsActive: SearchMasterepfIsActive,
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
                $scope.masterepfId = x;
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
                            "masterepfId": $scope.masterepfId,
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

        $scope.onClick_CancelEpfList = () => {
            $("#EpfList").modal("hide");
            $scope.onClick_Cancel();
        };

        $scope.onClick_LoadEpfListRecord = (x) => {
            try {

                $scope.masterepfId = x;

                let req = {
                    method: 'POST',
                    url: api_filltabledata_list,
                    data: {
                        masterepfId: $scope.masterepfId,
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

                                verb.masterepflistId = 0;
                                verb.masterepflistFrom = parseFloat(Data.masterepflistTo) + 0.01;
                                verb.masterepflistTo = '';
                                verb.masterepflistDifference = '';
                                verb.masterepflistEmploeePercentage = '';
                                verb.masterepflistEmployerPercentage = '';

                                res.data.unshift(verb);
                            }

                            $scope.tableParamsList = res.data;
                        }
                        else {
                            let res = [];

                            let verb = {};
                            verb.masterepflistId = 0;
                            verb.masterepflistFrom = 0.01;
                            verb.masterepflistTo = '';
                            verb.masterepflistDifference = '';
                            verb.masterepflistEmploeePercentage = '';
                            verb.masterepflistEmployerPercentage = '';

                            res.unshift(verb);

                            $scope.tableParamsList = res;
                        }
                        $("#EpfList").modal("show");
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_InsertUpdateListRecord = (x) => {
            try {

                let masterepflistId = x.masterepflistId;
                let masterepfId = $scope.masterepfId;
                let masterepflistFrom = x.masterepflistFrom;
                let masterepflistTo = x.masterepflistTo;
                let masterepflistDifference = x.masterepflistDifference;
                let masterepflistEmploeePercentage = x.masterepflistEmploeePercentage;
                let masterepflistEmployerPercentage = x.masterepflistEmployerPercentage;
                let masterepflistIsActive = true;

                let req = {};
                if (masterepflistId == 0)
                    req = {
                        method: 'POST',
                        url: api_listinsertdata,
                        data: {
                            "masterepflistId": masterepflistId,
                            "masterepfId": masterepfId,
                            "masterepflistFrom": masterepflistFrom,
                            "masterepflistTo": masterepflistTo,
                            "masterepflistDifference": masterepflistDifference,
                            "masterepflistEmploeePercentage": masterepflistEmploeePercentage,
                            "masterepflistEmployerPercentage": masterepflistEmployerPercentage,
                            "masterepflistIsActive": masterepflistIsActive
                        }
                    };
                else
                    req = {
                        method: 'POST',
                        url: api_listupdatedata,
                        data: {
                            "masterepflistId": masterepflistId,
                            "masterepfId": masterepfId,
                            "masterepflistFrom": masterepflistFrom,
                            "masterepflistTo": masterepflistTo,
                            "masterepflistDifference": masterepflistDifference,
                            "masterepflistEmploeePercentage": masterepflistEmploeePercentage,
                            "masterepflistEmployerPercentage": masterepflistEmployerPercentage,
                            "masterepflistIsActive": masterepflistIsActive
                        }
                    };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (masterepflistId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $scope.onClick_LoadEpfListRecord($scope.masterepfId);
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);