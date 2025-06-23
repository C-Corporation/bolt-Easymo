export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  notification_email: boolean;
  notification_loyer: boolean;
  notification_contrats: boolean;
  notification_reclamations: boolean;
  notification_entretien: boolean;
  notification_push: boolean;
  notification_rapports: boolean;
  created_at: string;
  updated_at: string;
}
