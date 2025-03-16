import { TBoolean, TLeadCuandoQuiereMudarse, TLeadEstadoHipoteca, TLeadFinanciacion, TLeadFinInversion, TLeadUsoVivienda } from "../enums";

interface MSubscriber {
  first_name: string;
  last_name?: string;
  phone: string;
  whatsapp_phone: string;
  email: string;
  gender: string;
  has_opt_in_sms: boolean;
  has_opt_in_email: boolean;
  consent_phrase: string;
}

interface MContactData {
  key: string;
  id: string;
  page_id: string;
  user_refs: string[];
  status: "active" | "inactive";
  first_name: string;
  last_name: string;
  name: string;
  gender?: string;
  profile_pic?: string | null;
  locale?: string | null;
  language?: string | null;
  timezone: string;
  live_chat_url: string;
  last_input_text?: string | null;
  optin_phone: boolean;
  phone?: string | null;
  optin_email: boolean;
  email?: string | null;
  subscribed: string;
  last_interaction?: string | null;
  ig_last_interaction?: string | null;
  last_seen?: string | null;
  ig_last_seen?: string | null;
  is_followup_enabled: boolean;
  ig_username?: string | null;
  ig_id?: string | null;
  whatsapp_phone?: string | null;
  optin_whatsapp: boolean;
  phone_country_code?: string | null;
  last_growth_tool?: string | null;
  custom_fields: {
    ahorros_disponibles?: number | null;
    cuando_quiere_mudarse?: TLeadCuandoQuiereMudarse | null;
    fin_inversion?: TLeadFinInversion | null;
    tipo_financiacion?: TLeadFinanciacion | null;
    uso_vivienda?: TLeadUsoVivienda | null;
    zona_interes?: string | null;
    estado_hipoteca?: TLeadEstadoHipoteca | null;
    venta_actual_propiedad?: TBoolean | null;
    chatbot_completado?: TBoolean | null;
  };
}

interface MBotField {
  field_id: number;
  field_value: string;
}

interface MSendFlow {
  subscriber_id: number;
  flow_ns: string;
}
