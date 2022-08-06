
let api_selectdatabyid = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiSelect";
let api_filltabledata = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiSelectAll";
let api_insertdata = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiInsert";
let api_updatedata = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiUpdate";
let api_deletedata = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiDelete";
//. insert default value
let api_insertDefaulValue = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiInsertDefaulValue";

app.controller("employer-additionalpay-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'AdditionalPay Setup');
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
            $scope.employeradditionalpaysetupId = 0;
            $scope.employeradditionalpaysetupCode = "";
            $scope.employeradditionalpaysetupDescription = "";
            $scope.employeradditionalpaysetupRate = "";
            $scope.employeradditionalpaysetupEPF = false;
            $scope.employeradditionalpaysetupSocso = false;
            $scope.employeradditionalpaysetupPCB = false;
            $scope.employeradditionalpaysetupEIS = false;
            $scope.employeradditionalpaysetupOT = false;
            $scope.employeradditionalpaysetupNPL = false;
            $scope.employeradditionalpaysetupCP8A = false;
            $scope.employeradditionalpaysetupCP22A = false;
            $scope.employeradditionalpaysetupHRDF = false;

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

                let employeradditionalpaysetupId = $scope.employeradditionalpaysetupId;
                let employeradditionalpaysetupCode = $scope.employeradditionalpaysetupCode;
                let employeradditionalpaysetupDescription = $scope.employeradditionalpaysetupDescription;
                let employeradditionalpaysetupRate = $scope.employeradditionalpaysetupRate;
                let employeradditionalpaysetupEPF = $scope.employeradditionalpaysetupEPF;
                let employeradditionalpaysetupSocso = $scope.employeradditionalpaysetupSocso;
                let employeradditionalpaysetupPCB = $scope.employeradditionalpaysetupPCB;
                let employeradditionalpaysetupEIS = $scope.employeradditionalpaysetupEIS;
                let employeradditionalpaysetupOT = $scope.employeradditionalpaysetupOT;
                let employeradditionalpaysetupNPL = $scope.employeradditionalpaysetupNPL;
                let employeradditionalpaysetupCP8A = $scope.employeradditionalpaysetupCP8A;
                let employeradditionalpaysetupCP22A = $scope.employeradditionalpaysetupCP22A;
                let employeradditionalpaysetupHRDF = $scope.employeradditionalpaysetupHRDF;

                let req = {};
                if (employeradditionalpaysetupId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employeradditionalpaysetupId": employeradditionalpaysetupId,
                    "employeradditionalpaysetupCode": employeradditionalpaysetupCode,
                    "employeradditionalpaysetupDescription": employeradditionalpaysetupDescription,
                    "employeradditionalpaysetupRate": employeradditionalpaysetupRate,
                    "employeradditionalpaysetupEPF": employeradditionalpaysetupEPF,
                    "employeradditionalpaysetupSocso": employeradditionalpaysetupSocso,
                    "employeradditionalpaysetupPCB": employeradditionalpaysetupPCB,
                    "employeradditionalpaysetupEIS": employeradditionalpaysetupEIS,
                    "employeradditionalpaysetupOT": employeradditionalpaysetupOT,
                    "employeradditionalpaysetupNPL": employeradditionalpaysetupNPL,
                    "employeradditionalpaysetupCP8A": employeradditionalpaysetupCP8A,
                    "employeradditionalpaysetupCP22A": employeradditionalpaysetupCP22A,
                    "employeradditionalpaysetupHRDF": employeradditionalpaysetupHRDF
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeradditionalpaysetupId == 0)
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
                        "employeradditionalpaysetupId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employeradditionalpaysetupId = res.data.employeradditionalpaysetupId;
                            $scope.employeradditionalpaysetupCode = res.data.employeradditionalpaysetupCode;
                            $scope.employeradditionalpaysetupDescription = res.data.employeradditionalpaysetupDescription;
                            $scope.employeradditionalpaysetupRate = res.data.employeradditionalpaysetupRate;
                            $scope.employeradditionalpaysetupEPF = res.data.employeradditionalpaysetupEPF.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupSocso = res.data.employeradditionalpaysetupSocso.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupPCB = res.data.employeradditionalpaysetupPCB.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupEIS = res.data.employeradditionalpaysetupEIS.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupOT = res.data.employeradditionalpaysetupOT.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupNPL = res.data.employeradditionalpaysetupNPL.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupCP8A = res.data.employeradditionalpaysetupCP8A.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupCP22A = res.data.employeradditionalpaysetupCP22A.data[0] == 1 ? true : false;
                            $scope.employeradditionalpaysetupHRDF = res.data.employeradditionalpaysetupHRDF.data[0] == 1 ? true : false;

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