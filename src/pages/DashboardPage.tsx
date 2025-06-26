import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, TrendingUp, Users, Calendar, Clock, DollarSign, House } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyDashboardState } from "@/components/empty-states/empty-dashboard";
import OwnerEmptyState from "@/components/owners/OwnerEmptyState";
import { useOwners } from "@/contexts/OwnerContext";
import { useProperties } from "@/hooks/useProperties";
import { useTenants } from "@/hooks/useTenants";
import { useTransactions } from "@/hooks/useTransactions";

const DashboardPage = () => {
  // Hooks de données
  const { noOwners } = useOwners();
  const { properties, loading: loadingProperties } = useProperties();
  const { tenants, loading: loadingTenants } = useTenants();
  const { transactions, loading: loadingTransactions } = useTransactions();

  // Fonctions de calcul
  const calculateMonthlyRent = (transactions: any[]) => {
    return transactions
      ?.filter(t => {
        if (!t.date) return false; // Guard against null/undefined dates
        const transactionDate = new Date(t.date);
        if (isNaN(transactionDate.getTime())) return false; // Guard against invalid date strings

        return t.type === 'income' && t.category === 'loyer' && 
               transactionDate >= new Date(new Date().setMonth(new Date().getMonth() - 1)) &&
               transactionDate < new Date(new Date().setMonth(new Date().getMonth() + 1));
      })
      .reduce((sum, t) => sum + t.amount, 0)
      .toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
  };

  const calculateOccupationRate = (properties: any[]) => {
    if (!properties?.length) return 0;
    const occupied = properties.filter(p => p.status === 'occupied').length;
    return ((occupied / properties.length) * 100).toFixed(1);
  };

  const calculateTenantRent = (tenant: any, properties: any[]) => {
    const property = properties?.find(p => p.id === tenant.property_id);
    return property ? property.rent : 0;
  };

  // Gestion de l'état de chargement et de données
  const loading = loadingProperties || loadingTenants || loadingTransactions;
  const hasData = properties?.length > 0 || tenants?.length > 0;

  // Calcul des statistiques
  const stats = [
    {
      title: "Loyer mensuel total",
      value: calculateMonthlyRent(transactions),
      icon: <DollarSign className="h-4 w-4" />,
      link: "/finances"
    },
    {
      title: "Taux d'occupation",
      value: calculateOccupationRate(properties) + "%",
      icon: <Building2 className="h-4 w-4" />,
      link: "/biens"
    },
    {
      title: "Locataires actifs",
      value: tenants?.length?.toString() || "0",
      icon: <Users className="h-4 w-4" />,
      link: "/locataires"
    },
    {
      title: "Biens immobiliers",
      value: properties?.length?.toString() || "0",
      icon: <House className="h-4 w-4" />,
      link: "/biens"
    }
  ];

  // Calcul des activités récentes
  const recentActivities = transactions
    ?.filter(t => t.type === 'income' && t.category === 'loyer' && t.date && !isNaN(new Date(t.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      title: 'Paiement reçu',
      description: `${tenants?.find(tenant => tenant.id === t.tenant_id)?.last_name} - ${t.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })} - ${new Date(t.date).toLocaleDateString('fr-FR')}`,
      date: new Date(t.date).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    })) || [];

  // Calcul des échéanciers
  const upcomingPayments = tenants
    ?.map(tenant => ({
      id: tenant.id,
      tenant: `${tenant.first_name} ${tenant.last_name}`,
      amount: calculateTenantRent(tenant, properties),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 15)), // Garder comme objet Date
      status: 'À venir'
    }))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()) // Trier directement sur les objets Date
    .slice(0, 3) || [];

  if (noOwners) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OwnerEmptyState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : hasData ? (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className="h-4 w-4 text-gray-500">{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-2">
                    <Link to={stat.link} className="hover:text-blue-600">
                      Voir plus
                    </Link>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activités récentes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Échéanciers */}
          <Card>
            <CardHeader>
              <CardTitle>Échéanciers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{payment.tenant}</h3>
                      <p className="text-sm text-gray-500">Échéance : {payment.dueDate.toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{payment.amount.toLocaleString('fr-FR')} XOF</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyDashboardState />
      )}
    </div>
  );
};

export default DashboardPage;
