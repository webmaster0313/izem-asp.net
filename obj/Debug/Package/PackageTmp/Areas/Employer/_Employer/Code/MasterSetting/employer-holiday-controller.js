
let api_selectdatabyid = backlink + "employer/api/employerholiday/employerholiday_apiSelect";
let api_filltabledata = backlink + "employer/api/employerholiday/employerholiday_apiSelectAll";
let api_insertdata = backlink + "employer/api/employerholiday/employerholiday_apiInsert";
let api_updatedata = backlink + "employer/api/employerholiday/employerholiday_apiUpdate";
let api_deletedata = backlink + "employer/api/employerholiday/employerholiday_apiDelete";
//.
let api_insertdatalist = backlink + "employer/api/employerholiday/employerholiday_apiInsertList";

app.controller("employer-holiday-controller", ['$scope', 'httpService', 'httpCommonService',
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
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Holiday');
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
            $scope.employerHolidayId = 0;
            $scope.holidayTitle = "";
            $scope.holidayDate = "";
            $scope.holidayDescription = "";
            $scope.holidayOTTag = "";
            $scope.holidayAddPayTag = "";
            $scope.holidayShiftTag = "";
            /* search */
            $scope.SearchHolidayTitle = "";
            $scope.SearchHolidayDate = moment().format("YYYY");
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
            let SearchHolidayDate = $scope.SearchHolidayDate;
            let SearchHolidayTitle = $scope.SearchHolidayTitle;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchHolidayDate": SearchHolidayDate,
                    "SearchHolidayTitle": SearchHolidayTitle,
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

                let employerHolidayId = $scope.employerHolidayId;
                let holidayTitle = $scope.holidayTitle;
                let holidayDate = moment($scope.holidayDate).format("YYYY-MM-DD");
                let holidayDescription = $scope.holidayDescription;
                let holidayOTTag = $scope.holidayOTTag;
                let holidayAddPayTag = $scope.holidayAddPayTag;
                let holidayShiftTag = $scope.holidayShiftTag;

                let req = {};
                if (employerHolidayId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employerHolidayId": employerHolidayId,
                    "holidayTitle": holidayTitle, "holidayDate": holidayDate, "holidayDescription": holidayDescription,
                    "holidayOTTag": holidayOTTag, "holidayAddPayTag": holidayAddPayTag, "holidayShiftTag": holidayShiftTag
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employerHolidayId == 0)
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
                        "employerHolidayId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employerHolidayId = res.data.employerHolidayId;
                            $scope.holidayTitle = res.data.holidayTitle;
                            $scope.holidayDate = new Date(res.data.holidayDate);
                            $scope.holidayDescription = res.data.holidayDescription;
                            $scope.holidayOTTag = res.data.holidayOTTag == 0 ? "" : res.data.holidayOTTag;
                            $scope.holidayAddPayTag = res.data.holidayAddPayTag == 0 ? "" : res.data.holidayAddPayTag;
                            $scope.holidayShiftTag = res.data.holidayShiftTag == 0 ? "" : res.data.holidayShiftTag;

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
                            "employerHolidayId": id
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

        //. dropdown

        $scope.onLoad_AdditionalPayset = () => {

            try {

                httpCommonService.fill_employer_additionalpaysetup()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_AdditionalPayset = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_AdditionalPayset();

        $scope.onLoad_OvertimeSetting = () => {

            try {

                httpCommonService.fill_employer_otsetup()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_OvertimeSetting = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_OvertimeSetting();

        $scope.onLoad_ShiftSetting = () => {

            try {

                httpCommonService.fill_employer_shiftsetup()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_ShiftSetting = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_ShiftSetting();

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

                let SearchHolidayDate = $scope.SearchHolidayDate;
                let SearchHolidayTitle = $scope.SearchHolidayTitle;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        "SearchHolidayDate": SearchHolidayDate,
                        "SearchHolidayTitle": SearchHolidayTitle,
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
                                strstring += "<td x:autofilter='all'><b> Title </b></td>";
                                strstring += "<td x:autofilter='all'><b> Date </b></td>";
                                strstring += "<td x:autofilter='all'><b> Description </b></td>";
                                strstring += "<td x:autofilter='all'><b> OT-Code </b></td>";
                                strstring += "<td x:autofilter='all'><b> AdditionalPay-Code </b></td>";
                                strstring += "<td x:autofilter='all'><b> Shift-Code </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].holidayTitle + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].holidayDateDDMMYYYY + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].holidayDescription + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerotsetupOTCode == null ? '' : obj[i].employerotsetupOTCode + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employeradditionalpaysetupCode == null ? '' : obj[i].employeradditionalpaysetupCode + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employershiftsetupCode == null ? '' : obj[i].employershiftsetupCode + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Holiday Excel');
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

        //. Multiple Insert Records

        $scope.onClick_CloseInsertMulti = () => {
            $("#multiInsertModal").modal("hide");
        };

        $scope.onClick_OpenInsertRecord = () => {
            try {

                let SearchHolidayDate = $scope.SearchHolidayDate;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        "SearchHolidayDate": SearchHolidayDate,
                        "SearchHolidayTitle": "",
                        "employerId": $scope._izemEmployerId,
                        pageIndex: $scope.pageIndex,
                        pageSize: 'all'
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            for (let i = 0; i < res.data.length; i++) {
                                let a = add_years(new Date(res.data[i].holidayDate), 1);
                                res.data[i].holidayDate = a;
                            }

                            $scope.tableParamsList = res.data;

                            $("#multiInsertModal").modal("show");
                        }
                        else {
                            $scope.tableParamsList = [];
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_InsertMultiHoliday = () => {
            try {

                let _data = $scope.tableParamsList;
                if (_data.length > 0) {
                    for (let i = 0; i < _data.length; i++) {
                        let _date = moment(_data[i].holidayDate).format("YYYY-MM-DD");
                        _data[i]._holidayDate = _date;
                    }

                    //. Insert
                    let req = { method: 'POST', url: api_insertdatalist };
                    let pera = {
                        "employerId": $scope._izemEmployerId,
                        "holidayList": JSON.stringify(_data)
                    }

                    req.data = pera;

                    httpService.httpOperationData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                insertMsg();
                                $scope.onLoad_MasterService();
                                $scope.onLoad_Clear();
                                $scope.onClick_CloseInsertMulti();
                            }
                        }, (err) => {
                            console.log(err);
                        });

                }
            } catch (e) {
                console.log(e);
            }
        };

    }]);