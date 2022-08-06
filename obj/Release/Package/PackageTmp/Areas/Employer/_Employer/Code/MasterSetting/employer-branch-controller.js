
let api_selectdatabyid = backlink + "employer/api/employerbranch/employerbranch_apiSelect";
let api_filltabledata = backlink + "employer/api/employerbranch/employerbranch_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerbranch/employerbranch_apiInsert";
let api_updatedata = backlink + "employer/api/employerbranch/employerbranch_apiUpdate";
let api_deletedata = backlink + "employer/api/employerbranch/employerbranch_apiDelete";

app.controller("employer-branch-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");

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
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Branch');
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
            $scope.employerbranchId = 0;
            $scope.employerId = 0;
            $scope.employerbranchName = "";
            $scope.mastercountryId = "";
            $scope.masterstateId = "";
            $scope.employerbranchCity = "";
            $scope.employerbranchPostcode = "";
            $scope.employerbranchAddress1 = "";
            $scope.employerbranchAddress2 = "";
            $scope.employerbranchAddress3 = "";
            $scope.employerbranchContactno = "";
            $scope.employerbranchFax = "";
            $scope.employerbranchEmail = "";
            $scope.employerbranchInchargeName = "";
            $scope.employerbranchInchargeMobile = "";
            $scope.employerbranchInchargeEmail = "";
            $scope.employerbranchIsActive = true;
            /* search */
            $scope.SearchEmployerbranchName = "";
            $scope.SearchEmployerbranchIsActive = "true";
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
            let SearchEmployerbranchName = $scope.SearchEmployerbranchName;
            let SearchEmployerbranchIsActive = $scope.SearchEmployerbranchIsActive;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    SearchEmployerbranchName: SearchEmployerbranchName,
                    SearchEmployerbranchIsActive: SearchEmployerbranchIsActive,
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

                let employerbranchId = $scope.employerbranchId;
                let employerbranchName = $scope.employerbranchName;
                let mastercountryId = $scope.mastercountryId;
                let masterstateId = $scope.masterstateId;
                let employerbranchCity = $scope.employerbranchCity;
                let employerbranchPostcode = $scope.employerbranchPostcode;
                let employerbranchAddress1 = $scope.employerbranchAddress1;
                let employerbranchAddress2 = $scope.employerbranchAddress2;
                let employerbranchAddress3 = $scope.employerbranchAddress3;
                let employerbranchContactno = $scope.employerbranchContactno;
                let employerbranchFax = $scope.employerbranchFax;
                let employerbranchEmail = $scope.employerbranchEmail;
                let employerbranchInchargeName = $scope.employerbranchInchargeName;
                let employerbranchInchargeMobile = $scope.employerbranchInchargeMobile;
                let employerbranchInchargeEmail = $scope.employerbranchInchargeEmail;
                let employerbranchIsActive = $scope.employerbranchIsActive;

                let req = {};
                if (employerbranchId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employerbranchId": employerbranchId,
                    "employerbranchName": employerbranchName, "mastercountryId": mastercountryId,
                    "masterstateId": masterstateId, "employerbranchCity": employerbranchCity, "employerbranchPostcode": employerbranchPostcode,
                    "employerbranchAddress1": employerbranchAddress1, "employerbranchAddress2": employerbranchAddress2,
                    "employerbranchAddress3": employerbranchAddress3, "employerbranchContactno": employerbranchContactno,
                    "employerbranchFax": employerbranchFax, "employerbranchEmail": employerbranchEmail,
                    "employerbranchInchargeName": employerbranchInchargeName,
                    "employerbranchInchargeMobile": employerbranchInchargeMobile, "employerbranchInchargeEmail": employerbranchInchargeEmail,
                    "employerbranchIsActive": employerbranchIsActive
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerbranchId == 0)
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
                        "employerbranchId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerbranchId = res.data.employerbranchId;
                            $scope.employerId = res.data.employerId;
                            $scope.employerbranchName = res.data.employerbranchName;
                            $scope.mastercountryId = res.data.mastercountryId == 0 ? "" : res.data.mastercountryId;
                            if ($scope.mastercountryId != "") {
                                $scope.fillState();
                            }
                            $scope.masterstateId = res.data.masterstateId == 0 ? "" : res.data.masterstateId;
                            $scope.employerbranchCity = res.data.employerbranchCity;
                            $scope.employerbranchPostcode = res.data.employerbranchPostcode;
                            $scope.employerbranchAddress1 = res.data.employerbranchAddress1;
                            $scope.employerbranchAddress2 = res.data.employerbranchAddress2;
                            $scope.employerbranchAddress3 = res.data.employerbranchAddress3;
                            $scope.employerbranchContactno = res.data.employerbranchContactno;
                            $scope.employerbranchFax = res.data.employerbranchFax;
                            $scope.employerbranchEmail = res.data.employerbranchEmail;
                            $scope.employerbranchInchargeName = res.data.employerbranchInchargeName;
                            $scope.employerbranchInchargeMobile = res.data.employerbranchInchargeMobile;
                            $scope.employerbranchInchargeEmail = res.data.employerbranchInchargeEmail;
                            $scope.employerbranchIsActive = res.data.employerbranchIsActive.data[0] == 1 ? true : false;

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
                            "employerbranchId": id
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

        //. Dropdown

        $scope.onLoad_Country = () => {

            try {

                httpCommonService.fill_backoffice_country()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_mastercountryId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Country();

        $scope.fillState = () => {

            try {

                httpCommonService.fill_backoffice_state($scope.mastercountryId)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_masterstateId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

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

        //. Excel download

        $scope.onClick_Download = () => {
            try {

                let SearchEmployerbranchName = $scope.SearchEmployerbranchName;
                let SearchEmployerbranchIsActive = $scope.SearchEmployerbranchIsActive;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        SearchEmployerbranchName: SearchEmployerbranchName,
                        SearchEmployerbranchIsActive: SearchEmployerbranchIsActive,
                        "employerId": $scope._izemEmployerId,
                        pageIndex: 1,
                        pageSize: 'all'
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;
                            let companyName = localStorage.getItem("_izemCompanyName");
                            let companyAddress = localStorage.getItem("_izemAddress");

                            var strstring = "";
                            if (obj.length > 0) {
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> Company Name : " + companyName + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'><b> " + companyAddress + " </b></td></tr>";
                                strstring += "<tr><td colspan = '14' x:autofilter='all'> </td></tr>";
                                strstring += "<tr>";
                                strstring += "<td x:autofilter='all'><b> Branch Name </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerbranchName + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Branch Excel');
                            }
                            else {
                                warningMsg("Download", "No records found.");
                            }
                        }
                        else {
                            warningMsg("Download", "No records found.");
                        }
                    }, (err) => {
                        console.log(err)
                    });


            } catch (e) {
                console.log(e);
            }
        };

    }]);