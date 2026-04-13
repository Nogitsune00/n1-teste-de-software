// Base de dados
let produtos = [];

// variaveis globais
let idCounter = 1000;

// funções relacionadas ao cadastro de produtos

// No HTML adicionar um onclick="cadastrarProduto()"
function cadastrarProduto(produto /* perguntar pro professor se precisa passar parametro*/ ){
    const pNome = document.getElementById('nomeProduto');
    const pPreco = document.getElementById('precoProduto');
    const pEstoque = document.getElementById('estoqueProduto');
    const pCategoria = document.getElementById('categoriaProduto');

    const preco = parseFloat(pPreco.value);
    const estoque = parseInt(pEstoque.value);
    let id =  idCounter ++;
    
    if(isNaN(estoque)){
        alert("Por favor, digite um número válido");
        pEstoque.focus();
        return;
    }

    if(isNaN(preco)){
        alert("Por favor, digite um número válido");
        pPreco.focus();
        return;
    }

    let info = {id: id, nome: pNome, preco: preco, estoque: estoque, categoria: pCategoria };

    produtos.push(info);

    pNome.value = '';
    pPreco.value = '';
    pEstoque.value = '';
    pCategoria.value = '';

    idCounter++;
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