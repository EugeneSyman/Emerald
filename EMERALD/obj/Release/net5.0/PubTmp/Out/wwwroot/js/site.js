function loginAdmin() {

    var username = document.getElementById('inputUsername');
    var password = document.getElementById('inputPassword');
    var conteiner = document.getElementById('adminConteiner');

    console.log(username.value);

    if (username.value === 'Admin' & password.value === '1234') {
        conteiner.innerHTML = '<button type="button" style="background-color:forestgreen" class="btn btn-primary btn-rounded"><i class="bi bi-check-circle"></i> Map</button>';
    }
}
