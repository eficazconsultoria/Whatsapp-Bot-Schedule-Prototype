import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/whatsapp")({
  component: WhatsAppSim,
});

type StepId =
  | "welcome"
  | "menu"
  | "support"
  | "sales"
  | "schedule_intro"
  | "schedule_pick_date"
  | "schedule_pick_time"
  | "schedule_confirmed"
  | "request_opened"
  | "end";

interface Message {
  id: string;
  from: "bot" | "user";
  text?: string;
  time: string;
  buttons?: { label: string; next: StepId }[];
  custom?: "datepicker" | "timepicker" | "summary";
}

const slots = ["09:00", "10:30", "13:00", "14:30", "16:00"];

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function WhatsAppSim() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    runStep("welcome");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function botSay(parts: Omit<Message, "id" | "from" | "time">[], delay = 700) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        ...parts.map((p, i) => ({
          ...p,
          id: `${Date.now()}-${i}-${Math.random()}`,
          from: "bot" as const,
          time: nowTime(),
        })),
      ]);
    }, delay);
  }

  function userSay(text: string) {
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, from: "user", text, time: nowTime() },
    ]);
  }

  function runStep(step: StepId) {
    switch (step) {
      case "welcome":
        botSay([
          { text: "Olá! 👋 Eu sou o assistente virtual da *UCRM*." },
          {
            text: "Como posso te ajudar hoje?",
            buttons: [
              { label: "💼 Falar com vendas", next: "sales" },
              { label: "🛟 Suporte técnico", next: "support" },
              { label: "📅 Agendar consulta", next: "schedule_intro" },
            ],
          },
        ]);
        break;
      case "sales":
        botSay([
          { text: "Ótimo! Vou registrar seu interesse comercial. 💼" },
          {
            text: "Você gostaria de:",
            buttons: [
              { label: "Receber proposta por e-mail", next: "request_opened" },
              { label: "Agendar uma demonstração", next: "schedule_intro" },
            ],
          },
        ]);
        break;
      case "support":
        botSay([
          { text: "Sinto muito pelo problema 😕. Vou abrir um chamado e nossa equipe entra em contato." },
          {
            text: "Confirma a abertura da solicitação?",
            buttons: [
              { label: "✅ Sim, abrir solicitação", next: "request_opened" },
              { label: "↩️ Voltar ao menu", next: "menu" },
            ],
          },
        ]);
        break;
      case "menu":
        runStep("welcome");
        break;
      case "schedule_intro":
        botSay([
          { text: "Perfeito! Vamos marcar sua consulta. 📅" },
          { text: "Selecione uma data disponível:", custom: "datepicker" },
        ]);
        break;
      case "schedule_pick_time":
        botSay([{ text: "Agora escolha o melhor horário:", custom: "timepicker" }]);
        break;
      case "schedule_confirmed":
        botSay([
          { custom: "summary", time: nowTime() } as Omit<Message, "id" | "from" | "time">,
          {
            text: "Quer registrar essa conversa como uma solicitação no nosso CRM?",
            buttons: [
              { label: "✅ Abrir solicitação", next: "request_opened" },
              { label: "Não, obrigado", next: "end" },
            ],
          },
        ]);
        break;
      case "request_opened": {
        const id = `SOL-${Math.floor(Math.random() * 9000 + 1000)}`;
        setRequestId(id);
        botSay([
          { text: `Pronto! Abri a solicitação *#${id}* no UCRM. Nossa equipe já foi notificada. 🚀` },
          { text: "Posso ajudar com mais alguma coisa?", buttons: [{ label: "Voltar ao início", next: "welcome" }] },
        ]);
        break;
      }
      case "end":
        botSay([{ text: "Obrigado pelo contato! Estarei por aqui sempre que precisar. 😄" }]);
        break;
    }
  }

  function handleButton(label: string, next: StepId) {
    userSay(label);
    setTimeout(() => runStep(next), 400);
  }

  function handleDatePick(dateIso: string) {
    setPickedDate(dateIso);
    userSay(`📅 ${formatDateLong(dateIso)}`);
    setTimeout(() => runStep("schedule_pick_time"), 400);
  }

  function handleTimePick(time: string) {
    setPickedTime(time);
    userSay(`⏰ ${time}`);
    setTimeout(() => runStep("schedule_confirmed"), 400);
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Phone frame */}
        <div className="relative w-[380px] h-[780px] bg-black rounded-[3rem] p-3 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
          <div className="w-full h-full rounded-[2.4rem] overflow-hidden flex flex-col bg-[var(--whatsapp-bg)]">
            {/* Header */}
            <div className="bg-[var(--whatsapp-green)] text-white px-3 py-3 flex items-center gap-3 pt-8">
              <ArrowLeft className="h-5 w-5" />
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">U</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">UCRM Assistente</div>
                <div className="text-[11px] opacity-80">online</div>
              </div>
              <Video className="h-5 w-5" />
              <Phone className="h-5 w-5" />
              <MoreVertical className="h-5 w-5" />
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
              style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%222%22 cy=%222%22 r=%221%22 fill=%22%23ddd%22 opacity=%220.3%22/></svg>')" }}
            >
              {messages.map((m) => (
                <Bubble
                  key={m.id}
                  msg={m}
                  pickedDate={pickedDate}
                  pickedTime={pickedTime}
                  onButton={handleButton}
                  onDate={handleDatePick}
                  onTime={handleTimePick}
                />
              ))}
              {typing && (
                <div className="flex">
                  <div className="bg-[var(--whatsapp-bubble-in)] rounded-lg px-3 py-2 text-xs text-muted-foreground shadow">
                    digitando…
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="bg-[var(--whatsapp-bg)] p-2 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full flex items-center px-3 py-2 gap-2 shadow-sm">
                <Smile className="h-5 w-5 text-muted-foreground" />
                <input disabled placeholder="Use os botões acima…" className="flex-1 text-sm bg-transparent outline-none" />
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </div>
              <button className="h-11 w-11 rounded-full bg-[var(--whatsapp-green)] text-white flex items-center justify-center">
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="max-w-sm bg-card border border-border rounded-lg p-5 space-y-3">
          <Link to="/" className="text-xs text-primary inline-flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Voltar ao painel</Link>
          <h2 className="text-lg font-bold">Simulação do bot WhatsApp</h2>
          <p className="text-sm text-muted-foreground">
            Esta tela mostra como o cliente final interage com o bot da UCRM diretamente do WhatsApp. O bot apresenta menus, agenda consultas (estilo Calendly) e abre uma solicitação no CRM ao final do atendimento.
          </p>
          {requestId && (
            <div className="bg-accent text-accent-foreground rounded-md p-3 text-sm">
              ✅ Solicitação <strong>#{requestId}</strong> registrada — visível em{" "}
              <Link to="/solicitacoes" className="underline">Solicitações</Link>.
            </div>
          )}
          {pickedDate && pickedTime && (
            <div className="bg-muted rounded-md p-3 text-sm">
              📅 Consulta marcada para <strong>{formatDateLong(pickedDate)}</strong> às <strong>{pickedTime}</strong>.<br />
              Verifique em <Link to="/agenda" className="underline text-primary">Agenda</Link>.
            </div>
          )}
          <button
            onClick={() => {
              setMessages([]);
              setPickedDate(null);
              setPickedTime(null);
              setRequestId(null);
              setTimeout(() => runStep("welcome"), 200);
            }}
            className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Reiniciar conversa
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  msg,
  pickedDate,
  pickedTime,
  onButton,
  onDate,
  onTime,
}: {
  msg: Message;
  pickedDate: string | null;
  pickedTime: string | null;
  onButton: (label: string, next: StepId) => void;
  onDate: (iso: string) => void;
  onTime: (t: string) => void;
}) {
  const isUser = msg.from === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 shadow-sm text-sm",
          isUser ? "bg-[var(--whatsapp-bubble-out)]" : "bg-[var(--whatsapp-bubble-in)]",
        )}
      >
        {msg.text && <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />}

        {msg.custom === "datepicker" && <DatePicker onPick={onDate} disabled={!!pickedDate} />}
        {msg.custom === "timepicker" && <TimePicker onPick={onTime} disabled={!!pickedTime} />}
        {msg.custom === "summary" && <SummaryCard date={pickedDate!} time={pickedTime!} />}

        {msg.buttons && (
          <div className="mt-2 flex flex-col gap-1.5">
            {msg.buttons.map((b) => (
              <button
                key={b.label}
                onClick={() => onButton(b.label, b.next)}
                className="text-[var(--whatsapp-green)] text-sm font-medium border-t border-muted pt-1.5 hover:opacity-80"
              >
                {b.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground mt-1">
          {msg.time}
          {isUser && <CheckCheck className="h-3 w-3 text-blue-500" />}
          {!isUser && <Check className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}

function formatText(s: string) {
  return s.replace(/\*(.+?)\*/g, "<strong>$1</strong>");
}

function DatePicker({ onPick, disabled }: { onPick: (iso: string) => void; disabled: boolean }) {
  const [cursor, setCursor] = useState(() => new Date());
  const month = cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const year = cursor.getFullYear();
  const m = cursor.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const startWeekday = new Date(year, m, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="mt-2 bg-white rounded-md border border-border p-2 w-[260px]">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCursor(new Date(year, m - 1, 1))} className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-semibold capitalize">{month}</span>
        <button onClick={() => setCursor(new Date(year, m + 1, 1))} className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-[10px] text-muted-foreground mb-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div key={i} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, m, day);
          const past = date < today;
          const isSunday = date.getDay() === 0;
          const dis = disabled || past || isSunday;
          return (
            <button
              key={i}
              disabled={dis}
              onClick={() => {
                const iso = `${year}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                onPick(iso);
              }}
              className={cn(
                "h-7 text-xs rounded",
                dis ? "text-muted-foreground/40" : "hover:bg-[var(--whatsapp-green)] hover:text-white text-foreground",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimePicker({ onPick, disabled }: { onPick: (t: string) => void; disabled: boolean }) {
  return (
    <div className="mt-2 bg-white rounded-md border border-border p-2 w-[220px]">
      <div className="grid grid-cols-2 gap-1.5">
        {slots.map((t) => (
          <button
            key={t}
            disabled={disabled}
            onClick={() => onPick(t)}
            className="text-xs py-1.5 rounded border border-[var(--whatsapp-green)] text-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green)] hover:text-white disabled:opacity-50"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ date, time }: { date: string; time: string }) {
  return (
    <div className="bg-accent rounded-md p-2 text-xs space-y-1">
      <div className="font-semibold">✅ Consulta confirmada</div>
      <div>📅 {formatDateLong(date)}</div>
      <div>⏰ {time}</div>
    </div>
  );
}

function formatDateLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}
