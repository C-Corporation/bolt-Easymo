import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
const SettingsPage: React.FC = () => {
  return <div className="h-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#2A2F36]">Paramètres</h1>
        
        <Tabs defaultValue="compte" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-xl mb-6">
            <TabsTrigger value="compte" className="text-[e84a33] bg-[#e84a33] text-slate-50">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
            <TabsTrigger value="facturation">Facturation</TabsTrigger>
          </TabsList>
          
          {/* Paramètres du compte */}
          <TabsContent value="compte">
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>
                  Modifiez vos informations personnelles et de contact.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-1/2 space-y-2">
                    <Label htmlFor="firstname">Prénom</Label>
                    <Input id="firstname" defaultValue="Philippe" className="bg-slate-50" />
                  </div>
                  <div className="w-full sm:w-1/2 space-y-2">
                    <Label htmlFor="lastname">Nom</Label>
                    <Input id="lastname" defaultValue="ZEKE" className="bg-slate-50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="philippe.zeke@example.com" className="bg-slate-50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" defaultValue="06 12 34 56 78" className="bg-slate-50" />
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-[#E84A33] hover:bg-[#E84A33]/90">Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Adresse postale</CardTitle>
                <CardDescription>
                  Adresse utilisée pour les documents officiels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue="15 rue des Lilas" className="bg-slate-50" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-1/3 space-y-2">
                    <Label htmlFor="postal">Code postal</Label>
                    <Input id="postal" defaultValue="75020" className="bg-slate-50" />
                  </div>
                  <div className="w-full sm:w-2/3 space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue="Paris" className="bg-slate-50" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-[#E84A33] hover:bg-[#E84A33]/90">Enregistrer l'adresse</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Paramètres des notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez comment vous souhaitez être alerté des événements importants.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Types de notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Paiement de loyer</p>
                        <p className="text-sm text-gray-500">Notifications de paiements reçus ou en retard</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Contrats et baux</p>
                        <p className="text-sm text-gray-500">Alertes de renouvellement ou expiration</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Réclamations locataires</p>
                        <p className="text-sm text-gray-500">Demandes et problèmes signalés</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Rappels d'entretien</p>
                        <p className="text-sm text-gray-500">Maintenance programmée et interventions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications push</p>
                      <p className="text-sm text-gray-500">Recevoir des notifications sur votre appareil</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rapports mensuels</p>
                      <p className="text-sm text-gray-500">Résumé mensuel de votre activité</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Paramètres de sécurité */}
          <TabsContent value="securite">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez votre mot de passe et les paramètres de sécurité.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Modifier le mot de passe</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-[#E84A33] hover:bg-[#E84A33]/90">Modifier le mot de passe</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Authentification à deux facteurs</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Activer l'authentification à deux facteurs</p>
                      <p className="text-sm text-gray-500">Sécurisez votre compte avec une vérification supplémentaire</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Sessions actives</h3>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Paris, France</p>
                        <p className="text-sm text-gray-500">Chrome • Windows • Aujourd'hui à 14:25</p>
                      </div>
                      <p className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Actuelle</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Button variant="outline">Se déconnecter des autres appareils</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Paramètres de facturation */}
          <TabsContent value="facturation">
            <Card>
              <CardHeader>
                <CardTitle>Facturation et abonnement</CardTitle>
                <CardDescription>
                  Gérez votre plan d'abonnement et vos informations de paiement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Plan Professionnel</h3>
                        <p className="text-sm text-gray-500">Facturé annuellement</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="font-bold text-xl">29,99 € <span className="text-sm font-normal text-gray-500">/mois</span></p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm">Prochain renouvellement le 15/08/2025</p>
                      <Button variant="outline" className="text-sm">Changer de plan</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Mode de paiement</h3>
                    
                    <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-1 rounded">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#1A1F36" />
                            <path d="M7 15H17V9H7V15Z" fill="#FF6B6C" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Carte Mastercard</p>
                          <p className="text-sm text-gray-500">Se terminant par 4242 • Expire 12/26</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Modifier</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Historique des factures</h3>
                      <Button variant="outline" size="sm">Télécharger tout</Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3">FAC-2025-042</td>
                            <td className="px-4 py-3">15/04/2025</td>
                            <td className="px-4 py-3">359,88 €</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Payé</span></td>
                            <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">PDF</Button></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3">FAC-2024-042</td>
                            <td className="px-4 py-3">15/04/2024</td>
                            <td className="px-4 py-3">359,88 €</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Payé</span></td>
                            <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">PDF</Button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default SettingsPage;