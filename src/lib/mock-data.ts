export type RequestStatus = "Novo" | "Em contato" | "Em negociação" | "Fechado" | "Perdido";

export interface CrmRequest {
  id: string;
  titulo: string;
  contato: string;
  status: RequestStatus;
  canal: "whatsapp" | "email" | "form";
  tipo?: string;
  grupo?: string;
  subgrupo?: string;
  valor?: number;
  dataConversao?: string;
}

export const mockRequests: CrmRequest[] = [
  { id: "1", titulo: "Harum delectus sequi iste molestias.", contato: "Edilson", status: "Em negociação", canal: "whatsapp" },
  { id: "2", titulo: "Fugiat aliquam itaque rerum animi adipisci.", contato: "Luiz", status: "Fechado", canal: "email" },
  { id: "3", titulo: "Aut et impedit sed veniam.", contato: "Flávia", status: "Em negociação", canal: "whatsapp", dataConversao: "nov 12, 2025 13:01:52" },
  { id: "4", titulo: "Perferendis quaerat autem.", contato: "Naiara", status: "Perdido", canal: "form" },
  { id: "5", titulo: "Sint voluptas qui voluptatibus.", contato: "Théo", status: "Fechado", canal: "email" },
  { id: "6", titulo: "Neque id reprehenderit sit non sint.", contato: "Stefany", status: "Em negociação", canal: "email", dataConversao: "mai 21, 2025 02:55:03" },
  { id: "7", titulo: "Consequatur ab magnam.", contato: "Flávio", status: "Em negociação", canal: "form", valor: 4197.94 },
  { id: "8", titulo: "Temporibus voluptatem ut laborum est.", contato: "Richard", status: "Perdido", canal: "email" },
  { id: "9", titulo: "Soluta voluptates quod debitis.", contato: "Luiz", status: "Em contato", canal: "email" },
  { id: "10", titulo: "Voluptas et occaecati numquam occaecati.", contato: "Marina", status: "Novo", canal: "whatsapp" },
  { id: "11", titulo: "Voluptates cum corrupti qui.", contato: "Pedro", status: "Em contato", canal: "whatsapp" },
  { id: "12", titulo: "Voluptas repellendus sit ullam accusantium sit.", contato: "Ana", status: "Em contato", canal: "form" },
  { id: "13", titulo: "Ut mollitia veritatis et aut aut.", contato: "Carlos", status: "Fechado", canal: "email" },
  { id: "14", titulo: "Omnis sit dicta harum culpa.", contato: "Júlia", status: "Fechado", canal: "whatsapp" },
];

export const statusColumns: RequestStatus[] = ["Novo", "Em contato", "Em negociação", "Fechado", "Perdido"];

export const canalColors: Record<string, string> = {
  whatsapp: "text-primary",
  email: "text-primary",
  form: "text-primary",
};

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  contact: string;
  topic: string;
  channel: "whatsapp" | "presencial" | "video";
}

export const mockAppointments: Appointment[] = [
  { id: "a1", date: todayPlus(0), time: "09:00", contact: "Marina Costa", topic: "Demonstração do produto", channel: "video" },
  { id: "a2", date: todayPlus(0), time: "11:30", contact: "Pedro Almeida", topic: "Consulta inicial", channel: "whatsapp" },
  { id: "a3", date: todayPlus(1), time: "14:00", contact: "Ana Souza", topic: "Reunião de fechamento", channel: "presencial" },
  { id: "a4", date: todayPlus(2), time: "10:00", contact: "Carlos Lima", topic: "Follow-up proposta", channel: "video" },
  { id: "a5", date: todayPlus(3), time: "16:30", contact: "Júlia Pereira", topic: "Onboarding", channel: "whatsapp" },
  { id: "a6", date: todayPlus(5), time: "15:00", contact: "Edilson Rocha", topic: "Renovação contrato", channel: "presencial" },
];

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
