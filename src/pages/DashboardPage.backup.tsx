// Sauvegarde de la version actuelle de DashboardPage.tsx
// Cette version contient des tentatives de réparation avec des erreurs de syntaxe

import React from 'react';
import { Building2, Users, FileText, DollarSign, Home, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { EmptyDashboardState } from '@/components/dashboard/EmptyDashboardState';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import { useTransactions } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

const DashboardPage: React.FC = () => {
  // Utilisation des hooks pour récupérer les données
  const { properties, loading: loadingProperties } = useProperties();
  const { tenants, loading: loadingTenants } = useTenants();
  const { transactions, loading: loadingTransactions } = useTransactions();

  // Calcul des statistiques
  const stats = [
    {
      title: 'Biens immobiliers',
      value: properties.length.toString(),
      icon: <Home className="h-6 w-6 text-[#E84A33]" />,
      link: '/immobiliers'
    },
    {
      title: 'Locataires',
      value: tenants.length.toString(),
      icon: <Users className="h-6 w-6 text-[#E84A33]" />,
      link: '/locataires'
    },
    {
      title: 'Loyers mensuels',
      value: calculateMonthlyRent(transactions).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }),
      icon: <DollarSign className="h-6 w-6 text-[#E84A33]" />
    },
    {
      title: 'Taux d\'occupation',
      value: calculateOccupationRate(properties).toFixed(1) + '%',
      icon: <BarChart2 className="h-6 w-6 text-[#E84A33]" />
    }
  ];

  // Calcul des activités récentes
  const recentActivities = transactions
    .filter(t => t.type === 'income' && t.category === 'loyer')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      title: 'Paiement reçu',
      description: `${t.tenant_id ? 'M.' : 'Mme.'} ${tenants.find(tenant => tenant.id === t.tenant_id)?.last_name} - ${t.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })} - ${format(new Date(t.date), 'MMMM yyyy', { locale: fr })}`,
      date: format(new Date(t.date), 'dd/MM/yyyy', { locale: fr }),
      type: 'paiement'
    }));

  // Calcul des prochains échéanciers
  const upcomingPayments = tenants
    .map(tenant => ({
      id: tenant.id,
      tenant: `${tenant.first_name} ${tenant.last_name}`,
      amount: calculateTenantRent(tenant, properties),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 15)), 'dd/MM/yyyy', { locale: fr }),
      status: 'À venir'
    }))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Fonctions utilitaires
  const calculateMonthlyRent = (transactions: any[]) => {
    return transactions
      .filter(t => t.type === 'income' && t.category === 'loyer' && 
                 new Date(t.date) >= new Date(new Date().setMonth(new Date().getMonth() - 1)) &&
                 new Date(t.date) < new Date(new Date().setMonth(new Date().getMonth() + 1)))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateOccupationRate = (properties: any[]) => {
    if (properties.length === 0) return 0;
    const occupied = properties.filter(p => p.status === 'occupied').length;
    return (occupied / properties.length) * 100;
  };

  const calculateTenantRent = (tenant: any, properties: any[]) => {
    const property = properties.find(p => p.id === tenant.property_id);
    return property ? property.rent_amount : 0;
  };

  // Affichage
  const loading = loadingProperties || loadingTenants || loadingTransactions;
  const hasData = properties.length > 0 || tenants.length > 0 || transactions.length > 0;

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* En-tête fixe */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-screen-xl mx-auto w-full">
          <div className="flex justify-between items-left">
            <div className="">
              <h1 className="text-2xl font-bold text-[#2A2F36]">Tableau de bord</h1>
              <p className="text-sm text-gray-500">Vue d'ensemble de votre portefeuille immobilier</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto py-6 px-[10px]">
          <div className="max-w-screen-xl mx-auto w-full space-y-6">
            
            {/* Cartes de statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-[#F8F9FA]">
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.link && (
                      <Link to={stat.link} className="text-sm text-[#E84A33] hover:underline">
                        Voir détails
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dernières activités */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2 lg:col-span-2 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Dernières activités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex-shrink-0 p-2 bg-[#F8F9FA] rounded-lg mr-3">
                          <FileText className="h-5 w-5 text-[#E84A33]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {activity.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prochains échéanciers */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Prochains échéanciers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingPayments.map(payment => (
                      <div key={payment.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{payment.tenant}</p>
                          <p className="text-xs text-gray-500">Échéance: {payment.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-white text-[#E84A33] border-[#E84A33] hover:bg-[#F8F9FA] hover:text-[#E84A33] hover:border-[#E84A33]">
                    Voir tous les échéanciers
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Section des biens immobiliers */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Vos biens immobiliers</CardTitle>
                <div className="flex justify-end w-full">
                  <Button variant="outline" className="bg-white text-[#E84A33] border-[#E84A33] hover:bg-[#F8F9FA] hover:text-[#E84A33] hover:border-[#E84A33] w-auto">
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map(property => (
                    <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-gray-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{property.name}</h3>
                        <p className="text-sm text-gray-500">{property.address}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {property.rent_amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}/mois
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            property.status === 'occupied' ? 'bg-green-100 text-green-800' : 
                            property.status === 'vacant' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {property.status === 'occupied' ? 'Loué' : 
                             property.status === 'vacant' ? 'Libre' : 
                             'Indisponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
