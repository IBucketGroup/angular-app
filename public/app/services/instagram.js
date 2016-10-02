"use strict";

angular
    .module('axm.instagram', [
        'ngRoute',
        'firebase'
    ])
    .service('instagramApi', [
        '$http',
        function ($http) {
            var self = this;
            var api_url = 'https://api.instagram.com/v1';

            self.access_token;

            self.setAccessToken = function (access_token) {
                self.access_token = access_token;
            };

            self.getUser = function () {
                var uri = '/users/self/';
                return GET(uri);
            };

            function GET(uri, query) {
                query = (query) ? query : {};
                query.access_token = self.access_token;
                query.callback = 'JSON_CALLBACK';
                var response = $http.jsonp(api_url + uri, {
                    method: 'GET',
                    params: query
                });

                return ParseResponse(response);
            }

            function ParseResponse(response) {
                return response.then(function (resp) {
                    var meta = resp.data.meta;
                    if (meta.code === 400) {
                        throwAPIError(meta);
                    }
                    return resp.data.data;
                });
            }

            function throwAPIError(meta) {
                var error = new Error(meta.error_message);
                error.code = meta.code;
                throw error;
            }

            return self;
        }])
    .factory('instagramFactory', [
        '$http',
        '$location',
        'instagramApi',
        '$firebaseAuth',
        function ($http, $location, instagramApi, $firebaseAuth) {
            var self = {};
            self.authObj = $firebaseAuth();

            self.getAuthUrl = function () {
                var url = 'https://api.instagram.com/oauth/authorize/?client_id=';
                url += AppConfig.instagram.ClientID;
                url += '&redirect_uri=';
                url += AppConfig.instagram.RedirectUri;
                url += '&response_type=token';
                return url;
            };

            self.callback = function (cb) {
                var hash = $location.hash();
                var regEx = /access_token=([0-9a-z\.]+)/;
                var access_token = hash.match(regEx)
                    ? hash.match(regEx)[1]
                    : false;
                if (access_token) {
                    this.login(access_token).then(function (igUser) {
                        cb(null, igUser);
                    }).catch(cb);
                } else {
                    return false;
                }
            };

            self.login = function (access_token) {
                instagramApi.setAccessToken(access_token);
                return instagramApi.getUser().then(function (igUser) {
                    igUser.email = igUser.username + '.' + igUser.id + '@instagramuser.com';
                    igUser.password = access_token;
                    igUser.displayName = igUser.full_name;
                    igUser.ig_uid = igUser.id;

                    return igUser;
                }).then(function (igUser) {
                    return apiLogin(igUser, igUser).catch(function () {
                        return apiRegister(igUser, igUser).then(function () {
                            return apiLogin(igUser, igUser);
                        });
                    })
                });
            };

            function apiLogin(igUser) {
                return self
                    .authObj
                    .$signInWithEmailAndPassword(igUser.email, igUser.password)
                    .then(function (firebaseUser) {
                        firebaseUser.updateProfile({
                            providerData: igUser
                        });
                        return firebaseUser;
                    });
            }

            function apiRegister(igUser) {
                return self
                    .authObj
                    .$createUserWithEmailAndPassword(igUser.email, igUser.password, igUser);
            }

            function bootstrapAccount(firebaseUser, igUser) {
                var user = igUser;
                user.uid = firebaseUser.uid;

            }

            return self;
        }
    ]);