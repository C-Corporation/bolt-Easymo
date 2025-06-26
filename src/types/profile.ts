export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  updated_at: string | null;
  selected_workspace_id: string | null;
  role: 'owner' | 'agent' | 'admin' | null;
  selected_owner_id: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string | null;
}
