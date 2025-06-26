# Documentation Technique – EASYIMO

## 1. Stack Technique Principale
- **Frontend** : React + Vite + TypeScript
- **UI** : shadcn-ui, Tailwind CSS
- **Backend/DB** : Supabase (PostgreSQL)

## 2. Structure Globale du Projet
- `src/` : Code source principal (logique métier, composants, pages, hooks, etc.)
- `public/` : Fichiers statiques
- `supabase/` : Fichiers liés à la base de données (schema, migrations)
- `scripts/` : Scripts utilitaires

## 3. Supabase – Schéma de la Base de Données
### Tables principales :
- **profiles** : profils utilisateurs, liés à l’authentification Supabase
- **workspaces** : espaces de travail collaboratifs
- **workspace_members** : membres des workspaces (rôles, gestion)
- **owners** : propriétaires (liés à un workspace)
- **tenants** : locataires (liés à un owner)
- **properties** : biens immobiliers (liés à un owner et workspace)
- **documents** : documents liés à un owner
- **transactions** : mouvements financiers (liés à un owner, property, tenant)
- **rent_payments** : paiements de loyers

### Relations (exemples) :
- `owners.workspace_id` → `workspaces.id`
- `properties.owner_id` → `owners.id`
- `tenants.owner_id` → `owners.id`
- `documents.owner_id` → `owners.id`
- `transactions.owner_id` → `owners.id`

## 4. Sécurité – Row Level Security (RLS) et Policies
- **RLS activé** sur toutes les tables sensibles.
- **Policies** :
  - Les utilisateurs ne peuvent accéder/éditer que les données de leur workspace ou de leur propre profil.
  - Exemples :
    - `profiles` : accès limité à son propre profil (`auth.uid() = id`)
    - `workspaces` : accès aux workspaces dont l’utilisateur est membre
    - `owners`, `properties`, `tenants`, `documents`, `transactions`, `rent_payments` : accès limité au workspace sélectionné via la fonction `public.get_selected_workspace_id()`
- **Fonction utilitaire** :
  - `public.get_selected_workspace_id()` : renvoie le workspace sélectionné pour l’utilisateur courant
- **Exemple de policy** :
  ```sql
  CREATE POLICY "Users can view properties in their workspace"
    ON public.properties FOR SELECT
    USING (workspace_id = public.get_selected_workspace_id());
  ```

## 5. Extensions PostgreSQL Supabase utilisées
- `pgcrypto` : pour la génération de UUID
- `uuid-ossp` : pour la génération de UUID
- Autres extensions installées (non utilisées partout) : `earthdistance`, `fuzzystrmatch`, `pgaudit`, `postgis`, etc.

## 6. Migrations et Évolution du Schéma
- Les migrations SQL sont dans `supabase/migrations/`
- Historique des migrations principales :
  - Création des tables et relations de base
  - Ajout des workspaces et gestion des membres
  - Mise en place des policies RLS
  - Ajout/ajustement des tables : owners, tenants, transactions, rent_payments
  - Nettoyage et ajustement des policies

## 7. Notes complémentaires
- La documentation doit être mise à jour à chaque évolution du schéma ou des politiques de sécurité.
- Les scripts SQL sont la source de vérité pour la structure de la base et les accès.

---

*Document généré automatiquement par Cascade AI le 25/06/2025. Complétez et ajustez selon les évolutions futures du projet.*
