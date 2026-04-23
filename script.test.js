const fs = require('fs'); // Necessário para ler o conteúdo do script.js
const path = require('path'); 



// Função para criar um elemento DOM simulado e seu comportamento
function createMockElement() {
    return {
        value: '',
        style: { display: 'none' },
        innerHTML: '',
        children: [],
        focus: jest.fn(),
        reset: jest.fn(),
        appendChild(child) {
            this.children.push(child);
            return child;
        }
    };
}

function createMockDocument() {
    const elements = new Map();

    const getElementById = (id) => {
        if (!elements.has(id)) {
            elements.set(id, createMockElement());
        }
        return elements.get(id);
    };

    return {
        getElementById,
        createElement: jest.fn(() => createMockElement()),
        addEventListener: jest.fn(),
        _elements: elements
    };
}

function carregarSistemaTestavel() {
    const scriptPath = path.resolve(__dirname, 'script.js');
    const source = fs.readFileSync(scriptPath, 'utf8');

    const documentMock = createMockDocument();
    const alertMock = jest.fn();
    const confirmMock = jest.fn(() => true);

    const factory = new Function(
        'document',
        'alert',
        'confirm',
        `${source}\nreturn { cadastrarProduto, excluirProduto, editarProduto, atualizarProduto, listarProdutos, buscarProdutoPorId, adicionarAoCarrinho, removerDoCarrinho, calcularSubtotal, aplicarCupom, calcularFrete, fecharPedido };`
    );

    const sistema = factory(documentMock, alertMock, confirmMock);

    return {
        sistema,
        documentMock,
        alertMock,
        confirmMock
    };
}

// Testes para a função adicionarAoCarrinho

describe("Função adicionarAoCarrinho", () => {
    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    });

    test("deve adicionar produto corretamente ao carrinho", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Produto adicionado ao carrinho");
    });

     test("deve retornar erro quando quantidade for menor ou igual a zero", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '0';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Quantidade inválida");
        expect(alertMock).toHaveBeenCalledWith("A quantidade deve ser um número positivo.");
    });

    test("deve retornar erro quando produto não existe", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '9999';
        documentMock.getElementById('quantidadeCarrinho').value = '1';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Produto não encontrado");
        expect(alertMock).toHaveBeenCalledWith("Erro: Produto não encontrado no catálogo!");
    });

     test("deve retornar erro quando quantidade maior que estoque", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '999';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Estoque insuficiente");
        expect(alertMock).toHaveBeenCalledWith("Erro: Quantidade solicitada é maior que o estoque disponível.");
    });
});

// Testes para a função removerDoCarrinho

describe("Função removerDoCarrinho", () => {
    let sistema;
    let documentMock;
    let alertMock;
    let confirmMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
        confirmMock = loaded.confirmMock;
    });

    test("deve remover produto do carrinho com sucesso", () => {
        
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        
        documentMock.getElementById('idRemoverCarrinho').value = '990';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("Produto removido com sucesso");
        expect(confirmMock).toHaveBeenCalled();
    });

    test("deve retornar erro se produto não estiver no carrinho", () => {
        documentMock.getElementById('idRemoverCarrinho').value = '9999';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("Produto não encontrado no carrinho");
        expect(alertMock).toHaveBeenCalled();
    });

    test("deve retornar erro se ID não for informado", () => {
        documentMock.getElementById('idRemoverCarrinho').value = '';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("ID vazio");
        expect(alertMock).toHaveBeenCalledWith("Por favor, digite o ID do produto que você quer remover.");
    });

    test("deve cancelar remoção quando confirm for falso", () => {
        confirmMock.mockReturnValueOnce(false);

        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('idRemoverCarrinho').value = '990';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("Operação cancelada");
    });
});

// Testes para a função calcularSubtotal
describe("Funcao calcularSubtotal", () => {

    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
    });

    test("deve calcular subtotal corretamente com múltiplos produtos", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('idProdutoCarrinho').value = '991';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBeGreaterThan(0);
    });

    test("deve retornar 0 quando carrinho estiver vazio", () => {
        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBe(0);
    });

    test("deve calcular corretamente com um único produto", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990'; // 250
        documentMock.getElementById('quantidadeCarrinho').value = '1';

        sistema.adicionarAoCarrinho();

        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBe(250);
    });

    test("deve considerar múltiplas adições do mesmo produto", () => {
        
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho(); // 250

        
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';
        sistema.adicionarAoCarrinho(); // +500

        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBe(750);
    });


});

// Testes para a função calcularFrete

describe("Funcao calcularFrete", () => {

    let sistema;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        alertMock = loaded.alertMock;
    });

    test("deve preencher campos corretamente para edição de produto", () => {
        documentMock.getElementById('nome').value = 'Produto a Editar';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';

        const resultadoCadastro = sistema.cadastrarProduto();
        expect(resultadoCadastro).toBeUndefined();

        const resultadoEdicao = sistema.editarProduto(1000);
        expect(resultadoEdicao).toBeUndefined();
        expect(documentMock.getElementById('editId').value).toBe(1000);
        expect(documentMock.getElementById('editNome').value).toBe('Produto a Editar');
        expect(documentMock.getElementById('editPreco').value).toBe(50);
        expect(documentMock.getElementById('editEstoque').value).toBe(5);
        expect(documentMock.getElementById('editCategoria').value).toBe('Hardware');
        expect(documentMock.getElementById('modalEdicao').style.display).toBe('block');
    })

    test("deve retornar erro ao tentar editar produto inexistente", () => {
        const resultadoEdicao = sistema.editarProduto(9999);

        expect(resultadoEdicao).toBe('Produto não encontrado');
        expect(alertMock).toHaveBeenCalledWith('Produto não encontrado');
    })

    test("deve retornar erro quando o preco for invalido", () => {
        documentMock.getElementById('nome').value = 'Produto a Editar';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';

        const resultadoCadastro = sistema.cadastrarProduto();
        expect(resultadoCadastro).toBeUndefined();

        const resultadoEdicao = sistema.editarProduto(1000);
        expect(resultadoEdicao).toBeUndefined();

        documentMock.getElementById('editPreco').value = '-10';
        const resultadoAtualizacao = sistema.atualizarProduto();

        expect(resultadoAtualizacao).toBe('Valor inválido');

    })

    test("deve retornar erro quando o estoque for invalido", () => {
        documentMock.getElementById('nome').value = 'Produto a Editar';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';

        const resultadoCadastro = sistema.cadastrarProduto();
        expect(resultadoCadastro).toBeUndefined();

        const resultadoEdicao = sistema.editarProduto(1000);
        expect(resultadoEdicao).toBeUndefined();

        documentMock.getElementById('editEstoque').value = 'abc';
        const resultadoAtualizacao = sistema.atualizarProduto();
        expect(resultadoAtualizacao).toBe('Valor inválido');

    })

})

describe("Funcao listarProdutos", () => {

    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    });

    test("deve listar produtos corretamente", () => {
        documentMock.getElementById('nome').value = 'Produto 1';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';
        sistema.cadastrarProduto();

    })

    test("deve retornar mensagem quando nao houver produtos cadastrados", () => {
        for (let id = 990; id <= 999; id++) {
            sistema.excluirProduto(id);
        }

        const resultado = sistema.listarProdutos();
        expect(resultado).toBe('Não há produtos registrados');
        expect(alertMock).not.toHaveBeenCalled();
    })

    test("deve retornar lista de produtos cadastrados", () => {
        documentMock.getElementById('nome').value = 'Produto 1';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';
        const resultado = sistema.cadastrarProduto();

        expect(resultado).toBeUndefined();
        expect(documentMock.getElementById('produtos').children).toHaveLength(11);

    })

    test("deve retornar mensagem quando o produto for excluido", () => {
        documentMock.getElementById('nome').value = 'Produto a Excluir';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';
        sistema.cadastrarProduto();

        const resultadoExclusao = sistema.excluirProduto(1000);
        const resultadoBusca = sistema.buscarProdutoPorId(1000);

        expect(resultadoExclusao).toBeUndefined();
        expect(resultadoBusca).toBe('Produto não encontrado');
        expect(alertMock).toHaveBeenCalledWith('Erro: Produto não encontrado no catálogo!');
    })
})

describe("Funcao buscarProdutoPorId", () => {

    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    });

    test("deve retornar produto por ID corretamente", () => {
        documentMock.getElementById('nome').value = 'Produto 1';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';
        sistema.cadastrarProduto();

        const resultado = sistema.buscarProdutoPorId(1000);

        expect(resultado).toBeInstanceOf(Array);
        expect(resultado).toHaveLength(1);
        expect(resultado[0]).toEqual(
            expect.objectContaining({
                id: 1000,
                nome: 'Produto 1',
                preco: 50,
                estoque: 5,
                categoria: 'Hardware'
            })
        )
    })

    test("deve retornar mensagem quando produto nao for encontrado", () => {
        const resultado = sistema.buscarProdutoPorId(9999);
        expect(resultado).toBe('Produto não encontrado');
    })

    test("deve retornar mensagem quando ID do produto for invalido", () => {
        const resultado = sistema.buscarProdutoPorId(-1);
        expect(resultado).toBe('Produto não encontrado');
    })

    test("deve retornar mensagem quando ID do produto for nao numerico", () => {
        const resultado = sistema.buscarProdutoPorId('abc');
        expect(resultado).toBe('Produto não encontrado');
    })
})

// Carrinho de Compras

describe("Função adicionarAoCarrinho", () => {
    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    });

    test("deve adicionar produto corretamente ao carrinho", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Produto adicionado ao carrinho");
    });

    test("deve retornar erro quando quantidade for menor ou igual a zero", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '0';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Quantidade inválida");
        expect(alertMock).toHaveBeenCalledWith("A quantidade deve ser um número positivo.");
    });

    test("deve retornar erro quando produto não existe", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '9999';
        documentMock.getElementById('quantidadeCarrinho').value = '1';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Produto não encontrado");
        expect(alertMock).toHaveBeenCalledWith("Erro: Produto não encontrado no catálogo!");
    });

    test("deve retornar erro quando quantidade maior que estoque", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '999';

        const resultado = sistema.adicionarAoCarrinho();

        expect(resultado).toBe("Estoque insuficiente");
        expect(alertMock).toHaveBeenCalledWith("Erro: Quantidade solicitada é maior que o estoque disponível.");
    });
});

describe("Função removerDoCarrinho", () => {
    let sistema;
    let documentMock;
    let alertMock;
    let confirmMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
        confirmMock = loaded.confirmMock;
    });

    test("deve remover produto do carrinho com sucesso", () => {

        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();


        documentMock.getElementById('idRemoverCarrinho').value = '990';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("Produto removido com sucesso");
        expect(confirmMock).toHaveBeenCalled();
    });

    test("deve retornar erro se produto não estiver no carrinho", () => {
        documentMock.getElementById('idRemoverCarrinho').value = '9999';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("Produto não encontrado no carrinho");
        expect(alertMock).toHaveBeenCalled();
    });

    test("deve retornar erro se ID não for informado", () => {
        documentMock.getElementById('idRemoverCarrinho').value = '';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("ID vazio");
        expect(alertMock).toHaveBeenCalledWith("Por favor, digite o ID do produto que você quer remover.");
    });

    test("deve cancelar remoção quando confirm for falso", () => {
        confirmMock.mockReturnValueOnce(false);

        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('idRemoverCarrinho').value = '990';

        const resultado = sistema.removerDoCarrinho();

        expect(resultado).toBe("Operação cancelada");
    });
});

describe("Funcao calcularSubtotal", () => {

    let sistema;
    let documentMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
    });

    test("deve calcular subtotal corretamente com múltiplos produtos", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('idProdutoCarrinho').value = '991';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBeGreaterThan(0);
    });

    test("deve retornar 0 quando carrinho estiver vazio", () => {
        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBe(0);
    });

    test("deve calcular corretamente com um único produto", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990'; // 250
        documentMock.getElementById('quantidadeCarrinho').value = '1';

        sistema.adicionarAoCarrinho();

        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBe(250);
    });

    test("deve considerar múltiplas adições do mesmo produto", () => {

        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho(); // 250


        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';
        sistema.adicionarAoCarrinho(); // +500

        const resultado = sistema.calcularSubtotal();

        expect(resultado).toBe(750);
    });


});

// Fechamento de pedido

describe("Funcao aplicarCupom", () => {

    let sistema;
    let documentMock;
    let alertMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    })

    test("deve aplicar frete grátis para compras acima de 200", () => {
        
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = '';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe("Pedido finalizado com sucesso");

        
        expect(alertMock).toHaveBeenCalled();
        const mensagem = alertMock.mock.calls.at(-1)[0];

        expect(mensagem).toContain("Frete: R$ 0.00");
    });

    test("deve cobrar frete para compras abaixo de 200", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '995';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = '';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe("Pedido finalizado com sucesso");

        const mensagem = alertMock.mock.calls.at(-1)[0];

        expect(mensagem).toContain("Frete: R$ 35.00");
    });

    test("deve finalizar pedido com sucesso, com cupom válido", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = 'DESC10';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe('Cupom inválido');
        expect(alertMock).toHaveBeenCalledWith('Erro: Cupom inválido.');
    })

    test("deve retornar valor original quando cupom for vazio", () => {
        const resultado = sistema.aplicarCupom(200, '');
        expect(resultado).toBe(200);
        expect(alertMock).not.toHaveBeenCalled();
    })

})

describe("Funcao calcularFrete", () => {

    let sistema;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        alertMock = loaded.alertMock;
    });

    test("deve retornar frete grátis para compras acima de 200", () => {
        const resultado = sistema.calcularFrete(250);

        expect(resultado).toBe(0);
    });

    test("deve retornar frete padrão para compras abaixo de 200", () => {
        const resultado = sistema.calcularFrete(100);

        expect(resultado).toBe(35);
    });

    test("deve retornar frete padrão exatamente em 199.99", () => {
        const resultado = sistema.calcularFrete(199.99);
        expect(resultado).toBe(35);
    });

    test("deve retornar frete grátis exatamente em 200", () => {
        const resultado = sistema.calcularFrete(200);
        expect(resultado).toBe(0);
    });


});

describe("Funcao fecharPedido", () => {

    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    });

    test("deve aplicar frete grátis para compras acima de 200", () => {

        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = '';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe("Pedido finalizado com sucesso");


        expect(alertMock).toHaveBeenCalled();
        const mensagem = alertMock.mock.calls.at(-1)[0];

        expect(mensagem).toContain("Frete: R$ 0.00");
    });

    test("deve cobrar frete para compras abaixo de 200", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '995';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = '';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe("Pedido finalizado com sucesso");

        const mensagem = alertMock.mock.calls.at(-1)[0];

        expect(mensagem).toContain("Frete: R$ 35.00");
    });

    test("deve finalizar pedido com sucesso, com cupom válido", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '2';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = 'DESC10';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe("Pedido finalizado com sucesso");
    });

    test("deve retornar erro quando cupom for inválido", () => {
        documentMock.getElementById('idProdutoCarrinho').value = '990';
        documentMock.getElementById('quantidadeCarrinho').value = '1';
        sistema.adicionarAoCarrinho();

        documentMock.getElementById('nomeCliente').value = 'Ana';
        documentMock.getElementById('cupomDesconto').value = 'INVALIDO';

        const resultado = sistema.fecharPedido();

        expect(resultado).toBe("Erro no cupom");
    });

});


