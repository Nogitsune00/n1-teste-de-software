const fs = require('fs'); // Necessário para ler o conteúdo do script.js
const path = require('path'); // Necessário para resolver o caminho do script.js

// Função para criar um elemento DOM simulado
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

// Função para criar um documento simulado
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

// Mock para o ambiente de teste
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
        `${source}\nreturn { cadastrarProduto, excluirProduto, editarProduto, atualizarProduto, listarProdutos, buscarProdutoPorId };`
    );

    const sistema = factory(documentMock, alertMock, confirmMock);

    return {
        sistema,
        documentMock,
        alertMock,
        confirmMock
    };
}

// Cadastro de produtos

describe('Funcao cadastrarProduto', () => {
    let sistema;
    let documentMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        alertMock = loaded.alertMock;
    });

    test('deve retornar dados obrigatorios quando nome nao for informado', () => {
        documentMock.getElementById('nome').value = '';
        documentMock.getElementById('preco').value = '120';
        documentMock.getElementById('estoque').value = '3';
        documentMock.getElementById('categoria').value = 'Perifericos';

        const resultado = sistema.cadastrarProduto();

        expect(resultado).toBe('Dados obrigatórios');
        expect(alertMock).toHaveBeenCalledWith('Por favor, preencha o Nome e a Categoria do produto!');
    });

    test('deve retornar valor invalido quando estoque for invalido', () => {
        documentMock.getElementById('nome').value = 'Produto Teste';
        documentMock.getElementById('preco').value = '120';
        documentMock.getElementById('estoque').value = 'abc';
        documentMock.getElementById('categoria').value = 'Perifericos';

        const resultado = sistema.cadastrarProduto();

        expect(resultado).toBe('Valor inválido');
        expect(documentMock.getElementById('estoque').focus).toHaveBeenCalledTimes(1);
    });

    test('deve retornar valor invalido quando preco for negativo', () => {
        documentMock.getElementById('nome').value = 'Produto Teste';
        documentMock.getElementById('preco').value = '-10';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Perifericos';

        const resultado = sistema.cadastrarProduto();

        expect(resultado).toBe('Valor inválido');
        expect(alertMock).toHaveBeenCalledWith('O preço deve ser um número positivo');
    });

    test('deve cadastrar produto corretamente validando array e objeto', () => {
        documentMock.getElementById('nome').value = 'Novo Produto';
        documentMock.getElementById('preco').value = '100';
        documentMock.getElementById('estoque').value = '10';
        documentMock.getElementById('categoria').value = 'Hardware';

        const resultado = sistema.cadastrarProduto();
        const encontrado = sistema.buscarProdutoPorId(1000);

        expect(resultado).toBeUndefined();
        expect(encontrado).toBeInstanceOf(Array);
        expect(encontrado).toHaveLength(1);
        expect(encontrado[0]).toEqual(
            expect.objectContaining({
                id: 1000,
                nome: 'Novo Produto',
                preco: 100,
                estoque: 10,
                categoria: 'Hardware'
            })
        );
    });
});

describe("Funcao excluirProduto", () => {

    let sistema;
    let documentMock;
    let confirmMock;
    let alertMock;

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
        confirmMock = loaded.confirmMock;
        alertMock = loaded.alertMock;
    });

    test("deve excluir produto corretamente validando array e objeto", () => {
        documentMock.getElementById('nome').value = 'Produto a Excluir';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';

        const resultadoCadastro = sistema.cadastrarProduto();
        expect(resultadoCadastro).toBeUndefined();

        confirmMock.mockReturnValueOnce(true);
        const resultadoExclusao = sistema.excluirProduto(1000);

        expect(resultadoExclusao).toBeUndefined();
        expect(confirmMock).toHaveBeenCalledWith('Deseja realmente excluir o produto de id 1000?');
        expect(sistema.buscarProdutoPorId(1000)).toBe('Produto não encontrado');
        expect(alertMock).toHaveBeenCalledWith('Erro: Produto não encontrado no catálogo!');
    })

    test("deve cancelar exclusao quando confirmacao for negativa", () => {
        documentMock.getElementById('nome').value = 'Produto a Excluir';
        documentMock.getElementById('preco').value = '50';
        documentMock.getElementById('estoque').value = '5';
        documentMock.getElementById('categoria').value = 'Hardware';

        const resultadoCadastro = sistema.cadastrarProduto();
        expect(resultadoCadastro).toBeUndefined();

        confirmMock.mockReturnValueOnce(false);
        const resultadoExclusao = sistema.excluirProduto(1000);

        expect(resultadoExclusao).toBe('Operação cancelada');
        expect(confirmMock).toHaveBeenCalledWith('Deseja realmente excluir o produto de id 1000?');
        expect(sistema.buscarProdutoPorId(1000)).not.toBe('Produto não encontrado');
        expect(alertMock).not.toHaveBeenCalledWith('Erro: Produto não encontrado no catálogo!');
    })

    test("deve retornar erro ao tentar excluir produto inexistente", () => {
        confirmMock.mockReturnValueOnce(true);
        const resultadoExclusao = sistema.excluirProduto(9999);

        expect(resultadoExclusao).toBe('Produto não encontrado');
        expect(confirmMock).not.toHaveBeenCalled();
    })

    test("deve retornar erro quando o ID do produto for inválido", () => {
        const resultadoExclusao = sistema.excluirProduto(-1);
        expect(resultadoExclusao).toBe('Produto não encontrado');
    })
})

describe("Funcao editarProduto", () => {

    let sistema;
    let documentMock;
    let alertMock; 

    beforeEach(() => {
        const loaded = carregarSistemaTestavel();
        sistema = loaded.sistema;
        documentMock = loaded.documentMock;
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

    test("deve retornar erro quando o preco for invalido" , () => {
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

    test("deve retornar erro quando o estoque for invalido" , () => {
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

    


