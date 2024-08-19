const key = "99d6a121ed473c060644b2c3ab18b605"; // Chave da API do OpenWeatherMap para autenticar as requisições

/* Função para exibir as informações na tela */
function dadosTela(dados) {
    // Atualiza o nome da cidade no elemento com a classe "title__cidade"
    document.querySelector(".title__cidade").innerHTML = "Tempo em " + dados.name;

    // Atualiza a temperatura máxima no elemento com a classe "max__tempo"
    document.querySelector(".max__tempo").innerHTML = "Max " + Math.floor(dados.main.temp_max) + "ºC";

    // Atualiza a temperatura mínima no elemento com a classe "min__tempo"
    document.querySelector(".min__tempo").innerHTML = "Min " + Math.floor(dados.main.temp_min) + "ºC";

    // Atualiza a descrição do clima no elemento com a classe "title__clima"
    document.querySelector(".title__clima").innerHTML = dados.weather[0].description;

    // Atualiza a umidade no elemento com a classe "title__umidade"
    document.querySelector(".title__umidade").innerHTML = "Umidade " + dados.main.humidity + "%";

    // Atualiza o ícone do clima no elemento com a classe "infor__icon"
    document.querySelector(".infor__icon").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;

    // Exibe a velocidade do vento convertida de m/s para km/h
    document.querySelector(".title__vento").innerHTML = "Vento: " + (dados.wind.speed * 3.6).toFixed(1) + " km/h";

    // Exibe alertas climáticos, se houver
    exibirAlertas(dados.alerts);
}

/* Função para buscar dados do clima por nome da cidade */
async function buscarCidade(cidade) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`)
        .then(response => response.json());

    dadosTela(dados);
}

/* Função para buscar dados do clima usando coordenadas (latitude e longitude) */
async function buscarPorCoordenadas(latitude, longitude) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&lang=pt_br&units=metric`)
        .then(response => response.json());

    dadosTela(dados);
}

/* Função para buscar o clima da cidade inserida pelo usuário */
function busca() {
    const cidade = document.querySelector(".input-seach").value;
    buscarCidade(cidade);
}

/* Função para ativar a localização do usuário e buscar o clima local */
function ativarLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                buscarPorCoordenadas(latitude, longitude);
            },
            () => {
                alert("Não foi possível obter sua localização. Por favor, digite o nome da cidade.");
            }
        );
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

/* Função para exibir os alertas na tela */
function exibirAlertas(alertas) {
    const alertaContainer = document.querySelector(".alerta-container");
    alertaContainer.innerHTML = ""; // Limpa alertas anteriores

    if (alertas && alertas.length > 0) {
        alertas.forEach(alerta => {
            const alertaElemento = document.createElement("div");
            alertaElemento.className = "alerta";
            alertaElemento.innerHTML = `
                <strong>Alerta:</strong> ${alerta.event}<br>
                <strong>Descrição:</strong> ${alerta.description}<br>
                <strong>Início:</strong> ${new Date(alerta.start * 1000).toLocaleString()}<br>
                <strong>Término:</strong> ${new Date(alerta.end * 1000).toLocaleString()}
            `;
            alertaContainer.appendChild(alertaElemento);
        });
    } else {
        alertaContainer.innerHTML = "<p>Não há alertas climáticos no momento.</p>";
    }
}

window.onload = ativarLocalizacao;
