import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Copy, Download, Flower2, LoaderCircle, Share2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AmbientPetals } from '../components/festa/AmbientPetals';
import { EntityReflection } from '../components/festa/EntityReflection';
import { EntrancePortal } from '../components/festa/EntrancePortal';
import { EventTimeline } from '../components/festa/EventTimeline';
import { Footer } from '../components/festa/Footer';
import { HeroSection } from '../components/festa/HeroSection';
import { LumeGlow } from '../components/festa/LumeGlow';
import { Navbar } from '../components/festa/Navbar';
import { OfferingCards } from '../components/festa/OfferingCards';
import { RoseDivider } from '../components/festa/RoseDivider';
import { RsvpSection } from '../components/festa/RsvpSection';
import { DownloadInviteModal } from '../components/DownloadInviteModal';
import { DEFAULT_EVENT_DETAILS } from '../constants';
import { isBase44Configured } from '../lib/base44';
import { getConviteByToken, getEntidadeByName, updateConvite } from '../lib/convites';
import type { Convite, Entidade } from '../types';

type LoadState = 'loading' | 'ready' | 'missing' | 'no-token' | 'error';

const event = DEFAULT_EVENT_DETAILS;

export function Home() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('convite');
  const [loadState, setLoadState] = useState<LoadState>(token ? 'loading' : 'no-token');
  const [convite, setConvite] = useState<Convite | null>(null);
  const [entidade, setEntidade] = useState<Entidade | null>(null);
  const [entered, setEntered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    if (!token) {
      setLoadState('no-token');
      setConvite(null);
      setEntidade(null);
      return () => {
        active = false;
      };
    }

    setLoadState('loading');
    setErrorMessage('');
    void (async () => {
      try {
        const found = await getConviteByToken(token);
        if (!active) return;
        if (!found) {
          setLoadState('missing');
          return;
        }
        const foundEntity = await getEntidadeByName(found.entidade_name);
        if (!active) return;
        setConvite(found);
        setEntidade(foundEntity);
        setLoadState('ready');
      } catch (error) {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'Não foi possível abrir este portal.');
        setLoadState('error');
      }
    })();

    return () => {
      active = false;
    };
  }, [token]);

  const handleUpdate = async (patch: Partial<Convite>) => {
    if (!convite?.id) return;
    const updated = await updateConvite(convite.id, patch);
    setConvite(updated);
  };

  const shareInvite = async () => {
    const url = window.location.href;
    const text = `Você foi convidado para a Festa da Menina. Abra o seu portal: ${url}`;
    if (navigator.share) {
      await navigator.share({ title: 'Festa da Menina', text, url }).catch(() => undefined);
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="ritual-page">
      <Navbar />
      <AmbientPetals />
      <LumeGlow />

      <AnimatePresence>{!entered ? <EntrancePortal onEnter={() => setEntered(true)} /> : null}</AnimatePresence>

      {loadState === 'loading' ? (
        <main className="flex min-h-screen items-center justify-center px-6 pt-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <LoaderCircle className="ritual-loader" />
            <span className="ritual-kicker">o portal está abrindo</span>
          </div>
        </main>
      ) : loadState === 'no-token' ? (
        <main className="flex min-h-screen items-center justify-center px-6 pt-20">
          <div className="ritual-card max-w-lg p-8 text-center sm:p-10">
            <Flower2 className="mx-auto h-10 w-10 text-[#c5a059]" />
            <span className="ritual-kicker mt-5 block">convite ritualístico</span>
            <h1 className="ritual-display mt-3 text-4xl">Aguarde o seu portal</h1>
            <p className="ritual-muted mt-4">Este convite é pessoal. Abra o link recebido da casa para entrar na sua gira.</p>
            {!isBase44Configured() ? (
              <div className="mt-7 border-t border-[#c5a059]/15 pt-5">
                <span className="ritual-caption">modo de demonstração local</span>
                <div className="mt-3 flex flex-col gap-2 text-left text-sm">
                  <a className="ritual-button ritual-button-ghost" href="/?convite=demo-padilha-2026">Abrir convite · Maria Padilha <ArrowUpRight className="h-4 w-4" /></a>
                  <a className="ritual-button ritual-button-ghost" href="/?convite=demo-trancaruas-2026">Abrir convite · Tranca Ruas <ArrowUpRight className="h-4 w-4" /></a>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      ) : loadState === 'missing' || loadState === 'error' || !convite ? (
        <main className="flex min-h-screen items-center justify-center px-6 pt-20">
          <div className="ritual-card max-w-lg p-8 text-center sm:p-10">
            <Flower2 className="mx-auto h-10 w-10 text-[#a1121f]" />
            <h1 className="ritual-title mt-5 text-3xl">Convite não encontrado</h1>
            <p className="ritual-muted mt-3">{errorMessage || 'Este link pode ter sido encerrado ou digitado incorretamente.'}</p>
            <button type="button" className="ritual-button ritual-button-ghost mt-7" onClick={() => window.location.assign('/')}>Voltar ao início</button>
          </div>
        </main>
      ) : (
        <motion.main initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <HeroSection convite={convite} entidade={entidade} event={event} />
          <div className="ritual-container -mt-8 relative z-20 flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="ritual-button ritual-button-ghost" onClick={shareInvite}><Share2 className="h-4 w-4" /> Compartilhar</button>
            <button type="button" className="ritual-button ritual-button-ghost" onClick={copyLink}><Copy className="h-4 w-4" /> {copied ? 'Copiado' : 'Copiar link'}</button>
            <button type="button" className="ritual-button ritual-button-ghost" onClick={() => setDownloadOpen(true)}><Download className="h-4 w-4" /> Baixar convite</button>
          </div>
          <RoseDivider label="o espelho" />
          <EntityReflection entidade={entidade} mediumName={convite.medium_name} />
          <EventTimeline event={event} />
          <RoseDivider label="a casa pede" />
          <OfferingCards event={event} />
          <RsvpSection convite={convite} onConfirm={handleUpdate} onDecline={() => handleUpdate({ status: 'declined', confirmed_at: null })} />
          <Footer event={event} />
          <DownloadInviteModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} event={event} />
        </motion.main>
      )}
    </div>
  );
}
