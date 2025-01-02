const form   = document.getElementById('pixForm');
const campos = document.querySelectorAll('.required');
const spans  = document.querySelectorAll('.span-required');
const cpfRegex = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;


    form.addEventListener('submit', (event) => {
        event.preventDefault();
        cepValidate();
        numValidate();
        nameValidate();
        cpfValidate();
    })

function setError(pagamento){
    campos[pagamento].style.border = '1px solid #e63636'

}

function removeError(pagamento){
    campos[pagamento].style.border = ''

}


function cepValidate(){
    if(campos[0].value.length < 8)
    {
        setError(0);
    }
    else{
        removeError(0);
    }
}

function numValidate(){
    if(campos[1].value.length < 1)
    {
        setError(1);
    }
    else{
        removeError(1);
    }
}


function nameValidate(){
    if(campos[2].value.length < 3)
    {
        setError(2);
    }
    else{
        removeError(2);
    }
}


function cpfValidate(){
    if(!cpfRegex.test(campos[3].value))
    {
        setError(3);
    }
    else{
        removeError(3);
    }
}