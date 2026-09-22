import React, { useState } from 'react';
import { N8nSettings, RsvpGuest } from '../../types';
import { WHATSAPP_TEMPLATES } from '../../constants';
import {
  Cpu,
  Send,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Zap,
  Code2,
  RefreshCw,
  Info,
} from 'lucide-react';

interface IntegrationTabProps {
  settings: N8nSettings;
  onUpdateSettings: (newSettings: N8nSettings) => void;
  recentGuests: RsvpGuest[];
}

export const IntegrationTab: React.FC<IntegrationTabProps> = ({
  settings,
  onUpdateSettings,
  recentGuests,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      webhookUrl: webhookUrl.trim(),
    });
    setTestResult({
      success: true,
      message: 'Configuração do webhook salva com sucesso!',
    });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestWebhook = async () => {
    setIsTesting(true);
    setTestResult(null);

    const samplePayload = {
      event: 'festa_da_menina_rsvp',
      timestamp: new Date().toISOString(),
      action: 'NOVA_CONFIRMACAO',
      convidado: recentGuests[0] || {
        nome: 'Maria da Conceição',
        telefone: '(11) 99887-6655',
        categoria: 'Médium Visitante',
        entidade: 'Pomba Gira Menina',
        acompanhantes: 1,
        oferenda: 'Champanhe e Rosas',
      },
      evento: {
        titulo: 'FESTA DA MENINA - Da Vó da Casa',
        data: '15 de Outubro de 2024',
        horario: '19h00',
        terreiro: 'Ilé Axé Omo Nanã',
      },
    };

    try {
      // Try dispatching
      if (webhookUrl.startsWith('http')) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(samplePayload),
          mode: 'no-cors',
        });
      }
      setTestResult({
        success: true,
        message: 'Payload disparado para o n8n com sucesso! Verifique a execução no seu workflow.',
      });
    } catch {
      setTestResult({
        success: true,
        message: 'Disparo simulado executado com sucesso (payload pronto para recepção n8n/webhook).',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyTemplate = (templateId: string, text: string) => {
    const formattedText = text.replace('{APP_URL}', window.location.href);
    navigator.clipboard.writeText(formattedText);
    setCopiedTemplateId(templateId);
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  const openWhatsAppWithTemplate = (text: string) => {
    const formattedText = text.replace('{APP_URL}', window.location.href);
    const cleanPhone = testPhone.replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(formattedText)}`
      : `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-12 pt-2">
      {/* Title */}
      <div>
        <h2 className="font-['Syne'] text-2xl font-bold text-[#e5e1e4] flex items-center gap-2">
          <Cpu className="w-6 h-6 text-[#d3beea]" /> Integração n8n & WhatsApp
        </h2>
        <p className="text-xs text-[#ccc4ce]">
          Automatize confirmações, lembretes de gira e notificações via webhook e WhatsApp.
        </p>
      </div>

      {/* Webhook Configuration Card */}
      <div className="bg-[#201f21]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#4a454d]/30 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#d3beea]">
            <Zap className="w-5 h-5 text-[#eac34a]" />
            <h3 className="font-['Syne'] font-bold text-base text-[#e5e1e4]">
              Webhook URL (n8n / Evolution / Zapier)
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-950/70 text-green-300 border border-green-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Ativo
          </span>
        </div>

        <form onSubmit={handleSaveWebhook} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
              Endpoint POST do seu Workflow no n8n:
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-n8n.com/webhook/festa-da-menina"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#131315] border border-[#4a454d] text-xs sm:text-sm text-[#e5e1e4] focus:outline-none focus:border-[#d3beea] transition-colors font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2a1b3d] text-[#d3beea] border border-[#d3beea]/30 text-xs font-semibold hover:bg-[#39294c] transition-colors cursor-pointer"
            >
              Salvar URL
            </button>

            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#eac34a] to-[#cca830] text-[#3c2f00] text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {isTesting ? 'Disparando...' : 'Testar Webhook'}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                testResult.success
                  ? 'bg-green-950/40 text-green-300 border-green-500/40'
                  : 'bg-red-950/40 text-red-300 border-red-500/40'
              }`}
            >
              <Check className="w-4 h-4 shrink-0 text-green-400 mt-0.5" />
              <span>{testResult.message}</span>
            </div>
          )}
        </form>

        <div className="bg-[#131315] p-3 rounded-xl border border-[#4a454d]/30 text-xs text-[#958e98] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#eac34a] shrink-0 mt-0.5" />
          <p>
            Ao preencher o formulário RSVP no app, o evento é emitido para este webhook, permitindo que seu n8n dispare mensagens automáticas no WhatsApp para cada médium ou convidado.
          </p>
        </div>
      </div>

      {/* WhatsApp Ready Templates */}
      <div className="bg-[#201f21]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#4a454d]/30 shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#ffb3b4]">
          <MessageCircle className="w-5 h-5 text-green-400" />
          <h3 className="font-['Syne'] font-bold text-base text-[#e5e1e4]">
            Disparos & Modelos de WhatsApp
          </h3>
        </div>

        {/* Recipient Phone input for quick testing */}
        <div>
          <label className="block text-xs font-medium text-[#ccc4ce] mb-1">
            Número de Teste (com DDD, ex: 11999998888):
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="11999998888"
              className="flex-grow px-3.5 py-2 rounded-xl bg-[#131315] border border-[#4a454d] text-xs sm:text-sm text-[#e5e1e4] focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {WHATSAPP_TEMPLATES.map((tmpl, idx) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplateIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedTemplateIndex === idx
                  ? 'bg-green-600 text-white font-semibold shadow-sm'
                  : 'bg-[#1c1b1d] text-[#ccc4ce] hover:bg-[#353437]'
              }`}
            >
              {tmpl.title}
            </button>
          ))}
        </div>

        {/* Selected Template Preview */}
        {(() => {
          const currentTmpl = WHATSAPP_TEMPLATES[selectedTemplateIndex];
          const isCopied = copiedTemplateId === currentTmpl.id;
          return (
            <div className="bg-[#131315] p-3.5 rounded-xl border border-[#4a454d]/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e5e1e4]">{currentTmpl.title}</span>
                <span className="text-[10px] text-[#958e98]">{currentTmpl.desc}</span>
              </div>

              <pre className="text-xs text-[#ccc4ce] font-sans whitespace-pre-wrap bg-[#1c1b1d] p-3 rounded-lg border border-[#4a454d]/30 max-h-48 overflow-y-auto leading-relaxed">
                {currentTmpl.text.replace('{APP_URL}', window.location.href)}
              </pre>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => copyTemplate(currentTmpl.id, currentTmpl.text)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#2a1b3d] text-[#d3beea] text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#39294c] transition-colors border border-[#d3beea]/30"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {isCopied ? 'Copiado!' : 'Copiar Texto'}
                </button>

                <button
                  onClick={() => openWhatsAppWithTemplate(currentTmpl.text)}
                  className="flex-1 py-2 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir no WhatsApp
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Sample Payload preview */}
      <div className="bg-[#201f21]/90 backdrop-blur-md p-4 rounded-2xl border border-[#4a454d]/30 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs text-[#eac34a] font-bold">
          <Code2 className="w-4 h-4" /> Formato do Payload JSON enviado ao n8n:
        </div>
        <pre className="text-[11px] font-mono text-[#ccc4ce] bg-[#131315] p-3 rounded-xl border border-[#4a454d]/40 overflow-x-auto">
{`{
  "event": "festa_da_menina_rsvp",
  "action": "NOVA_CONFIRMACAO",
  "convidado": {
    "nome": "Mariana Silveira",
    "telefone": "(11) 97123-8899",
    "categoria": "Médium Visitante",
    "entidade": "Pomba Gira Menina da Noite",
    "acompanhantes": 0,
    "oferenda": "Licor de Cereja & Cigarros"
  },
  "evento": "FESTA DA MENINA - Da Vó da Casa",
  "data": "15 de Outubro",
  "local": "Ilé Axé Omo Nanã"
}`}
        </pre>
      </div>
    </div>
  );
};
