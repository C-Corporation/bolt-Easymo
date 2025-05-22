import React from 'react';
import { Building2, Users, FileText, DollarSign, Home, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const DashboardPage: React.FC = () => {
  // Données factices pour les statistiques
  const stats = [{
    title: 'Biens immobiliers',
    value: '24',
    icon: <Home className="h-6 w-6 text-[#E84A33]" />,
    link: '/immobiliers'
  }, {
    title: 'Locataires',
    value: '18',
    icon: <Users className="h-6 w-6 text-[#E84A33]" />,
    link: '/locataires'
  }, {
    title: 'Loyers mensuels',
    value: '12 450 €',
    icon: <DollarSign className="h-6 w-6 text-[#E84A33]" />
  }, {
    title: 'Taux d\'occupation',
    value: '85%',
    icon: <BarChart2 className="h-6 w-6 text-[#E84A33]" />
  }];

  // Dernières activités
  const recentActivities = [{
    id: 1,
    title: 'Nouveau contrat signé',
    description: 'M. Dupont - Appartement B12',
    date: '20/05/2025',
    type: 'contrat'
  }, {
    id: 2,
    title: 'Paiement reçu',
    description: 'Mme Martin - 750€ - Mai 2025',
    date: '19/05/2025',
    type: 'paiement'
  }, {
    id: 3,
    title: 'Visite programmée',
    description: 'Appartement A5 - Demain 14h',
    date: '18/05/2025',
    type: 'visite'
  }];

  // Prochains échéanciers
  const upcomingPayments = [{
    id: 1,
    tenant: 'M. Durand',
    amount: '750 €',
    dueDate: '05/06/2025',
    status: 'À venir'
  }, {
    id: 2,
    tenant: 'Mme Leroy',
    amount: '620 €',
    dueDate: '05/06/2025',
    status: 'À venir'
  }, {
    id: 3,
    tenant: 'M. et Mme Bernard',
    amount: '850 €',
    dueDate: '10/06/2025',
    status: 'À venir'
  }];
  return <div className="flex flex-col min-h-0 h-full">
      {/* En-tête fixe */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-screen-xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="">
              <h1 className="text-4xl font-bold text-white text-left">Tableau de bord</h1>
              <p className="text-white">Vue d'ensemble de votre portefeuille immobilier</p>
            </div>
            <div className="flex-shrink-0">
              <Button asChild>
                
              </Button>
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
        {stats.map((stat, index) => <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
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
              {stat.link && <Link to={stat.link} className="text-sm text-[#E84A33] hover:underline">
                  Voir détails
                </Link>}
            </CardContent>
          </Card>)}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Dernières activités */}
        <Card className="md:col-span-2 lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dernières activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map(activity => <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
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
                </div>)}
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
              {upcomingPayments.map(payment => <div key={payment.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.tenant}</p>
                    <p className="text-xs text-gray-500">Échéance: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{payment.amount}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </div>
                </div>)}
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
            {/* Exemple de bien immobilier */}
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-300" />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Appartement B12</h3>
                <p className="text-sm text-gray-500">12 Rue de la Paix, 75001 Paris</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm font-medium">850 €/mois</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Loué</span>
                </div>
              </div>
            </div>
            {/* Ajoutez d'autres biens ici */}
          </div>
        </CardContent>
      </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default DashboardPage;