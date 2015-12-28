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

        function drawClock() {
            var min = $scope.time.getMinutes();
            var hour = $scope.time.getHours() % 12 + min / 60;
            console.log(hour, min);

            var hourAng = hour * 30 / 180 * 3.1415926;
            var minAng = min * 6 / 180 * 3.1415926;
            $scope.hy2 = 25 - 10 * Math.cos(hourAng);
            $scope.hx2 = 25 + 10 * Math.sin(hourAng);
            $scope.my2 = 25 - 20 * Math.cos(minAng);
            $scope.mx2 = 25 + 20 * Math.sin(minAng);
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
    .controller('faceCtrl', function($scope, $state, $interval) {
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

        function check() {
            var myPic = TakePicture("video");
            CheckFace('F128720903', myPic, function(result) {
                if (result) {
                    console.log("辨識成功");
                    $scope.sucess++;
                } else {
                    console.log("辨識失敗");
                    $scope.fail++;
                }
            });
        };

        $scope.sucess = 0;
        $scope.fail = 0;

        var interval = $interval(function() {
            check();
            console.log($scope.sucess);
            if($scope.sucess == 2){
                $interval.cancel(interval);
                setTimeout(function(){
                    $scope.next();
                }, 1000)
            }
            if($scope.fail == 5){
                $interval.cancel(interval);
            }
        }, 1000)

        $scope.next = function() {
            var videoSrc = document.getElementById('video').src;
            document.getElementById('video').src = "";
            console.log(localStream);
            localStream.getVideoTracks()[0].stop();
            setTimeout(function() {
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
