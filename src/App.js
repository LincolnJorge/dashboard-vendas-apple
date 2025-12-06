import React, { useState, useEffect } from 'react';
import './App.css';
import './GoogleSheetsSimple.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import GoogleSheetsSimple from './GoogleSheetsSimple';

// Importar dados iniciais
import initialData from './assets/dados_vendas.json';
import annualData from './assets/dados_anuais.json';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function KPICard({ title, value, icon: Icon, description }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        <Icon className="kpi-icon" />
      </div>
      <div className="kpi-content">
        <div className="kpi-value">{value}</div>
        <p className="kpi-description">{description}</p>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [allMonthsData] = useState(initialData);

  useEffect(() => {
    if (allMonthsData && Object.keys(allMonthsData).length > 0) {
      const months = Object.keys(allMonthsData).sort().reverse();
      const latestMonth = months[0];
      setSelectedMonth(latestMonth);
      setCurrentMonthData(allMonthsData[latestMonth]);
    }
  }, [allMonthsData]);

  useEffect(() => {
    if (selectedMonth && allMonthsData[selectedMonth]) {
      setCurrentMonthData(allMonthsData[selectedMonth]);
    }
  }, [selectedMonth, allMonthsData]);

  const getMonthName = (monthKey) => {
    const [year, monthNum] = monthKey.split('-');
    const date = new Date(year, monthNum - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  if (!currentMonthData || !currentMonthData.kpis_geral) {
    return <div className="loading">Carregando dados...</div>;
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <h1 className="main-title">Dashboard de Vendas - iTech Apple Store</h1>
            <p className="subtitle">
              {activeTab === 'dados-anuais' 
                ? 'Análise anual comparativa (Jan 2024 - Nov 2025)' 
                : `Análise completa das vendas de ${getMonthName(selectedMonth)}`}
            </p>
            <GoogleSheetsSimple />
          </div>
          <div className="header-controls">
            {activeTab !== 'dados-anuais' && (
              <div className="month-selector">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  {Object.keys(allMonthsData).sort().reverse().map(monthKey => (
                    <option key={monthKey} value={monthKey}>
                      {getMonthName(monthKey)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="tabs">
          <div className="tab-list">
            <button 
              className={`tab ${activeTab === 'visao-geral' ? 'active' : ''}`}
              onClick={() => setActiveTab('visao-geral')}
            >
              Visão Geral
            </button>
            <button 
              className={`tab ${activeTab === 'origem' ? 'active' : ''}`}
              onClick={() => setActiveTab('origem')}
            >
              Análise de Origem
            </button>
            <button 
              className={`tab ${activeTab === 'produtos' ? 'active' : ''}`}
              onClick={() => setActiveTab('produtos')}
            >
              Análise de Produtos
            </button>
            <button 
              className={`tab ${activeTab === 'equipe' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipe')}
            >
              Desempenho da Equipe
            </button>
            <button 
              className={`tab ${activeTab === 'dados-anuais' ? 'active' : ''}`}
              onClick={() => setActiveTab('dados-anuais')}
            >
              Dados Anuais
            </button>
          </div>

          {activeTab === 'visao-geral' && (
            <div className="tab-content">
              {/* KPIs Gerais */}
              <div className="kpi-section">
                <h3 className="section-title">KPIs Gerais</h3>
                <div className="kpi-grid">
                  <KPICard
                    title="Receita Total (Geral)"
                    value={formatCurrency(currentMonthData.kpis_geral.receita_total)}
                    icon={DollarSign}
                    description="Total de vendas (produtos + acessórios)"
                  />
                  <KPICard
                    title="Total de Vendas (Geral)"
                    value={currentMonthData.kpis_geral.total_vendas}
                    icon={ShoppingCart}
                    description="Todas as transações (produtos + acessórios)"
                  />
                  <KPICard
                    title="Ticket Médio (Geral)"
                    value={formatCurrency(currentMonthData.kpis_geral.ticket_medio)}
                    icon={TrendingUp}
                    description="Por transação (geral)"
                  />
                </div>
              </div>

              {/* KPIs Produtos Apple */}
              <div className="kpi-section">
                <h3 className="section-title">Produtos Apple</h3>
                <div className="kpi-grid">
                  <KPICard
                    title="Receita Produtos Apple"
                    value={formatCurrency(currentMonthData.kpis_apple.receita_total)}
                    icon={DollarSign}
                    description="Apenas produtos Apple"
                  />
                  <KPICard
                    title="Total de Vendas (Produtos Apple)"
                    value={currentMonthData.kpis_apple.total_vendas}
                    icon={ShoppingCart}
                    description="Vendas de itens Apple (sem acessórios)"
                  />
                  <KPICard
                    title="Ticket Médio Produtos Apple"
                    value={formatCurrency(currentMonthData.kpis_apple.ticket_medio)}
                    icon={TrendingUp}
                    description="Apenas produtos Apple"
                  />
                </div>
              </div>

              {/* KPIs Acessórios */}
              <div className="kpi-section">
                <h3 className="section-title">Acessórios</h3>
                <div className="kpi-grid">
                  <KPICard
                    title="Receita Acessórios"
                    value={formatCurrency(currentMonthData.kpis_acessorios.receita_total)}
                    icon={DollarSign}
                    description="Apenas acessórios"
                  />
                  <KPICard
                    title="Vendas Acessórios"
                    value={currentMonthData.kpis_acessorios.total_vendas}
                    icon={ShoppingCart}
                    description="Apenas acessórios"
                  />
                  <KPICard
                    title="Ticket Médio Acessórios"
                    value={formatCurrency(currentMonthData.kpis_acessorios.ticket_medio)}
                    icon={TrendingUp}
                    description="Apenas acessórios"
                  />
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Receita por Origem</h3>
                  <p>Distribuição da receita por canal de aquisição</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={currentMonthData.vendas_por_origem}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ Origem, receita_total }) => `${Origem}: ${formatCurrency(receita_total)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="receita_total"
                      >
                        {currentMonthData.vendas_por_origem.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Produtos Mais Vendidos</h3>
                  <p>Receita por categoria de produto</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={currentMonthData.produtos_mais_vendidos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Produtos" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receita_total" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'origem' && (
            <div className="tab-content">
              <div className="charts-grid">
                <div className="chart-card full-width">
                  <h3>Receita por Origem (Geral vs. Produtos Apple)</h3>
                  <p>Comparativo da receita total e receita de produtos Apple por canal</p>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={currentMonthData.vendas_por_origem}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Origem" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receita_total" fill="#8884d8" name="Receita Total" />
                      <Bar dataKey="receita_total_apple" fill="#00C49F" name="Receita Produtos Apple" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="kpi-section">
                <h3 className="section-title">Detalhes por Origem</h3>
                <div className="origem-details">
                  {currentMonthData.vendas_por_origem.map((origem, index) => (
                    <div key={index} className="origem-card">
                      <h4>{origem.Origem}</h4>
                      <div className="origem-kpis">
                        <div className="kpi-item">
                          <p>Receita Total:</p>
                          <span>{formatCurrency(origem.receita_total)}</span>
                        </div>
                        <div className="kpi-item">
                          <p>Vendas Totais:</p>
                          <span>{origem.total_vendas}</span>
                        </div>
                        <div className="kpi-item apple-kpi">
                          <p>Receita Apple:</p>
                          <span>{formatCurrency(origem.receita_total_apple)}</span>
                        </div>
                        <div className="kpi-item apple-kpi">
                          <p>Vendas Apple:</p>
                          <span>{origem.total_vendas_apple}</span>
                        </div>
                        <div className="kpi-item apple-kpi">
                          <p>Ticket Médio Apple:</p>
                          <span>{formatCurrency(origem.ticket_medio_apple)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'produtos' && (
            <div className="tab-content">
              <div className="charts-grid">
                <div className="chart-card full-width">
                  <h3>Receita por Produto</h3>
                  <p>Receita detalhada por modelo de produto</p>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={currentMonthData.produtos_mais_vendidos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Produtos" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receita_total" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="kpi-section">
                <h3 className="section-title">Tabela de Produtos</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Receita Total</th>
                        <th>Total de Vendas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMonthData.produtos_mais_vendidos.map((produto, index) => (
                        <tr key={index}>
                          <td>{produto.Produtos}</td>
                          <td>{formatCurrency(produto.receita_total)}</td>
                          <td>{produto.total_vendas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'equipe' && (
            <div className="tab-content">
              <div className="charts-grid">
                <div className="chart-card full-width">
                  <h3>Receita por Atendente (Geral vs. Produtos Apple)</h3>
                  <p>Comparativo da receita total e receita de produtos Apple por atendente</p>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={currentMonthData.desempenho_atendentes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Atendente" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receita_total" fill="#8884d8" name="Receita Total" />
                      <Bar dataKey="receita_total_apple" fill="#00C49F" name="Receita Produtos Apple" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="kpi-section">
                <h3 className="section-title">Detalhes por Atendente</h3>
                <div className="atendentes-grid">
                  {currentMonthData.desempenho_atendentes.map((atendente, index) => (
                    <div key={index} className="atendente-card">
                      <h4>{atendente.Atendente}</h4>
                      
                      <div className="atendente-section">
                        <h5>Geral</h5>
                        <div className="atendente-kpis">
                          <div className="kpi-item">
                            <p>Receita Total:</p>
                            <span>{formatCurrency(atendente.receita_total)}</span>
                          </div>
                          <div className="kpi-item">
                            <p>Vendas Totais:</p>
                            <span>{atendente.total_vendas}</span>
                          </div>
                        </div>
                      </div>

                      <div className="atendente-section">
                        <h5>Produtos Apple</h5>
                        <div className="atendente-kpis">
                          <div className="kpi-item apple-kpi">
                            <p>Receita Apple:</p>
                            <span>{formatCurrency(atendente.receita_total_apple)}</span>
                          </div>
                          <div className="kpi-item apple-kpi">
                            <p>Vendas Apple:</p>
                            <span>{atendente.total_vendas_apple}</span>
                          </div>
                        </div>
                      </div>

                      <div className="atendente-section">
                        <h5>Acessórios</h5>
                        <div className="atendente-kpis">
                          <div className="kpi-item">
                            <p>Receita Acessórios:</p>
                            <span>{formatCurrency(atendente.receita_total_acessorios)}</span>
                          </div>
                          <div className="kpi-item">
                            <p>Vendas Acessórios:</p>
                            <span>{atendente.total_vendas_acessorios}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dados-anuais' && annualData && (
            <div className="tab-content">
              {/* KPIs Anuais Totais */}
              <div className="kpi-section">
                <h3 className="section-title">Totais Anuais (Jan 2024 - Nov 2025)</h3>
                <div className="kpi-grid">
                  <KPICard
                    title="Receita Total Anual"
                    value={formatCurrency(annualData.totais.geral.receita_total)}
                    icon={DollarSign}
                    description="Total de todas as vendas"
                  />
                  <KPICard
                    title="Total de Vendas Anual"
                    value={annualData.totais.geral.total_vendas}
                    icon={ShoppingCart}
                    description="Todas as transações"
                  />
                  <KPICard
                    title="Ticket Médio Anual"
                    value={formatCurrency(annualData.totais.geral.ticket_medio)}
                    icon={TrendingUp}
                    description="Média por transação"
                  />
                </div>
              </div>

              {/* Gráficos de Comparação */}
              <div className="charts-grid">
                <div className="chart-card full-width">
                  <h3>Evolução de Receita por Mês</h3>
                  <p>Comparação mês a mês da receita total</p>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={annualData.resumo_geral}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="receita_total" stroke="#8884d8" name="Receita Total" />
                      <Line type="monotone" dataKey="ticket_medio" stroke="#82ca9d" name="Ticket Médio" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card full-width">
                  <h3>Comparação: Geral vs. Produtos Apple vs. Acessórios</h3>
                  <p>Receita por mês para cada categoria</p>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={annualData.resumo_geral}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receita_total" fill="#8884d8" name="Geral" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tabela de Comparação Mensal */}
              <div className="kpi-section">
                <h3 className="section-title">Comparação Mês a Mês - Geral</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mês</th>
                        <th>Receita Total</th>
                        <th>Total de Vendas</th>
                        <th>Ticket Médio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annualData.resumo_geral.map((mes, index) => (
                        <tr key={index}>
                          <td>{mes.mes}</td>
                          <td>{formatCurrency(mes.receita_total)}</td>
                          <td>{mes.total_vendas}</td>
                          <td>{formatCurrency(mes.ticket_medio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="kpi-section">
                <h3 className="section-title">Comparação Mês a Mês - Produtos Apple</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mês</th>
                        <th>Receita Apple</th>
                        <th>Vendas Apple</th>
                        <th>Ticket Médio Apple</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annualData.resumo_apple.map((mes, index) => (
                        <tr key={index}>
                          <td>{mes.mes}</td>
                          <td>{formatCurrency(mes.receita_total)}</td>
                          <td>{mes.total_vendas}</td>
                          <td>{formatCurrency(mes.ticket_medio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="kpi-section">
                <h3 className="section-title">Comparação Mês a Mês - Acessórios</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mês</th>
                        <th>Receita Acessórios</th>
                        <th>Vendas Acessórios</th>
                        <th>Ticket Médio Acessórios</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annualData.resumo_acessorios.map((mes, index) => (
                        <tr key={index}>
                          <td>{mes.mes}</td>
                          <td>{formatCurrency(mes.receita_total)}</td>
                          <td>{mes.total_vendas}</td>
                          <td>{formatCurrency(mes.ticket_medio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
