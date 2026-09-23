import React, { useRef, useState } from 'react';
import { ASSETS } from '../constants';
import { EventDetails } from '../types';
import { X, Download, Share2, Copy, Check, Sparkles } from 'lucide-react';

interface DownloadInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails;
}

export const DownloadInviteModal: React.FC<DownloadInviteModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateAndDownloadImage = () => {
    setIsGenerating(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // High resolution card dimensions (1080 x 1920 Instagram Story / Mobile wallpaper ratio)
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    // 1. Dark Velvet Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#131315');
    bgGradient.addColorStop(0.35, '#2a1b3d');
    bgGradient.addColorStop(0.7, '#131315');
    bgGradient.addColorStop(1, '#0e0e10');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Gold Border
    ctx.strokeStyle = '#cca830';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(234, 195, 74, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.strokeStyle = '#eac34a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(20, 20);
      ctx.lineTo(20, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(55, 55, 0);
    drawCorner(width - 55, 55, 90);
    drawCorner(width - 55, height - 55, 180);
    drawCorner(55, height - 55, 270);

    // Load Rose Image
    const roseImg = new Image();
    roseImg.crossOrigin = 'anonymous';
    roseImg.onload = () => {
      // Draw Circular Emblem
      const centerX = width / 2;
      const centerY = 280;
      const radius = 110;

      // Glow behind circle
      const glow = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.5);
      glow.addColorStop(0, 'rgba(234, 195, 74, 0.4)');
      glow.addColorStop(1, 'rgba(234, 195, 74, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#eac34a';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Clip image to circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(roseImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      drawTextContent();
    };

    roseImg.onerror = () => {
      drawTextContent();
    };

    const drawTextContent = () => {
      const centerX = width / 2;
      const eventYear = new Date(event.targetDateTime).getFullYear();

      // Header Sparkle
      ctx.fillStyle = '#eac34a';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨  FESTA DA MENINA  ✨', centerX, 470);

      // Title Subtitle
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(event.subtitle, centerX, 550);

      // Poetic Invitation phrase
      ctx.fillStyle = '#ccc4ce';
      ctx.font = 'italic 28px sans-serif';
      const quoteLines = [
        '"Com muita alegria e respeito, convidamos você e sua entidade',
        'para celebrar conosco mais uma noite de festa, força e axé."',
      ];
      ctx.fillText(quoteLines[0], centerX, 630);
      ctx.fillText(quoteLines[1], centerX, 675);

      // Divider
      ctx.strokeStyle = 'rgba(234, 195, 74, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 180, 725);
      ctx.lineTo(centerX + 180, 725);
      ctx.stroke();

      // Cronograma Box
      const boxY = 770;
      const boxW = 880;
      const boxH = 430;
      const boxX = (width - boxW) / 2;

      ctx.fillStyle = 'rgba(42, 27, 61, 0.7)';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = 'rgba(211, 190, 234, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#eac34a';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('CRONOGRAMA & INFORMAÇÕES', boxX + 40, boxY + 60);

      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`📅  Data: ${event.dateStr} de ${eventYear}`, boxX + 40, boxY + 125);
      ctx.fillText(`⏰  Início: ${event.startTime} | Encerramento: ${event.endTime}`, boxX + 40, boxY + 180);
      ctx.fillText(`🔥  Churrasco: ${event.bbqTime}`, boxX + 40, boxY + 235);
      ctx.fillText(`👗  ${event.dressCodeTitle} - Roupas elegantes em harmonia`, boxX + 40, boxY + 290);
      ctx.fillText(`🍷  BEBIDA & FUMO - Cada médium traz de sua entidade`, boxX + 40, boxY + 345);
      ctx.fillText(`🚗  SEGURANÇA - Se for dirigir, não beba. Vá de carona/app`, boxX + 40, boxY + 400);

      // Localização
      const locY = 1250;
      ctx.fillStyle = 'rgba(32, 31, 33, 0.8)';
      ctx.fillRect(boxX, locY, boxW, 220);
      ctx.strokeStyle = 'rgba(234, 195, 74, 0.25)';
      ctx.strokeRect(boxX, locY, boxW, 220);

      ctx.fillStyle = '#eac34a';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('📍  LOCALIZAÇÃO', boxX + 40, locY + 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(event.houseName, boxX + 40, locY + 120);

      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#ccc4ce';
      ctx.fillText(`${event.address} (${event.locationDetails})`, boxX + 40, locY + 165);

      // Bottom Axé Message
      ctx.fillStyle = '#eac34a';
      ctx.font = 'italic bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('"Venha preparado para celebrar, cantar, dar e firmar', centerX, 1550);
      ctx.fillText('essa noite especial junto à Menina." 🌹', centerX, 1600);

      ctx.fillStyle = '#ccc4ce';
      ctx.font = '22px sans-serif';
      ctx.fillText('Laroyê Pomba Gira Menina! Axé para todos nós!', centerX, 1670);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'convite_festa_da_menina.png';
      downloadLink.href = dataUrl;
      downloadLink.click();

      setIsGenerating(false);
    };

    roseImg.src = ASSETS.GOLD_ROSE_EMBLEM;
  };

  const copyInviteText = () => {
    const inviteText = `✨ *FESTA DA MENINA - Da Vó da Casa* ✨\n\n"Com muita alegria e respeito, convidamos você e sua entidade para celebrar conosco mais uma noite de festa, força e axé." 🌹\n\n📅 *Data:* ${event.dateStr} de ${new Date(event.targetDateTime).getFullYear()}\n⏰ *Início:* ${event.startTime}\n📍 *Local:* ${event.houseName} (${event.address})\n👗 *Traje:* Luxo\n🍾 *Bebida & Fumo:* Traga o de sua entidade\n🚗 *Segurança:* Se beber, não dirija!\n\nConfirme sua presença no app: ${window.location.href}`;
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1c1b1d] border border-[#cca830]/40 w-full max-w-md rounded-2xl shadow-2xl p-5 flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#201f21] text-[#958e98] hover:text-[#e5e1e4] border border-[#4a454d]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[#eac34a]">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-['Syne'] font-bold text-lg text-[#e5e1e4]">
            Baixar & Compartilhar Convite
          </h3>
        </div>

        {/* Card Thumbnail Preview */}
        <div className="relative rounded-xl overflow-hidden border border-[#cca830]/30 bg-gradient-to-b from-[#131315] via-[#2a1b3d] to-[#131315] p-5 text-center flex flex-col items-center gap-3 shadow-inner">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#eac34a]/60 p-1 bg-[#353437]">
            <img
              src={ASSETS.GOLD_ROSE_EMBLEM}
              alt="Rosa Dourada"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <span className="text-[10px] text-[#eac34a] font-bold tracking-widest uppercase block">
              Festa da Menina
            </span>
            <h4 className="font-['Syne'] font-bold text-base text-[#e5e1e4]">
              {event.subtitle}
            </h4>
            <span className="text-xs text-[#ccc4ce]">
              15 de Outubro • 19h00 • Ilé Axé Omo Nanã
            </span>
          </div>

          <p className="text-[11px] text-[#eac34a] italic">
            "Venha preparado para celebrar junto à Menina." 🌹
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={generateAndDownloadImage}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#eac34a] to-[#cca830] text-[#3c2f00] font-['Syne'] font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Gerando Imagem...' : 'Baixar Imagem em Alta Resolução (PNG)'}
          </button>

          <button
            onClick={copyInviteText}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2a1b3d] text-[#d3beea] text-xs font-semibold flex items-center justify-center gap-2 border border-[#d3beea]/30 hover:bg-[#39294c] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Texto do Convite Copiado!' : 'Copiar Texto Completo do Convite'}
          </button>

          {navigator.share && (
            <button
              onClick={() => {
                navigator.share({
                  title: 'Festa da Menina - Da Vó da Casa',
                  text: 'Com muita alegria e respeito, convidamos você e sua entidade para celebrar conosco mais uma noite de festa, força e axé.',
                  url: window.location.href,
                });
              }}
              className="w-full py-2 px-4 rounded-xl bg-[#201f21] text-[#ccc4ce] text-xs font-medium flex items-center justify-center gap-2 border border-[#4a454d]/40 hover:text-[#e5e1e4] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Compartilhar pelo Celular
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
