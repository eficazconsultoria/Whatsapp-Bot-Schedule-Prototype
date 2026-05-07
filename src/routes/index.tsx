import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, Users, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import { mockRequests, mockAppointments } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    { label: "Solicitações abertas", value: mockRequests.filter((r) => r.status !== "Fechado" && r.status !== "Perdido").length, icon: Inbox },
    { label: "Contatos ativos", value: 124, icon: Users },
    { label: "Agendas hoje", value: mockAppointments.length, icon: Calendar },
    { label: "Conversões mês", value: "18%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-muted-foreground">Painel de Controle</div>
        <h1 className="text-2xl font-bold mt-1">Visão geral</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold mt-3">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link
          to="/whatsapp"
          className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <MessageCircle className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-semibold">Simular Bot WhatsApp</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize o fluxo do bot na perspectiva do cliente final.
          </p>
        </Link>
        <Link
          to="/agenda"
          className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <Calendar className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-semibold">Agenda do backoffice</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie consultas marcadas pelos clientes.
          </p>
        </Link>
      </div>
    </div>
  );
}
