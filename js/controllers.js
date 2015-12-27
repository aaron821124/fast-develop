angular.module('app')
    .controller('mainCtrl', function($rootScope, $scope, $interval, $state) {
        $rootScope.$state = $state;

        $scope.idCard = idCard;

        console.log($state.get());
        $scope.time = new Date();
        $interval(function() {
            $scope.time = new Date();
        }, 10000);
    })
    .controller('icCtrl', function($scope, $state) {
        $scope.check = function() {
            console.log('check');
            ICCardInserted(function(card) {
                console.log(card);
            });

            ICCardEjected(function() {
                console.log('ej');
            });
        }

        $scope.next = function() {
            $state.go('verification.face');
            // console.log($state.get('^.face'))
        }
    })
    .controller('faceCtrl', function($scope, $state) {
        InitWebCam("video");

        $scope.check = function() {
            var myPic = TakePicture("video");
            console.log(outcard);
            CheckFace(outcard.IDNumber, myPic, function(result) {
                if (result) {
                    alert("辨識成功");
                } else {
                    alert("辨識失敗");
                }
            });
        };
        $scope.next = function() {
            var videoSrc = document.getElementById('video').src;
            document.getElementById('video').src = "";
            window.URL.revokeObjectURL(videoSrc);
            $state.go('verification.id-card');
        }
    })
    .controller('idCtrl', function($scope, $state) {

    
        $scope.next = function() {
            $state.go('verification.finger-print')
        }
    })
    .controller('fingerCtrl', function($scope, $state) {
        $scope.next = function() {
            $state.go('verification.check-info')
        }
    })
    .controller('checkCtrl', function($scope, $state) {
        $scope.next = function() {
            $state.go('verification.sucess')
        }
    })