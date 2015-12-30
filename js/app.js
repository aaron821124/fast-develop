angular.module('app', ['ngMaterial', 'ui.router', 'uiRouterStyles', 'ngMdIcons'])
    .run(['$state', '$stateParams',
        function($state, $stateParams) {
            //this solves page refresh and getting back to state
        }
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");


        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/home.html",
                data: {
                    // css: 'css/home.css'
                }
            })

        .state('verification', {
            url: "/verification",
            templateUrl: "views/verification/verification.html",
            abstract: true
        })

        .state('verification.ic-card', {
            url: "/ic-card",
            templateUrl: "views/verification/IC_card.html"
        })

        .state('verification.face', {
            url: "/face",
            templateUrl: "views/verification/Face.html"
        })

        .state('verification.id-card', {
            url: "/id-card",
            templateUrl: "views/verification/idCard.html"
        })

        .state('verification.finger-print', {
            url: "/finger-print",
            templateUrl: "views/verification/FingerPrint.html"
        })

        .state('verification.check-info', {
            url: "/check-info",
            templateUrl: "views/verification/checkInfo.html"
        })

        .state('verification.sucess', {
            url: "/sucess",
            templateUrl: "views/verification/sucess.html"
        })

        .state('verification.sucess-info', {
            url: "/sucess-info",
            templateUrl: "views/verification/sucess_info.html"
        })

        .state('verification.sucess-place', {
            url: "/sucess-place",
            templateUrl: "views/verification/sucess_place.html"
        })
    });
    




