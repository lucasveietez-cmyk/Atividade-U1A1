1. Sobre o Projeto

Aplicação web para consulta de dados de localização e endereçamento.

    Objetivo da aplicação: Mostrar a localização a partir de um CEP, localizar ruas informando UF e cidade, e manter um log (histórico) de todas as pesquisas realizadas.

    Tecnologias: HTML, CSS (Materialize), JavaScript (Fetch API) e LocalStorage.

2. Conceitos de PWA

Uma PWA é um site que oferece uma experiência de aplicativo.

    Instalável: Pode ser fixado na tela inicial do celular ou desktop.

    Offline (Service Worker): Garante que a estrutura do app carregue sem internet usando cache.

    Responsividade: O layout funciona perfeitamente em celulares e computadores.

    manifest.json: Arquivo de configuração de ícones e cores do app.

    Service Worker: Script que roda em segundo plano para gerenciar o cache.

3. Como rodar o projeto localmente

    No VS Code, abra a pasta do projeto.

    Com a extensão Live Server instalada, clique em "Go Live" no arquivo index.html.

    A aplicação abrirá automaticamente no seu navegador.

4. Como fazer o deploy

O deploy foi realizado no Netlify:

    Upload: Arrastei a pasta raiz do projeto para o painel de deploy do Netlify.

    Configuração: Defini o nome do domínio nas configurações do site.

    Link final: https://buscacepp-lucas-nr.netlify.app/
