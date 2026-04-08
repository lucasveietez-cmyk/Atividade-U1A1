// Inicialização de componentes e carregamento prévio de dados
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tabs');
  M.Tabs.init(tabs);
  
  carregarEstados();
  iniciarServiceWorker();
});

// Função para registrar o histórico de operações
function registrarLog(mensagem) {
  const listaLogs = document.getElementById('lista-logs');
  const momentoAtual = new Date().toLocaleString('pt-BR');
  const elementoLista = document.createElement('li');
  
  elementoLista.className = 'collection-item';
  elementoLista.textContent = `[${momentoAtual}] ${mensagem}`;
  listaLogs.prepend(elementoLista);
}

// Lógica de busca pelo CEP
async function buscarCep() {
  const campoCep = document.getElementById('cep').value.replace(/\D/g, '');
  
  if (campoCep.length !== 8) return;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${campoCep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      registrarLog(`Falha: O CEP ${campoCep} é inexistente.`);
      return;
    }

    document.getElementById('cidade').value = dados.localidade;
    document.getElementById('bairro').value = dados.bairro;
    document.getElementById('estado').value = dados.uf;
    document.getElementById('ddd').value = dados.ddd;

    M.updateTextFields();
    registrarLog(`Êxito: Consulta realizada para o CEP ${campoCep}.`);
  } catch (excecao) {
    registrarLog(`Erro de comunicação ao buscar o CEP ${campoCep}.`);
  }
}

function limparCamposCep() {
  document.getElementById('cep').value = '';
  document.getElementById('cidade').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('estado').value = '';
  document.getElementById('ddd').value = '';
  M.updateTextFields();
}

// Integração com a API do IBGE para listagem de Estados
async function carregarEstados() {
  try {
    const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    const estados = await resposta.json();
    const seletorUf = document.getElementById('uf-rua');

    estados.forEach(estado => {
      const opcao = document.createElement('option');
      opcao.value = estado.sigla;
      opcao.textContent = estado.nome;
      seletorUf.appendChild(opcao);
    });

    M.FormSelect.init(seletorUf);
  } catch (excecao) {
    registrarLog('Falha ao obter as Unidades Federativas do IBGE.');
  }
}

// Integração com a API do IBGE para listagem de Municípios atrelados ao Estado
async function carregarCidades() {
  const siglaUf = document.getElementById('uf-rua').value;
  if (!siglaUf) return;

  try {
    const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaUf}/municipios`);
    const cidades = await resposta.json();
    const seletorCidade = document.getElementById('cidade-rua');

    seletorCidade.innerHTML = `<option value='' disabled selected>Selecione a Cidade</option>`;

    cidades.forEach(cidade => {
      const opcao = document.createElement('option');
      opcao.value = cidade.nome;
      opcao.textContent = cidade.nome;
      seletorCidade.appendChild(opcao);
    });

    M.FormSelect.init(seletorCidade);
  } catch (excecao) {
    registrarLog(`Falha ao carregar os municípios do estado ${siglaUf}.`);
  }
}

// Lógica de busca de localidades pelo nome da rua
async function buscarRua() {
  const siglaUf = document.getElementById('uf-rua').value;
  const nomeCidade = document.getElementById('cidade-rua').value;
  const nomeRua = document.getElementById('rua').value;

  if (!siglaUf || !nomeCidade || nomeRua.length < 3) {
    registrarLog('Atenção: Informe a UF, a Cidade e ao menos 3 caracteres no Logradouro.');
    return;
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${siglaUf}/${nomeCidade}/${nomeRua}/json/`);
    const dadosEnderecos = await resposta.json();
    const areaResultados = document.getElementById('lista-ruas');
    areaResultados.innerHTML = '';

    if (!dadosEnderecos || dadosEnderecos.length === 0) {
      registrarLog(`Sem resultados para: ${nomeRua}, ${nomeCidade} - ${siglaUf}.`);
      return;
    }

    dadosEnderecos.forEach(endereco => {
      const itemLista = document.createElement('li');
      itemLista.className = 'collection-item';
      itemLista.innerHTML = `<strong>CEP:</strong> ${endereco.cep} <br> <strong>Endereço:</strong> ${endereco.logradouro}, ${endereco.bairro}`;
      areaResultados.appendChild(itemLista);
    });

    registrarLog(`Busca textual concluída: ${nomeRua}, ${nomeCidade} - ${siglaUf}.`);
  } catch (excecao) {
    registrarLog('Erro de rede ao processar a busca por logradouro.');
  }
}

// Registro do Worker para funcionalidade PWA
function iniciarServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registro => console.log('Service Worker ativado no escopo:', registro.scope))
        .catch(erro => console.log('Falha na ativação do Service Worker.', erro));
    });
  }
}