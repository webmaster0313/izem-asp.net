
let api_selectdatabyid = backlink + "backoffice/api/socso/socso_apiSelect";
let api_filltabledata = backlink + "backoffice/api/socso/socso_apiSelectAll";
let api_insertdata = backlink + "backoffice/api/socso/socso_apiInsert";
let api_updatedata = backlink + "backoffice/api/socso/socso_apiUpdate";
let api_deletedata = backlink + "backoffice/api/socso/socso_apiDelete";
let api_uploadExcel = backlink + "backoffice/api/socso/socso_apiUploadExcelFile";
/* list */
let api_filltabledata_list = backlink + "backoffice/api/socsolist/socsolist_apiSelectAll";
let api_listinsertdata = backlink + "backoffice/api/socsolist/socsolist_apiInsert";
let api_listupdatedata = backlink + "backoffice/api/socsolist/socsolist_apiUpdate";

app.controller("master-socso-controller", ['$scope', 'httpService',
    function ($scope, httpService) {
        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.mastersocsoId = 0;
            $scope.mastersocsoCode = "";
            $scope.mastersocsoTitle = "";
            $scope.mastersocsoIsActive = true;
            /* search */
            $scope.SearchMasterSOCSOTitle = "";
            $scope.SearchMastersocsoIsActive = "true";
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

                let mastersocsoId = $scope.mastersocsoId;
                let mastersocsoCode = $scope.mastersocsoCode;
                let mastersocsoTitle = $scope.mastersocsoTitle;
                let mastersocsoIsActive = $scope.mastersocsoIsActive;

                let req = {};
                if (mastersocsoId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "mastersocsoId": mastersocsoId,
                    "mastersocsoCode": mastersocsoCode,
                    "mastersocsoTitle": mastersocsoTitle,
                    "mastersocsoIsActive": mastersocsoIsActive
                };

                req.data = pera;
            
                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (mastersocsoId == 0)
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
                        "mastersocsoId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.mastersocsoId = res.data.mastersocsoId
                            $scope.mastersocsoCode = res.data.mastersocsoCode
                            $scope.mastersocsoTitle = res.data.mastersocsoTitle
                            $scope.mastersocsoIsActive = res.data.mastersocsoIsActive.data[0] == 1 ? true : false;

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
                            "mastersocsoId": id
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
            let SearchMasterSOCSOTitle = $scope.SearchMasterSOCSOTitle;
            let SearchMastersocsoIsActive = $scope.SearchMastersocsoIsActive;
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    SearchMasterSOCSOTitle: SearchMasterSOCSOTitle,
                    SearchMastersocsoIsActive: SearchMastersocsoIsActive,
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
                $scope.mastersocsoId = x;
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
                            "mastersocsoId": $scope.mastersocsoId,
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

        $scope.onClick_CancelSocsoList = () => {
            $("#SocsoList").modal("hide");
            $scope.onClick_Cancel();
        };

        $scope.onClick_LoadSocsoListRecord = (x) => {
            try {

                $scope.mastersocsoId = x;

                let req = {
                    method: 'POST',
                    url: api_filltabledata_list,
                    data: {
                        mastersocsoId: $scope.mastersocsoId,
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

                                verb.mastersocsolistId = 0;
                                verb.mastersocsolistFrom = parseFloat(Data.mastersocsolistTo) + 0.01;
                                verb.mastersocsolistTo = '';
                                verb.mastersocsolistEmployerContribution = '';
                                verb.mastersocsolistEmployeeContribution = '';
                                verb.mastersocsolistTotalContribution = '';
                                verb.mastersocsolistEmployerContribution1 = '';

                                res.data.unshift(verb);
                            }

                            $scope.tableParamsList = res.data;
                        }
                        else {
                            let res = [];

                            let verb = {};
                            verb.mastersocsolistId = 0;
                            verb.mastersocsolistFrom = 0.01;
                            verb.mastersocsolistTo = '';
                            verb.mastersocsolistEmployerContribution = '';
                            verb.mastersocsolistEmployeeContribution = '';
                            verb.mastersocsolistTotalContribution = '';
                            verb.mastersocsolistEmployerContribution1 = '';

                            res.unshift(verb);

                            $scope.tableParamsList = res;
                        }
                        $("#SocsoList").modal("show");
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_InsertUpdateListRecord = (x) => {
            try {

                let mastersocsolistId = x.mastersocsolistId;
                let mastersocsoId = $scope.mastersocsoId;
                let mastersocsolistFrom = x.mastersocsolistFrom;
                let mastersocsolistTo = x.mastersocsolistTo;
                let mastersocsolistEmployerContribution = x.mastersocsolistEmployerContribution;
                let mastersocsolistEmployeeContribution = x.mastersocsolistEmployeeContribution;
                let mastersocsolistTotalContribution = x.mastersocsolistTotalContribution;
                let mastersocsolistEmployerContribution1 = x.mastersocsolistEmployerContribution1;
                let mastersocsolistIsActive = true;

                let req = {};
                if (mastersocsolistId == 0)
                    req = {
                        method: 'POST',
                        url: api_listinsertdata,
                        data: {
                            "mastersocsolistId": mastersocsolistId,
                            "mastersocsoId": mastersocsoId,
                            "mastersocsolistFrom": mastersocsolistFrom,
                            "mastersocsolistTo": mastersocsolistTo,
                            "mastersocsolistEmployerContribution": mastersocsolistEmployerContribution,
                            "mastersocsolistEmployeeContribution": mastersocsolistEmployeeContribution,
                            "mastersocsolistTotalContribution": mastersocsolistTotalContribution,
                            "mastersocsolistEmployerContribution1": mastersocsolistEmployerContribution1,
                            "mastersocsolistIsActive": mastersocsolistIsActive
                        }
                    };
                else
                    req = {
                        method: 'POST',
                        url: api_listupdatedata,
                        data: {
                            "mastersocsolistId": mastersocsolistId,
                            "mastersocsoId": mastersocsoId,
                            "mastersocsolistFrom": mastersocsolistFrom,
                            "mastersocsolistTo": mastersocsolistTo,
                            "mastersocsolistEmployerContribution": mastersocsolistEmployerContribution,
                            "mastersocsolistEmployeeContribution": mastersocsolistEmployeeContribution,
                            "mastersocsolistTotalContribution": mastersocsolistTotalContribution,
                            "mastersocsolistEmployerContribution1": mastersocsolistEmployerContribution1,
                            "mastersocsolistIsActive": mastersocsolistIsActive
                        }
                    };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (mastersocsolistId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $scope.onClick_LoadSocsoListRecord($scope.mastersocsoId);
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);