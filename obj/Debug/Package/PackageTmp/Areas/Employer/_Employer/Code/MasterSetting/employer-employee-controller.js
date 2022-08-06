
let api_selectdatabyid = backlink + "employer/api/employee/employee_apiSelect";
let api_filltabledata = backlink + "employer/api/employee/employee_apiSelectAll";
let api_insertdata = backlink + "employer/api/employee/employee_apiInsert";
let api_updatedata = backlink + "employer/api/employee/employee_apiUpdate";
let api_deletedata = backlink + "employer/api/employee/employee_apiDelete";
//. Image Upload
let api_imageupload = "/employer/home/imageUpload";
let api_imageremove = "/employer/home/imageRemove";

//. Member
let api_filltabledata_searchmember = backlink + "member/api/member/member_apiSelect_Search";
let api_signInAccount = backlink + "member/api/member/member_apiSignInAccount";

//.
let api_deleteEmployeeLeaveDate = backlink + "employer/api/employerleavetypeentitlement/employerleavetypeentitlement_apiRemoveLeaveEntitlement";

//. Machine Connection
let api_pushUser = backlink + "employer/api/machineConnection/pushUserToAllMachine";

app.controller("employer-employee-controller", ['$scope', '$rootScope', 'httpService', 'httpCommonService', '$http',
    function ($scope, $rootScope, httpService, httpCommonService, $http) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");
        $scope._izemSignupId = localStorage.getItem("_izemSignupId");
        $scope._izememployerbranchId = localStorage.getItem("_employerbranchId");

        //. Rights
        $scope.isAddPermit = false;
        $scope.isEditPermit = false;
        $scope.isDeletePermit = false;
        $scope.isReportPermit = false;

        $scope.onLoad_Access = (localData) => {
            try {

                let _subDiv = JSON.parse(localData);
                if (_subDiv.length > 0) {
                    let _layout = _subDiv.filter(x => x.menuName == 'Master entries' && x.pageName == 'Employee');
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

        $scope.milisec = new Date().getMilliseconds();

        $scope.loaded = false;
        $scope.memberloaded = false;
        $scope.hideEntry = true;

        $scope.maxSize = defaultpagecount();
        $scope.pageIndex = 1;
        $scope.pageSizeSelected = defaultpagesize();

        $scope.onLoad_Clear = () => {
            $scope._employeeId = 0;

            $scope.employerdepartmentId = 0;
            $scope.employerdepartmentTitle = "";
            $scope.employerdepartmentIsActive = true;
            /* search */
            $scope.SearchEmployeeId = "";
            $scope.SearchEmployerdepartmentId = "";
            $scope.SearchEmployerbranchId = "";
            $scope.SearchEmployeeIsActive = "true";
            $scope.sortBy = "employeeEnroll";
            $scope.pageName = "normal";

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
            let SearchEmployeeId = $scope.SearchEmployeeId;
            let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;

            let SearchEmployerbranchId = $scope.SearchEmployerbranchId;

            if ($scope._izememployerbranchId != 0)
                SearchEmployerbranchId = $scope._izememployerbranchId

            let SearchEmployeeIsActive = $scope.SearchEmployeeIsActive;
            let sortBy = $scope.sortBy;

            let pageName = $scope.pageName;

            let req = {
                method: 'POST',
                url: api_filltabledata,
                data: {
                    strWhere: "",
                    SearchEmployeeId: SearchEmployeeId,
                    SearchEmployerdepartmentId: SearchEmployerdepartmentId,
                    SearchEmployerbranchId: SearchEmployerbranchId,
                    SearchEmployeeIsActive: SearchEmployeeIsActive,
                    sortBy: sortBy,
                    "employerId": $scope._izemEmployerId,
                    pageIndex: $scope.pageIndex,
                    pageSize: $scope.pageSizeSelected,
                    pageName: pageName
                }
            };
            $scope.onLoad_FillTable(req);
        };
        $scope.onLoad_MasterService();

        $scope.onClick_AddRecord = () => {
            $scope.hideEntry = false;
            $scope.hideMemberTable = true;
            $scope.hideMemberForm = false;
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
                    "employerdepartmentId": employerdepartmentId, "employerdepartmentTitle": employerdepartmentTitle, "employerdepartmentIsActive": employerdepartmentIsActive
                }

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

        //. dropdown

        $scope.onLoad_Employee = () => {

            try {

                httpCommonService.fill_employee()
                    .then((res) => {
                        if (res.status == 200) {
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
                            $scope.fill_employerbranchId = res.data;
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
                            $scope.fill_employerdepartmentId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Department();

        $scope.onLoad_Entitlement = () => {

            try {

                httpCommonService.fill_employee_entitlement()
                    .then((res) => {
                        if (res.status == 200) {
                            $scope.fill_employerentitlementId = res.data;
                        }
                    }, (err) => {
                        console.log(err);
                    })

            } catch (e) {
                console.log(e);
            }

        };
        $scope.onLoad_Entitlement();

        //. Image Upload

        $scope.userImageUpload = function (files) {
            $scope.verbImage = files;
            $scope.userImage = $scope.verbImage[0];
        };

        $scope.onClick_OpenImageUploadModal = (x) => {
            try {

                $scope._employeeEnroll = x.employeeEnroll;
                $scope._employerId = x.employerId;

                var imageUrl = "/Image/" + $scope._employerId + "/" + $scope._employeeEnroll + ".jpg";
                imageExists(imageUrl, function (exists) {

                    if (exists) {
                        $scope.$apply(function () {
                            $scope.userImage = "/Image/" + $scope._employerId + "/" + $scope._employeeEnroll + ".jpg";
                        });
                    }
                    else {
                        $scope.$apply(function () {
                            $scope.userImage = "/Image/NoPhoto.jpg";
                        });
                    }
                });

                $('#imageUploadModal').modal('show');
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_CloseImageUpload = () => {
            try {

                angular.element("#userImageUpload").val(null);
                $('#id_userImage').attr('src', '/Image/NoPhoto.jpg');

                $scope.userImage = "/Image/NoPhoto.jpg";
                $scope.verbImage = [];

                $scope._employeeEnroll = 0;
                $scope._employerId = 0;

                $('#imageUploadModal').modal('hide');
            } catch (e) {
                console.log(e);
            }
        };

        $scope.loadImage = async function () {
            let baseImage = '';
            if ($scope.userImage != "" && $scope.userImage != "/Image/NoPhoto.jpg") {
                if ($scope.verbImage.length == 0)
                    baseImage = '';
                else
                    baseImage = await toBase64($scope.userImage);
            }

            if (baseImage != "") {
                const result = await $.ajax({
                    url: api_imageupload,
                    type: 'POST',
                    data: {
                        "baseImage": baseImage,
                        "id": $scope._employeeEnroll.toString(),
                        "folderId": $scope._employerId.toString()
                    }
                });
            };

            $scope.onClick_CloseImageUpload();
            $scope.onLoad_MasterService();
        };

        //. End Image Upload

        //. Employee Detail

        $scope.hideMemberForm = false;

        $scope.onClick_EditMember = (x) => {

            let memberId = x.memberId;

            $scope.hideMemberForm = true;
            $scope.hideEntry = false;

            $rootScope.onLoad_UpdateMember(memberId);
        };

        $rootScope.onClick_CloseMemberForm = () => {
            $scope.hideMemberForm = false;
            $scope.hideEntry = true;

            $scope.onLoad_MasterService();
        };

        //. End Employee Detail

        //. Employer Detail

        $scope.onClick_SubmitEmployee = () => {
            try {

                if ($scope.employeeIsActive == false) {
                    if ($scope.employeeLeaving == null) {
                        alert("Please mention date of leaving.");
                        return;
                    }
                }

                let employeeId = $scope.employeeId;
                let memberId = $scope.memberId;
                let employerdepartmentId = $scope.employerdepartmentId;
                let employerbranchId = $scope.employerbranchId;
                let employeeEnroll = $scope.employeeEnroll;
                let employeeAlternativeEnroll = $scope.employeeAlternativeEnroll;
                let employeeManagerId = $scope.employeeManagerId;
                let employerentitlementId = $scope.employerentitlementId;

                let employeeCompanyEmail = $scope.employeeCompanyEmail;
                let employeeJoining = moment($scope.employeeJoining).format("YYYY-MM-DD");
                let employeeLeaving = $scope.employeeLeaving == null ? null : moment($scope.employeeLeaving).format("YYYY-MM-DD");

                let employeeLimitCategroy = $scope.employeeLimitCategroy;
                let employeeLimitEmployee = $scope.employeeLimitEmployee;
                let employeeLimitDependent = $scope.employeeLimitDependent;
                let employeeVisitLimitEmployee = $scope.employeeVisitLimitEmployee;
                let employeeVisitLimitDependent = $scope.employeeVisitLimitDependent;
                let employeeVisitAllowed = $scope.employeeVisitAllowed;
                let employeeVisitDuration = $scope.employeeVisitDuration;
                let employeeEntitlementRemarks = $scope.employeeEntitlementRemarks;
                let employeeDesignation = $scope.employeeDesignation;
                let employeeIsCustomEntitled = $scope.employeeIsCustomEntitled;
                let employeeIsActive = $scope.employeeIsActive;
                let employeeIsMachine = $scope.employeeIsMachine;
                let isMultiShift = $scope.isMultiShift;
                let employeeIsManualAttendance = $scope.employeeIsManualAttendance;
                let employeeIsMultipleLogin = $scope.employeeIsMultipleLogin;
                let employeeIsFixJoining = $scope.employeeIsFixJoining;

                let employeeType = $scope.employeeType;

                let req = {};
                if (employeeId == 0)
                    req = { method: 'POST', url: api_insertdata };
                else
                    req = { method: 'POST', url: api_updatedata };

                let pera = {
                    "employerId": $scope._izemEmployerId,
                    "createdBy": $scope._izemSignupId,
                    "employeeId": employeeId, "memberId": memberId, "employerdepartmentId": employerdepartmentId, "employerbranchId": employerbranchId,
                    "employeeEnroll": employeeEnroll, "employeeAlternativeEnroll": employeeAlternativeEnroll, "employeeManagerId": employeeManagerId,
                    "employerentitlementId": employerentitlementId, "employeeCompanyEmail": employeeCompanyEmail, "employeeJoining": employeeJoining,
                    "employeeLeaving": employeeLeaving, "employeeLimitCategroy": employeeLimitCategroy, "employeeLimitEmployee": employeeLimitEmployee,
                    "employeeLimitDependent": employeeLimitDependent, "employeeVisitLimitEmployee": employeeVisitLimitEmployee,
                    "employeeVisitLimitDependent": employeeVisitLimitDependent, "employeeVisitAllowed": employeeVisitAllowed, "employeeVisitDuration": employeeVisitDuration,
                    "employeeEntitlementRemarks": employeeEntitlementRemarks, "employeeDesignation": employeeDesignation, "employeeIsCustomEntitled": employeeIsCustomEntitled,
                    "employeeIsActive": employeeIsActive, "employeeIsMachine": employeeIsMachine, "employeeIsFixJoining": employeeIsFixJoining, "isMultiShift": isMultiShift,
                    "employeeIsManualAttendance": employeeIsManualAttendance, "employeeIsMultipleLogin": employeeIsMultipleLogin, "employeeType": employeeType
                }

                req.data = pera;

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            if (employeeId == 0)
                                insertMsg();
                            else
                                updateMsg();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_EditEmployee = (x) => {
            try {

                let employeeId = x.employeeId;
                $scope._employeeId = employeeId;

                let req = {
                    method: 'POST',
                    url: api_selectdatabyid,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": employeeId
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            /* load dropdown */
                            $scope.onLoad_Department();
                            $scope.onLoad_Branch();
                            $scope.onLoad_Entitlement();
                            $scope.onLoad_Employee();
                            /* end load dropdown */
                            $scope._memberName = res.data.memberName;

                            $scope.employeeId = res.data.employeeId;
                            $scope.memberId = res.data.memberId;
                            $scope.employerId = res.data.employerId;
                            $scope.employerdepartmentId = res.data.employerdepartmentId == 0 ? "" : res.data.employerdepartmentId;
                            $scope.employerbranchId = res.data.employerbranchId == 0 ? "" : res.data.employerbranchId;
                            $scope.employeeEnroll = res.data.employeeEnroll == 0 ? "" : res.data.employeeEnroll;
                            $scope.employeeAlternativeEnroll = res.data.employeeAlternativeEnroll == 0 ? "" : res.data.employeeAlternativeEnroll;
                            $scope.employeeManagerId = res.data.employeeManagerId;
                            $scope.employerentitlementId = res.data.employerentitlementId == 0 ? "" : res.data.employerentitlementId;
                            $scope.employeeCompanyEmail = res.data.employeeCompanyEmail;
                            $scope.employeeJoining = res.data.employeeJoining == null ? null : new Date(res.data.employeeJoining);
                            $scope.employeeLeaving = res.data.employeeLeaving == null ? null : new Date(res.data.employeeLeaving);

                            $scope.employeeLimitCategroy = res.data.employeeLimitCategroy;
                            $scope.employeeLimitEmployee = res.data.employeeLimitEmployee;
                            $scope.employeeLimitDependent = res.data.employeeLimitDependent;
                            $scope.employeeVisitLimitEmployee = res.data.employeeVisitLimitEmployee;
                            $scope.employeeVisitLimitDependent = res.data.employeeVisitLimitDependent;
                            $scope.employeeVisitAllowed = res.data.employeeVisitAllowed;
                            $scope.employeeVisitDuration = res.data.employeeVisitDuration;
                            $scope.employeeEntitlementRemarks = res.data.employeeEntitlementRemarks;
                            $scope.employeeDesignation = res.data.employeeDesignation;

                            $scope.employeeIsCustomEntitled = res.data.employeeIsCustomEntitled.data[0] == 1 ? true : false;
                            $scope.employeeIsActive = res.data.employeeIsActive.data[0] == 1 ? true : false;
                            $scope.employeeIsMachine = res.data.employeeIsMachine.data[0] == 1 ? true : false;
                            $scope.isMultiShift = res.data.isMultiShift.data[0] == 1 ? true : false;
                            $scope.employeeIsManualAttendance = res.data.employeeIsManualAttendance.data[0] == 1 ? true : false;
                            $scope.employeeIsMultipleLogin = res.data.employeeIsMultipleLogin.data[0] == 1 ? true : false;
                            $scope.employeeIsFixJoining = res.data.employeeIsFixJoining.data[0] == 1 ? true : false;

                            $scope.employeeType = res.data.employeeType;

                            $scope.hideMasterForm = true;
                            $scope.hideEntry = false;

                            $scope.hideEmployeeSalarySetup = false;
                            $scope.hideEmployeeAllowanceDeductionSetup = false;
                            $scope.hideEmployeeCustomRateSetup = false;
                            $scope.hideEmployeeDependentSetup = false;
                            $scope.hideEmployeeEntitlementSetup = false;
                            $scope.hideEmployeeLeaveEntitlementSetup = false;
                            $scope.hideEmployeeLoanSetup = false;
                            $scope.hideEmployeeShiftSetup = false;
                            $scope.hideEmployeeForm = true;
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_CloseEmployeeForm = () => {
            try {

                $scope.hideEmployeeForm = false;
                $scope.hideMasterForm = false;
                $scope.hideEntry = true;
                $scope.onLoad_MasterService();
            } catch (e) {
                console.log(e);
            }
        };

        //. 
        $scope.onLoad_removeEmployeeLeaveData = () => {

            try {

                let employeeId = $scope.employeeId;

                let req = {
                    method: 'POST',
                    url: api_deleteEmployeeLeaveDate,
                    data: {
                        "employerId": $scope._izemEmployerId,
                        "employeeId": employeeId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            deleteMsg();
                        }
                    }, (err) => {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }

        };

        $scope.onClick_SetJoiningDate = () => {
            try {

                if ($scope.employeeIsFixJoining != false)
                    value = customConfirm('Please ensure the joining date! Once checked, Date of joining cannot be changed.');
                else
                    value = customConfirm('Are you sure, You want to update joining date! You need to update leave entitlement again after wards.');

                if (value == "Yes") {
                    $scope.onClick_SubmitEmployee();
                    if ($scope.employeeIsFixJoining == false) {
                        $scope.onLoad_removeEmployeeLeaveData();
                    }
                }
                else {

                    if ($scope.employeeIsFixJoining != false) {
                        $scope.employeeIsFixJoining = false;
                        $scope.onLoad_removeEmployeeLeaveData();
                    }
                    else
                        $scope.employeeIsFixJoining = true;

                }

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_SetLeavingDate = () => {
            if ($scope.employeeIsActive == true)
                $scope.employeeLeaving = null;
        };

        //. Salary Setup

        $scope.hideEmployeeSalarySetup = false;

        $scope.onClick_EmployeeSalarySetup = () => {
            try {

                $rootScope.onLoad_UpdateEmployeeSalarySetup($scope._employeeId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = true;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeSalarySetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Allowance Deduction Setup

        $scope.hideEmployeeAllowanceDeductionSetup = false;

        $scope.onClick_EmployeeAllowanceDeductionSetup = () => {
            try {

                $rootScope.onLoad_UpdateEmployeeAllowanceDeductionSetup($scope._employeeId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = true;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeAllowanceDeductionSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Custom Rate Setup

        $scope.hideEmployeeCustomRateSetup = false;

        $scope.onClick_EmployeeCustomRateSetup = () => {
            try {

                $rootScope.onLoad_UpdateEmployeeCustomRatesSetup($scope._employeeId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = true;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeCustomRateSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Loan Setup

        $scope.hideEmployeeLoanSetup = false;

        $scope.onClick_EmployeeLoanSetup = () => {
            try {

                $rootScope.onLoad_UpdateEmployeeLoanSetup($scope._employeeId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeLoanSetup = true;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeLoanSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Leave Entitlement Setup

        $scope.hideEmployeeLeaveEntitlementSetup = false;

        $scope.onClick_EmployeeLeaveEntitlementSetup = () => {
            try {

                $rootScope.onLoad_EmployeeLeaveEntitlementSetup($scope.employeeId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = true;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeLeaveEntitlementSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Entitlement Setup

        $scope.hideEmployeeEntitlementSetup = false;

        $scope.onClick_EmployeeEntitlementSetup = () => {
            try {

                $rootScope.onLoad_UpdateEmployeeEntitlementsetup($scope.employeeId, $scope.employeeIsCustomEntitled, $scope.employerentitlementId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeEntitlementSetup = true;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeEntitlementSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Dependent Setup

        $scope.hideEmployeeDependentSetup = false;

        $scope.onClick_EmployeeDependentSetup = () => {
            try {

                $rootScope.onLoad_EmployeeDependentSetup($scope._employeeId);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeDependentSetup = true;
                $scope.hideEmployeeShiftSetup = false;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeDependentSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Shift Setup

        $scope.hideEmployeeShiftSetup = false;

        $scope.onClick_EmployeeShiftSetup = () => {
            try {

                $rootScope.onLoad_EmployeeShiftSetup($scope.employeeId, $scope.isMultiShift, $scope.employeeIsManualAttendance);

                $scope.hideMasterForm = true;
                $scope.hideEmployeeSalarySetup = false;
                $scope.hideEmployeeAllowanceDeductionSetup = false;
                $scope.hideEmployeeCustomRateSetup = false;
                $scope.hideEmployeeLoanSetup = false;
                $scope.hideEmployeeLeaveEntitlementSetup = false;
                $scope.hideEmployeeEntitlementSetup = false;
                $scope.hideEmployeeDependentSetup = false;
                $scope.hideEmployeeShiftSetup = true;
                $scope.hideEmployeeForm = false;
            } catch (e) {
                console.log(e);
            }
        };

        $rootScope.onClick_CloseEmployeeShiftSetup = () => {
            $scope.onClick_EditEmployee({ employeeId: $scope._employeeId });
        };

        //. Member Setup

        $scope.onClick_CancelMember = () => {
            try {

                $scope.hideEntry = true;
                $scope.hideMemberTable = false;

                $scope.onLoad_MasterService();

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_ResetMemberForm = () => {
            $scope.searchbypassport = "";
            $scope.searchbynric = "";
            $scope.searchbymember = "";

            $scope.memberTableParams = [];
            $scope.memberloaded = false;
        };

        $scope.onLoad_MasterMemberService = () => {
            let req = {
                method: 'POST',
                url: api_filltabledata_searchmember,
                data: {
                    "employerId": $scope._izemEmployerId,
                    searchbypassport: $scope.searchbypassport,
                    searchbynric: $scope.searchbynric,
                    searchbymember: $scope.searchbymember,
                    pageIndex: 1,
                    pageSize: 'all'

                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.memberTableParams = res.data;
                        $scope.memberloaded = true;
                    }
                    else {
                        $scope.memberTableParams = [];
                        $scope.memberloaded = false;
                    }
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_Submit_MemberToEmployee = (x) => {

            let employeeId = $scope.employeeId;
            let memberId = x.memberId;
            let employerdepartmentId = "";
            let employerbranchId = "";
            let employeeEnroll = "";
            let employeeAlternativeEnroll = "";
            let employeeManagerId = "";
            let employerentitlementId = "";
            let employeeCompanyEmail = $scope.employeeCompanyEmail;
            let employeeJoining = null;
            let employeeLeaving = null;
            let employeeLimitCategroy = "";
            let employeeLimitEmployee = "";
            let employeeLimitDependent = "";
            let employeeVisitLimitEmployee = "";
            let employeeVisitLimitDependent = "";
            let employeeVisitAllowed = "0";
            let employeeVisitDuration = "";
            let employeeEntitlementRemarks = "";
            let employeeDesignation = "";
            let employeeIsCustomEntitled = false;
            let employeeIsActive = true;
            let employeeIsMachine = false;
            let isMultiShift = false;
            let employeeIsManualAttendance = false;
            let employeeIsMultipleLogin = false;
            let employeeIsFixJoining = false;
            let employeeType = "";

            let req = {
                method: 'POST',
                url: api_insertdata,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": employeeId, "memberId": memberId, "employerdepartmentId": employerdepartmentId, "employerbranchId": employerbranchId, "employeeEnroll": employeeEnroll,
                    "employeeAlternativeEnroll": employeeAlternativeEnroll, "employeeManagerId": employeeManagerId, "employerentitlementId": employerentitlementId,
                    "employeeCompanyEmail": employeeCompanyEmail, "employeeJoining": employeeJoining, "employeeLeaving": employeeLeaving, "employeeLimitCategroy": employeeLimitCategroy,
                    "employeeLimitEmployee": employeeLimitEmployee, "employeeLimitDependent": employeeLimitDependent, "employeeVisitLimitEmployee": employeeVisitLimitEmployee,
                    "employeeVisitLimitDependent": employeeVisitLimitDependent, "employeeVisitAllowed": employeeVisitAllowed, "employeeVisitDuration": employeeVisitDuration,
                    "employeeEntitlementRemarks": employeeEntitlementRemarks, "employeeDesignation": employeeDesignation, "employeeIsCustomEntitled": employeeIsCustomEntitled,
                    "employeeIsActive": employeeIsActive, "employeeIsMachine": employeeIsMachine, "employeeIsFixJoining": employeeIsFixJoining, "isMultiShift": isMultiShift,
                    "employeeIsManualAttendance": employeeIsManualAttendance, "employeeIsMultipleLogin": employeeIsMultipleLogin, "employeeType": employeeType
                }
            };

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeeId == 0)
                            insertMsg();
                        else
                            updateMsg();
                    }
                    $scope.onLoad_MasterMemberService();
                }, (err) => {
                    console.log(err);
                });
        };

        $scope.onClick_AddNewMember = () => {
            $rootScope.onClick_AddMember();

            $scope.hideMemberTable = false;
            $scope.hideMemberForm = true;
            $scope.hideEntry = false;
        };

        $rootScope.onLoad_AfterInsertProcess = (searchbypassport, searchbynric, searchbymember) => {

            $scope.onClick_AddRecord();

            $scope.searchbypassport = searchbypassport;
            $scope.searchbynric = searchbynric;
            $scope.searchbymember = searchbymember;

            $scope.onLoad_MasterMemberService();
        };

        //. signIn

        $scope.onClick_AllowSignIn = (x) => {
            try {

                $scope.loginMemberId = x.memberId;
                $scope.loginName = x.memberName;
                $scope.loginEmail = x.memberEmail;
                $scope.loginEmployeeIsMultipleLogin = x.employeeIsMultipleLogin.data[0];

                $("#signInModal").modal("show");
            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_CancelSignInAccount = () => {
            $("#signInModal").modal("hide");

            $scope.loginMemberId = '';
            $scope.loginName = '';
            $scope.loginEmail = '';
            $scope.loginPassword = '';

            $scope.onLoad_MasterService();
        };

        $scope.onClick_SignInAccount = () => {
            try {
                let memberId = $scope.loginMemberId;
                let name = $scope.loginName;
                let email = $scope.loginEmail;
                let password = $scope.loginPassword;
                let isReadTerm = true;
                let value = "member";

                if ($scope.loginEmployeeIsMultipleLogin == 1) {
                    value = "employer";
                }

                let req = {
                    method: 'POST',
                    url: api_signInAccount,
                    data: {
                        "name": name,
                        "mobile": '',
                        "email": email,
                        "role": value,
                        "password": password,
                        "isReadTerm": isReadTerm,
                        "isVerify": true,
                        "memberId": memberId
                    }
                };

                httpService.httpOperationData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            successMsg("Login", "Access provided!");
                            $scope.onClick_CancelSignInAccount();
                            $("#signInModal").modal("hide");
                        }
                        if (res.status === 409) {
                            warningMsg("Login", "Record already registerd!");
                        }
                    }, (err) => {
                        console.log(err)
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //. Excel download

        $scope.onClick_Download = () => {
            try {

                let SearchEmployeeId = $scope.SearchEmployeeId;
                let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;
                let SearchEmployerbranchId = $scope.SearchEmployerbranchId;
                let SearchEmployeeIsActive = $scope.SearchEmployeeIsActive;
                let sortBy = $scope.sortBy;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        SearchEmployeeId: SearchEmployeeId,
                        SearchEmployerdepartmentId: SearchEmployerdepartmentId,
                        SearchEmployerbranchId: SearchEmployerbranchId,
                        SearchEmployeeIsActive: SearchEmployeeIsActive,
                        sortBy: sortBy,
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
                                strstring += "<td x:autofilter='all'><b> Enrollment No </b></td>";
                                strstring += "<td x:autofilter='all'><b> Employee Name </b></td>";
                                strstring += "<td x:autofilter='all'><b> Nric No </b></td>";
                                strstring += "<td x:autofilter='all'><b> Mobile No </b></td>";
                                strstring += "<td x:autofilter='all'><b> Email Id </b></td>";
                                strstring += "<td x:autofilter='all'><b> Gender </b></td>";
                                strstring += "<td x:autofilter='all'><b> Department </b></td>";
                                strstring += "<td x:autofilter='all'><b> Branch </b></td>";
                                strstring += "<td x:autofilter='all'><b> Designation </b></td>";
                                strstring += "<td x:autofilter='all'><b> Current Basic </b></td>";
                                strstring += "</tr>";
                                for (let i = 0; i < obj.length; i++) {
                                    strstring += "<tr>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employeeEnroll + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].memberName + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].memberNric + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].memberMobile + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].memberEmail + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].memberGender + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerdepartmentTitle + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employerbranchName + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employeeDesignation + " </td>";
                                    strstring += "<td x:autofilter='all'> " + obj[i].employeesalarysetupCurrentBasic + " </td>";
                                    strstring += "</tr>";
                                }
                            }

                            if (strstring != "") {
                                $("#tabledata").html("");
                                $("#tabledata").html(strstring);
                                tableToExcel('tabledata', 'Employee Excel');
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

        //. PDF download
        $scope.load_Report = (obj) => {
            try {
                $("body").addClass("loading");
                let employeeData = JSON.stringify(obj);

                $http({
                    method: "POST",
                    url: "/employer/MasterSetting/load_employeeReport",
                    responseType: "blob",
                    data: {
                        "companyName": localStorage.getItem("_izemCompanyName"),
                        "reportTitle": "Employee List",
                        "employeeData": employeeData
                    }
                }).then(function successCallback(response) {
                    var fileURL = URL.createObjectURL(response.data);
                    $("body").removeClass("loading");
                    window.open(fileURL, "EmployeeReport.pdf");
                }, function errorCallback(response) {
                    console.log(response);
                    $("body").removeClass("loading");
                });

            } catch (e) {
                console.log(e);
            }
        };

        $scope.onClick_GeneratePDF = () => {
            try {

                let SearchEmployeeId = $scope.SearchEmployeeId;
                let SearchEmployerdepartmentId = $scope.SearchEmployerdepartmentId;
                let SearchEmployerbranchId = $scope.SearchEmployerbranchId;
                let SearchEmployeeIsActive = $scope.SearchEmployeeIsActive;

                let req = {
                    method: 'POST',
                    url: api_filltabledata,
                    data: {
                        strWhere: "",
                        SearchEmployeeId: SearchEmployeeId,
                        SearchEmployerdepartmentId: SearchEmployerdepartmentId,
                        SearchEmployerbranchId: SearchEmployerbranchId,
                        SearchEmployeeIsActive: SearchEmployeeIsActive,
                        "employerId": $scope._izemEmployerId,
                        pageIndex: 1,
                        pageSize: 'all'
                    }
                };

                httpService.httpFetchData(req)
                    .then((res) => {
                        if (res.status == 200) {
                            let obj = res.data;
                            if (obj.length > 0) {
                                for (let i = 0; i < obj.length; i++) {
                                    obj[i].employeeIsActive = obj[i].employeeIsActive.data[0] == "1" ? "1" : "0";
                                    obj[i].employeeIsCustomEntitled = obj[i].employeeIsCustomEntitled.data[0] == "1" ? "1" : "0";
                                    obj[i].employeeIsFixJoining = obj[i].employeeIsFixJoining.data[0] == "1" ? "1" : "0";
                                    obj[i].employeeIsMachine = obj[i].employeeIsMachine.data[0] == "1" ? "1" : "0";
                                    obj[i].isMultiShift = obj[i].isMultiShift.data[0] == "1" ? "1" : "0";
                                    obj[i].employeeIsManualAttendance = obj[i].employeeIsManualAttendance.data[0] == "1" ? "1" : "0";
                                    obj[i].employeeIsMultipleLogin = obj[i].employeeIsMultipleLogin.data[0] == "1" ? "1" : "0";
                                }
                            }
                            $scope.load_Report(obj);
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

        // Remove Employee
        $scope.onClick_RemoveImage = async () => {
            try {

                const result = await $.ajax({
                    url: api_imageremove,
                    type: 'POST',
                    data: {
                        "id": $scope._employeeEnroll.toString(),
                        "folderId": $scope._employerId.toString()
                    }
                });

                $scope.onClick_CloseImageUpload();
                $scope.onLoad_MasterService();

            } catch (e) {
                console.log(e);
            }
        };

        // Add Employee to all machine
        $scope.onClick_PushRecordToMachine = () => {
            try {

                let employeeName = $scope._memberName;
                let employeeNo = $scope.employeeEnroll;
                let employeeGender = 'unknown';
                let employerId = $scope.employerId;

                let req = {
                    method: 'POST',
                    url: api_pushUser,
                    data: {
                        "employerId": employerId,
                        "employeeName": employeeName,
                        "employeeNo": employeeNo,
                        "employeeGender": employeeGender
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
                                successMsg('Machine Record', "Record pushed to machine successfully");
                            }
                            else {
                                warningMsg('Alert', 'Record is already inserted!')
                            }
                        }
                        $("body").removeClass("loading");

                    }, (err) => {
                        console.log(err);
                        $("body").removeClass("loading");
                    });


            } catch (e) {
                console.log(e);
            }
        };

    }]);