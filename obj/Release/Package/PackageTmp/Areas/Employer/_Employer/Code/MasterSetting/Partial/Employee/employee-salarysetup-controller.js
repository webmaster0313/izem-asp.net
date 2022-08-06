

let api_selectdatabyid_salarysetup = backlink + "employer/api/employeesalarysetup/employeesalarysetup_apiSelect";
let api_filltabledata_salarysetup = backlink + "employer/api/employeesalarysetup/employeesalarysetup_apiSelectAll";
let api_insertdata_salarysetup = backlink + "employer/api/employeesalarysetup/employeesalarysetup_apiInsert";
let api_updatedata_salarysetup = backlink + "employer/api/employeesalarysetup/employeesalarysetup_apiUpdate";
let api_deletedata_salarysetup = backlink + "employer/api/employeesalarysetup/employeesalarysetup_apiDelete";

app.controller("employee-salarysetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        $scope.onLoad_Clear = () => {
            $scope.employeesalarysetupId = 0;
            $scope.employeesalarysetupCurrentBasic = 0.0;
            $scope.employeesalarysetupOldBasic = 0.0;
            $scope.employeesalarysetupPaymentRate = "";
            $scope.employeesalarysetupConfirmationDate = null;
            $scope.employeesalarysetupIncrementDate = null;
            $scope.employeesalarysetupEPFGroup = "";
            $scope.employeesalarysetupSocsoGroup = "";
            $scope.employeesalarysetupSocsoCategory = "";
            $scope.employeesalarysetupEISGroup = "";
            $scope.employeesalarysetupEISCategory = "";
            $scope.employeesalarysetupPCBGroup = "";
            $scope.employeesalarysetupHRDFGroup = "";
            $scope.employeesalarysetupPaymentType = "";
            $scope.employeesalarysetupRemarks = "";
            $scope.employeesalarysetupResign = null;

            $scope.employeesalarysetupResidentialStatus = "false";
            $scope.employeesalarysetupCategory = "";
            $scope.employeesalarysetupChildren = 0;
            $scope.employeesalarysetupRemunerationType = "";
            $scope.employeesalarysetupTaxBorneEmployer = "false";
            $scope.employeesalarysetupCalculateMTDAR = "false";
            $scope.employeesalarysetupAccumulatedPTAE = 0;
            $scope.employeesalarysetupAccumulatedPTABIK = 0;
            $scope.employeesalarysetupAccumulatedEPF = 0;
            $scope.employeesalarysetupAccumulatedSocso = 0;
            $scope.employeesalarysetupAccumulatedMTD = 0;
            $scope.employeesalarysetupAccumulatedZakat = 0;


        };

        $scope.onLoad_Epf = () => {
            try {

                httpCommonService.fill_backoffice_epf()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employeesalarysetupEPFGroup = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Epf();

        $scope.onLoad_HRDF = () => {
            try {

                httpCommonService.fill_backoffice_hrdf()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employeesalarysetupHRDFGroup = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_HRDF();

        $scope.onLoad_Socso = () => {
            try {

                httpCommonService.fill_backoffice_socso()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employeesalarysetupSocsoGroup = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Socso();

        $scope.onLoad_Eis = () => {
            try {

                httpCommonService.fill_backoffice_eis()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employeesalarysetupEISGroup = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_Eis();

        $rootScope.onLoad_UpdateEmployeeSalarySetup = (employeeId) => {

            $scope.onLoad_Clear();

            $scope.employeeId = employeeId;

            try {

                let req = {
                    method: 'POST',
                    url: api_selectdatabyid_salarysetup,
                    data: {
                        "employeeId": $scope.employeeId,
                        "employerId": $scope._izemEmployerId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            $scope.onLoad_Epf();
                            $scope.onLoad_Socso();
                            $scope.onLoad_Eis();
                            $scope.onLoad_HRDF();

                            $scope.employeesalarysetupId = res.data.employeesalarysetupId;
                            $scope.employeesalarysetupCurrentBasic = res.data.employeesalarysetupCurrentBasic;
                            $scope.employeesalarysetupOldBasic = res.data.employeesalarysetupOldBasic;
                            $scope.employeesalarysetupPaymentRate = res.data.employeesalarysetupPaymentRate;
                            $scope.employeesalarysetupConfirmationDate = res.data.employeesalarysetupConfirmationDate != null ? new Date(res.data.employeesalarysetupConfirmationDate) : null;
                            $scope.employeesalarysetupIncrementDate = res.data.employeesalarysetupIncrementDate != null ? new Date(res.data.employeesalarysetupIncrementDate) : null;
                            $scope.employeesalarysetupEPFGroup = res.data.employeesalarysetupEPFGroup;
                            $scope.employeesalarysetupSocsoGroup = res.data.employeesalarysetupSocsoGroup;
                            $scope.employeesalarysetupSocsoCategory = res.data.employeesalarysetupSocsoCategory.toString();
                            $scope.employeesalarysetupEISGroup = res.data.employeesalarysetupEISGroup;
                            $scope.employeesalarysetupEISCategory = res.data.employeesalarysetupEISCategory.toString();
                            $scope.employeesalarysetupPCBGroup = res.data.employeesalarysetupPCBGroup.toString();
                            $scope.employeesalarysetupHRDFGroup = res.data.employeesalarysetupHRDFGroup;
                            $scope.employeesalarysetupPaymentType = res.data.employeesalarysetupPaymentType;
                            $scope.employeesalarysetupRemarks = res.data.employeesalarysetupRemarks;
                            $scope.employeesalarysetupResign = res.data.employeesalarysetupResign;

                            $scope.employeesalarysetupResidentialStatus = res.data.employeesalarysetupResidentialStatus.data[0] == "1" ? "true" : "false";
                            $scope.employeesalarysetupCategory = res.data.employeesalarysetupCategory;
                            $scope.employeesalarysetupChildren = res.data.employeesalarysetupChildren;
                            $scope.employeesalarysetupRemunerationType = res.data.employeesalarysetupRemunerationType;
                            $scope.employeesalarysetupTaxBorneEmployer = res.data.employeesalarysetupTaxBorneEmployer.data[0] == "1" ? "true" : "false";
                            $scope.employeesalarysetupCalculateMTDAR = res.data.employeesalarysetupCalculateMTDAR.data[0] == "1" ? "true" : "false";
                            $scope.employeesalarysetupAccumulatedPTAE = res.data.employeesalarysetupAccumulatedPTAE;
                            $scope.employeesalarysetupAccumulatedPTABIK = res.data.employeesalarysetupAccumulatedPTABIK;
                            $scope.employeesalarysetupAccumulatedEPF = res.data.employeesalarysetupAccumulatedEPF;
                            $scope.employeesalarysetupAccumulatedSocso = res.data.employeesalarysetupAccumulatedSocso;
                            $scope.employeesalarysetupAccumulatedMTD = res.data.employeesalarysetupAccumulatedMTD;
                            $scope.employeesalarysetupAccumulatedZakat = res.data.employeesalarysetupAccumulatedZakat;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SubmitEmployeeSalarySetup = () => {
            try {

                let employeesalarysetupId = $scope.employeesalarysetupId;
                let employeesalarysetupCurrentBasic = $scope.employeesalarysetupCurrentBasic;
                let employeesalarysetupOldBasic = $scope.employeesalarysetupOldBasic;
                let employeesalarysetupPaymentRate = $scope.employeesalarysetupPaymentRate;
                let employeesalarysetupConfirmationDate = $scope.employeesalarysetupConfirmationDate == null ? null : moment($scope.employeesalarysetupConfirmationDate).format("YYYY-MM-DD");
                let employeesalarysetupIncrementDate = $scope.employeesalarysetupIncrementDate == null ? null : moment($scope.employeesalarysetupIncrementDate).format("YYYY-MM-DD");
                let employeesalarysetupEPFGroup = $scope.employeesalarysetupEPFGroup;
                let employeesalarysetupSocsoGroup = $scope.employeesalarysetupSocsoGroup;
                let employeesalarysetupSocsoCategory = $scope.employeesalarysetupSocsoCategory;
                let employeesalarysetupEISGroup = $scope.employeesalarysetupEISGroup;
                let employeesalarysetupEISCategory = $scope.employeesalarysetupEISCategory;
                let employeesalarysetupPCBGroup = $scope.employeesalarysetupPCBGroup;
                let employeesalarysetupHRDFGroup = $scope.employeesalarysetupHRDFGroup;
                let employeesalarysetupPaymentType = $scope.employeesalarysetupPaymentType;
                let employeesalarysetupRemarks = $scope.employeesalarysetupRemarks;
                let employeesalarysetupResign = $scope.employeesalarysetupResign == null ? null : moment($scope.employeesalarysetupResign).format("YYYY-MM-DD");

                let employeesalarysetupResidentialStatus = $scope.employeesalarysetupResidentialStatus == "false" ? false : true;
                let employeesalarysetupCategory = $scope.employeesalarysetupCategory;
                let employeesalarysetupChildren = $scope.employeesalarysetupChildren;
                let employeesalarysetupRemunerationType = $scope.employeesalarysetupRemunerationType;
                let employeesalarysetupTaxBorneEmployer = $scope.employeesalarysetupTaxBorneEmployer == "false" ? false : true;
                let employeesalarysetupCalculateMTDAR = $scope.employeesalarysetupCalculateMTDAR == "false" ? false : true;
                let employeesalarysetupAccumulatedPTAE = $scope.employeesalarysetupAccumulatedPTAE;
                let employeesalarysetupAccumulatedPTABIK = $scope.employeesalarysetupAccumulatedPTABIK;
                let employeesalarysetupAccumulatedEPF = $scope.employeesalarysetupAccumulatedEPF;
                let employeesalarysetupAccumulatedSocso = $scope.employeesalarysetupAccumulatedSocso;
                let employeesalarysetupAccumulatedMTD = $scope.employeesalarysetupAccumulatedMTD;
                let employeesalarysetupAccumulatedZakat = $scope.employeesalarysetupAccumulatedZakat;

                let req = {};
                if (employeesalarysetupId == 0)
                    req = { method: 'POST', url: api_insertdata_salarysetup };
                else
                    req = { method: 'POST', url: api_updatedata_salarysetup };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employeesalarysetupId": employeesalarysetupId, "employeeId": $scope.employeeId, "employeesalarysetupCurrentBasic": employeesalarysetupCurrentBasic,
                    "employeesalarysetupOldBasic": employeesalarysetupOldBasic, "employeesalarysetupPaymentRate": employeesalarysetupPaymentRate,
                    "employeesalarysetupConfirmationDate": employeesalarysetupConfirmationDate, "employeesalarysetupIncrementDate": employeesalarysetupIncrementDate,
                    "employeesalarysetupEPFGroup": employeesalarysetupEPFGroup, "employeesalarysetupSocsoGroup": employeesalarysetupSocsoGroup,
                    "employeesalarysetupSocsoCategory": employeesalarysetupSocsoCategory, "employeesalarysetupEISGroup": employeesalarysetupEISGroup,
                    "employeesalarysetupEISCategory": employeesalarysetupEISCategory, "employeesalarysetupPCBGroup": employeesalarysetupPCBGroup,
                    "employeesalarysetupHRDFGroup": employeesalarysetupHRDFGroup, "employeesalarysetupPaymentType": employeesalarysetupPaymentType,
                    "employeesalarysetupRemarks": employeesalarysetupRemarks, "employeesalarysetupResign": employeesalarysetupResign,
                    "employeesalarysetupResidentialStatus": employeesalarysetupResidentialStatus, "employeesalarysetupCategory": employeesalarysetupCategory,
                    "employeesalarysetupChildren": employeesalarysetupChildren, "employeesalarysetupRemunerationType": employeesalarysetupRemunerationType,
                    "employeesalarysetupTaxBorneEmployer": employeesalarysetupTaxBorneEmployer, "employeesalarysetupCalculateMTDAR": employeesalarysetupCalculateMTDAR,
                    "employeesalarysetupAccumulatedPTAE": employeesalarysetupAccumulatedPTAE, "employeesalarysetupAccumulatedPTABIK": employeesalarysetupAccumulatedPTABIK,
                    "employeesalarysetupAccumulatedEPF": employeesalarysetupAccumulatedEPF, "employeesalarysetupAccumulatedSocso": employeesalarysetupAccumulatedSocso,
                    "employeesalarysetupAccumulatedMTD": employeesalarysetupAccumulatedMTD, "employeesalarysetupAccumulatedZakat": employeesalarysetupAccumulatedZakat
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeesalarysetupId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            $rootScope.onLoad_UpdateEmployeeSalarySetup($scope.employeeId);
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);