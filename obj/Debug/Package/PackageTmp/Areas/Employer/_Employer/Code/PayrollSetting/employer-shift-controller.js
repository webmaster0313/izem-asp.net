
let api_selectdatabyid = backlink + "employer/api/employershiftsetup/employershiftsetup_apiSelect";
let api_filltabledata = backlink + "employer/api/employershiftsetup/employershiftsetup_apiSelectAll";
let api_insertdata = backlink + "employer/api/employershiftsetup/employershiftsetup_apiInsert";
let api_updatedata = backlink + "employer/api/employershiftsetup/employershiftsetup_apiUpdate";
let api_deletedata = backlink + "employer/api/employershiftsetup/employershiftsetup_apiDelete";
//. insert default value
let api_insertDefaulValue = backlink + "employer/api/employershiftsetup/employershiftsetup_apiInsertDefaulValue";

app.controller("employer-shift-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Shift Setup');
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
            $scope.employershiftsetupId = 0;
            $scope.employershiftsetupCode = "";
            $scope.employershiftsetupDescription = "";
            $scope.employershiftsetupAmount = 0.0;
            $scope.employershiftsetupEPF = false;
            $scope.employershiftsetupSocso = false;
            $scope.employershiftsetupPCB = false;
            $scope.employershiftsetupEIS = false;
            $scope.employershiftsetupOT = false;
            $scope.employershiftsetupNPL = false;
            $scope.employershiftsetupCP8A = false;
            $scope.employershiftsetupCP22A = false;
            $scope.employershiftsetupHRDF = false;

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

                let employershiftsetupId = $scope.employershiftsetupId;
                let employershiftsetupCode = $scope.employershiftsetupCode;
                let employershiftsetupDescription = $scope.employershiftsetupDescription;
                let employershiftsetupAmount = $scope.employershiftsetupAmount;
                let employershiftsetupEPF = $scope.employershiftsetupEPF;
                let employershiftsetupSocso = $scope.employershiftsetupSocso;
                let employershiftsetupPCB = $scope.employershiftsetupPCB;
                let employershiftsetupEIS = $scope.employershiftsetupEIS;
                let employershiftsetupOT = $scope.employershiftsetupOT;
                let employershiftsetupNPL = $scope.employershiftsetupNPL;
                let employershiftsetupCP8A = $scope.employershiftsetupCP8A;
                let employershiftsetupCP22A = $scope.employershiftsetupCP22A;
                let employershiftsetupHRDF = $scope.employershiftsetupHRDF;

                let req = {};
                if (employershiftsetupId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employershiftsetupId": employershiftsetupId,
                    "employershiftsetupCode": employershiftsetupCode,
                    "employershiftsetupDescription": employershiftsetupDescription,
                    "employershiftsetupAmount": employershiftsetupAmount,
                    "employershiftsetupEPF": employershiftsetupEPF,
                    "employershiftsetupSocso": employershiftsetupSocso,
                    "employershiftsetupPCB": employershiftsetupPCB,
                    "employershiftsetupEIS": employershiftsetupEIS,
                    "employershiftsetupOT": employershiftsetupOT,
                    "employershiftsetupNPL": employershiftsetupNPL,
                    "employershiftsetupCP8A": employershiftsetupCP8A,
                    "employershiftsetupCP22A": employershiftsetupCP22A,
                    "employershiftsetupHRDF": employershiftsetupHRDF
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employershiftsetupId == 0)
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
                        "employershiftsetupId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employershiftsetupId = res.data.employershiftsetupId
                            $scope.employershiftsetupCode = res.data.employershiftsetupCode
                            $scope.employershiftsetupDescription = res.data.employershiftsetupDescription
                            $scope.employershiftsetupAmount = res.data.employershiftsetupAmount
                            $scope.employershiftsetupEPF = res.data.employershiftsetupEPF.data[0] == 1 ? true : false;
                            $scope.employershiftsetupSocso = res.data.employershiftsetupSocso.data[0] == 1 ? true : false;
                            $scope.employershiftsetupPCB = res.data.employershiftsetupPCB.data[0] == 1 ? true : false;
                            $scope.employershiftsetupEIS = res.data.employershiftsetupEIS.data[0] == 1 ? true : false;
                            $scope.employershiftsetupOT = res.data.employershiftsetupOT.data[0] == 1 ? true : false;
                            $scope.employershiftsetupNPL = res.data.employershiftsetupNPL.data[0] == 1 ? true : false;
                            $scope.employershiftsetupCP8A = res.data.employershiftsetupCP8A.data[0] == 1 ? true : false;
                            $scope.employershiftsetupCP22A = res.data.employershiftsetupCP22A.data[0] == 1 ? true : false;
                            $scope.employershiftsetupHRDF = res.data.employershiftsetupHRDF.data[0] == 1 ? true : false;

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