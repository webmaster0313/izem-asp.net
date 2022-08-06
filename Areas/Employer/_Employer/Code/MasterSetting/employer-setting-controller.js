
let api_selectdatabyid = backlink + "employer/api/employersetting/employersetting_apiSelect";
let api_filltabledata = backlink + "employer/api/employersetting/employersetting_apiSelectAll";
let api_insertdata = backlink + "employer/api/employersetting/employersetting_apiInsert";
let api_updatedata = backlink + "employer/api/employersetting/employersetting_apiUpdate";
let api_deletedata = backlink + "employer/api/employersetting/employersetting_apiDelete";

app.controller("employer-setting-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        //. Rights
        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Setting');
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
            $scope.employersettingId = 0;
            $scope.employersettingClinicSubmissionDatetime = 0;
            $scope.employersettingAutoApproveClaimLimit = 0;
            $scope.employersettingTotalClaimsLimit = 0;
            $scope.employersettingConsultationLimit = 0;
            $scope.employersettingMedicationLimit = 0;
            $scope.employersettingTreatementLimit = 0;
            $scope.employersettingMedicalLeaveLimit = 0;
            $scope.employersettingMedicationPrescribedLimit = 0;
            $scope.employersettingAllowClaimSubmittedAnnualLimit = 0;
            $scope.employersettingAllowClaimSubmittedPerVisitLimit = 0;
            $scope.employersettingAllowClaimSubmittedToExceedAnnualVisitLimit = 0;
        };
        $scope.onLoad_Clear();

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {

                            let _data = res.data[0];

                            $scope.employersettingId = _data.employersettingId;
                            $scope.employersettingClinicSubmissionDatetime = _data.employersettingClinicSubmissionDatetime;
                            $scope.employersettingAutoApproveClaimLimit = _data.employersettingAutoApproveClaimLimit;

                            $scope.employersettingTotalClaimsLimit = _data.employersettingTotalClaimsLimit;
                            $scope.employersettingConsultationLimit = _data.employersettingConsultationLimit;
                            $scope.employersettingMedicationLimit = _data.employersettingMedicationLimit;
                            $scope.employersettingTreatementLimit = _data.employersettingTreatementLimit;
                            $scope.employersettingMedicalLeaveLimit = _data.employersettingMedicalLeaveLimit;
                            $scope.employersettingMedicationPrescribedLimit = _data.employersettingMedicationPrescribedLimit;

                            $scope.employersettingAllowClaimSubmittedAnnualLimit = _data.employersettingAllowClaimSubmittedAnnualLimit.data[0] == 1 ? true : false;
                            $scope.employersettingAllowClaimSubmittedPerVisitLimit = _data.employersettingAllowClaimSubmittedPerVisitLimit.data[0] == 1 ? true : false;
                            $scope.employersettingAllowClaimSubmittedToExceedAnnualVisitLimit = _data.employersettingAllowClaimSubmittedToExceedAnnualVisitLimit.data[0] == 1 ? true : false;

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

        $scope.onClick_Submit = () => {
            try {

                let employersettingId = $scope.employersettingId;
                let employersettingClinicSubmissionDatetime = $scope.employersettingClinicSubmissionDatetime;
                let employersettingAutoApproveClaimLimit = $scope.employersettingAutoApproveClaimLimit;
                let employersettingTotalClaimsLimit = $scope.employersettingTotalClaimsLimit;
                let employersettingConsultationLimit = $scope.employersettingConsultationLimit;
                let employersettingMedicationLimit = $scope.employersettingMedicationLimit;
                let employersettingTreatementLimit = $scope.employersettingTreatementLimit;
                let employersettingMedicalLeaveLimit = $scope.employersettingMedicalLeaveLimit;
                let employersettingMedicationPrescribedLimit = $scope.employersettingMedicationPrescribedLimit;
                let employersettingAllowClaimSubmittedAnnualLimit = $scope.employersettingAllowClaimSubmittedAnnualLimit;
                let employersettingAllowClaimSubmittedPerVisitLimit = $scope.employersettingAllowClaimSubmittedPerVisitLimit;
                let employersettingAllowClaimSubmittedToExceedAnnualVisitLimit = $scope.employersettingAllowClaimSubmittedToExceedAnnualVisitLimit;

                let req = {};
                if (employersettingId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employersettingId": employersettingId,
                    "employersettingClinicSubmissionDatetime": employersettingClinicSubmissionDatetime,
                    "employersettingAutoApproveClaimLimit": employersettingAutoApproveClaimLimit,
                    "employersettingTotalClaimsLimit": employersettingTotalClaimsLimit,
                    "employersettingConsultationLimit": employersettingConsultationLimit,
                    "employersettingMedicationLimit": employersettingMedicationLimit,
                    "employersettingTreatementLimit": employersettingTreatementLimit,
                    "employersettingMedicalLeaveLimit": employersettingMedicalLeaveLimit,
                    "employersettingMedicationPrescribedLimit": employersettingMedicationPrescribedLimit,
                    "employersettingAllowClaimSubmittedAnnualLimit": employersettingAllowClaimSubmittedAnnualLimit,
                    "employersettingAllowClaimSubmittedPerVisitLimit": employersettingAllowClaimSubmittedPerVisitLimit,
                    "employersettingAllowClaimSubmittedToExceedAnnualVisitLimit": employersettingAllowClaimSubmittedToExceedAnnualVisitLimit
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employersettingId == 0)
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

        $scope.onClick_Cancel = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };

    }]);