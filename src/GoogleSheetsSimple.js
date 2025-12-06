import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

function GoogleSheetsSimple() {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar configuração salva no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('googleSheetsId');
    if (saved) {
      setSpreadsheetId(saved);
      setIsConnected(true);
    }
    
    const savedLastUpdate = localStorage.getItem('lastGoogleSheetsUpdate');
    if (savedLastUpdate) {
      setLastUpdate(savedLastUpdate);
    }
  }, []);

  const handleSaveConfig = () => {
    if (!spreadsheetId.trim()) {
      showMessage('Por favor, insira um ID de planilha válido', 'error');
      return;
    }

    localStorage.setItem('googleSheetsId', spreadsheetId);
    setIsConnected(true);
    showMessage('Conectado ao Google Sheets com sucesso!', 'success');
    setShowSettings(false);
  };

  const handleUpdateDashboard = async () => {
    if (!spreadsheetId.trim()) {
      showMessage('Por favor, configure o ID da planilha primeiro', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showMessage('Baixando dados do Google Sheets...', 'info');

      // URL para exportar como CSV
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;
      
      // Fazer requisição para o CSV
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error('Não foi possível acessar a planilha. Verifique o ID.');
      }

      const csvText = await response.text();
      
      // Processar CSV e converter para JSON
      const lines = csvText.split('\n');
      if (lines.length < 2) {
        throw new Error('Planilha vazia ou formato inválido');
      }

      // Pular primeira linha (título) e usar segunda como headers
      const headers = lines[1].split(',').map(h => h.trim());
      const data = [];

      for (let i = 2; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        
        data.push(row);
      }

      if (data.length === 0) {
        throw new Error('Nenhum dado encontrado na planilha');
      }

      // Salvar dados no localStorage
      localStorage.setItem('googleSheetsData', JSON.stringify(data));
      
      const updateTime = new Date().toLocaleString('pt-BR');
      localStorage.setItem('lastGoogleSheetsUpdate', updateTime);
      setLastUpdate(updateTime);

      showMessage(`✓ Dashboard atualizado! ${data.length} registros importados.`, 'success');
      
      // Recarregar página após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erro:', error);
      showMessage(`Erro: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('googleSheetsId');
    localStorage.removeItem('googleSheetsData');
    setSpreadsheetId('');
    setIsConnected(false);
    showMessage('Desconectado do Google Sheets', 'info');
  };

  return (
    <div className="google-sheets-simple">
      {/* Status de conexão */}
      <div className="connection-status-simple">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
        <span className="status-text">
          {isConnected ? '✓ Conectado ao Google Sheets' : '○ Desconectado'}
        </span>
        
        <div className="status-actions">
          <button
            className="btn-update-simple"
            onClick={handleUpdateDashboard}
            disabled={!isConnected || isLoading}
            title="Atualizar dados agora"
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            <span>{isLoading ? 'Atualizando...' : 'Atualizar'}</span>
          </button>

          <button
            className="btn-settings-simple"
            onClick={() => setShowSettings(!showSettings)}
            title="Configurar Google Sheets"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Painel de configuração */}
      {showSettings && (
        <div className="settings-panel-simple">
          <div className="settings-content-simple">
            <h3>Conectar Google Sheets</h3>
            <p className="settings-description-simple">
              Cole o ID da sua planilha Google Sheets. Você pode encontrá-lo na URL:
              <br />
              <code>https://docs.google.com/spreadsheets/d/<strong>SEU_ID_AQUI</strong>/edit</code>
            </p>
            
            <div className="input-group-simple">
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Cole o ID aqui"
                className="input-spreadsheet-id-simple"
              />
            </div>

            <div className="settings-actions-simple">
              <button
                className="btn-save-simple"
                onClick={handleSaveConfig}
                disabled={isLoading}
              >
                Conectar
              </button>
              
              {isConnected && (
                <button
                  className="btn-disconnect-simple"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  Desconectar
                </button>
              )}
              
              <button
                className="btn-cancel-simple"
                onClick={() => setShowSettings(false)}
                disabled={isLoading}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagens de status */}
      {message && (
        <div className={`message-simple message-${messageType}`}>
          {messageType === 'success' && <CheckCircle size={16} />}
          {messageType === 'error' && <AlertCircle size={16} />}
          {messageType === 'info' && <RefreshCw size={16} className="spinning" />}
          <span>{message}</span>
        </div>
      )}

      {/* Informação de última atualização */}
      {lastUpdate && (
        <div className="last-update-simple">
          <Clock size={14} />
          <span>Última atualização: {lastUpdate}</span>
        </div>
      )}
    </div>
  );
}

export default GoogleSheetsSimple;
