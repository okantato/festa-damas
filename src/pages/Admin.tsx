import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, ExternalLink, Link2, LogOut, MessageCircle, Plus, RefreshCw, Send, Trash2, UserCheck, Users, Zap } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { DEFAULT_N8N_SETTINGS, WHATSAPP_TEMPLATES } from '../constants';
import { createToken, createConvite, deleteConvite, listConvites, listEntidades, setCheckIn } from '../lib/convites';
import type { Convite, Entidade, N8nSettings } from '../types';

type AdminTab = 'convites' | 'rsvp' | 'integracao';

const emptyForm = {
  medium_name: '',
  entidade_name: '',
  phone: '',
  role: 'Médium Visitante',
  notes: '',
};

function readSettings(): N8nSettings {
  if (typeof window === 'undefined') return DEFAULT_N8N_SETTINGS;
  try {
    const value = window.localStorage.getItem('festa_da_menina_n8n');
    return value ? { ...DEFAULT_N8N_SETTINGS, ...JSON.parse(value) } : DEFAULT_N8N_SETTINGS;
  } catch {
    return DEFAULT_N8N_SETTINGS;
  }
}

function statusLabel(status: Convite['status']) {
  if (status === 'confirmed') return 'Confirmado';
  if (status === 'declined') return 'Não comparecerá';
  return 'Pendente';
}

function statusClass(status: Convite['status']) {
  return `admin-status admin-status-${status}`;
}

async function copyText(value: string) {
  if (navigator.clipboard) await navigator.clipboard.writeText(value);
}

export function Admin() {
  const { logout, isConfigured } = useAuth();
  const [tab, setTab] = useState<AdminTab>('convites');
  const [convites, setConvites] = useState<Convite[]>([]);
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [settings, setSettings] = useState<N8nSettings>(readSettings);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextConvites, nextEntidades] = await Promise.all([listConvites(), listEntidades()]);
      setConvites(nextConvites);
      setEntidades(nextEntidades);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os convites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const confirmed = useMemo(() => convites.filter((item) => item.status === 'confirmed'), [convites]);
  const pending = useMemo(() => convites.filter((item) => item.status === 'pending'), [convites]);
  const checkedIn = useMemo(() => convites.filter((item) => item.checked_in), [convites]);

  const notify = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 2800);
  };

  const submitInvite = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createConvite({
        medium_name: form.medium_name.trim(),
        entidade_name: form.entidade_name,
        token: createToken(),
        status: 'pending',
        phone: form.phone.trim(),
        role: form.role as Convite['role'],
        notes: form.notes.trim(),
        companions_count: 0,
      });
      setForm(emptyForm);
      await load();
      notify('Convite criado. O link já pode ser compartilhado.');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Não foi possível criar o convite.');
    } finally {
      setSaving(false);
    }
  };

  const removeInvite = async (id: string) => {
    if (!window.confirm('Remover este convite e seu link?')) return;
    try {
      await deleteConvite(id);
      await load();
      notify('Convite removido.');
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Não foi possível remover o convite.');
    }
  };

  const toggleCheckIn = async (convite: Convite) => {
    if (!convite.id) return;
    try {
      await setCheckIn(convite.id, !convite.checked_in);
      await load();
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : 'Não foi possível atualizar o check-in.');
    }
  };

  const copyInviteLink = async (convite: Convite) => {
    const link = `${window.location.origin}/?convite=${encodeURIComponent(convite.token)}`;
    await copyText(link);
    setCopied(convite.token);
    notify('Link do convite copiado.');
    window.setTimeout(() => setCopied(''), 2200);
  };

  const saveSettings = () => {
    const next = { ...settings, lastSync: new Date().toISOString() };
    setSettings(next);
    window.localStorage.setItem('festa_da_menina_n8n', JSON.stringify(next));
    notify('Configuração do webhook salva.');
  };

  const testWebhook = async () => {
    if (!settings.webhookUrl) {
      setError('Informe a URL do webhook antes de testar.');
      return;
    }
    setTesting(true);
    setError('');
    try {
      await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'teste_convite', timestamp: new Date().toISOString(), fonte: 'festa-da-menina' }),
        mode: 'no-cors',
      });
      setSettings((current) => ({ ...current, lastSync: new Date().toISOString() }));
      notify('Payload enviado ao webhook.');
    } catch {
      setError('Não foi possível confirmar o envio. Verifique a URL e as permissões do n8n.');
    } finally {
      setTesting(false);
    }
  };

  const exportCsv = () => {
    const header = ['Médio', 'Entidade', 'Status', 'WhatsApp', 'Acompanhantes', 'Oferenda', 'Check-in'];
    const rows = confirmed.map((item) => [item.medium_name, item.entidade_name, statusLabel(item.status), item.phone || '', item.companions_count || 0, item.drink_or_offering || '', item.checked_in ? 'Sim' : 'Não']);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(csv)}`;
    link.download = `convites-festa-da-menina-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="ritual-page admin-shell">
      <header className="ritual-nav">
        <div className="ritual-container flex h-full items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="ritual-kicker">Painel da casa</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-[#958e98] sm:inline">{isConfigured ? 'Base44 conectado' : 'modo local'}</span>
            <button type="button" className="ritual-icon-button" onClick={logout} title="Sair"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <main className="ritual-container">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="ritual-kicker">administração da gira</span>
            <h1 className="ritual-display mt-2 text-4xl sm:text-5xl">Convites & presença</h1>
            <p className="ritual-muted mt-2 text-sm">Crie portais, acompanhe confirmações e cuide dos detalhes da noite.</p>
          </div>
          <button type="button" className="ritual-button ritual-button-ghost" onClick={() => void load()}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar</button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="admin-stat"><span className="admin-stat-value">{convites.length}</span><span className="admin-stat-label">convites</span></div>
          <div className="admin-stat"><span className="admin-stat-value">{confirmed.length}</span><span className="admin-stat-label">confirmados</span></div>
          <div className="admin-stat"><span className="admin-stat-value">{pending.length}</span><span className="admin-stat-label">pendentes</span></div>
          <div className="admin-stat"><span className="admin-stat-value">{checkedIn.length}</span><span className="admin-stat-label">check-ins</span></div>
        </div>

        {message ? <div className="admin-alert mb-4">{message}</div> : null}
        {error ? <div className="admin-alert admin-error mb-4">{error}</div> : null}

        <div className="admin-tabs mb-6">
          {([['convites', 'Convites'], ['rsvp', 'Lista de presença'], ['integracao', 'n8n & WhatsApp']] as const).map(([id, label]) => (
            <button key={id} type="button" className={`admin-tab ${tab === id ? 'admin-tab-active' : ''}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === 'convites' ? (
          <div className="admin-grid">
            <section className="ritual-card p-5">
              <div className="mb-5 flex items-center gap-2"><Plus className="h-4 w-4 text-[#c5a059]" /><h2 className="ritual-title text-2xl">Novo convite</h2></div>
              <form onSubmit={submitInvite} className="grid gap-4 sm:grid-cols-2">
                <label className="ritual-field sm:col-span-2"><span>Nome do médium</span><input required value={form.medium_name} onChange={(event) => setForm({ ...form, medium_name: event.target.value })} placeholder="Ex.: Mariana Silveira" /></label>
                <label className="ritual-field"><span>Entidade</span><select required value={form.entidade_name} onChange={(event) => setForm({ ...form, entidade_name: event.target.value })}><option value="">Selecione</option>{entidades.map((item) => <option key={item.id || item.name} value={item.name}>{item.name} · {item.type === 'exu' ? 'Exu' : 'Pombogira'}</option>)}</select></label>
                <label className="ritual-field"><span>WhatsApp</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(11) 99999-9999" /></label>
                <label className="ritual-field"><span>Categoria</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option>Médium da Casa</option><option>Médium Visitante</option><option>Convidado / Amigo</option><option>Familiar</option></select></label>
                <label className="ritual-field"><span>Recado inicial</span><input value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Opcional" /></label>
                <button type="submit" disabled={saving || !entidades.length} className="ritual-button ritual-button-primary sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Criando...' : 'Criar convite e gerar link'}</button>
              </form>
            </section>

            <section className="ritual-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Link2 className="h-4 w-4 text-[#c5a059]" /><h2 className="ritual-title text-2xl">Portais criados</h2></div><span className="ritual-caption">{convites.length} registros</span></div>
              <InviteTable convites={convites} copied={copied} onCopy={copyInviteLink} onDelete={removeInvite} />
            </section>
          </div>
        ) : null}

        {tab === 'rsvp' ? (
          <div className="admin-grid">
            <section className="ritual-card p-5">
              <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-[#c5a059]" /><h2 className="ritual-title text-2xl">Confirmações</h2></div><button type="button" className="ritual-button ritual-button-ghost" onClick={exportCsv}>Exportar CSV</button></div>
              <InviteTable convites={convites} copied={copied} onCopy={copyInviteLink} onDelete={removeInvite} onCheckIn={toggleCheckIn} showCheckIn />
            </section>
          </div>
        ) : null}

        {tab === 'integracao' ? (
          <div className="admin-grid admin-grid-two">
            <section className="ritual-card p-5">
              <div className="mb-4 flex items-center gap-2"><Zap className="h-4 w-4 text-[#c5a059]" /><h2 className="ritual-title text-2xl">Webhook n8n</h2></div>
              <div className="flex flex-col gap-4">
                <label className="ritual-field"><span>Endpoint POST</span><input className="admin-input font-mono" value={settings.webhookUrl} onChange={(event) => setSettings({ ...settings, webhookUrl: event.target.value })} placeholder="https://seu-n8n.com/webhook/festa-da-menina" /></label>
                <label className="flex items-center gap-2 text-sm text-[#cdbd9d]"><input type="checkbox" checked={settings.autoSync} onChange={(event) => setSettings({ ...settings, autoSync: event.target.checked })} /> Enviar RSVP automaticamente</label>
                <div className="flex flex-col gap-2 sm:flex-row"><button type="button" className="ritual-button ritual-button-ghost flex-1" onClick={saveSettings}>Salvar</button><button type="button" className="ritual-button ritual-button-primary flex-1" onClick={testWebhook} disabled={testing}>{testing ? 'Enviando...' : 'Testar envio'} <Send className="h-4 w-4" /></button></div>
                {settings.lastSync ? <span className="ritual-caption">último registro: {new Date(settings.lastSync).toLocaleString('pt-BR')}</span> : null}
              </div>
            </section>
            <section className="ritual-card p-5">
              <div className="mb-4 flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#9cd6ac]" /><h2 className="ritual-title text-2xl">Modelos de WhatsApp</h2></div>
              <div className="flex flex-col gap-3">{WHATSAPP_TEMPLATES.map((template) => <div key={template.id} className="rounded-xl border border-[#c5a059]/15 bg-[#0a0707]/40 p-3"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-[#e8d9c4]">{template.title}</span><button type="button" className="ritual-icon-button h-8 w-8" onClick={async () => { await copyText(template.text.replace('{APP_URL}', window.location.origin)); notify('Modelo copiado.'); }} title="Copiar modelo"><Copy className="h-3.5 w-3.5" /></button></div><p className="ritual-muted mt-2 whitespace-pre-wrap text-xs leading-relaxed">{template.text.replace('{APP_URL}', window.location.origin)}</p><a className="mt-3 inline-flex items-center gap-1 text-xs text-[#9cd6ac] hover:underline" href={`https://wa.me/?text=${encodeURIComponent(template.text.replace('{APP_URL}', window.location.origin))}`} target="_blank" rel="noreferrer">Abrir no WhatsApp <ExternalLink className="h-3 w-3" /></a></div>)}</div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function InviteTable({ convites, copied, onCopy, onDelete, onCheckIn, showCheckIn = false }: { convites: Convite[]; copied: string; onCopy: (convite: Convite) => void; onDelete: (id: string) => void; onCheckIn?: (convite: Convite) => void; showCheckIn?: boolean }) {
  if (!convites.length) return <div className="admin-alert">Nenhum convite criado ainda.</div>;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Médio</th><th>Entidade</th><th>Status</th><th>Contato</th><th>Ações</th></tr></thead>
        <tbody>
          {convites.map((convite) => (
            <tr key={convite.id || convite.token}>
              <td><span className="block font-semibold text-[#e8d9c4]">{convite.medium_name}</span><span className="text-[10px] text-[#786c66]">{convite.token}</span></td>
              <td>{convite.entidade_name}</td>
              <td><span className={statusClass(convite.status)}>{statusLabel(convite.status)}</span>{convite.checked_in ? <span className="ml-2 text-[10px] text-[#9cd6ac]">presente</span> : null}</td>
              <td>{convite.phone || '—'}<span className="block text-[10px] text-[#786c66]">{convite.companions_count ? `+${convite.companions_count} acompanhantes` : ''}</span></td>
              <td><div className="flex items-center gap-1.5"><button type="button" className="ritual-icon-button h-8 w-8" onClick={() => onCopy(convite)} title="Copiar link">{copied === convite.token ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}</button>{showCheckIn && onCheckIn ? <button type="button" className="ritual-icon-button h-8 w-8" onClick={() => onCheckIn(convite)} title="Check-in"><UserCheck className="h-3.5 w-3.5" /></button> : null}<button type="button" className="ritual-icon-button h-8 w-8" onClick={() => onDelete(convite.id || convite.token)} title="Remover"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
