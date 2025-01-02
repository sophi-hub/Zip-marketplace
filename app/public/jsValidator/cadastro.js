// const formulario = document.querySelector("#formulario");
// formulario.addEventListener("submit", function(evento) {
//     evento.preventDefault();
//     const senha = formulario.querySelector("[name='senha']").value;
//     const confirmSenha = formulario.querySelector("[name='confirmsenha']").value;

//     if (senha === confirmSenha && senha != '' && confirmSenha != '' )  {
//         formulario.submit()
//         return true
//     } else {
//         new Notify ({
//             status: 'error',
//             title: 'Verifique a senha', 
//             text: 'As senhas não são iguais',
//             speed: 300,
//             effect: 'fade',
//             showIcon: false,
//             showCloseButton: true,
//             autoclose: true,
//             autotimeout: 5000,
//             gap: 20,
//             distance: 20,
//             position: 'center'
//         });
//         formulario.querySelector("[name='senha']").classList.toggle("invalido");
//         formulario.querySelector("[name='confirmsenha']").classList.toggle("invalido");
//         return false
//     }
    
    
// });
