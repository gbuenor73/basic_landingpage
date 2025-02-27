const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Caminho onde a planilha será salva
const filePath = "./cadastro_evento.xlsx";

// Função para salvar os dados na planilha
const salvarExcel = (dados) => {
    let ws = XLSX.utils.json_to_sheet(dados);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participantes");
    XLSX.writeFile(wb, filePath);
};

// Array para armazenar os dados
let dados = [];

// Rota para receber os dados do formulário
app.post('/salvar', upload.none(), (req, res) => {
    const { nome, cpf, email, telefone } = req.body;

    // Adiciona os dados ao array
    dados.push({ Nome: nome, CPF: cpf, Email: email, Telefone: telefone });

    // Salva no arquivo Excel
    salvarExcel(dados);

    res.json({ mensagem: "Dados salvos com sucesso!" });
});

// Rota para servir o index.html ao acessar "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
