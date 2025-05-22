
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre compte</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium">Profil utilisateur</h3>
            <p className="text-sm text-muted-foreground">Mettez à jour vos informations personnelles</p>
          </div>
          <div className="p-6 pt-0">
            <form className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nom complet
                </label>
                <input
                  id="name"
                  className="rounded-md border px-3 py-2 text-sm"
                  defaultValue="Philippe ZEKE"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="rounded-md border px-3 py-2 text-sm"
                  defaultValue="philippe.zeke@example.com"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Téléphone
                </label>
                <input
                  id="phone"
                  className="rounded-md border px-3 py-2 text-sm"
                  defaultValue="+33 6 12 34 56 78"
                />
              </div>
              <button className="bg-[#E84A33] hover:bg-[#d43f2a] text-white px-4 py-2 rounded-md">
                Enregistrer les changements
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium">Sécurité</h3>
            <p className="text-sm text-muted-foreground">Mettez à jour vos paramètres de sécurité</p>
          </div>
          <div className="p-6 pt-0">
            <form className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="current-password" className="text-sm font-medium">
                  Mot de passe actuel
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  Nouveau mot de passe
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <button className="bg-[#E84A33] hover:bg-[#d43f2a] text-white px-4 py-2 rounded-md">
                Changer le mot de passe
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">Gérez vos préférences de notification</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[
                'Notifications par email',
                'Notifications par SMS',
                'Rappels de paiement',
                'Alertes de maintenance'
              ].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">Recevoir des notifications pour {item.toLowerCase()}</p>
                  </div>
                  <div className="relative h-6 w-11 rounded-full bg-muted">
                    <div className="absolute h-5 w-5 translate-y-[2px] translate-x-[2px] rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium">Préférences</h3>
            <p className="text-sm text-muted-foreground">Personnalisez votre expérience</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Langue
                </label>
                <select id="language" className="rounded-md border px-3 py-2 text-sm">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Fuseau horaire
                </label>
                <select id="timezone" className="rounded-md border px-3 py-2 text-sm">
                  <option value="europe/paris">Europe/Paris (UTC+1)</option>
                  <option value="europe/london">Europe/London (UTC)</option>
                  <option value="america/new_york">America/New York (UTC-5)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Thème sombre</p>
                  <p className="text-xs text-muted-foreground">Utiliser un thème sombre</p>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-muted">
                  <div className="absolute right-0 h-5 w-5 translate-y-[2px] translate-x-[-2px] rounded-full bg-[#E84A33] shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
