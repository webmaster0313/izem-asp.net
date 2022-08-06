
let api_selectdatabyid = backlink + "employer/api/employerallowance/employerallowance_apiSelect";
let api_filltabledata = backlink + "employer/api/employerallowance/employerallowance_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerallowance/employerallowance_apiInsert";
let api_updatedata = backlink + "employer/api/employerallowance/employerallowance_apiUpdate";
let api_deletedata = backlink + "employer/api/employerallowance/employerallowance_apiDelete";

app.controller("employer-allowancededuction-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Payroll Process' && x.pageName == 'Allowance Deduction Setup');
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

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope.employerallowanceId = 0;
            $scope.employerallowanceType = "";
            $scope.employerallowanceCode = "";
            $scope.employerallowanceDescription = "";
            $scope.employerallowanceProrate = false;
            $scope.employerallowanceEpf = false;
            $scope.employerallowanceSocso = false;
            $scope.employerallowancePCB = false;
            $scope.employerallowanceEIS = false;
            $scope.employerallowanceOT = false;
            $scope.employerallowanceNPL = false;
            $scope.employerallowanceCP8A = false;
            $scope.employerallowanceCP22A = false;
            $scope.employerallowanceCP38Tax = false;
            $scope.employerallowanceShift = false;
            $scope.employerallowanceAddPay = false;
            $scope.employerallowancePTPTN = false;
            $scope.employerallowanceZakat = false;
            $scope.employerallowanceTabungHaji = false;
            $scope.employerallowanceHRDF = false;
            $scope.employerallowanceBenefitInKind = false;
            $scope.employerallowanceAdditionalRemuneration = false;

            $scope.employerallowanceEAPosition = 0;
            $scope.employerallowanceCP22APosition = 0;

            $scope.employerallowanceIsActive = false;
            /* search */
            $scope.SearchEmployerallowanceCode = "";
            $scope.SearchEmployerallowanceIsActive = "true";
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
            let SearchEmployerallowanceCode = $scope.SearchEmployerallowanceCode;
            let SearchEmployerallowanceIsActive = $scope.SearchEmployerallowanceIsActive;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchEmployerallowanceIsActive": SearchEmployerallowanceIsActive,
                    "SearchEmployerallowanceCode": SearchEmployerallowanceCode,
                    "employerId": $scope._izemEmployerId,
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

                let employerallowanceId = $scope.employerallowanceId;
                let employerallowanceType = $scope.employerallowanceType;
                let employerallowanceCode = $scope.employerallowanceCode;
                let employerallowanceDescription = $scope.employerallowanceDescription;
                let employerallowanceProrate = $scope.employerallowanceProrate;
                let employerallowanceEpf = $scope.employerallowanceEpf;
                let employerallowanceSocso = $scope.employerallowanceSocso;
                let employerallowancePCB = $scope.employerallowancePCB;
                let employerallowanceEIS = $scope.employerallowanceEIS;
                let employerallowanceOT = $scope.employerallowanceOT;
                let employerallowanceNPL = $scope.employerallowanceNPL;
                let employerallowanceCP8A = $scope.employerallowanceCP8A;
                let employerallowanceCP22A = $scope.employerallowanceCP22A;
                let employerallowanceCP38Tax = $scope.employerallowanceCP38Tax;
                let employerallowanceShift = $scope.employerallowanceShift;
                let employerallowanceAddPay = $scope.employerallowanceAddPay;
                let employerallowancePTPTN = $scope.employerallowancePTPTN;
                let employerallowanceZakat = $scope.employerallowanceZakat;
                let employerallowanceTabungHaji = $scope.employerallowanceTabungHaji;
                let employerallowanceHRDF = $scope.employerallowanceHRDF;
                let employerallowanceBenefitInKind = $scope.employerallowanceBenefitInKind;
                let employerallowanceAdditionalRemuneration = $scope.employerallowanceAdditionalRemuneration;
                let employerallowanceEAPosition = $scope.employerallowanceEAPosition;
                let employerallowanceCP22APosition = $scope.employerallowanceCP22APosition;
                let employerallowanceIsActive = $scope.employerallowanceIsActive;

                let req = {};
                if (employerallowanceId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerallowanceId": employerallowanceId,
                    "employerallowanceType": employerallowanceType,
                    "employerallowanceCode": employerallowanceCode,
                    "employerallowanceDescription": employerallowanceDescription,
                    "employerallowanceProrate": employerallowanceProrate,
                    "employerallowanceEpf": employerallowanceEpf,
                    "employerallowanceSocso": employerallowanceSocso,
                    "employerallowancePCB": employerallowancePCB,
                    "employerallowanceEIS": employerallowanceEIS,
                    "employerallowanceOT": employerallowanceOT,
                    "employerallowanceNPL": employerallowanceNPL,
                    "employerallowanceCP8A": employerallowanceCP8A,
                    "employerallowanceCP22A": employerallowanceCP22A,
                    "employerallowanceCP38Tax": employerallowanceCP38Tax,
                    "employerallowanceShift": employerallowanceShift,
                    "employerallowanceAddPay": employerallowanceAddPay,
                    "employerallowancePTPTN": employerallowancePTPTN,
                    "employerallowanceZakat": employerallowanceZakat,
                    "employerallowanceTabungHaji": employerallowanceTabungHaji,
                    "employerallowanceHRDF": employerallowanceHRDF,
                    "employerallowanceBenefitInKind": employerallowanceBenefitInKind,
                    "employerallowanceAdditionalRemuneration": employerallowanceAdditionalRemuneration,
                    "employerallowanceEAPosition": employerallowanceEAPosition,
                    "employerallowanceCP22APosition": employerallowanceCP22APosition,
                    "employerallowanceIsActive": employerallowanceIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerallowanceId == 0)
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
                        "employerallowanceId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerallowanceId = res.data.employerallowanceId
                            $scope.employerallowanceType = res.data.employerallowanceType
                            $scope.employerallowanceCode = res.data.employerallowanceCode
                            $scope.employerallowanceDescription = res.data.employerallowanceDescription
                            $scope.employerallowanceProrate = res.data.employerallowanceProrate.data[0] == 1 ? true : false;
                            $scope.employerallowanceEpf = res.data.employerallowanceEpf.data[0] == 1 ? true : false;
                            $scope.employerallowanceSocso = res.data.employerallowanceSocso.data[0] == 1 ? true : false;
                            $scope.employerallowancePCB = res.data.employerallowancePCB.data[0] == 1 ? true : false;
                            $scope.employerallowanceEIS = res.data.employerallowanceEIS.data[0] == 1 ? true : false;
                            $scope.employerallowanceOT = res.data.employerallowanceOT.data[0] == 1 ? true : false;
                            $scope.employerallowanceNPL = res.data.employerallowanceNPL.data[0] == 1 ? true : false;
                            $scope.employerallowanceCP8A = res.data.employerallowanceCP8A.data[0] == 1 ? true : false;
                            $scope.employerallowanceCP22A = res.data.employerallowanceCP22A.data[0] == 1 ? true : false;
                            $scope.employerallowanceCP38Tax = res.data.employerallowanceCP38Tax.data[0] == 1 ? true : false;
                            $scope.employerallowanceShift = res.data.employerallowanceShift.data[0] == 1 ? true : false;
                            $scope.employerallowanceAddPay = res.data.employerallowanceAddPay.data[0] == 1 ? true : false;
                            $scope.employerallowancePTPTN = res.data.employerallowancePTPTN.data[0] == 1 ? true : false;
                            $scope.employerallowanceZakat = res.data.employerallowanceZakat.data[0] == 1 ? true : false;
                            $scope.employerallowanceTabungHaji = res.data.employerallowanceTabungHaji.data[0] == 1 ? true : false;
                            $scope.employerallowanceHRDF = res.data.employerallowanceHRDF.data[0] == 1 ? true : false;
                            $scope.employerallowanceBenefitInKind = res.data.employerallowanceBenefitInKind.data[0] == 1 ? true : false;
                            $scope.employerallowanceAdditionalRemuneration = res.data.employerallowanceAdditionalRemuneration.data[0] == 1 ? true : false;
                            $scope.employerallowanceEAPosition = res.data.employerallowanceEAPosition;
                            $scope.employerallowanceCP22APosition = res.data.employerallowanceCP22APosition;
                            $scope.employerallowanceIsActive = res.data.employerallowanceIsActive.data[0] == 1 ? true : false;

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
                            "employerId": $scope._izemEmployerId,
                            "employerallowanceId": id
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
            $scope.onLoad_MasterService();
        };

        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

        //.

        $scope.onChanged_employerallowanceBenefitInKind = () => {
            try {

                $scope.isEmployerallowanceBenefitInKind = $scope.employerallowanceBenefitInKind;
                if ($scope.employerallowanceBenefitInKind == true) {
                    $scope.employerallowanceProrate = false;
                    $scope.employerallowanceEpf = false;
                    $scope.employerallowanceSocso = false;
                    $scope.employerallowancePCB = false;
                    $scope.employerallowanceEIS = false;
                    $scope.employerallowanceOT = false;
                    $scope.employerallowanceNPL = false;
                    $scope.employerallowanceCP8A = false;
                    $scope.employerallowanceCP22A = false;
                    $scope.employerallowanceCP38Tax = false;
                    $scope.employerallowanceShift = false;
                    $scope.employerallowanceAddPay = false;
                    $scope.employerallowancePTPTN = false;
                    $scope.employerallowanceZakat = false;
                    $scope.employerallowanceTabungHaji = false;
                    $scope.employerallowanceHRDF = false;
                }

            } catch (e) {
                console.log(e);
            }
        };

    }]);