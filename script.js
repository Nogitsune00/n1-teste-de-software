// Base de dados
let produtos = [];

// variaveis globais
let idCounter = 1000;

// funções relacionadas ao cadastro de produtos

// No HTML adicionar um onclick="cadastrarProduto()"
function cadastrarProduto(produto /* perguntar pro professor se precisa passar parametro*/ ){
    // adicionar no HTML campos de input para as variaveis abaixo, nesses inputs adicionar o valor de id
    // igual ao valor presente entre aspas simples.
    const pNome = document.getElementById('nome');
    const pPreco = document.getElementById('preco');
    const pEstoque = document.getElementById('estoque');
    const pCategoria = document.getElementById('categoria');
    // preferencialmente adicionar a categoria como valores pré-definidos

    const preco = parseFloat(pPreco.value);
    const estoque = parseInt(pEstoque.value);
    let id;
    
    if(isNaN(estoque)){
        alert("Por favor, digite um número válido");
        pEstoque.focus();
        return "Valor inválido";
    }

    if(isNaN(preco)){
        alert("Por favor, digite um número válido");
        pPreco.focus();
        return "Valor inválido";
    }

    if(pNome === '' || pCategoria === ''){
        return "Dados obrigatórios"
    }

    id = idCounter++;

    let info = {id: id, nome: pNome, preco: preco, estoque: estoque, categoria: pCategoria };

    produtos.push(info);

    document.getElementById('FormCadastro').reset();

    listarProdutos();
}

function excluirProduto(id){


}

function editarProduto(id){


}

function listarProdutos(){


}

function buscarProdutoPorId(id){


}

// funções relacionadas ao carrinho de compras




// funções relacionadas ao fechamento do pedido