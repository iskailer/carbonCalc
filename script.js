const localDb = new PouchDB('carbon_footprint');
const remoteCouchDBURL = 'http://admin:admin@localhost:5984/carbon_footprint';

document.getElementById('calculate').addEventListener('click', function(event) {
    calculateCarbonFootprint();
});

document.getElementById('startVoice').addEventListener('click', function() {
    startVoiceCommand();
});

document.getElementById('loadTableBtn').addEventListener('click', function () {
   loadTableBtn();
});


function calculateCarbonFootprint() {

    // Obtém os valores dos inputs
    var fuelAmount = parseFloat(document.getElementById('fuel').value);
    var distance = parseFloat(document.getElementById('distance').value);
    var fuelType = document.getElementById("fuelType").value;
    var fuelEmissionFactor = 0;

    switch (fuelType) {
        case "diesel":
          fuelEmissionFactor = 2.68; // Fator de emissão de CO2 para o diesel
          break;
        case "gasolina":
          fuelEmissionFactor = 2.31; // Fator de emissão de CO2 para a gasolina
          break;
        case "etanol":
          fuelEmissionFactor = 1.46; // Fator de emissão de CO2 para o etanol
          break;
        case "gnv":
          fuelEmissionFactor = 1.99; // Fator de emissão de CO2 para o GNV
          break;
        default:
          break;
      }


    // Fatores de emissão de carbono
    var distanceEmission = 0.12; // Emissões de carbono por quilômetro (kg CO2/km)

    // Calcula a pegada de carbono do escopo 1
    var carbonFootprint = (fuelAmount * fuelEmissionFactor) + (distance * distanceEmission);

    // Exibe o resultado
    document.getElementById('result').innerHTML = "<p>A Pegada de Carbono do Escopo 1 deste veiculo é de " + carbonFootprint.toFixed(2) + " kg CO2<p>";

    saveResults(fuelAmount, fuelEmissionFactor, distance, distanceEmission,carbonFootprint.toFixed(2));
};

function startVoiceCommand() {
    if (annyang) {

		annyang.setLanguage('pt-BR');
        // Define o comando de voz
        var commands = {
        'calcular': calculateCarbonFootprint,
		'Quantidade (de) (Combustível) (Usada) *fuel(litros)': setFuel,
		'Distância (Percorrida) (de) *distance(quilômetros)(quilometros)(km)': setDistance,
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

function setFuel(fuel) {
  if (!isNaN(parseFloat(fuel))) {
    document.getElementById("fuel").value = fuel;
  }
};

function setDistance(distance) {
  if (!isNaN(parseFloat(distance))) {
    document.getElementById("distance").value = distance;
  }
};

function saveResults(fuelAmount, fuelEmissionFactor, distance, distanceEmission,carbonFootprint){
   const CarbonCalcResult = {
          fuelAmount: fuelAmount,
          fuelEmissionFactor: fuelEmissionFactor,
          distance: distance,
          distanceEmission: distanceEmission,
          carbonFootprint: carbonFootprint
      };
      saveData(CarbonCalcResult).then(function () {
          console.log('Dados salvos com sucesso!');
      }).catch(function (err) {
          console.log(err);
      });
};

function saveData(CarbonCalcResult) {
    return localDb.put({
        _id: new Date().toISOString(),
        CarbonCalcResult: CarbonCalcResult
    });
}


// Configuração da sincronização bidirecional
localDb.sync(remoteCouchDBURL, {
    live: true, // habilita atualizações em tempo real
    retry: true // tenta novamente se ocorrer um erro
}).on('change', function (change) {
    // Indica que ocorreu uma mudança no banco de dados local ou remoto
    console.log('Mudança detectada:', change);
}).on('paused', function (info) {
    // Indica que a sincronização foi pausada
    console.log('Sincronização pausada:', info);
}).on('active', function (info) {
    // Indica que a sincronização foi retomada
    console.log('Sincronização retomada:', info);
}).on('error', function (err) {
    // Indica que ocorreu um erro durante a sincronização
    console.error('Erro durante a sincronização:', err);
});

function loadTableBtn() {
    localDb.allDocs({ include_docs: true, descending: true })
        .then(function (result) {
            // Limpa a tabela existente, se houver
            clearTable();

            // Cria uma tabela e cabeçalho
            var table = document.createElement("table");
            var headerRow = table.insertRow(0);
            var headers = ["Quantidade de Combustível (litros)", "Fator de Emissão de Combustível (kg CO2/l)", "Distância Percorrida (km)", "Emissões de Carbono por Distância (kg CO2/km)", "Pegada de Carbono (kg CO2)"];
            for (var i = 0; i < headers.length; i++) {
                var headerCell = document.createElement("th");
                headerCell.textContent = headers[i];
                headerRow.appendChild(headerCell);
            }

            // Adiciona os dados do banco de dados à tabela
            result.rows.forEach(function (row) {
                var data = row.doc.CarbonCalcResult;
                var newRow = table.insertRow();
                newRow.insertCell().textContent = data.fuelAmount;
                newRow.insertCell().textContent = data.fuelEmissionFactor;
                newRow.insertCell().textContent = data.distance;
                newRow.insertCell().textContent = data.distanceEmission;
                newRow.insertCell().textContent = data.carbonFootprint;
            });

            // Adiciona a tabela à página
            document.getElementById("tableContainer").appendChild(table);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function clearTable() {
    var tableContainer = document.getElementById("tableContainer");
    while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
    }
}