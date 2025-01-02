async function buscarEndereco() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const numero = document.getElementById('numero').value.trim();

    // Validar o CEP para garantir que ele tenha 8 dígitos
    if (!/^[0-9]{8}$/.test(cep)) {
        alert("Por favor, insira um CEP válido com 8 números.");
        return;
    }

    // Validar o número da casa para garantir que ele seja um número e não esteja vazio
    if (numero === "" || isNaN(numero)) {
        alert("Por favor, insira um número válido para a casa.");
        return;
    }

    try {
        // Utilizando a API do ViaCEP para obter as informações do CEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!response.ok) throw new Error("CEP não encontrado.");
        
        const data = await response.json();

        if (data.erro) throw new Error("CEP não encontrado.");

        // Exibir as informações do endereço
        document.getElementById('endereco-info').innerHTML = `
            <p><strong>Endereço:</strong> ${data.logradouro}, ${numero}</p>
            <p><strong>Bairro:</strong> ${data.bairro}</p>
            <p><strong>Cidade:</strong> ${data.localidade}</p>
            <p><strong>Estado:</strong> ${data.uf}</p>
        `;
    } catch (error) {
        document.getElementById('endereco-info').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}
