// const form   = document.getElementById('control');
// const campos = document.querySelectorAll('.required');
// const spans  = document.querySelectorAll('.span-required');
// const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

//     form.addEventListener('submit', (event) => {
//         event.preventDefault();
//         emailValidate();
//         mainPasswordValidate();
//     })



// function setError(login_do_usuario){
//     campos[login_do_usuario].style.border = '1px solid #e63636';
//     spans[login_do_usuario].style.display = 'block';
// }

// function removeError(login_do_usuario){
//     campos[login_do_usuario].style.border = ''
//     spans[login_do_usuario].style.display = 'none';
// }


// function emailValidate(){
//     if(!emailRegex.test(campos[0].value))
//     {
//         setError(0);
//     }
//     else{
//         removeError(0);
//     }
// }

// function mainPasswordValidate(){
//     if(campos[1].value.length < 8)
//     {
//         setError(1);
//     }
//     else
//     {
//         removeError(1);
//     }
// }
















































// /*const form = document.querySelector("#control")
// const userInput =  document.querySelector("#email") || document.querySelector('#cpf')
// const passwordInput = document.querySelector("#senha")
// const formBtn = document.querySelector('#botao-form');

// formBtn.addEventListener("click", () => {
//     //Verifica se o email está vazio
//     if (!userInput.value) {
//         alert("Por favor, preencha o campo destacado");
//         userInput.focus();
//         return;
//     }

//     //Verifica se a senha está preenchida
//     if(!validatePassword(passwordInput.value, 8)) {
//         alert("A senha prescisa de ser no mínimo 8 dígitos.");
//         passwordInput.focus();
//         return;
//     }

//     //Se todos os campos estiverem corretamente preenchidos, envie-o
//     //form.submit();
// })


//     //Função que valida email
//     function isEmailValid(email) {
//         //Cria uma regex para validar email
//         const emailRegex = new RegExp(
//             //usuario12@host.com.br
//             /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
//         );

//         if (emailRegex.test(email)) {
//             return true;
//         }

//         return false;
//     }


//     //Função que valida senha
//     function validatePassword(password, minDigits) {
//         if(password.length >= minDigits) {
//             return true
//         }
//             return false
//     }
//     */