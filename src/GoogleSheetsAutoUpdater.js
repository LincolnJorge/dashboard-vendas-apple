import React, { useState, useEffect, useRef } from 'react';
import { Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';

function GoogleSheetsAutoUpdater({ onDataUpdate }) {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(5); // minutos
  const intervalRef = useRef(null);
  const lastHashRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Carregar configuração ao montar
  useEffect(() => {
    loadConfig();
  }, []);

  // Configurar verificação automática quando há spreadsheetId
  useEffect(() => {
    if (spreadsheetId && isConnected) {
      // Fazer primeira verificação imediatamente
      checkForUpdates();
      
      // Configurar intervalo para verificações periódicas
      intervalRef.current = setInterval(() => {
        checkForUpdates();
      }, updateInterval * 60 * 1000); // Converter minutos para ms

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [spreadsheetId, isConnected, updateInterval]);

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config`);
      const data = await response.json();
      if (data.spreadsheet_id) {
        setSpreadsheetId(data.spreadsheet_id);
        setIsConnected(true);
        showMessage('Conectado ao Google Sheets', 'success');
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const checkForUpdates = async () => {
    if (!spreadsheetId) return;

    try {
      // Baixar dados do Google Sheets
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;
      const response = await fetch(url);
      const csvText = await response.text();
      
      // Criar hash dos dados para comparar
      const currentHash = hashCode(csvText);
      
      // Se dados mudaram, atualizar dashboard
      if (lastHashRef.current && lastHashRef.current !== currentHash) {
        console.log('Mudanças detectadas no Google Sheets, atualizando...');
        await updateDashboard();
      }
      
      lastHashRef.current = currentHash;
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  };

  const updateDashboard = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/update-from-google-sheets?spreadsheet_id=${encodeURIComponent(spreadsheetId)}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setLastUpdate(new Date().toLocaleString('pt-BR'));
        showMessage('Dashboard atualizado automaticamente', 'success');
        
        // Recarregar página após 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
    }
  };

  const handleSaveConfig = async () => {
    if (!spreadsheetId.trim()) {
      showMessage('Por favor, insira um ID de planilha válido', 'error');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/save-config?spreadsheet_id=${encodeURIComponent(spreadsheetId)}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setIsConnected(true);
        showMessage('Conectado ao Google Sheets com sucesso!', 'success');
        setShowSettings(false);
      } else {
        showMessage('Erro ao conectar ao Google Sheets', 'error');
      }
    } catch (error) {
      showMessage(`Erro: ${error.message}`, 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 4000);
  };

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Converter para 32-bit integer
    }
    return hash.toString();
  };

  return (
    <div className="google-sheets-auto-updater">
      {/* Status de conexão */}
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
        <span className="status-text">
          {isConnected ? 'Conectado ao Google Sheets' : 'Desconectado'}
        </span>
        
        <button
          className="btn-settings-small"
          onClick={() => setShowSettings(!showSettings)}
          title="Configurar Google Sheets"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Painel de configuração */}
      {showSettings && (
        <div className="settings-panel-auto">
          <div className="settings-content">
            <h3>Configurar Atualização Automática</h3>
            <p className="settings-description">
              O dashboard será atualizado automaticamente quando detectar mudanças na planilha.
              <br />
              ID da planilha: <code>https://docs.google.com/spreadsheets/d/<strong>SEU_ID_AQUI</strong>/edit</code>
            </p>
            
            <div className="input-group">
              <label>ID da Planilha Google Sheets</label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Cole o ID aqui"
                className="input-spreadsheet-id"
              />
            </div>

            <div className="input-group">
              <label>Intervalo de Verificação (minutos)</label>
              <input
                type="number"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Math.max(1, parseInt(e.target.value) || 5))}
                min="1"
                max="60"
                className="input-interval"
              />
              <small>Quanto menor, mais frequente a verificação (mínimo: 1 minuto)</small>
            </div>

            <div className="settings-actions">
              <button
                className="btn-save"
                onClick={handleSaveConfig}
              >
                Conectar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowSettings(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagens de status */}
      {message && (
        <div className={`message-auto message-${messageType}`}>
          {messageType === 'success' && <CheckCircle size={16} />}
          {messageType === 'error' && <AlertCircle size={16} />}
          <span>{message}</span>
        </div>
      )}

      {/* Informação de última atualização */}
      {lastUpdate && (
        <div className="last-update-auto">
          <Clock size={14} />
          <span>Última atualização: {lastUpdate}</span>
        </div>
      )}
    </div>
  );
}

export default GoogleSheetsAutoUpdater;
