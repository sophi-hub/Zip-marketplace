document.addEventListener("DOMContentLoaded", function (e) {
    //chave pública do vendedor
    const mercadopago = new MercadoPago('APP_USR-72b8cc69-8252-4d71-b78e-0af3ec8fc217', {
        locale: 'pt-BR' // Os mais comuns são: 'pt-BR', 'es-AR' e 'en-US'
    });
// APP_USR-72b8cc69-8252-4d71-b78e-0af3ec8fc217
    console.log("primeira etapa")
    


    // Handle call to backend and generate preference.
    document.getElementById("checkout-btn").addEventListener("click", function () {
        console.log("clicou no botão")
        //$('#checkout-btn').attr("disabled", true);
        const items = document.querySelectorAll(".products .item");
        console.log(items)
        // Array para armazenar os dados extraídos
        const extractedData = [];
        // Itera sobre cada item para extrair os dados
        items.forEach(item => {
            console.log(item)
            const id = document.getElementById('id_prod').value.toString();
            const unit_price = Number(parseFloat( item.querySelector(".preco-prod-value").innerText).toFixed(2));
            const title = item.querySelector(".name-prod").innerText.toString(); // Transformando title em string
            const quantity = Number(1); // Garantindo que quantity seja um número
            const currency_id = "BRL";        
            
            
            extractedData.push({ id, unit_price, title, quantity, currency_id });
        });
        const orderData = { items: extractedData };
 
        console.log(orderData)
        console.log('teste')
        
        fetch("/create-preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
        .then(function (response) {
            return response.json();
            
        })
        .then(function (preference) {
            console.log(preference)
            createCheckoutButton(preference.id);
            //$(".shopping-cart").fadeOut(500);
            setTimeout(() => {
               // $(".container_payment").show(500).fadeIn();
               preference.sandbox_init_point
               window.open(preference.sandbox_init_point)
            }, 500);
        })
        .catch(function () {
            alert("Unexpected error");
           // $('#checkout-btn').attr("disabled", false);
        });
    });

    function createCheckoutButton(preferenceId) {
        // Initialize the checkout
        const bricksBuilder = mercadopago.bricks();
        const renderComponent = async (bricksBuilder) => {
            if (window.checkoutButton) window.checkoutButton.unmount();
            await bricksBuilder.create(
                'wallet',
                'button-checkout', // class/id onde o botão de pagamento será exibido
                {
                    initialization: {
                        preferenceId: preferenceId
                    },
                    callbacks: {
                        onError: (error) => console.error(error),
                        onReady: () => {}
                    }
                }
            );
            window.checkoutButton = renderComponent(bricksBuilder);
            window.open('sandbox_init_point')
        };
    }

    // Go back
    /*document.getElementById("go-back").addEventListener("click", function () {
        $(".container_payment").fadeOut(500);
        setTimeout(() => {
            $(".shopping-cart").show(500).fadeIn();
        }, 500);
        $('#checkout-btn').attr("disabled", false);
    });*/
});
