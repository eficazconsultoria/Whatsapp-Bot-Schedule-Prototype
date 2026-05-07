import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Video, MapPin, MessageCircle } from "lucide-react";
import { mockAppointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agenda")({
  component: AgendaPage,
});

const channelMeta = {
  video: { label: "Vídeo", Icon: Video },
  presencial: { label: "Presencial", Icon: MapPin },
  whatsapp: { label: "WhatsApp", Icon: MessageCircle },
};

function AgendaPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const monthLabel = cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const startWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();

  const today = new Date().toISOString().slice(0, 10);
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dateKey(day: number) {
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${cursor.getFullYear()}-${m}-${d}`;
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm text-muted-foreground">Agenda</div>
        <h1 className="text-2xl font-bold mt-1">Calendário do backoffice</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie as consultas marcadas pelos clientes via bot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="font-semibold capitalize">{monthLabel}</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground border-b border-border">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
              <div key={d} className="px-2 py-2 text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="h-24 border-r border-b border-border bg-muted/20" />;
              const k = dateKey(day);
              const events = mockAppointments.filter((a) => a.date === k);
              const isToday = k === today;
              return (
                <div key={i} className={cn("h-24 border-r border-b border-border p-1.5 text-xs flex flex-col", isToday && "bg-accent/40")}>
                  <span className={cn("font-medium", isToday && "text-primary")}>{day}</span>
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {events.slice(0, 2).map((e) => (
                      <div key={e.id} className="bg-primary/10 text-primary rounded px-1.5 py-0.5 truncate">
                        {e.time} {e.contact}
                      </div>
                    ))}
                    {events.length > 2 && <div className="text-muted-foreground">+{events.length - 2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="font-semibold mb-4">Próximas consultas</h2>
          <ul className="space-y-3">
            {mockAppointments.map((a) => {
              const meta = channelMeta[a.channel];
              const Icon = meta.Icon;
              return (
                <li key={a.id} className="border border-border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{a.contact}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(a.date)} · {a.time}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{a.topic}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                    <Icon className="h-3 w-3" /> {meta.label}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
