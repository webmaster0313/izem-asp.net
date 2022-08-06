
let api_filltabledata = backlink + "employer/api/employee/employee_apiSelectAll";
/* Machine connection and picture library */
let api_checkConnectionStatus = backlink + "employer/api/machineConnection/checkConnection";
let api_getpictureLoad = backlink + "employer/api/machineConnection/checkPictureLibrary";
let api_getpictureCreated = backlink + "employer/api/machineConnection/createPictureLibrary";
/* Machine operation */
let api_getUser = backlink + "employer/api/machineConnection/transferUserDataFromMachineToServer";
let api_pushUser = backlink + "employer/api/machineConnection/pushUserToMachine";
let api_deleteUser = backlink + "employer/api/machineConnection/deleteUserFromMachine";

app.controller("employer-datatransfer-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Attendance entries' && x.pageName == 'Device Operation');
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

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.tableParams = res.data;
                            $scope.loaded = true;
                        }
                        else {
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
            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    "employerId": $scope._izemEmployerId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };
            $scope.onLoad_FillTable(req);
        };

        $scope.onLoad_PictureLoad = () => {

            try {

                let req = {
                    method: 'POST', url: api_getpictureLoad, data: {
                        masterexeUrl: "http://" + $scope.masterexeUrl,
                        mastermachineUrl: "http://" + $scope.mastermachineUrl,
                        mastermachineUser: $scope.mastermachineUser,
                        mastermachinePassword: $scope.mastermachinePassword,
                    }
                };

                httpService.masterHttpFetchData(req)
                    .then((res) => {

                        if (res.data.data.statusString == 'OK') {
                            $scope.isPictureLibraryCreated = true;
                            $scope.isNotPictureLibraryCreated = false;

                            $scope.onLoad_MasterService();
                        }
                        else {
                            $scope.isPictureLibraryCreated = false;
                            $scope.isNotPictureLibraryCreated = true;

                            alert("Click on Created Picture Library to upload image to machine.")
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_PictureCreated = () => {
            try {

                let req = {
                    method: 'POST', url: api_getpictureCreated, data: {
                        masterexeUrl: "http://" + $scope.masterexeUrl,
                        mastermachineUrl: "http://" + $scope.mastermachineUrl,
                        mastermachineUser: $scope.mastermachineUser,
                        mastermachinePassword: $scope.mastermachinePassword,
                    }
                };

                httpService.masterHttpFetchData(req)
                    .then((res) => {

                        if (res.data.statusString == 'OK') {
                            $scope.onLoad_PictureLoad();
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_CheckConnection = () => {
            try {

                let req = {
                    method: 'POST', url: api_checkConnectionStatus, data: {
                        masterexeUrl: "http://" + $scope.masterexeUrl,
                        mastermachineUrl: "http://" + $scope.mastermachineUrl,
                        mastermachineUser: $scope.mastermachineUser,
                        mastermachinePassword: $scope.mastermachinePassword,
                    }
                };

                httpService.masterHttpFetchData(req)
                    .then((res) => {

                        let status = res.data.status;

                        if (status == "200") {
                            $scope.isConnected = true;
                            $scope.isNotConnected = false;

                            $scope.onLoad_PictureLoad();
                        }
                        else {
                            $scope.isConnected = false;
                            $scope.isNotConnected = true;
                        }

                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onChange_loadMachine = (x) => {

            let value = $scope.fill_masterMachine[x];

            if (value != undefined) {
                $scope.masterexeUrl = value.machineExeUrl;
                $scope.mastermachineUrl = value.machineUrl;
                $scope.mastermachineUser = value.machineUser;
                $scope.mastermachinePassword = value.machinePassword;

                $scope.onClick_CheckConnection();
            }

        };

        $scope.onLoad_Machinelist = () => {

            try {

                httpCommonService.fill_employer_machinelist()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masterMachine = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Machinelist();

        /* push user to machine */
        $scope.pushUser = (x) => {

            try {

                let employeeName = x.memberName;
                let employeeNo = x.employeeEnroll;
                let employeeGender = x.memberGender;
                let employerId = x.employerId;

                let req = {
                    method: 'POST',
                    url: api_pushUser,
                    data: {
                        masterexeUrl: "http://" + $scope.masterexeUrl,
                        mastermachineUrl: "http://" + $scope.mastermachineUrl,
                        mastermachineUser: $scope.mastermachineUser,
                        mastermachinePassword: $scope.mastermachinePassword,
                        "employerId": employerId, "employeeName": employeeName, "employeeNo": employeeNo, "employeeGender": employeeGender
                    }
                };

                $("body").addClass("loading");

                httpService.masterHttpFetchData(req)
                    .then((res) => {
                        if (res.data.status == '404') {
                            warningMsg('Alert', 'Error while processing!')
                        }
                        else {
                            let status = res.data.data;
                            if (status == 'OK') {
                                $("body").removeClass("loading");
                                successMsg('Machine Record', "Record pushed to machine successfully");
                                //$scope.onLoad_MasterService();
                            }
                            else {
                                warningMsg('Alert', 'Record is already inserted!');
                                $("body").removeClass("loading");
                            }
                        }

                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
                $("body").removeClass("loading");
            }

        };

        $scope.deleteUser = (x) => {

            try {

                let employeeNo = x.employeeEnroll;

                let req = {
                    method: 'POST', url: api_deleteUser, data: {
                        masterexeUrl: "http://" + $scope.masterexeUrl,
                        mastermachineUrl: "http://" + $scope.mastermachineUrl,
                        mastermachineUser: $scope.mastermachineUser,
                        mastermachinePassword: $scope.mastermachinePassword,
                        "employeeNo": employeeNo
                    }
                };

                $("body").addClass("loading");

                httpService.masterHttpFetchData(req)
                    .then((res) => {
                        if (res.data.status == '404') {
                            warningMsg('Alert', 'Error while processing!');
                            $("body").removeClass("loading");
                        }
                        else {
                            $("body").removeClass("loading");
                            let status = res.data.data;
                            successMsg('Machine Record', "Record removed from machine successfully");
                            //$scope.onLoad_MasterService();
                        }

                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
                $("body").removeClass("loading");
            }

        };

        /* transfer data to server */
        $scope.onClick_pushDataToMachine = () => {
            try {
                let transferDate = ConvertDateforDatabaseOnlyDate($scope.masterCurrentDate);

                let req = {
                    method: 'POST',
                    url: api_getUser,
                    data: {
                        masterexeUrl: "http://" + $scope.masterexeUrl,
                        mastermachineUrl: "http://" + $scope.mastermachineUrl,
                        mastermachineUser: $scope.mastermachineUser,
                        mastermachinePassword: $scope.mastermachinePassword,
                        "transferDate": transferDate
                    }
                };
                $("body").addClass("loading");
                httpService.masterHttpFetchData(req)
                    .then((res) => {
                        if (res.data.status == '404') {
                            warningMsg('Alert', 'Error while processing!');
                            $("body").removeClass("loading");
                        }
                        else {
                            successMsg('Machine Record', res.data.data);
                            $("body").removeClass("loading");
                        }

                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                $("body").removeClass("loading");
            }
        };

    }]);