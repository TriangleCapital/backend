interface MSubscriber {
  first_name: string;
  last_name: string;
  phone: string;
  whatsapp_phone: string;
  email: string;
  gender: string;
  has_opt_in_sms: boolean;
  has_opt_in_email: boolean;
  consent_phrase: string;
}

interface MBotField {
  field_id: number;
  field_value: string;
}
