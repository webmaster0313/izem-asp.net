
app.service('httpService', ['$rootScope', '$window', '$http',
    function ($rootScope, $window, $http) {

        this.httpFetchData = function (req) {

            try {

                $("body").addClass("loading");

                let rebuildReq = {
                    method: req.method,
                    url: req.url,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: req.data
                };

                return $http(rebuildReq).
                    then(function success(response) {
                        $("body").removeClass("loading");
                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", "No records found!");
                            return result;
                        }

                    }, function error(error) {
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        this.httpOperationData = function (req) {

            try {

                $("body").addClass("loading");

                let rebuildReq = {
                    method: req.method,
                    url: req.url,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: req.data
                };

                return $http(rebuildReq).
                    then(function success(response) {
                        $("body").removeClass("loading");
                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 409) {
                            warningMsg("Warning", result.message);
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", result.message);
                            return result;
                        }

                    }, function error(error) {
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                $("body").removeClass("loading");
                console.log(e);
            }
        };

        this.httpRemoveData = function (req) {

            try {

                $("body").addClass("loading");

                let rebuildReq = {
                    method: req.method,
                    url: req.url,
                    headers: {
                        "Authorization": $rootScope.token
                    },
                    data: req.data
                };

                return $http(rebuildReq).
                    then(function success(response) {
                        $("body").removeClass("loading");
                        let status = response.data.status;
                        let result = response.data;

                        if (status === 200) {
                            return result;
                        }

                        if (status === 404) {
                            warningMsg("Warning", result.message);
                            return result;
                        }

                    }, function error(error) {
                        $("body").removeClass("loading");
                    });

            } catch (e) {
                console.log(e);
            }
        };

        this.masterHttpFetchData = function (req) {

            let rebuildReq = {
                method: req.method,
                url: req.url,
                headers: {
                    "Authorization": ''
                },
                data: req.data
            };

            return $http(rebuildReq)
                .then(function success(response) {

                    return response;

                }, function error(error) {
                    if (!error.response) {
                        console.log("Please check your internet connection.");
                    }
                    $("body").removeClass("loading");
                });
        };

    }]);