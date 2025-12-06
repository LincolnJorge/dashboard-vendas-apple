import React, { useState, useEffect } from 'react';
import { RefreshCw, Settings, CheckCircle, AlertCircle } from 'lucide-react';

function GoogleSheetsUpdater({ onUpdate }) {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Carregar configuração salva ao montar
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config`);
      const data = await response.json();
      if (data.spreadsheet_id) {
        setSpreadsheetId(data.spreadsheet_id);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const handleSaveConfig = async () => {
    if (!spreadsheetId.trim()) {
      setMessage('Por favor, insira um ID de planilha válido');
      setMessageType('error');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/save-config?spreadsheet_id=${encodeURIComponent(spreadsheetId)}`, {
        method: 'POST',
      });

      if (response.ok) {
        setMessage('Configuração salva com sucesso!');
        setMessageType('success');
        setShowSettings(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage('Erro ao salvar configuração');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDashboard = async () => {
    if (!spreadsheetId.trim()) {
      setMessage('Por favor, configure o ID da planilha Google Sheets primeiro');
      setMessageType('error');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('Atualizando dados...');
      setMessageType('info');

      const response = await fetch(
        `${API_BASE_URL}/api/update-from-google-sheets?spreadsheet_id=${encodeURIComponent(spreadsheetId)}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage('Dashboard atualizado com sucesso!');
        setMessageType('success');
        setLastUpdate(new Date().toLocaleString('pt-BR'));
        
        // Recarregar página para mostrar novos dados
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Erro: ${error.detail || 'Falha ao atualizar'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Erro de conexão: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="google-sheets-updater">
      {/* Botões de controle */}
      <div className="updater-controls">
        <button
          className="btn-update"
          onClick={handleUpdateDashboard}
          disabled={isLoading || !spreadsheetId}
          title="Atualizar dados do Google Sheets"
        >
          <RefreshCw size={18} />
          <span>{isLoading ? 'Atualizando...' : 'Atualizar Dashboard'}</span>
        </button>

        <button
          className="btn-settings"
          onClick={() => setShowSettings(!showSettings)}
          title="Configurar Google Sheets"
        >
          <Settings size={18} />
          <span>Configurar</span>
        </button>
      </div>

      {/* Painel de configuração */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-content">
            <h3>Configurar Google Sheets</h3>
            <p className="settings-description">
              Insira o ID da sua planilha Google Sheets. Você pode encontrá-lo na URL da planilha:
              <br />
              <code>https://docs.google.com/spreadsheets/d/<strong>SEU_ID_AQUI</strong>/edit</code>
            </p>
            
            <div className="input-group">
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Cole o ID da planilha Google Sheets aqui"
                className="input-spreadsheet-id"
              />
            </div>

            <div className="settings-actions">
              <button
                className="btn-save"
                onClick={handleSaveConfig}
                disabled={isLoading}
              >
                Salvar Configuração
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowSettings(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagens de status */}
      {message && (
        <div className={`message message-${messageType}`}>
          {messageType === 'success' && <CheckCircle size={18} />}
          {messageType === 'error' && <AlertCircle size={18} />}
          {messageType === 'info' && <RefreshCw size={18} className="spinning" />}
          <span>{message}</span>
        </div>
      )}

      {/* Informação de última atualização */}
      {lastUpdate && (
        <div className="last-update">
          Última atualização: {lastUpdate}
        </div>
      )}
    </div>
  );
}

export default GoogleSheetsUpdater;
