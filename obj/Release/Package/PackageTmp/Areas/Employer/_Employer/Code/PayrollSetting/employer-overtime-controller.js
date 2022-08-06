
let api_selectdatabyid = backlink + "employer/api/employerotsetup/employerotsetup_apiSelect";
let api_filltabledata = backlink + "employer/api/employerotsetup/employerotsetup_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerotsetup/employerotsetup_apiInsert";
let api_updatedata = backlink + "employer/api/employerotsetup/employerotsetup_apiUpdate";
let api_deletedata = backlink + "employer/api/employerotsetup/employerotsetup_apiDelete";
//. insert default value
let api_insertDefaulValue = backlink + "employer/api/employerotsetup/employerotsetup_apiInsertDefaulValue";

app.controller("employer-overtime-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.loaded = false;
        $scope.hideEntry = true;

        //. Rights
        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Overtime Setup');
                    if (_layout.length > 0) {
                        if (_layout[0].isFullAccess.data[0] == 1) {
                            $scope.isAddPermit = true;
                            $scope.isEditPermit = true;
                            $scope.isDeletePermit = true;
                            $scope.isReportPermit = true;
                        } else {
                            if (_layout[0].isAdd.data[0] == 1)
                                $scope.isAddPermit = true;
                            if (_layout[0].isEdit.data[0] == 1)
                                $scope.isEditPermit = true;
                            if (_layout[0].isDelete.data[0] == 1)
                                $scope.isDeletePermit = true;
                            if (_layout[0].isReport.data[0] == 1)
                                $scope.isReportPermit = true;
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_Permission = () => {
            try {

                let _userRole = localStorage.getItem("_izemRole");
                if (_userRole == "employer") {
                    $scope.isAddPermit = true;
                    $scope.isEditPermit = true;
                    $scope.isDeletePermit = true;
                    $scope.isReportPermit = true;
                } else {
                    let localData = localStorage.getItem("_izemRights");
                    if (localData != null)
                        $scope.onLoad_Access(localData);
                    else {
                        warningMsg("Issue with rights.");
                    }
                }

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Permission();
        //.

        $scope.onLoad_Clear = () => {
            $scope.employerotsetupId = 0;
            $scope.employerotsetupOTCode = "";
            $scope.employerotsetupDescription = "";
            $scope.employerotsetupRate = 0.0;
            $scope.employerotsetupEPF = false;
            $scope.employerotsetupSocso = false;
            $scope.employerotsetupPCB = false;
            $scope.employerotsetupEIS = false;
            $scope.employerotsetupCP8A = false;
            $scope.employerotsetupCP22A = false;
            $scope.employerotsetupHRDF = false;

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
                    "employerId": $scope._izemEmployerId,
                    pageIndex: 1,
                    pageSize: 'all'
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

                let employerotsetupId = $scope.employerotsetupId;
                let employerotsetupOTCode = $scope.employerotsetupOTCode;
                let employerotsetupDescription = $scope.employerotsetupDescription;
                let employerotsetupRate = $scope.employerotsetupRate;
                let employerotsetupEPF = $scope.employerotsetupEPF;
                let employerotsetupSocso = $scope.employerotsetupSocso;
                let employerotsetupPCB = $scope.employerotsetupPCB;
                let employerotsetupEIS = $scope.employerotsetupEIS;
                let employerotsetupCP8A = $scope.employerotsetupCP8A;
                let employerotsetupCP22A = $scope.employerotsetupCP22A;
                let employerotsetupHRDF = $scope.employerotsetupHRDF;

                let req = {};
                if (employerotsetupId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerotsetupId": employerotsetupId,
                    "employerotsetupOTCode": employerotsetupOTCode,
                    "employerotsetupDescription": employerotsetupDescription,
                    "employerotsetupRate": employerotsetupRate,
                    "employerotsetupEPF": employerotsetupEPF,
                    "employerotsetupSocso": employerotsetupSocso,
                    "employerotsetupPCB": employerotsetupPCB,
                    "employerotsetupEIS": employerotsetupEIS,
                    "employerotsetupCP8A": employerotsetupCP8A,
                    "employerotsetupCP22A": employerotsetupCP22A,
                    "employerotsetupHRDF": employerotsetupHRDF
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerotsetupId == 0)
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
                        "employerotsetupId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerotsetupId = res.data.employerotsetupId
                            $scope.employerotsetupOTCode = res.data.employerotsetupOTCode
                            $scope.employerotsetupDescription = res.data.employerotsetupDescription
                            $scope.employerotsetupRate = res.data.employerotsetupRate
                            $scope.employerotsetupEPF = res.data.employerotsetupEPF.data[0] == 1 ? true : false;
                            $scope.employerotsetupSocso = res.data.employerotsetupSocso.data[0] == 1 ? true : false;
                            $scope.employerotsetupPCB = res.data.employerotsetupPCB.data[0] == 1 ? true : false;
                            $scope.employerotsetupEIS = res.data.employerotsetupEIS.data[0] == 1 ? true : false;
                            $scope.employerotsetupCP8A = res.data.employerotsetupCP8A.data[0] == 1 ? true : false;
                            $scope.employerotsetupCP22A = res.data.employerotsetupCP22A.data[0] == 1 ? true : false;
                            $scope.employerotsetupHRDF = res.data.employerotsetupHRDF.data[0] == 1 ? true : false;

                            $scope.hideEntry = false;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_Cancel = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();

            $scope.hideEntry = true;
        };

        $scope.onClick_AddDefault = () => {
            try {

                let req = {
                    method: 'POST',
                    url: api_insertDefaulValue,
                    data: {
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
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

    }]);