function generatorPostcard(e) {
    $(e).prop("disabled", false);
    const userName = $('#postcardModal #username').val()
    if (!userName || userName.length > 15) {
        $('#postcardModal .modal-body .sum-character .alert-name').removeClass('invisible')
        return
    }
    $(e).attr("disabled", true);

    setTimeout(() => {
        $("#postcardModal .btn-create-postcard").attr('disabled', false)
    }, 3000);
    var canvas = document.getElementById('postcardCanvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.crossOrigin = "anonymous";

    const gender = $('#postcardModal .gender-input:checked').val()
    let prefix = 'Chúng em cảm ơn anh/chị ';
    let suffixe = '';

    if (gender == 0) prefix = prefix.replace("anh/chị", "chị");
    else if (gender == 1) prefix = prefix.replace("anh/chị", "anh");

    var font = new FontFace('Pecita', 'url(css/font/Pecita.otf)');
    document.fonts.add(font);

    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = '37px Pecita';
        ctx.textBaseline = "middle";

        var parts = [
            { text: prefix, color: "black" },
            { text: userName, color: "red" },
            { text: suffixe, color: "black" }
        ];

        var totalWidth = 0;
        parts.forEach(function(part) {
            totalWidth += ctx.measureText(part.text).width;
        });

        var x = (canvas.width - totalWidth) / 2;
        var y = 786;


        parts.forEach(function(part) {
            ctx.fillStyle = part.color; 
            ctx.fillText(part.text, x, y); 
            x += ctx.measureText(part.text).width;
        });

        $('#postcardModal').modal('hide')
        $('#resultModal #img-result').attr('src', canvas.toDataURL())
        $('#resultModal').modal('show')
        
        // if (GVs.isIOS()) {
        //     $('#ios-image-modal .modal-body img').attr('src', canvas.toDataURL())
        //     $('#ios-image-modal').modal('show')
        // } else {

        //     $('#resultModal #img-result').attr('src', canvas.toDataURL())
        //     $('#resultModal').modal('show')
        // }
    };

    font.load().then(function(loadedFont) {
        console.log('Font loaded:', loadedFont);
        img.src = 'img/postcard-thankyou.png';
    }).catch(function(error) {
        img.src = 'img/postcard-thankyou.png';
        console.error('Font load error:', error);
    });

}

function downloadPostCard() {
    var canvas = document.getElementById('postcardCanvas');
    var dataURL = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'aahg6-thankyou-postcard.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function onInputNameChange(e) {
    if (e.target.value.length > 0) {
        $('#postcardModal .modal-body .sum-character .alert-name').addClass('invisible')
    }
    $('#postcardModal #count-name').html(e.target.value.length)
}

window.addEventListener('load', () => {
    $('#resultModal').on('hidden.bs.modal', event => {
        var canvas = document.getElementById('postcardCanvas');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $('#resultModal #img-result').attr('src', '')
    })
    $('#postcardModal').on('hidden.bs.modal', event => {
        $('#postcardModal #username').val('')
        $('#postcardModal #count-name').html('0')
        $('#postcardModal .modal-body .sum-character .alert-name').addClass('invisible')
        $('#postcardModal .gender-input').prop('checked', false)
    })
    $('#ios-image-modal').on('hidden.bs.modal', event => {
        $('#ios-image-modal .modal-body img').attr('src', '')
    })
})

function removeDisable() {
    $("#postcardModal .btn-create-postcard").prop('disabled', false)
}

// class GVs {
//     static isIOS() {
//         return [
//             'iPad Simulator',
//             'iPhone Simulator',
//             'iPod Simulator',
//             'iPad',
//             'iPhone',
//             'iPod'
//         ].includes(navigator.platform)
//             || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
//     }
// }
