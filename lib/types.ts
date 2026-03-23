export interface WineAnalysis {
  nome_vino: string;
  produttore: string;
  annata: string;
  regione: string;
  paese: string;
  denominazione: string;
  vitigni: string[];
  gradazione: string;
  temperatura_servizio: string;
  note_visive: string;
  note_olfattive: string;
  note_gustative: string;
  abbinamenti: string[];
  descrizione: string;
  confidenza: "alta" | "media" | "bassa" | "nulla";
}
