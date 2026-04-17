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
    } else if(estoque <= 0){
        alert("O estoque deve ser um número positivo")
        pEstoque.focus();
        return "Valor inválido";
    }

    if(isNaN(preco)){
        alert("Por favor, digite um número válido");
        pPreco.focus();
        return "Valor inválido";
    } else if(preco <= 0.00){
        alert("O preço deve ser um número positivo")
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
    const index = produtos.findIndex(item => item.id === id);

    if(index === -1){
        return "Produto não encontrado"
    }else{
        if(confirm(`Deseja realmente excluir o produto de id ${id}?`)){
            produtos.splice(index, 1);
            listarProdutos();
        }else{
            return "Operação cancelada"
        }
    }
}

function editarProduto(id){
    const index = produtos.findIndex(item => item.id === id);

    if(index === -1){
        alert("Produto não encontrado");
        return "Produto não encontrado"
    }
    
    document.getElementById("editId").value = produtos[index].id;
    document.getElementById("editNome").value = produtos[index].nome;
    document.getElementById("editPreco").value = produtos[index].preco;
    document.getElementById("editEstoque").value = produtos[index].estoque;
    document.getElementById("editCategoria").value = produtos[index].categoria;
    
    document.getElementById("modalEdicao").style.display = "block";
}

function atualizarProduto(){
    const id = document.getElementById("EditId").value;
    const index = produtos.findIndex(item=> item.id == id);

    if(index === -1){
        alert("Erro ao editar o produto");
        return "Erro ao editar o produto";
    }

    const nome = document.getElementById('editNome');
    const preco = document.getElementById('editPreco');
    const estoque = document.getElementById('editEstoque');
    const categoria = document.getElementById('editCategoria');

    if(isNaN(parseInt(estoque.value))){
        alert("Por favor, digite um número válido");
        estoque.focus();
        return "Valor inválido";
    } else if(parseInt(estoque.value) <= 0){
        alert("O estoque deve ser um número positivo")
        estoque.focus();
        return "Valor inválido";
    }

    if(isNaN(parseFloat(preco.value))){
        alert("Por favor, digite um número válido");
        preco.focus();
        return "Valor inválido";
    } else if(parseFloat(preco.value) <= 0.00){
        alert("O preço deve ser um número positivo")
        preco.focus();
        return "Valor inválido";
    }

    if(nome === '' || categoria === ''){
        return "Dados obrigatórios"
    }

    produtos[index].nome = nome
    produtos[index].preco = preco
    produtos[index].estoque = estoque
    produtos[index].categoria = categoria

    document.getElementById("modalEdicao").style.display = "none";
    listarProdutos();
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