angular.module('app')
    .controller('mainCtrl', function($rootScope, $scope, $interval, $state) {
        $rootScope.$state = $state;

        $scope.idCard = idCard;

        console.log($state.get());
        $scope.time = new Date();
        $scope.hx2 = 0;
        $scope.hy2 = 0;
        $scope.mx2 = 0;
        $scope.my2 = 0;
        drawClock();
        $interval(function() {
            $scope.time = new Date();
            drawClock();
        }, 10000);

        function drawClock(){
            var min = $scope.time.getMinutes();
            var hour = $scope.time.getHours()%12 + min/60;
            console.log(hour, min);

            var hourAng = hour*30/180*3.1415926;
            var minAng = min*6/180*3.1415926;
            $scope.hy2 = 25 - 10*Math.cos(hourAng);
            $scope.hx2 = 25 + 10*Math.sin(hourAng);
            $scope.my2 = 25 - 20*Math.cos(minAng);
            $scope.mx2 = 25 + 20*Math.sin(minAng);
            // console.log(hy2, hx2);
        }
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


        var localStream;
        function InitWebCam(id) {

            navigator.webkitGetUserMedia({
                video: true,
                audio: false
            }, function(stream) {
                var video = document.getElementById(id);
                video.src = window.URL.createObjectURL(stream);
                localStream = stream;
                video.play();
            }, function(err) {
                console.log(err);
            });
        }

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
            console.log(localStream);
            localStream.getVideoTracks()[0].stop();
            setTimeout(function(){
                $state.go('verification.id-card');
            }, 5);
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
