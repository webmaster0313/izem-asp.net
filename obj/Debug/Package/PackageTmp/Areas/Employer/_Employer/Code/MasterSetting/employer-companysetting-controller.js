
let api_selectdatabyid = backlink + "employer/api/companysetting/companysetting_apiSelect";
let api_filltabledata = backlink + "employer/api/companysetting/companysetting_apiSelectAll";
let api_insertdata = backlink + "employer/api/companysetting/companysetting_apiInsert";
let api_updatedata = backlink + "employer/api/companysetting/companysetting_apiUpdate";
let api_deletedata = backlink + "employer/api/companysetting/companysetting_apiDelete";

app.controller("employer-companysetting-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Company Profile');
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
            $scope.settingId = 0;
            $scope.employerId = 0;
            $scope.companyName = "";
            $scope.companyAddress = "";
            $scope.companyContactEmail = "";
            $scope.emailId = "";
            $scope.password = "";

            $scope.testingEmailId = "";
        };
        $scope.onLoad_Clear();

        $scope.onLoad_FillTable = (req) => {

            try {

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let result = res.data[0];

                            $scope.settingId = result.settingId;
                            $scope.employerId = result.employerId;
                            $scope.companyName = result.companyName;
                            $scope.companyAddress = result.companyAddress;
                            $scope.companyContactEmail = result.companyContactEmail;
                            $scope.emailId = result.emailId;
                            $scope.password = result.password;
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

                let settingId = $scope.settingId;
                let companyName = $scope.companyName;
                let companyAddress = $scope.companyAddress;
                let companyContactEmail = $scope.companyContactEmail;
                let emailId = $scope.emailId;
                let password = $scope.password;

                let req = {};
                if (settingId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "settingId": settingId,
                    "companyName": companyName,
                    "companyAddress": companyAddress,
                    "companyContactEmail": companyContactEmail,
                    "emailId": emailId,
                    "password": password
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (settingId == 0)
                                insertMsg();
                            else
                                updateMsg();

                            localStorage.setItem("_izemCompanyName", companyName);
                            localStorage.setItem("_izemAddress", companyAddress);
                            localStorage.setItem("_izemCompanyContact", companyContactEmail);

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

            $scope.hideEntry = true;
        };

    }]);