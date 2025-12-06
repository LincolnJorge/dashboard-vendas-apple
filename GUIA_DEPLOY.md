# Guia de Deploy - Dashboard de Vendas iTech Apple Store

Este guia explica como fazer o deploy do dashboard no seu domínio menesesiphones.com/dashboard usando GitHub e Vercel.

## Pré-requisitos

- Conta GitHub (você já tem: LincolnJorge)
- Conta Vercel (gratuita)
- Acesso ao seu domínio menesesiphones.com

## Passo 1: Criar Repositório no GitHub

### 1.1 Acessar GitHub

1. Vá para https://github.com
2. Faça login com sua conta (LincolnJorge)
3. Clique no ícone "+" no canto superior direito
4. Selecione "New repository"

### 1.2 Configurar Repositório

1. **Repository name**: `dashboard-vendas-apple`
2. **Description**: Dashboard de Vendas - iTech Apple Store
3. **Visibility**: Public (para que Vercel possa acessar)
4. **Initialize this repository with**:
   - Marque "Add a README file"
   - Marque "Add .gitignore" e selecione "Node"
5. Clique em "Create repository"

### 1.3 Clonar Repositório Localmente

```bash
git clone https://github.com/LincolnJorge/dashboard-vendas-apple.git
cd dashboard-vendas-apple
```

## Passo 2: Adicionar Arquivos do Dashboard

### 2.1 Copiar Arquivos

Copie todos os arquivos do dashboard para a pasta do repositório:

```bash
# Copiar arquivos do projeto React
cp -r /home/ubuntu/dashboard-vendas-apple/src .
cp -r /home/ubuntu/dashboard-vendas-apple/public .
cp /home/ubuntu/dashboard-vendas-apple/package.json .
cp /home/ubuntu/dashboard-vendas-apple/.gitignore .
cp /home/ubuntu/dashboard-vendas-apple/vercel.json .
```

### 2.2 Atualizar package.json

Abra o arquivo `package.json` e certifique-se de que contém:

```json
{
  "name": "dashboard-vendas-apple",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://menesesiphones.com/dashboard",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.10.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### 2.3 Fazer Commit e Push

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Adicionar dashboard de vendas"

# Fazer push para GitHub
git push origin main
```

## Passo 3: Conectar ao Vercel

### 3.1 Acessar Vercel

1. Vá para https://vercel.com
2. Clique em "Sign Up"
3. Selecione "Continue with GitHub"
4. Autorize Vercel a acessar sua conta GitHub

### 3.2 Importar Projeto

1. Após fazer login, clique em "Add New..." > "Project"
2. Procure por "dashboard-vendas-apple"
3. Clique em "Import"

### 3.3 Configurar Projeto

1. **Framework Preset**: Selecione "Create React App"
2. **Root Directory**: Deixe em branco (ou ".")
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. Clique em "Deploy"

Vercel começará a fazer o build. Aguarde alguns minutos até que termine.

## Passo 4: Configurar Domínio Customizado

### 4.1 No Vercel

1. Vá para o projeto no Vercel
2. Clique em "Settings"
3. Selecione "Domains"
4. Clique em "Add"
5. Digite: `menesesiphones.com`

### 4.2 Configurar DNS no seu Provedor

Vercel fornecerá instruções de DNS. Você precisa adicionar um registro CNAME:

**Exemplo de configuração:**

- **Type**: CNAME
- **Name**: dashboard
- **Value**: cname.vercel-dns.com (ou o valor fornecido pelo Vercel)

**Onde adicionar:**

1. Acesse o painel de controle do seu provedor de domínio
2. Procure por "DNS" ou "Gerenciar DNS"
3. Adicione o registro CNAME conforme instruções do Vercel
4. Aguarde 24-48 horas para a propagação do DNS

### 4.3 Verificar Configuração

1. Após a propagação do DNS, acesse: https://menesesiphones.com/dashboard
2. O dashboard deve estar disponível

## Passo 5: Atualizar Dados

### 5.1 Atualizar Dados Localmente

Quando tiver novos dados de vendas:

1. Atualize o arquivo `src/assets/dados_vendas.json` com os novos dados
2. Faça commit e push:

```bash
git add src/assets/dados_vendas.json
git commit -m "Atualizar dados de vendas"
git push origin main
```

3. Vercel fará deploy automático em poucos minutos

### 5.2 Usar Google Sheets (Recomendado)

Ou use a integração Google Sheets:

1. Crie uma planilha no Google Sheets
2. No dashboard, clique em "Configurar" (⚙️)
3. Cole o ID da planilha
4. Clique em "Conectar"
5. Use o botão "Atualizar" para sincronizar dados

## Troubleshooting

### Erro: "Build failed"

- Verifique se todos os arquivos foram copiados
- Certifique-se de que `package.json` está correto
- Verifique se não há erros de sintaxe em `src/App.js`

### Domínio não funciona

- Verifique se o registro DNS foi adicionado corretamente
- Aguarde 24-48 horas para propagação
- Verifique no Vercel se o domínio está configurado

### Dashboard vazio ou com erro

- Verifique se `src/assets/dados_vendas.json` existe
- Verifique se os dados estão em formato JSON válido
- Abra o console do navegador (F12) para ver erros

## Próximos Passos

1. Teste o dashboard em: https://menesesiphones.com/dashboard
2. Configure a integração Google Sheets (opcional)
3. Compartilhe o link com sua equipe

## Suporte

Para dúvidas sobre Vercel: https://vercel.com/docs
Para dúvidas sobre o dashboard: Consulte `GUIA_USO_DASHBOARD.md`

---

**Versão**: 1.0
**Data**: Dezembro 2025
