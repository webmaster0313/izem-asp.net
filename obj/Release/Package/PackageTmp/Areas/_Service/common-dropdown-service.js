app.service('httpCommonService', ['$rootScope', '$http',
    function ($rootScope, $http) {

        /* Master Country */
        let api_fill_country = backlink + "backoffice/api/country/country_apiSelection";
        this.fill_backoffice_country = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_country,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No country records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master State */
        let api_fill_state = backlink + "backoffice/api/state/state_apiSelection";
        this.fill_backoffice_state = function (id) {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_state,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        mastercountryId: id
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No country records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master Facility*/
        let api_fill_facility = backlink + "backoffice/api/facility/facility_apiSelection";
        this.fill_backoffice_facility = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_facility,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No facility records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master Facility*/
        let api_fill_subscriptiontype = backlink + "backoffice/api/mastersubscriptiontype/mastersubscriptiontype_apiSelection";
        this.fill_backoffice_subscriptiontype = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_subscriptiontype,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No subscription type records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master Race*/
        let api_fill_race = backlink + "backoffice/api/race/race_apiSelection";
        this.fill_backoffice_race = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_race,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No race records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master Citizenship*/
        let api_fill_citizenship = backlink + "backoffice/api/citizenship/citizenship_apiSelection";
        this.fill_backoffice_citizenship = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_citizenship,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No citizenship records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master Relationship*/
        let api_fill_relationship = backlink + "backoffice/api/relationship/relationship_apiSelection";
        this.fill_backoffice_relationship = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_relationship,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No relationship records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master EPF*/
        let api_fill_epf = backlink + "backoffice/api/epf/epf_apiSelection";
        this.fill_backoffice_epf = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_epf,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No epf records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };


        /* Master HRDF*/
        let fill_backoffice_hrdf = backlink + "backoffice/api/hrdf/hrdf_apiSelection";
        this.fill_backoffice_hrdf = function () {
            try {

                let req = {
                    method: 'POST',
                    url: fill_backoffice_hrdf,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No hrdf records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master SOCSO*/
        let api_fill_socso = backlink + "backoffice/api/socso/socso_apiSelection";
        this.fill_backoffice_socso = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_socso,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No socso records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master Employer*/
        let api_fill_employer = backlink + "employer/api/employer/employer_apiSelection";
        this.fill_master_employer = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_employer,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No socso records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Master EIS*/
        let api_fill_eis = backlink + "backoffice/api/eis/eis_apiSelection";
        this.fill_backoffice_eis = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_eis,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No eis records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //? Employer Service

        /* Employee */
        let api_fill_employee = backlink + "employer/api/employee/employee_apiSelection";
        this.fill_employee = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employee,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No employee records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Branch */
        let api_fill_employeeBranch = backlink + "employer/api/employerbranch/employerbranch_apiSelection";
        this.fill_employee_branch = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employeeBranch,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No branch records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Department */
        let api_fill_employeeDepartment = backlink + "employer/api/employerdepartment/employerdepartment_apiSelection";
        this.fill_employee_department = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employeeDepartment,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No branch records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Entitlement */
        let api_fill_employeeEntitlement = backlink + "employer/api/employerentitlement/employerentitlement_apiSelection";
        this.fill_employee_entitlement = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employeeEntitlement,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No entitlement records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Entitlement */
        let api_fill_employerAllowance = backlink + "employer/api/employerallowance/employerallowance_apiSelection";
        this.fill_employee_allowance = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employerAllowance,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId,
                        "employerallowanceBenefitInKind": false
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No allowance records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };
        this.fill_employee_allowance1 = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employerAllowance,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId,
                        "employerallowanceBenefitInKind": ""
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No allowance records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Shift */
        let api_fill_employerShift = backlink + "employer/api/employermastershift/employermastershift_apiSelection";
        this.fill_employer_shift = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employerShift,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No shift records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Leave Type */
        let api_fill_employerLeaveTtype = backlink + "employer/api/employerleavetype/employerleavetype_apiSelection";
        this.fill_employer_leavetype = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employerLeaveTtype,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No leave type records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Additional Setup */
        let api_fill_employeradditionalpaysetup = backlink + "employer/api/employeradditionalpaysetup/employeradditionalpaysetup_apiSelection";
        this.fill_employer_additionalpaysetup = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employeradditionalpaysetup,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No additionalpay setup records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Overtime Setup */
        let api_fill_employerotsetup = backlink + "employer/api/employerotsetup/employerotsetup_apiSelection";
        this.fill_employer_otsetup = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employerotsetup,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No overtime setup records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        /* Shift Setup */
        let api_fill_employershiftsetup = backlink + "employer/api/employershiftsetup/employershiftsetup_apiSelection";
        this.fill_employer_shiftsetup = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employershiftsetup,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No overtime setup records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };


        /* Attendace device */
        let api_fill_employermachinelist = backlink + "employer/api/machinelist/machinelist_apiSelection";
        this.fill_employer_machinelist = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employermachinelist,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No machine records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //? Employee Service

        /* Leave Type */
        let api_fill_employeeLeaveEntitlement = backlink + "employer/api/employeeleaveentitlement/employeeleaveentitlement_apiSelection";
        this.fill_employer_leaveEntitlement = function (employeeId) {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employeeLeaveEntitlement,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId,
                        "employeeId": employeeId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No leave type records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //? Utility

        let api_fill_employerTemplate = backlink + "employer/api/employertemplate/employertemplate_apiSelection";
        this.fill_employerTemplate = function () {
            try {

                let _izemEmployerId = localStorage.getItem("_izemEmployerId");

                let req = {
                    method: 'POST',
                    url: api_fill_employerTemplate,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {
                        "employerId": _izemEmployerId
                    }
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No template records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //? Employee Banks
        let api_fill_employeeBanks = backlink + "backoffice/api/masteremployeebank/masteremployeebank_apiSelection";
        this.fill_backoffice_employeebank = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_employeeBanks,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No employee banks records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

        //? Employer Banks
        let api_fill_employerBanks = backlink + "backoffice/api/masteremployerbank/masteremployerbank_apiSelection";
        this.fill_backoffice_employerbank = function () {
            try {

                let req = {
                    method: 'POST',
                    url: api_fill_employerBanks,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: {}
                };

                return $http(req)
                    .then(function success(response) {

                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No employre banks records.");
                            return result;
                        }

                    }, function error(error) {
                        console.log(error);
                    });

            } catch (e) {
                console.log(e);
            }
        };

    }]);