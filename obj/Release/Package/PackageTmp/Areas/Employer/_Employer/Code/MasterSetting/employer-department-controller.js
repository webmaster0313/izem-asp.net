
let api_selectdatabyid = backlink + "employer/api/employerdepartment/employerdepartment_apiSelect";
let api_filltabledata = backlink + "employer/api/employerdepartment/employerdepartment_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerdepartment/employerdepartment_apiInsert";
let api_updatedata = backlink + "employer/api/employerdepartment/employerdepartment_apiUpdate";
let api_deletedata = backlink + "employer/api/employerdepartment/employerdepartment_apiDelete";

app.controller("employer-department-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Department');
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
            $scope.employerdepartmentId = 0;
            $scope.employerdepartmentTitle = "";
            $scope.employerdepartmentIsActive = true;
            /* search */
            $scope.SearchEmployerdepartmentTitle = "";
            $scope.SearchEmployerdepartmentIsActive = "true";
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
            let SearchEmployerdepartmentTitle = $scope.SearchEmployerdepartmentTitle;
            let SearchEmployerdepartmentIsActive = $scope.SearchEmployerdepartmentIsActive;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchEmployerdepartmentTitle": SearchEmployerdepartmentTitle,
                    "SearchEmployerdepartmentIsActive": SearchEmployerdepartmentIsActive,
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

                let employerdepartmentId = $scope.employerdepartmentId;
                let employerdepartmentTitle = $scope.employerdepartmentTitle;
                let employerdepartmentIsActive = $scope.employerdepartmentIsActive;

                let req = {};
                if (employerdepartmentId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employerdepartmentId": employerdepartmentId,
                    "employerdepartmentTitle": employerdepartmentTitle,
                    "employerdepartmentIsActive": employerdepartmentIsActive
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerdepartmentId == 0)
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
                        "employerdepartmentId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerdepartmentId = res.data.employerdepartmentId
                            $scope.employerdepartmentTitle = res.data.employerdepartmentTitle
                            $scope.employerdepartmentIsActive = res.data.employerdepartmentIsActive.data[0] == 1 ? true : false;

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
                            "employerdepartmentId": id
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

        //. Excel download

        $scope.onClick_Download = () => {
            try {

                let SearchEmployerdepartmentTitle = $scope.SearchEmployerdepartmentTitle;
                let SearchEmployerdepartmentIsActive = $scope.SearchEmployerdepartmentIsActive;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        "SearchEmployerdepartmentTitle": SearchEmployerdepartmentTitle,
                        "SearchEmployerdepartmentIsActive": SearchEmployerdepartmentIsActive,
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
                                strstring += "<td x:autofilter='all'><b> Department Name </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerdepartmentTitle + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Department Excel');
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