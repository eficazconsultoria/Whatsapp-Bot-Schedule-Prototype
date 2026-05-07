import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, LayoutGrid, Table as TableIcon, Filter, Search } from "lucide-react";
import { mockRequests, statusColumns, type CrmRequest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/solicitacoes")({
  component: SolicitacoesPage,
});

function SolicitacoesPage() {
  const [view, setView] = useState<"table" | "kanban">("table");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Solicitações &gt; Listar</div>
          <h1 className="text-2xl font-bold mt-1">
            {view === "table" ? "Solicitações" : "Solicitações (Kanban Mode)"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === "table" ? "kanban" : "table")}
            className="h-9 inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent"
          >
            {view === "table" ? <><LayoutGrid className="h-4 w-4" /> Visualização Kanban</> : <><TableIcon className="h-4 w-4" /> Visualização Tabela</>}
          </button>
          <button className="h-9 inline-flex items-center gap-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {view === "kanban" ? "+ Nova Solicitação" : "Criar Solicitação"}
          </button>
        </div>
      </div>

      {view === "table" ? <TableView /> : <KanbanView />}
    </div>
  );
}

function TableView() {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-end gap-2 p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Pesquisar"
            className="h-8 w-64 rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none"
          />
        </div>
        <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-input">
          <Filter className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-input">
          <TableIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="px-4 py-3 w-10"><input type="checkbox" /></th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Grupo</th>
              <th className="px-4 py-3 font-medium">Subgrupo</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Data conversão</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {mockRequests.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3"><input type="checkbox" /></td>
                <td className="px-4 py-3 font-medium">{r.titulo}</td>
                <td className="px-4 py-3">{r.contato}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3"><span className="text-primary">{r.canal}</span></td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3">{r.valor ? r.valor.toFixed(2) : ""}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.dataConversao || ""}</td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1 text-primary text-sm">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanView() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {statusColumns.map((status) => {
        const items = mockRequests.filter((r) => r.status === status);
        return (
          <div key={status} className="bg-card border border-border rounded-lg flex flex-col min-h-[400px]">
            <div className="p-3 border-b border-border flex items-center gap-2">
              <span className="text-sm font-medium">{status}</span>
              <span className="text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5">{items.length}</span>
            </div>
            <div className="p-3 space-y-2 flex-1">
              {items.map((r: CrmRequest) => (
                <div key={r.id} className={cn("bg-background border border-border rounded-md p-3 text-sm font-medium")}>
                  {r.titulo}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
