angular.module('app')
    .controller('mainCtrl', function($rootScope, $scope, $interval, $state, $mdDialog) {
        $rootScope.$state = $state;

        $scope.step = 1;

        $scope.idCard = idCard;

        $rootScope.patient = {
            patientInfo: {}
        };

        $scope.hideTab = false;

        $rootScope.home = function() {
            $state.go('home');
        }

        //-----------------------time------------------------
        $scope.time = new Date();
        // $scope.hx2 = 0;
        // $scope.hy2 = 0;
        // $scope.mx2 = 0;
        // $scope.my2 = 0;
        // drawClock();
        $interval(function() {
            $scope.time = new Date();
            // drawClock();
        }, 10000);

        // function drawClock() {
        //     var min = $scope.time.getMinutes();
        //     var hour = $scope.time.getHours() % 12 + min / 60;

        //     var hourAng = hour * 30 / 180 * 3.1415926;
        //     var minAng = min * 6 / 180 * 3.1415926;
        //     $scope.hy2 = 25 - 10 * Math.cos(hourAng);
        //     $scope.hx2 = 25 + 10 * Math.sin(hourAng);
        //     $scope.my2 = 25 - 20 * Math.cos(minAng);
        //     $scope.mx2 = 25 + 20 * Math.sin(minAng);
        //     // console.log(hy2, hx2);
        // }

        $scope.showLeaveConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            if ($scope.step == 4) {
                $rootScope.home();
                return;
            }
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/verification/leave.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $rootScope.home();
                    $mdDialog.hide(answer);
                };
            }
        };

        $scope.showhelpConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/verification/help.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }
        };


    })
    .controller('icCtrl', function($scope, $state) {
        $scope.$parent.$parent.step = 1;

        console.log($scope.patient.patientInfo);
        console.log('check');

        ICCardInserted(function(card) {
            $scope.patient.patientInfo = card;
            $scope.success = true;
            ICCardEjected(function() {
                $scope.next();
            });
            $scope.$apply();
            // $scope.next();
        });
    
        // setTimeout(function(){
        //     // $scope.next();
        //     $scope.success = true;
        //     $scope.$apply();
        // }, 3000);



        $scope.next = function() {
            $scope.$parent.$parent.step = 2;
            $state.go('verification.face');
        }
    })
    .controller('faceCtrl', function($scope, $state, $interval) {
        $scope.$parent.$parent.step = 2;



        var localStream;

        function InitWebCam(id) {
            var mediaConstraint = {
                video: true,
                audio: false
            };
            if (typeof MediaStreamTrack === 'undefined' ||
                typeof MediaStreamTrack.getSources === 'undefined') {
                alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
            } else {
                MediaStreamTrack.getSources(function(sourceInfos) {
                    mediaConstraint.video = {
                        optional: [{
                            sourceId: sourceInfos[sourceInfos.length - 1].id

                        }]
                    }

                    navigator.webkitGetUserMedia(mediaConstraint, function(stream) {
                        var video = document.getElementById(id);
                        video.src = window.URL.createObjectURL(stream);
                        localStream = stream;
                        video.play();
                    }, function(err) {
                        console.log(err);
                    });


                });
            }
        }

        function check() {
            var myPic = TakePicture("video");
            console.log($scope.patient.patientInfo);
            CheckFace($scope.patient.patientInfo.IDNumber, myPic, function(result) {
                if (result) {
                    console.log("辨識成功");
                    $scope.sucess++;
                } else {
                    console.log("辨識失敗");
                    $scope.fail++;
                }
            });
        };
        var interval;

        $scope.startCheck = function() {
            InitWebCam("video");
            $scope.$parent.$parent.hideTab = false;
            $scope.sucess = 0;
            $scope.fail = 0;
            $scope.checkFail = 0;
            setTimeout(function() {
                interval = $interval(function() {
                    check();
                    if ($scope.sucess >= 2) {
                        $interval.cancel(interval);
                        setTimeout(function() {
                            $scope.next();
                        }, 1000)
                    }
                    if ($scope.fail >= 5) {
                        clearStream();
                        $scope.checkFail = true;
                        $scope.$parent.$parent.hideTab = true;
                        $interval.cancel(interval);
                    }
                }, 1000);
                $scope.check = true;
            }, 2500);
        };


        $scope.startCheck();
        // InitWebCam("video");


        function clearStream() {
            $interval.cancel(interval);
            var videoSrc = document.getElementById('video').src;
            document.getElementById('video').src = "";
            console.log(localStream);
            localStream.getVideoTracks()[0].stop();
        }

        $scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                $scope.$parent.$parent.hideTab = false;
                clearStream();
            })

        $scope.next = function() {
            $scope.$parent.$parent.step = 3;
            setTimeout(function() {
                $state.go('verification.check-info');
            }, 5);
        }
    })
    .controller('idCtrl', function($scope, $state, $timeout) {
        $scope.$parent.$parent.step = 1;

        $scope.input = "";

        $scope.clickBtn = function(num) {
            $scope.errorMessage = "";
            if ($scope.input.length == 3 || $scope.input.length == 7) {
                $scope.input += '-'
            }
            if ($scope.input.length < 11) {
                $scope.input += num;
            }

        }

        $scope.errorMessage = "";

        $scope.enter = function() {
            $scope.errorMessage = "";
            if ($scope.input.length < 11) {
                $scope.errorMessage = "輸入未滿九碼，請輸入九碼數字";
                return;
            }

            var input = $scope.input;
            input = input.replace(/-/g, "");
            $scope.search = true;
            $scope.resultCount = 0;
            for (var i = 0; i < 26; ++i) {
                var c = String.fromCharCode(65 + i);
                var number = input;
                getUserData(c + number, function(result) {
                    $scope.resultCount++;
                    $scope.$apply();
                    if (result) {
                        $scope.patient.patientInfo = result;
                        $scope.next();
                    }
                });
            };

        }

        $scope.$watch('resultCount', function(newVal, oldVal) {
            if (newVal == 26) {
                $scope.errorMessage = "查無號碼，請確認輸入的號碼是否正確";
                $scope.search = false;
            }
        })

        $scope.back = function() {
            $scope.errorMessage = "";
            if ($scope.input.length == 9 || $scope.input.length == 5) {
                $scope.input = $scope.input.slice(0, $scope.input.length - 2);
            } else $scope.input = $scope.input.slice(0, $scope.input.length - 1);

        }

        $scope.next = function() {
            $scope.$parent.$parent.step = 2;
            $state.go('verification.face')
        }
    })
    .controller('fingerCtrl', function($scope, $state) {
        $scope.$parent.$parent.step = 2;

        console.log('check');
        console.log($scope.patient.patientInfo);
        InitFingerPrint("COM4");

        CheckFingerPrint($scope.patient.patientInfo.IDNumber, function(result) {
            if (result) {
                $scope.next();
            } else {
                alert("辨識失敗");
            }
        });


        $scope.next = function() {
            $scope.$parent.$parent.step = 3;
            $state.go('verification.check-info')
        }
    })
    .controller('checkCtrl', function($scope, $state) {
        $scope.$parent.$parent.step = 3;


        console.log($scope.patient.patientInfo);

        $scope.next = function() {
            $scope.$parent.$parent.step = 4;
            $state.go('verification.sucess')
        }
    })
    .controller('successCtrl', function($scope, $timeout, $state) {
        $scope.$parent.$parent.step = 4;

        $scope.selfStep = 1;

        $timeout(function() {
            $state.go('verification.sucess-info');
        }, 2500);

    })
    .controller('infoCtrl', function($scope, $interval, $state) {
        $scope.countDown = 30;
        $scope.$parent.$parent.step = 4;

        if ($scope.patient.patientInfo.IDNumber) {
            if ($scope.patient.patientInfo.IDNumber[1] == 1) {
                $scope.patient.patientInfo.sex = '男'
            } else {
                $scope.patient.patientInfo.sex = '女'
            }
        }


        var interval = $interval(function() {
            if ($scope.countDown == 0) {
                $scope.home();
                $interval.cancel(interval);
            }
            $scope.countDown--;
        }, 1000)

        $scope.data = ['姓名：' + $scope.patient.patientInfo.Name, 
        '就診醫師：陳俊杉', 
        '就診科別：一般外科',
        '預估看診時間：15:30',
        '就診號碼：14',
        '就診診間：2樓 H區 第三診'];

        $scope.print = function(){
            Print(data);
        }

        $scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                $interval.cancel(interval);
            });

        $scope.full = false;
        $scope.toggleMap = function() {
            $scope.countDown = 30;
            if ($scope.full) {
                $scope.full = false;
            } else {
                $scope.full = true;
            }
        }
    })
