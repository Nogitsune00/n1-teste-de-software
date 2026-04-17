// Base de dados
let produtos = [];

// variaveis globais
let idCounter = 1000;
const listaProdutos = document.getElementById('produtos');

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

    // adicionar no html um formulario, que vai conter os campos de cadastro de produto, com o id abaixo 
    document.getElementById('FormCadastro').reset();

    listarProdutos();
}

function excluirProduto(id){


}

function editarProduto(id){


}

function listarProdutos(){
    listaProdutos.innerHTML = `<tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ações</th>
        </tr>`;

    if (produtos.length === 0){
        const row = document.createElement('tr');
        row.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
        listaProdutos.appendChild(row);
        return "Não há produtos registrados";
    }

    produtos.forEach((produto) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>Preço: ${produto.preco}</td>
            <td>Estoque: ${produto.estoque}</td>
            <td>${produto.categoria}</td>
            <td class="">
                <button onclick="editarProduto('${produto.id}')">Editar</button>
                <button onclick="excluirProduto('${produto.id}')">Excluir</button>
            </td>
        `;

        listaProdutos.appendChild(row);
    });
}

function buscarProdutoPorId(id){


}

// funções relacionadas ao carrinho de compras




// funções relacionadas ao fechamento do pedido