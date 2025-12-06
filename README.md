# Dashboard de Vendas iTech Apple Store - Guia de Uso

## 📊 Visão Geral

O Dashboard de Vendas iTech Apple Store é uma ferramenta interativa que permite acompanhar em tempo real as métricas de vendas da loja, com suporte para atualização automática via Google Sheets.

## 🚀 Como Usar

### 1. Acessar o Dashboard

O dashboard está disponível em: **[URL DO DASHBOARD]**

### 2. Conectar ao Google Sheets (Opcional)

Para atualizar os dados automaticamente através de uma planilha Google Sheets:

#### Passo 1: Preparar a Planilha Google Sheets

1. Crie uma planilha no Google Sheets com a estrutura de dados de vendas
2. **Importante**: A primeira linha deve ser um título (será pulada)
3. A segunda linha deve conter os nomes das colunas:
   - `Data` - Data da venda
   - `Produto` - Nome do produto
   - `Valor pago` - Valor da transação
   - `Origem` - Canal de aquisição (Cliente, Tráfego Pago, Indicação, etc.)
   - `Vendedor` - Nome do vendedor
   - Outras colunas conforme necessário

#### Passo 2: Obter o ID da Planilha

1. Abra sua planilha no Google Sheets
2. Copie o ID da URL:
   ```
   https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
   ```
3. O ID é a sequência de caracteres entre `/d/` e `/edit`

#### Passo 3: Conectar no Dashboard

1. No dashboard, clique no botão de **engrenagem** (⚙️) no header
2. Cole o ID da planilha no campo "Cole o ID aqui"
3. Clique em **"Conectar"**
4. O status mudará para **"✓ Conectado ao Google Sheets"** (em verde)

#### Passo 4: Atualizar Dados

1. Após conectar, o botão **"Atualizar"** ficará ativo
2. Clique em **"Atualizar"** para sincronizar os dados da planilha com o dashboard
3. O dashboard será recarregado com os novos dados
4. A data/hora da última atualização será exibida

### 3. Explorar as Abas

O dashboard possui 5 abas principais:

#### **Visão Geral**
- KPIs gerais (Receita Total, Total de Vendas, Ticket Médio)
- Métricas separadas por Produtos Apple e Acessórios
- Gráficos de receita por origem e produtos mais vendidos
- Seletor de mês para análise específica

#### **Análise de Origem**
- Distribuição de receita por canal de aquisição
- Canais: Cliente, Tráfego Pago, Indicação, Amigos, Google, Instagram, Outros
- Métricas por origem (receita geral, Apple e acessórios)

#### **Análise de Produtos**
- Receita detalhada por categoria de produto
- Produtos: iPhone, MacBook, iPad, Apple Watch, AirPods, Pencil, Apple Vision, Acessórios
- Tabela com receita e quantidade de vendas

#### **Desempenho da Equipe**
- Métricas individuais de cada vendedor
- Receita total, Apple e acessórios por vendedor
- Comparação de desempenho

#### **Dados Anuais**
- Comparação mês a mês de todo o período
- Gráficos de evolução de receita
- Tabelas comparativas de todos os meses

## 💰 Formato de Moeda

Todos os valores são exibidos em **Real Brasileiro (R$)** com o formato:
- **Separador de milhar**: Ponto (.)
- **Separador decimal**: Vírgula (,)

Exemplo: R$ 1.234.567,89

## 📈 Métricas Principais

### Receita Total (Geral)
Soma de todas as transações (produtos Apple + acessórios)

### Total de Vendas
Número total de transações registradas

### Ticket Médio
Valor médio por transação (Receita Total ÷ Total de Vendas)

### Produtos Apple
Receita e vendas apenas de produtos Apple (iPhone, MacBook, iPad, Apple Watch, AirPods, Pencil, Apple Vision)

### Acessórios
Receita e vendas apenas de acessórios complementares

## 🔄 Atualização de Dados

### Método 1: Atualização Manual
1. Clique no botão **"Atualizar"** no header
2. Os dados serão sincronizados imediatamente
3. O dashboard será recarregado

### Método 2: Atualização Automática Periódica
1. Configure o intervalo desejado (padrão: 5 minutos)
2. O sistema verificará automaticamente se há mudanças na planilha
3. Se detectar mudanças, atualizará o dashboard automaticamente

## ⚙️ Configurações

### Desconectar do Google Sheets
1. Clique no botão de engrenagem (⚙️)
2. Clique em **"Desconectar"**
3. O status voltará para "Desconectado"
4. Os dados locais serão mantidos

### Mudar de Planilha
1. Clique no botão de engrenagem (⚙️)
2. Limpe o campo de ID e cole um novo ID
3. Clique em **"Conectar"**

## 🗓️ Seletor de Mês

Na aba "Visão Geral", você pode selecionar um mês específico para análise:
- Todos os dados são filtrados para o mês selecionado
- As métricas e gráficos são atualizados automaticamente
- Disponível para: Janeiro 2024 a Novembro 2025

## 📱 Responsividade

O dashboard é responsivo e funciona em:
- Computadores desktop
- Tablets
- Smartphones

## 🔒 Privacidade e Segurança

- Os dados são armazenados localmente no navegador (localStorage)
- O ID da planilha é salvo apenas no navegador do usuário
- Nenhum dado é enviado para servidores externos
- A planilha Google Sheets deve ter permissões de acesso público para leitura

## ⚠️ Troubleshooting

### "Erro: Não foi possível acessar a planilha"
- Verifique se o ID da planilha está correto
- Certifique-se de que a planilha está com acesso público (qualquer pessoa com o link pode visualizar)
- Verifique a conexão com a internet

### Dados não aparecem após atualizar
- Verifique se a estrutura da planilha está correta
- Certifique-se de que há dados após a segunda linha (primeira é título, segunda é header)
- Recarregue a página manualmente (F5)

### Botão "Atualizar" está desabilitado
- Verifique se está conectado ao Google Sheets (status deve ser verde)
- Tente conectar novamente

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o suporte técnico.

---

**Versão**: 1.0  
**Data**: Dezembro 2025  
**Desenvolvido para**: iTech Apple Store
