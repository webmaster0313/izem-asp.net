
//. npl
let api_selectdatabyid_customstatutorysetup = backlink + "employer/api/employeestatutorysetup/employeestatutorysetup_apiSelect";
let api_filltabledata_customstatutorysetup = backlink + "employer/api/employeestatutorysetup/employeestatutorysetup_apiSelectAll";
let api_insertdata_customstatutorysetup = backlink + "employer/api/employeestatutorysetup/employeestatutorysetup_apiInsert";
let api_updatedata_customstatutorysetup = backlink + "employer/api/employeestatutorysetup/employeestatutorysetup_apiUpdate";
let api_deletedata_customstatutorysetup = backlink + "employer/api/employeestatutorysetup/employeestatutorysetup_apiDelete";

//. npl
let api_selectdatabyid_customnplsetup = backlink + "employer/api/employeenplsetup/employeenplsetup_apiSelect";
let api_filltabledata_customnplsetup = backlink + "employer/api/employeenplsetup/employeenplsetup_apiSelectAll";
let api_insertdata_customnplsetup = backlink + "employer/api/employeenplsetup/employeenplsetup_apiInsert";
let api_updatedata_customnplsetup = backlink + "employer/api/employeenplsetup/employeenplsetup_apiUpdate";
let api_deletedata_customnplsetup = backlink + "employer/api/employeenplsetup/employeenplsetup_apiDelete";

//. additionalpay
let api_selectdatabyid_customadditionalpaysetup = backlink + "employer/api/employeeadditionalpaysetup/employeeadditionalpaysetup_apiSelect";
let api_filltabledata_customadditionalpaysetup = backlink + "employer/api/employeeadditionalpaysetup/employeeadditionalpaysetup_apiSelectAll_View";
let api_insertdata_customadditionalpaysetup = backlink + "employer/api/employeeadditionalpaysetup/employeeadditionalpaysetup_apiInsert";
let api_updatedata_customadditionalpaysetup = backlink + "employer/api/employeeadditionalpaysetup/employeeadditionalpaysetup_apiUpdate";
let api_deletedata_customadditionalpaysetup = backlink + "employer/api/employeeadditionalpaysetup/employeeadditionalpaysetup_apiDelete_All";

//. overtime
let api_selectdatabyid_customotsetup = backlink + "employer/api/employeeotsetup/employeeotsetup_apiSelect";
let api_filltabledata_customotsetup = backlink + "employer/api/employeeotsetup/employeeotsetup_apiSelectAll_View";
let api_insertdata_customotsetup = backlink + "employer/api/employeeotsetup/employeeotsetup_apiInsert";
let api_updatedata_customotsetup = backlink + "employer/api/employeeotsetup/employeeotsetup_apiUpdate";
let api_deletedata_customotsetup = backlink + "employer/api/employeeotsetup/employeeotsetup_apiDelete_All";

//. shift
let api_selectdatabyid_customshiftsetup = backlink + "employer/api/employeeshiftsetup/employeeshiftsetup_apiSelect";
let api_filltabledata_customshiftsetup = backlink + "employer/api/employeeshiftsetup/employeeshiftsetup_apiSelectAll_View";
let api_insertdata_customshiftsetup = backlink + "employer/api/employeeshiftsetup/employeeshiftsetup_apiInsert";
let api_updatedata_customshiftsetup = backlink + "employer/api/employeeshiftsetup/employeeshiftsetup_apiUpdate";
let api_deletedata_customshiftsetup = backlink + "employer/api/employeeshiftsetup/employeeshiftsetup_apiDelete_All";

app.controller("employee-customratesetup-controller", ['$rootScope', '$scope', 'httpService', 'httpCommonService',
    function ($rootScope, $scope, httpService, httpCommonService) {

        $scope._izemEmployerId = localStorage.getItem("_izemEmployerId");

        //. Statutory Rate 

        $scope.onLoad_MasterService_StatutorySetup = () => {
            let req = {
                method: 'POST',
                url: api_filltabledata_customstatutorysetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.employeestatutorysetupId = res.data[0].employeestatutorysetupId;
                        $scope.employeestatutorysetupEpfERate = res.data[0].employeestatutorysetupEpfERate;
                        $scope.employeestatutorysetupEpfRRate = res.data[0].employeestatutorysetupEpfRRate;
                        $scope.employeestatutorysetupSocsoERate = res.data[0].employeestatutorysetupSocsoERate;
                        $scope.employeestatutorysetupSocsoRRate = res.data[0].employeestatutorysetupSocsoRRate;
                        $scope.employeestatutorysetupEISERate = res.data[0].employeestatutorysetupEISERate;
                        $scope.employeestatutorysetupEISRRate = res.data[0].employeestatutorysetupEISRRate;
                        $scope.employeestatutorysetupPCBERate = res.data[0].employeestatutorysetupPCBERate;
                    }
                    else {
                        $scope.employeestatutorysetupEpfERate = 0;
                        $scope.employeestatutorysetupEpfRRate = 0;
                        $scope.employeestatutorysetupSocsoERate = 0;
                        $scope.employeestatutorysetupSocsoRRate = 0;
                        $scope.employeestatutorysetupEISERate = 0;
                        $scope.employeestatutorysetupEISRRate = 0;
                        $scope.employeestatutorysetupPCBERate = 0;
                    }
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_Submit_StatutorySetup = () => {

            let employeestatutorysetupId = $scope.employeestatutorysetupId == null ? 0 : $scope.employeestatutorysetupId;
            let employeestatutorysetupEpfERate = $scope.employeestatutorysetupEpfERate;
            let employeestatutorysetupEpfRRate = $scope.employeestatutorysetupEpfRRate;
            let employeestatutorysetupSocsoERate = $scope.employeestatutorysetupSocsoERate;
            let employeestatutorysetupSocsoRRate = $scope.employeestatutorysetupSocsoRRate;
            let employeestatutorysetupEISERate = $scope.employeestatutorysetupEISERate;
            let employeestatutorysetupEISRRate = $scope.employeestatutorysetupEISRRate;
            let employeestatutorysetupPCBERate = $scope.employeestatutorysetupPCBERate;

            let req = {};
            if (employeestatutorysetupId == 0)
                req = { method: 'POST', url: api_insertdata_customstatutorysetup };
            else
                req = { method: 'POST', url: api_updatedata_customstatutorysetup };

            let pera = {
                "employerId": $scope._izemEmployerId,
                "employeestatutorysetupId": employeestatutorysetupId,
                "employeeId": $scope.employeeId,
                "employeestatutorysetupEpfERate": employeestatutorysetupEpfERate,
                "employeestatutorysetupEpfRRate": employeestatutorysetupEpfRRate,
                "employeestatutorysetupSocsoERate": employeestatutorysetupSocsoERate,
                "employeestatutorysetupSocsoRRate": employeestatutorysetupSocsoRRate,
                "employeestatutorysetupEISERate": employeestatutorysetupEISERate,
                "employeestatutorysetupEISRRate": employeestatutorysetupEISRRate,
                "employeestatutorysetupPCBERate": employeestatutorysetupPCBERate
            };

            req.data = pera;

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeestatutorysetupId == 0)
                            insertMsg();
                        else
                            updateMsg();
                        $scope.onLoad_MasterService_StatutorySetup();
                    }
                }, (err) => {
                    console.log(err);
                });

        };

        //. NPL Rate

        $scope.onLoad_MasterService_NPLSetup = () => {
            let req = {
                method: 'POST',
                url: api_filltabledata_customnplsetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200) {
                        $scope.employeenplsetupId = res.data[0].employeenplsetupId;
                        $scope.employeenplsetupDayRate = res.data[0].employeenplsetupDayRate;
                        $scope.employeenplsetupHourRate = res.data[0].employeenplsetupHourRate;
                    }
                    else {
                        $scope.employeenplsetupDayRate = 0;
                        $scope.employeenplsetupHourRate = 0;
                    }
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_Submit_NPLSetup = () => {

            let employeenplsetupId = $scope.employeenplsetupId == null ? 0 : $scope.employeenplsetupId;
            let employeenplsetupDayRate = $scope.employeenplsetupDayRate;
            let employeenplsetupHourRate = $scope.employeenplsetupHourRate;

            let req = {};
            if (employeenplsetupId == 0)
                req = { method: 'POST', url: api_insertdata_customnplsetup };
            else
                req = { method: 'POST', url: api_updatedata_customnplsetup };

            let pera = {
                "employerId": $scope._izemEmployerId,
                "employeenplsetupId": employeenplsetupId,
                "employeeId": $scope.employeeId,
                "employeenplsetupDayRate": employeenplsetupDayRate,
                "employeenplsetupHourRate": employeenplsetupHourRate
            }

            req.data = pera;

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeenplsetupId == 0)
                            insertMsg();
                        else
                            updateMsg();
                        $scope.onLoad_MasterService_NPL_Setup();
                    }
                }, (err) => {
                    console.log(err);
                });

        };

        //. AdditionalPay Rate 

        $scope.onLoad_MasterService_AdditionalPaySetup = () => {
            let req = {
                method: 'POST',
                url: api_filltabledata_customadditionalpaysetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200)
                        $scope.tableParams_Additional_Pay_Rate_Setup = res.data;
                    else
                        $scope.tableParams_Additional_Pay_Rate_Setup = [];
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_Submit_AdditionalPaySetup = (x) => {

            let employeeadditionalpaysetupId = x.employeeadditionalpaysetupId == null ? 0 : x.employeeadditionalpaysetupId;
            let employeradditionalpaysetupId = x.employeradditionalpaysetupId;
            let employeeadditionalpaysetupRate = x.employeeadditionalpaysetupRate;

            let req = {};
            if (employeeadditionalpaysetupId == 0)
                req = { method: 'POST', url: api_insertdata_customadditionalpaysetup };
            else
                req = { method: 'POST', url: api_updatedata_customadditionalpaysetup };

            let pera = {
                "employerId": $scope._izemEmployerId,
                "employeeadditionalpaysetupId": employeeadditionalpaysetupId,
                "employeeId": $scope.employeeId,
                "employeradditionalpaysetupId": employeradditionalpaysetupId,
                "employeeadditionalpaysetupRate": employeeadditionalpaysetupRate
            };

            req.data = pera;

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeeadditionalpaysetupId == 0)
                            insertMsg();
                        else
                            updateMsg();
                        $scope.onLoad_MasterService_AdditionalPaySetup();
                    }
                }, (err) => {
                    console.log(err);
                });
        };

        $scope.onClick_DeleteRecord_AdditionalPaySetup = () => {
            let req = {
                method: 'POST',
                url: api_deletedata_customadditionalpaysetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId
                }
            };

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        deleteMsg();
                        $scope.onLoad_MasterService_AdditionalPaySetup();
                    }
                }, (err) => {
                    console.log(err);
                });
        }

        //. Overtime Rate 

        $scope.onLoad_MasterService_OTSetup = () => {
            let req = {
                method: 'POST',
                url: api_filltabledata_customotsetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200)
                        $scope.tableParams_OTSetup = res.data;
                    else
                        $scope.tableParams_OTSetup = [];

                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_Submit_OTSetup = (x) => {

            let employeeotsetupId = x.employeeotsetupId == null ? 0 : x.employeeotsetupId;
            let employerotsetupId = x.employerotsetupId;
            let employeeotsetupRate = x.employeeotsetupRate;

            let req = {};
            if (employeeotsetupId == 0)
                req = { method: 'POST', url: api_insertdata_customotsetup };
            else
                req = { method: 'POST', url: api_updatedata_customotsetup };

            let pera = {
                "employerId": $scope._izemEmployerId,
                "employeeotsetupId": employeeotsetupId,
                "employeeId": $scope.employeeId,
                "employerotsetupId": employerotsetupId,
                "employeeotsetupRate": employeeotsetupRate
            };

            req.data = pera;

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeeotsetupId == 0)
                            insertMsg();
                        else
                            updateMsg();
                        $scope.onLoad_MasterService_OTSetup();
                    }
                }, (err) => {
                    console.log(err);
                });
        };

        $scope.onClick_DeleteRecord_OTSetup = () => {
            let req = {
                method: 'POST',
                url: api_deletedata_customotsetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId
                }
            };

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        deleteMsg();
                        $scope.onLoad_MasterService_OTSetup();
                    }
                }, (err) => {
                    console.log(err);
                });
        }

        //. Shift Rate

        $scope.onLoad_MasterService_ShiftSetup = () => {
            let strWhere = "";
            let req = {
                method: 'POST',
                url: api_filltabledata_customshiftsetup,
                data: {
                    strWhere: strWhere,
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId,
                    pageIndex: 1,
                    pageSize: 'all'
                }
            };

            httpService.httpFetchData(req)
                .then((res) => {
                    if (res.status == 200)
                        $scope.tableParams_ShiftSetup = res.data;
                    else
                        $scope.tableParams_ShiftSetup = [];
                }, (err) => {
                    console.log(err)
                });
        };

        $scope.onClick_Submit_ShiftSetup = (x) => {
            let employeeshiftsetupId = x.employeeshiftsetupId == null ? 0 : x.employeeshiftsetupId;
            let employershiftsetupId = x.employershiftsetupId;
            let employeeshiftsetupRate = x.employeeshiftsetupRate;

            let req = {};
            if (employeeshiftsetupId == 0)
                req = { method: 'POST', url: api_insertdata_customshiftsetup };
            else
                req = { method: 'POST', url: api_updatedata_customshiftsetup };

            let pera = {
                "employerId": $scope._izemEmployerId,
                "employeeshiftsetupId": employeeshiftsetupId,
                "employeeId": $scope.employeeId,
                "employershiftsetupId": employershiftsetupId,
                "employeeshiftsetupRate": employeeshiftsetupRate
            };

            req.data = pera;

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        if (employeeshiftsetupId == 0)
                            insertMsg();
                        else
                            updateMsg();
                        $scope.onLoad_MasterService_ShiftSetup();
                    }
                }, (err) => {
                    console.log(err);
                });
        };

        $scope.onClick_DeleteRecord_ShiftSetup = () => {

            let req = {
                method: 'POST',
                url: api_deletedata_customshiftsetup,
                data: {
                    "employerId": $scope._izemEmployerId,
                    "employeeId": $scope.employeeId
                }
            };

            httpService.httpOperationData(req)
                .then((res) => {
                    if (res.status == 200) {
                        deleteMsg();
                        $scope.onLoad_MasterService_ShiftSetup();
                    }
                }, (err) => {
                    console.log(err);
                });

        };

        //. Startup

        $rootScope.onLoad_UpdateEmployeeCustomRatesSetup = (employeeId) => {
            $scope.employeeId = employeeId;
            $scope.onLoad_MasterService_ShiftSetup();

            $("#v-pills-shift-tab").addClass("active");
            $("#v-pills-ot-tab").removeClass("active");
            $("#v-pills-addpay-tab").removeClass("active");
            $("#v-pills-npl-tab").removeClass("active");
            $("#v-pills-statutory-tab").removeClass("active");

            $("#v-pills-shift").addClass(" show active");
            $("#v-pills-ot").removeClass("show active");
            $("#v-pills-addpay").removeClass("show active");
            $("#v-pills-npl").removeClass("show active");
            $("#v-pills-statutory").removeClass("show active");
        };

    }]);