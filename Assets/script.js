// Selecionando os elementos para o Modal
const fundoModal = document.querySelector('#fundo-modal')
const closeModal = document.querySelector('#close-modal')
const openModal = document.querySelector('#open-modal')

const toggleModal = () => {
    fundoModal.classList.toggle('ativo')
}

// abrir ou fechar o modal
openModal.addEventListener('click', toggleModal)
closeModal.addEventListener('click', toggleModal)

// se for clicado no fundo do modal, ele fechará tambem
fundoModal.addEventListener('click', (e) => {
    if (e.target === fundoModal){
        toggleModal()
    }
})

// se o botão ESC for clicado, será fechado tambem
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
        toggleModal()
    }
})

// Modal de Limpar o Histórico Financeiro
const lixeiraHistorico = document.querySelector('#clear-AllList')
const btnCancelar = document.querySelector('#btn-cancelar')
const btnExcluir = document.querySelector('#btn-excluir')
const fundoModalDelete = document.querySelector('#fundoModal-delete')

const ModalLimpar = () => {
    fundoModalDelete.classList.toggle('ativo')
}

lixeiraHistorico.addEventListener('click', ModalLimpar)
btnCancelar.addEventListener('click', ModalLimpar)

btnExcluir.addEventListener('click', function (e) {

    e.preventDefault() 

    transacoes = []
    atualizarPainelResumo()
    ModalLimpar()
})


// Selecionando os elementos do DOM
const entrada = document.querySelector('#entrada')
const saida = document.querySelector('#saida')
const saldo = document.querySelector('#saldo')
const titleSaldo = document.querySelector('#title-saldo')

// Selecionando os elementos do formulário para adicionar nos elementos do DOM
const form = document.querySelector('#formulario')
const descricaoInput = document.querySelector('#descricao')
const valorInput = document.querySelector('#valor')
const tipoInput = document.querySelector('#tipo')
const btnLimpar = document.querySelector('#clear')
const btnAdicionar = document.querySelector('#btn-add')

// Selecionando a lista onde as transações serão exibidas
const listaUl = document.querySelector('#listagem');

// Criando o LocalStorage
const transacaoSalva = localStorage.getItem('HistoricoFinanceiro')

//se existir alguma coisa no localStorage, vai retornar esse valor em convertido. senao, retorna um array vazio
let transacoes = transacaoSalva ? JSON.parse(transacaoSalva) : [] // array onde todas as transações serão adicionadas

atualizarPainelResumo() //chamei a função uma vez no início para garantir que os dados carregados do localStorage sejam exibidos na tela assim que a página abre.

// Adicionando um evento de submit ao formulário
btnAdicionar.addEventListener('click', function (e){
    //isso fará que a página não recarregue ao enviar o formulário
    e.preventDefault()

    // Pegando os valores dos inputs
    const descricao = descricaoInput.value
    const valor = parseFloat(valorInput.value)
    const tipo = tipoInput.value

    // Validação simples para não adicionar transações vazias
    if (descricao.trim() === '' || isNaN(valor)) { // Trim para remover espaços em branco e isNaN para verificar se o valor é um número
        alert( 'PLS, coloque uma descrição e um valor válido.' )
        return // Se a descrição estiver vazia ou o valor não for um número, não adiciona a transação
    }

    // Criando um objeto para a nova transação
    const novaTransacao = {
        id: Date.now(), // Usando o timestamp como ID único
        descricao: descricao,
        valor: valor,
        tipo: tipo
    }

    // Adicionando a nova transação ao array de transações
    transacoes.push(novaTransacao)

    atualizarPainelResumo() // Atualiza o painel de resumo
    toggleModal()

    //limpando os campos do formulário
    descricaoInput.value = ''
    valorInput.value = ''
    tipoInput.value = '/'
    descricaoInput.focus() // Foca no campo de descrição para facilitar

})

// Função para atualizar o painel de resumo

function atualizarPainelResumo() {
    renderizarLista() // Renderiza as transações na lista
    atualizarResumo() // Atualiza os valores de entradas, saídas e saldo

    //Toda vez que atualizamos a tela, salvamos a versão mais recente do array no localStorage
    localStorage.setItem('HistoricoFinanceiro', JSON.stringify(transacoes)) // traduzi para texto
}

function renderizarLista(){
    // limpando a lista antes de renderizar novamente
    listaUl.innerHTML = ''

    // remover item de exemplo que estava na lista
    const itemDeExemplo = document.querySelector('.itens') 
    if (itemDeExemplo) {itemDeExemplo.remove()}

    // agora vem a magica de renderizar a lista de transações e adicionar os itens na lista

    transacoes.forEach(transacoes => {
        // vou criar o elemento <li>
        const li = document.createElement('li')
        li.classList.add('itens') // Adicionando a classe 'itens' para estilização futura

        //criando outra classe 'Entrada' ou 'Saída' para estilização no CSS
        li.classList.add(transacoes.tipo)

        // formatar o valor para moeda brasileira (R$)
        const valorFormatado = transacoes.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        // criar <li> na area do historico

        li.innerHTML = `
        <p> ${transacoes.descricao} </p>
        <p> ${valorFormatado} </p>
        <p> ${transacoes.tipo === 'entrada' ? 'Entrada <Strong>⇑</Strong>' : 'Saída <Strong>⇓</Strong>'} </p>
        <button class="btn-apagar" data-id="${transacoes.id}">
            <ion-icon name="trash-bin-outline"></ion-icon>
        </button>`

        listaUl.appendChild(li)

    })
}

function atualizarResumo() {

    // vou atualizar o painel de entrada

    const painelEntrada = transacoes
    .filter(trans => trans.tipo === 'entrada') // aq o filter eh como uma esteira que verifica se o valor que ta em trans (que eu criei, mas eh de transação) eh identico a 'entrada'. Se for, ele vai pra proxima esteira.
    .reduce((acc, trans) => acc + trans.valor, 0) // essa esteira cria duas variaveis (acc, trans) para fazer a soma entre eles
    // 'acc' É a abreviação de "accumulator". Pense como o visor da sua calculadora. Ele guarda o total acumulado até o momento. Ele começa com o valor inicial que definimos (0)

    // vou atualizar o painel de saida

    const painelSaida = transacoes
    .filter(trans => trans.tipo === 'saida')
    .reduce((acc, trans) => acc + trans.valor, 0)

    const painelSaldo = painelEntrada - painelSaida

    //atualizar paineis atraves do html. vou imprimir o valor ja convertido para o Real

    entrada.textContent = painelEntrada.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
    saida.textContent = painelSaida.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
    saldo.textContent = painelSaldo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    // alterar cor no caso de total ser negativo e positivo
    if(painelSaldo < 0) {
        saldo.style.color = '#9b2323'
        titleSaldo.style.color = '#9b2323'
    }else {
        saldo.style.color = 'green'
        titleSaldo.style.color = 'green'
    }
}

btnLimpar.addEventListener('click', function limparInput(e) {

    e.preventDefault()

    descricaoInput.value = ''
    valorInput.value = ''
    tipoInput.value = '/'
    descricaoInput.focus()
})

// Botão para limpar um item especifico do Historico

listaUl.addEventListener('click', function (e) {
    
    const elementoClicado = e.target

    const btnApagar = elementoClicado.closest('.btn-apagar')

    if(btnApagar){
        const idDelete = btnApagar.dataset.id
        transacoes = transacoes.filter(t => t.id !== parseInt(idDelete))

        atualizarPainelResumo()
    }
})

   

