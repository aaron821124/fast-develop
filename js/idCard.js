function idCard() {
    var images = document.getElementsByClassName('button');
    for (var i = 0; i < images.length; i++) {
        images[i].onmousedown = down;
        images[i].onmouseup = pull;
    };

    function down(e) {
        var image = e.target;
        var name = image.id;
        name = name + '_click.png';
        image.src = 'img/' + name;
    }

    function pull(e) {
        var image = e.target;
        var name = image.id;
        name = name + '.png';
        image.src = 'img/' + name;
    }

    /*輸入數字*/
    var numbers = document.getElementsByClassName('number');
    for (var i = 0; i < numbers.length; i++) {
        numbers[i].onclick = addNumber;
    };

    var number = [];


    function addNumber(e) {
        var picture = e.target;
        number.push(picture.id);
        if (number.length >= 10) {
            number = number.slice(0, number.length - 1);
        };
        document.getElementById('InputNumber').innerHTML = number.toString().replace(/,/g, '');
    };

    /*退一位*/
    var back = document.getElementById('inputback');
    back.onclick = Back;

    function Back() {
        var newNumber = number.slice(0, number.length - 1);
        number = newNumber;
        document.getElementById('InputNumber').innerHTML = number.toString().replace(/,/g, '');
        console.log("bbb");
    }

    /*清除全部*/
    var clear = document.getElementById('inputclear');
    clear.onclick = Clear;

    function Clear() {
        var NoneNumber = number.slice(0, 0);
        number = NoneNumber;
        document.getElementById('InputNumber').innerHTML = number.toString().replace(/,/g, '');
    }
}
