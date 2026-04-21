// Base de dados
let produtos = [
  {
    id: 990,
    nome: 'Teclado Mecânico',
    preco: 250.00,
    estoque: 30,
    categoria: 'Periféricos'
  },
  {
    id: 991,
    nome: 'Monitor 24"',
    preco: 900.00,
    estoque: 15,
    categoria: 'Eletrônicos'
  },
  {
    id: 992,
    nome: 'Headset Gamer',
    preco: 180.00,
    estoque: 50,
    categoria: 'Periféricos'
  },
  {
    id: 993,
    nome: 'Placa de Vídeo RTX 3060',
    preco: 2200.00,
    estoque: 8,
    categoria: 'Hardware'
  },
  {
    id: 994,
    nome: 'SSD 1TB',
    preco: 400.00,
    estoque: 25,
    categoria: 'Hardware'
  },
  {
    id: 995,
    nome: 'Mousepad Gamer',
    preco: 40.00,
    estoque: 100,
    categoria: 'Periféricos'
  },
  {
    id: 996,
    nome: 'Notebook i5',
    preco: 3200.00,
    estoque: 10,
    categoria: 'Eletrônicos'
  },
  {
    id: 997,
    nome: 'Memória RAM 16GB',
    preco: 300.00,
    estoque: 40,
    categoria: 'Hardware'
  },
  {
    id: 998,
    nome: 'Webcam Full HD',
    preco: 150.00,
    estoque: 35,
    categoria: 'Periféricos'
  },
  {
    id: 999,
    nome: 'Smartphone Android',
    preco: 1200.00,
    estoque: 20,
    categoria: 'Eletrônicos'
  }
];

// variaveis globais
let idCounter = 1000;
const listaProdutos = document.getElementById('produtos');

// funções relacionadas ao cadastro de produtos

function cadastrarProduto(){
    const pNome = document.getElementById('nome');
    const pPreco = document.getElementById('preco');
    const pEstoque = document.getElementById('estoque');
    const pCategoria = document.getElementById('categoria');

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

    if(pNome.value === '' || pCategoria.value === ''){
        alert("Por favor, preencha o Nome e a Categoria do produto!");
        return "Dados obrigatórios"
    }

    id = idCounter++;

    let info = {id: id, nome: pNome.value, preco: preco, estoque: estoque, categoria: pCategoria.value };

    produtos.push(info);

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
    const id = document.getElementById("editId").value;
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

    produtos[index].nome = nome.value
    produtos[index].preco = parseFloat(preco.value)
    produtos[index].estoque = parseInt(estoque.value)
    produtos[index].categoria = categoria.value

    document.getElementById("modalEdicao").style.display = "none";
    listarProdutos();
}

function listarProdutos(lista = produtos){
    listaProdutos.innerHTML = `<tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ações</th>
        </tr>`;

    if (lista.length === 0){
        const row = document.createElement('tr');
        row.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
        listaProdutos.appendChild(row);
        return "Não há produtos registrados";
    }

    lista.forEach((produto) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco}</td>
            <td>${produto.estoque}</td>
            <td>${produto.categoria}</td>
            <td class=""> 
                <button onclick="editarProduto(${produto.id})" class="sucess">Editar</button>
                <button onclick="excluirProduto(${produto.id})" class="danger">Excluir</button>
            </td>
        `;

        listaProdutos.appendChild(row);
    });
}

function buscarProdutoPorId(id){
    const idBusca = id.toString();

    const resultado = produtos.filter(produto => 
        produto.id.toString() === idBusca
    );

    if(resultado.length === 0){
        listarProdutos([]);
        return "Produto não encontrado";
    }

    listarProdutos(resultado);
    return resultado;
}

function buscar(){
    const valor = document.getElementById("search").value;
    buscarProdutoPorId(valor);
}

// funções relacionadas ao carrinho de compras
let carrinhoDeCompras = [];

function adicionarAoCarrinho() {
    const cIdProduto = document.getElementById('idProdutoCarrinho');
    const cQuantidade = document.getElementById('quantidadeCarrinho');

    const idProduto = parseInt(cIdProduto.value);
    const quantidade = parseInt(cQuantidade.value);

    if (isNaN(idProduto) || isNaN(quantidade)) {
        alert("Por favor, digite números válidos para ID e Quantidade.");
        cIdProduto.focus();
        return "Valor inválido";
    }

    if (quantidade <= 0) {
        alert("A quantidade deve ser um número positivo.");
        cQuantidade.focus();
        return "Quantidade inválida";
    }

    const index = produtos.findIndex(item => item.id === idProduto);

    if (index === -1) {
        alert("Erro: Produto não encontrado no catálogo!");
        return "Produto não encontrado";
    }

    if (produtos[index].estoque <= 0) {
        alert("Erro: Produto sem estoque.");
        return "Sem estoque";
    }

    if (quantidade > produtos[index].estoque) {
        alert("Erro: Quantidade solicitada é maior que o estoque disponível.");
        return "Estoque insuficiente";
    }

    let infoCarrinho = { produto: produtos[index], quantidade: quantidade };
    carrinhoDeCompras.push(infoCarrinho);

    cIdProduto.value = '';
    cQuantidade.value = '';

    alert("Produto adicionado ao carrinho!");
    return "Produto adicionado ao carrinho";
}

function removerDoCarrinho() {
    const cIdRemover = document.getElementById('idRemoverCarrinho');
    const idNumero = parseInt(cIdRemover.value);

    if (isNaN(idNumero)) {
        alert("Por favor, digite o ID do produto que você quer remover.");
        cIdRemover.focus();
        return "ID vazio";
    }

    const index = carrinhoDeCompras.findIndex(item => item.produto.id === idNumero);

    if (index === -1) {
        alert(`Erro: O produto de ID ${idNumero} não está no seu carrinho.`);
        return "Produto não encontrado no carrinho";
    } else {
        if (confirm(`Deseja realmente remover o produto de id ${idNumero} do carrinho?`)) {
            carrinhoDeCompras.splice(index, 1);
            alert("Produto removido com sucesso!");
            cIdRemover.value = '';
            return "Produto removido com sucesso";
        } else {
            return "Operação cancelada";
        }
    }
}

function calcularSubtotal() {
    let subtotal = 0;
    
    for (let item of carrinhoDeCompras) {
        subtotal += (item.produto.preco * item.quantidade);
    }
    
    return subtotal;
}

// funções relacionadas ao fechamento do pedido

function aplicarCupom(valorTotal, cupomDigitado) {
    if (cupomDigitado !== "" && cupomDigitado !== "DESC10") {
        alert("Erro: Cupom inválido.");
        return "Cupom inválido"; 
    }

    if (cupomDigitado === "DESC10") {
        return valorTotal - (valorTotal * 0.10);
    }

    return valorTotal; 
}

function calcularFrete(valorCompra) {
    if (valorCompra >= 200) {
        return 0.00;
    }
    return 35.00; 
}

function fecharPedido() {
    const pNomeCliente = document.getElementById('nomeCliente');
    const pCupom = document.getElementById('cupomDesconto');

    if (carrinhoDeCompras.length === 0) {
        alert("Erro: O carrinho está vazio. Adicione produtos antes de fechar o pedido.");
        return "Carrinho vazio";
    }

    if (pNomeCliente.value === "") {
        alert("Por favor, digite o nome do cliente.");
        pNomeCliente.focus();
        return "Dados obrigatórios";
    }

    let valorSubtotal = calcularSubtotal();
    let retornoCupom = aplicarCupom(valorSubtotal, pCupom.value);
    
    if (retornoCupom === "Cupom inválido") {
        return "Erro no cupom";
    }

    let valorComDesconto = retornoCupom;
    let valorDoFrete = calcularFrete(valorComDesconto);
    let totalFinal = valorComDesconto + valorDoFrete;

    alert(`Pedido fechado com sucesso, ${pNomeCliente.value}!\nSubtotal: R$ ${valorSubtotal.toFixed(2)}\nFrete: R$ ${valorDoFrete.toFixed(2)}\nTotal Pago: R$ ${totalFinal.toFixed(2)}`);

    pNomeCliente.value = '';
    pCupom.value = '';
    carrinhoDeCompras = []; 

    return "Pedido finalizado com sucesso";
}

document.addEventListener("DOMContentLoaded", () => {
    listarProdutos();
});