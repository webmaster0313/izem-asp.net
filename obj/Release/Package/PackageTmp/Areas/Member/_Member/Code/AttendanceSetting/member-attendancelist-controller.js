
let api_selectdatabyid = backlink + "employer/api/employeeattendance/employeeattendance_apiSelect";
let api_filltabledata = backlink + "employer/api/employeeattendance/employeeattendance_apiSelectAll";
let api_insertdata = backlink + "employer/api/employeeattendance/employeeattendance_apiInsert";
let api_updatedata = backlink + "employer/api/employeeattendance/employeeattendance_apiUpdate";
let api_deletedata = backlink + "employer/api/employeeattendance/employeeattendance_apiDelete";
//.
let api_calculateandtransfer = backlink + "employer/api/employeeattendance/employeeattendance_apiCalculateAndTransfer";
let api_apiBulkUpload = backlink + "employer/api/employeeattendance/employeeattendance_apiBulkUploadExcel";

app.controller("member-attendancelist-controller", ['$scope', 'httpService', 'httpCommonService',
    function ($scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemEmployeeId = localStorage.getItem("_izemEmployeeId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");
        /* Assign EmployeeId */
        $scope.employeeId = $scope._izemEmployeeId;

        $scope.loaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            let date = new Date();

            $scope.employeeattendanceId = 0;
            $scope.employeeEnroll = "";
            $scope.employeeattendanceEntryTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
            //. search
            $scope.SearchFromDate = new Date();
            $scope.SearchToDate = new Date();
            $scope.SearchEmployeeId = "";
            $scope.SearchEmployerdepartmentId = "";
            $scope.SearchEmployerbranchId = "";

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
            let SearchFromDate = $scope.SearchFromDate;
            let SearchToDate = $scope.SearchToDate;
            let SearchEmployeeId = $scope.SearchEmployeeId;
            let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;
            let SearchEmployerbranchId = $scope.SearchEmployerbranchId;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    "SearchFromDate": SearchFromDate,
                    "SearchToDate": SearchToDate,
                    "SearchEmployeeId": SearchEmployeeId,
                    "SearchEmployerdepartmentId": SearchEmployerdepartmentId,
                    "SearchEmployerbranchId": SearchEmployerbranchId,
                    "employerId": $scope._izemEmployerId,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onLoad_Employee = () => {

            try {

                httpCommonService.fill_employee()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employeeEnroll = res.data;
                            $scope.fill_SearchEmployeeId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Employee();

        $scope.onLoad_Branch = () => {

            try {

                httpCommonService.fill_employee_branch()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_SearchEmployerbranchId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Branch();

        $scope.onLoad_Department = () => {

            try {

                httpCommonService.fill_employee_department()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_SearchEmployerdepartmentId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Department();

        $scope.onClick_AddRecord = () => {
            $scope.hideEntry = false;
        };

        $scope.onClick_Submit = () => {
            try {

                let employeeattendanceId = $scope.employeeattendanceId;
                let employeeEnroll = $scope.employeeEnroll;
                let employeeattendanceStatus = '';
                let employeeattendanceEntryTime = moment($scope.employeeattendanceEntryTime).format("YYYY-MM-DD HH:mm:ss");

                let req = {};
                if (employeeattendanceId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employeeattendanceId": employeeattendanceId,
                    "employeeEnroll": employeeEnroll,
                    "employeeattendanceStatus": employeeattendanceStatus,
                    "employeeattendanceEntryTime": employeeattendanceEntryTime,
                    "isManual": true
                };

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeeattendanceId == 0)
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
                        "employeeattendanceId": id
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.employeeattendanceId = res.data.employeeattendanceId;
                            $scope.employeeEnroll = res.data.employeeEnroll;
                            let _date = new Date(res.data.employeeattendanceEntryTime);
                            $scope.employeeattendanceEntryTime = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes());

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
                            "employeeattendanceId": id
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
            $("#searchModal").modal("hide");
        };
        $scope.onClick_ResetSearch = () => {
            $scope.onLoad_Clear();
            $scope.onLoad_MasterService();
        };
        //. transfer data
        $scope.onLoad_MasterTransfer = () => {
            try {

                let permission = customConfirm('Are you sure, You want to continue?');
                if (permission == 'No')
                    return;

                $("#searchModal").modal("hide");

                let req = {
                    method: 'POST',
                    url: api_calculateandtransfer,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        'fromDate': moment($scope.SearchFromDate).format("YYYY-MM-DD"),
                        'toDate': moment($scope.SearchToDate).format("YYYY-MM-DD")
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            successMsg("Success", res.message);
                            let calculateData = {
                                "fromDate": $scope.SearchFromDate,
                                "toDate": $scope.SearchToDate
                            };

                            localStorage.setItem("calculateData", JSON.stringify(calculateData));

                            window.location.href = "/employer/attendancesetting/manage-your-attendancereport";
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };
        //. Excel download
        $scope.onClick_Download = () => {
            try {

                let SearchFromDate = $scope.SearchFromDate;
                let SearchToDate = $scope.SearchToDate;
                let SearchEmployeeId = $scope.SearchEmployeeId;
                let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;
                let SearchEmployerbranchId = $scope.SearchEmployerbranchId;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        "SearchFromDate": SearchFromDate,
                        "SearchToDate": SearchToDate,
                        "SearchEmployeeId": SearchEmployeeId,
                        "SearchEmployerdepartmentId": SearchEmployerdepartmentId,
                        "SearchEmployerbranchId": SearchEmployerbranchId,
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
                                strstring += "<td x:autofilter='all'><b> Date </b></td>";
                                strstring += "<td x:autofilter='all'><b> Entry Time </b></td>";
                                strstring += "<td x:autofilter='all'><b> Enrollment No </b></td>";
                                strstring += "<td x:autofilter='all'><b> Employee No </b></td>";
                                strstring += "<td x:autofilter='all'><b> Employee Name </b></td>";
                                strstring += "<td x:autofilter='all'><b> Department </b></td>";
                                strstring += "<td x:autofilter='all'><b> Branch </b></td>";
                                strstring += "<td x:autofilter='all'><b> OT-Code </b></td>";
                                strstring += "<td x:autofilter='all'><b> AddPay-Code </b></td>";
                                strstring += "<td x:autofilter='all'><b> Shift-Code </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {

                                    let _employeradditionalpaysetupCode = obj[i].employeradditionalpaysetupCode == null ? '-' : obj[i].employeradditionalpaysetupCode;
                                    let _employerotsetupOTCode = obj[i].employerotsetupOTCode == null ? '-' : obj[i].employerotsetupOTCode;
                                    let _employershiftsetupCode = obj[i].employershiftsetupCode == null ? '-' : obj[i].employershiftsetupCode;

                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + moment(obj[i].employeeattendanceEntryTime).format("DD-MM-YYYY") + " </td>";
                                    strstring += "<td x:autofilter='all'> " + moment(obj[i].employeeattendanceEntryTime).format("HH:mm:ss") + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employeeEnroll + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employeeAlternativeEnroll + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].memberName + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerdepartmentTitle + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerbranchName + " </td>";
                                    strstring += "<td x:autofilter='all'> " + _employerotsetupOTCode + " </td>";
                                    strstring += "<td x:autofilter='all'> " + _employeradditionalpaysetupCode + " </td>";
                                    strstring += "<td x:autofilter='all'> " + _employershiftsetupCode + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Attendace Excel');
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

        //. upload row data using excel file

        var reader = new FileReader();
        $scope.fileUploading = false;
        $scope.fileUploadedList = false;
        $scope._Data = [];

        $scope.onClick_OpenExcelUploader = () => {
            try {

                $("#excelUploaderModal").modal("show");
            } catch (e) {
                console.log(e);
            }
        };

        $(function () {
            $('input[type=file]').change(function () {
                if (typeof (FileReader) != "undefined") {
                    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                    $($(this)[0].files).each(function () {
                        var file = $(this);
                        if (regex.test(file[0].name.toLowerCase())) {
                            reader.readAsDataURL(file[0]);
                        } else {
                            alert(file[0].name + " is not a valid image file.");
                            return false;
                        }
                    });
                } else {
                    alert("This browser does not support HTML5 FileReader.");
                }
            });
        });

        $scope.onClick_UploadExcel = () => {
            $scope.fileUploading = true;
            var byteData = reader.result;
            if (byteData != null) {
                byteData = byteData.split(';')[1].replace("base64,", "");
                $.ajax({
                    type: "POST",
                    url: "/employer/home/GetExcelData",
                    data: { "byteData": byteData },

                    success: function (response) {
                        if (response != "") {
                            $scope.fileUploading = false;
                            let result = JSON.parse(response);
                            if (result.length > 0) {
                                $scope.fileUploadedList = true;
                                $scope.$apply(function () {
                                    $scope._Data = result;
                                });
                            }
                            else {
                                $scope.fileUploading = false;
                                warningMsg("", "Please check your file and file format, not able to find the records.");
                            }
                        }
                        else {
                            $scope._Data = [];
                            $scope.fileUploading = false;
                            warningMsg("", "Please check your file and file format, not able to find the records.");
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
            else {
                warningMsg("File Status", "Please select file for upload");
                $scope.fileUploading = false;
            }
        };

        $scope.onClick_CloseBulkUpload = (x) => {

            $scope.fileUploading = false;
            $scope.fileUploadedList = false;

            $scope._Data = [];

            var file = document.getElementById("fuUpload");
            file.value = file.defaultValue;
            reader = new FileReader();

            if (x != 'reset')
                $("#excelUploaderModal").modal("hide");
        };

        $scope.onClick_BulkSubmit = () => {
            try {

                if ($scope._Data.length > 0) {
                    let req = {
                        method: 'POST',
                        url: api_apiBulkUpload,
                        data: {
                            "employerId": $scope._izemEmployerId,
                            "rowData": JSON.stringify($scope._Data)
                        }
                    };

                    httpService.httpOperationData(req)
                        .then((res) => {
                            if (res.status == 200) {
                                insertMsg();
                                $scope.onLoad_MasterService();
                                $scope.onClick_CloseBulkUpload();
                            }
                            $scope._Data = [];
                            $("#excelUploaderModal").modal("hide");

                        }, (err) => {
                            console.log(err);
                        });
                }
                else {
                    warningMsg("File Status", "Please select file for upload");
                }
            } catch (e) {
                console.log(e);
            }
        };

    }]);