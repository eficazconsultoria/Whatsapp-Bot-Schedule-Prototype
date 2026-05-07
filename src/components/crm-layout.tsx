import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  Inbox,
  UserCog,
  Activity,
  Gauge,
  Boxes,
  Server,
  FileText,
  CreditCard,
  Calendar,
  MessageCircle,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Painel de Controle", icon: LayoutDashboard },
  { to: "/empresas", label: "Empresas", icon: Building2 },
  { to: "/contatos", label: "Contatos", icon: Users },
  { to: "/solicitacoes", label: "Solicitações", icon: Inbox },
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/whatsapp", label: "Bot WhatsApp", icon: MessageCircle },
  { to: "/usuarios", label: "Usuários", icon: UserCog },
];

const sistemaNav = [
  { to: "/sistema/logs", label: "Logs de Atividade", icon: Activity },
  { to: "/sistema/limits", label: "Plan Limits", icon: Gauge },
  { to: "/sistema/planos", label: "Planos", icon: Boxes },
  { to: "/sistema/tenants", label: "Tenants", icon: Server },
];

const finNav = [
  { to: "/financeiro/faturas", label: "Faturas", icon: FileText },
  { to: "/financeiro/assinaturas", label: "Assinaturas", icon: CreditCard },
];

export function CrmLayout() {
  const location = useLocation();

  // Hide CRM chrome on the WhatsApp simulation route — it's a fullscreen mobile view.
  if (location.pathname.startsWith("/whatsapp")) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 shrink-0 border-r border-border bg-[var(--sidebar-bg)] flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <span className="text-lg font-bold tracking-tight">UCRM</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 text-sm">
          <NavGroup items={mainNav} pathname={location.pathname} />
          <NavSection title="Sistema">
            <NavGroup items={sistemaNav} pathname={location.pathname} />
          </NavSection>
          <NavSection title="Financeiro">
            <NavGroup items={finNav} pathname={location.pathname} />
          </NavSection>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-end px-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Pesquisar"
              className="h-9 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
            SA
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="px-5 pb-2 text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function NavGroup({
  items,
  pathname,
}: {
  items: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  pathname: string;
}) {
  return (
    <ul className="space-y-0.5 px-2">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors",
                active && "bg-accent text-accent-foreground font-medium",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
