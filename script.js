document.getElementById('carbonForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão
    calculateCarbonFootprint();
});

document.getElementById('startVoice').addEventListener('click', function() {
    startVoiceCommand();
});

function calculateCarbonFootprint() {
	console.log ('calculando!');
	
    // Obtém os valores dos inputs
    var fuelAmount = parseFloat(document.getElementById('fuel').value);
    var distance = parseFloat(document.getElementById('distance').value);

    // Fatores de emissão de carbono
    var fuelEmissionFactor = 2.68; // Fator de emissão de carbono do combustível diesel (kg CO2/l)
    var distanceEmission = 0.12; // Emissões de carbono por quilômetro (kg CO2/km)

    // Calcula a pegada de carbono do escopo 1
    var carbonFootprint = (fuelAmount * fuelEmissionFactor) + (distance * distanceEmission);

    // Exibe o resultado
    document.getElementById('result').innerHTML = "A Pegada de Carbono do Escopo 1 deste(s) caminhão(ões) é de " + carbonFootprint.toFixed(2) + " kg CO2";
};

function startVoiceCommand() {
    if (annyang) {
		
		annyang.setLanguage('pt-BR');
        // Define o comando de voz
        var commands = {
            'calcular': function() {
                // Simula o clique no botão de submit quando o comando de voz é acionado
                document.getElementById('carbonForm').dispatchEvent(new Event('submit'));
            },			
			'*txt':test
        };

        // Adiciona os comandos de voz
        annyang.addCommands(commands);
        // Inicia o reconhecimento de voz
		
		console.log ('comandos annyang adicionados!');
        annyang.start();
    } else {
        alert('O reconhecimento de voz não é suportado neste navegador.');
    }
};

function test(txt){
  console.log (txt);
  annyang.pause();
};

/*

    document.getElementById('carbonForm').addEventListener('submit', function(event) {: Esta linha seleciona o elemento com o ID 'carbonForm' (provavelmente o formulário) e adiciona um ouvinte de evento para o evento 'submit'. Quando o formulário é submetido, a função anônima é executada.

    event.preventDefault();: Esta linha dentro da função anônima previne o comportamento padrão de envio do formulário, que seria recarregar a página.

    calculateCarbonFootprint();: Esta linha chama uma função chamada calculateCarbonFootprint() quando o formulário é submetido. Esta função é responsável por calcular a pegada de carbono com base nos valores inseridos nos campos do formulário.

    document.getElementById('startVoice').addEventListener('click', function() {: Esta linha seleciona o elemento com o ID 'startVoice' (provavelmente um botão) e adiciona um ouvinte de evento para o evento 'click'. Quando o botão é clicado, a função anônima é executada.

    startVoiceCommand();: Esta linha chama uma função chamada startVoiceCommand() quando o botão é clicado. Esta função é responsável por iniciar o reconhecimento de voz e associar comandos de voz à funcionalidade de calcular a pegada de carbono.

    function calculateCarbonFootprint() {: Esta linha define uma função chamada calculateCarbonFootprint(), que é responsável por calcular a pegada de carbono com base nos valores inseridos nos campos do formulário.

    var fuelAmount = parseFloat(document.getElementById('fuel').value);: Esta linha obtém o valor inserido no campo de entrada com o ID 'fuel' (provavelmente a quantidade de combustível) e converte para um número de ponto flutuante.

    var distance = parseFloat(document.getElementById('distance').value);: Esta linha obtém o valor inserido no campo de entrada com o ID 'distance' (provavelmente a distância percorrida) e converte para um número de ponto flutuante.

    var fuelEmissionFactor = 2.3;: Esta linha define o fator de emissão de carbono do combustível em kg CO2/litro.

    var distanceEmission = 0.12;: Esta linha define as emissões de carbono por quilômetro em kg CO2/km.

    var carbonFootprint = (fuelAmount * fuelEmissionFactor) + (distance * distanceEmission);: Esta linha calcula a pegada de carbono somando as emissões de carbono do combustível e as emissões de carbono pela distância percorrida.

    document.getElementById('result').innerHTML = "Sua Pegada de Carbono do Escopo 1 é de " + carbonFootprint.toFixed(2) + " kg CO2";: Esta linha atualiza o conteúdo do elemento com o ID 'result' com o resultado do cálculo da pegada de carbono, formatando-o com duas casas decimais.

    function startVoiceCommand() {: Esta linha define uma função chamada startVoiceCommand(), que é responsável por iniciar o reconhecimento de voz e associar comandos de voz à funcionalidade de calcular a pegada de carbono.

    if (annyang) {: Esta linha verifica se a biblioteca Annyang está disponível no navegador.

    annyang.setLanguage('pt-BR');: Esta linha configura o idioma do reconhecimento de voz para português brasileiro.

    var commands = { ... };: Esta linha define um objeto chamado commands, que contém os comandos de voz associados às funcionalidades da aplicação.

    annyang.addCommands(commands);: Esta linha adiciona os comandos definidos no objeto commands ao reconhecimento de voz.

    annyang.start();: Esta linha inicia o reconhecimento de voz.

    function test(txt){ ... };: Esta linha define uma função chamada test(), que é chamada quando o reconhecimento de voz captura algum texto. Essa função pode ser usada para testar e manipular o texto capturado.

    console.log (txt);: Esta linha registra o texto capturado pelo reconhecimento de voz no console do navegador.

    annyang.pause();: Esta linha pausa o reconhecimento de voz após a captura do texto.*/
