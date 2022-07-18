class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == "" || this[i] == null) {
                return false
            }
        }
        return true
    }
}
class Bd {
    constructor() {
        let id = localStorage.getItem("id")
        if (id === null) {
            localStorage.setItem("id", 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem("id")
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem("id", id)
    }
    recuperarTodosRegistros() {
        //array despesas
        let despesas = Array()
        let id = localStorage.getItem("id")
        //recupera as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            //existe a possibilidade de haver índices pulados/removidos
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        //ano
        if (despesa.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mês
        if (despesa.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descrição
        if (despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id) 
    }
}

let bd = new Bd()

function registrarDespesas() {
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesas = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesas.validarDados()) {
        bd.gravar(despesas)
        document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso!"
        document.getElementById("modal_titulo_div").className = "modal-header text-success"
        document.getElementById("modal_conteudo").innerHTML = "Despesa foi cadastrada com sucesso"
        document.getElementById("modal_btn").innerHTML = "Voltar"
        document.getElementById("modal_btn").className = "btn btn-success"
        //dialog de sucesso
        $("#modalRegistraDespesas").modal("show")
        //limpar formulário
        ano.value = ""
        mes.value = ""
        dia.value = ""
        tipo.value = ""
        descricao.value = ""
        valor.value = ""
    } else {
        document.getElementById("modal_titulo").innerHTML = "Erro na inclusão do registro"
        document.getElementById("modal_titulo_div").className = "modal-header text-danger"
        document.getElementById("modal_conteudo").innerHTML = "Erro na gravação, verifique se todos os campos foram preenchidos corretamente"
        document.getElementById("modal_btn").innerHTML = "Voltar e corrigir"
        document.getElementById("modal_btn").className = "btn btn-danger"
        //dialog de erro
        $("#modalRegistraDespesas").modal("show")
    }
}

function pesquisarDespesas() {
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesas = new Despesas(ano, mes, dia, tipo, descricao, valor)
    let despesa = bd.pesquisar(despesas)
    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ""
    //percorrer o array despesas
    //percorrer o array despesas
    despesa.forEach(function (d) {
        console.log(d)
        //criando as linhas(tr)
        let linha = listaDespesas.insertRow()
        //criando as colunas(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustar o tipo
        switch (d.tipo) {
            case "1": d.tipo = "Alimentação"
                break
            case "2": d.tipo = "Educação"
                break
            case "3": d.tipo = "Lazer"
                break
            case "4": d.tipo = "Saúde"
                break
            case "5": d.tipo = "Transporte"
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        //botão de exclusão
        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = '<i class = "fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace("id_despesa_", "")
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}