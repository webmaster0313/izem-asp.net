let api_selectdatabyid = backlink + "employer/api/employerpermissionsetting/employerpermissionsetting_apiSelect";
let api_insertdata = backlink + "employer/api/employerpermissionsetting/employerpermissionsetting_apiInsert";

app.controller("employer-permissionsetting-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

        $scope.employerPermissionSettingId = 0;
        $scope.isAutoAttendanceData = false;
        $scope.isAutoSendEmailData = false;

        $scope.onLoad_EmployerBank = () => {
            try {

                httpCommonService.fill_backoffice_employerbank()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masteremployerBankName = res.data;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };
        $scope.onLoad_EmployerBank();

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let result = res.data;
                            if (result.length > 0) {
                                for (let i = 0; i < result.length; i++) {
                                    if (result[i].employerPermissionSettingKey == "AutoPushAttendance") {
                                        $scope.isAutoAttendanceData = result[i].employerPermissionSettingValue == "true" ? true : false;
                                    }
                                    if (result[i].employerPermissionSettingKey == "AutoSendEmail") {
                                        $scope.isAutoSendEmailData = result[i].employerPermissionSettingValue == "true" ? true : false;
                                    }
                                    if (result[i].employerPermissionSettingKey == "lockPassword") {
                                        $scope.lockPassword = result[i].employerPermissionSettingValue;
                                    }
                                    if (result[i].employerPermissionSettingKey == "employerBankName") {
                                        $scope.employerBankName = result[i].employerPermissionSettingValue;
                                    }
                                }
                            }
                        }
                        else {
                            $scope.employerPermissionSettingId = 0;
                            $scope.isAutoAttendanceData = false;
                            $scope.isAutoSendEmailData = false;
                            $scope.lockPassword = "";
                            $scope.employerBankName = "";
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onLoad_MasterService = () => {
            let req = {
                method: 'POST',
                url: api_selectdatabyid,
                data: {
                    "employerId": $scope._izemEmployerId
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();



        $scope.onClick_Submit = () => {

            try {

                let employerPermissionSettingId = $scope.employerPermissionSettingId;
                let isAutoAttendanceData = $scope.isAutoAttendanceData;
                let isAutoSendEmailData = $scope.isAutoSendEmailData;
                let lockPassword = $scope.lockPassword;
                let employerBankName = $scope.employerBankName;

                let req = { method: 'POST', url: api_insertdata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "employerPermissionSettingId": employerPermissionSettingId,
                    "isAutoAttendanceData": isAutoAttendanceData,
                    "isAutoSendEmailData": isAutoSendEmailData,
                    "lockPassword": lockPassword,
                    "employerBankName": employerBankName
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            insertMsg();
                            $scope.onLoad_MasterService();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);