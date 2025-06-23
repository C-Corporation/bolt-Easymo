
import React, { useState } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { DollarSign, Plus } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { COLORS } from '@/constants/colors';

const FinancesPage: React.FC = () => {
  const { transactions, loading, addTransaction } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // Données pour les graphiques (en FCFA)
  const monthlyData = [
    { name: 'Jan', revenus: 4250000, depenses: 1375000 },
    { name: 'Fév', revenus: 4460000, depenses: 1245000 },
    { name: 'Mar', revenus: 4460000, depenses: 1443000 },
    { name: 'Avr', revenus: 4265000, depenses: 1312000 },
    { name: 'Mai', revenus: 4429000, depenses: 1509000 },
    { name: 'Jun', revenus: 4429000, depenses: 1181000 },
  ];

  const pieData = [
    { name: 'Loyers', value: 4429000, color: '#E84A33' },
    { name: 'Charges', value: 787000, color: '#4A4F55' },
    { name: 'Maintenance', value: 525000, color: '#9CA3AF' },
    { name: 'Assurances', value: 350, color: '#63686F' },
    { name: 'Taxes', value: 450, color: '#2A2F36' },
  ];
  
  const COLORS = pieData.map(item => item.color);

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2A2F36]">Finances</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une transaction
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState 
          title="Aucune transaction financière enregistrée"
          description="Commencez par ajouter vos revenus et dépenses pour suivre la santé financière de votre parc immobilier."
          buttonText="Ajouter une transaction"
          onButtonClick={() => { /* TODO: Open add transaction dialog */ }}
          icon={<DollarSign className="w-16 h-16" />}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Statistiques financières */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Revenu mensuel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#E84A33]">
                  {transactions
                    .filter(t => t.type === 'income' && t.date >= new Date(new Date().setMonth(new Date().getMonth() - 1)))
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Dépenses mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {transactions
                    .filter(t => t.type === 'expense' && t.date >= new Date(new Date().setMonth(new Date().getMonth() - 1)))
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Bénéfice net</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {transactions
                    .filter(t => t.date >= new Date(new Date().setMonth(new Date().getMonth() - 1)))
                    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
                    .toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Rentabilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {(() => {
                    const totalIncome = transactions
                      .filter(t => t.type === 'income')
                      .reduce((sum, t) => sum + t.amount, 0);
                    const totalExpenses = transactions
                      .filter(t => t.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0);
                    if (totalIncome === 0) return '0%';
                    return `${((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%`;
                  })()}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Revenus vs Dépenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      ...transactions
                        .filter(t => t.date >= new Date(new Date().setMonth(new Date().getMonth() - 5)))
                        .reduce((acc, t) => {
                          const month = t.date.toLocaleString('fr-FR', { month: 'short' });
                          acc[month] = acc[month] || { name: month, revenus: 0, depenses: 0 };
                          acc[month][t.type === 'income' ? 'revenus' : 'depenses'] += t.amount;
                          return acc;
                        }, {} as Record<string, { name: string; revenus: number; depenses: number }>)
                        .map(entry => entry[1])
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`} />
                    <Legend />
                    <Bar dataKey="revenus" name="Revenus" fill="#E84A33" />
                    <Bar dataKey="depenses" name="Dépenses" fill="#9CA3AF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Répartition des dépenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        ...transactions
                          .filter(t => t.type === 'expense')
                          .reduce((acc, t) => {
                            acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
                            acc[t.category].value += t.amount;
                            return acc;
                          }, {} as Record<string, { name: string; value: number }>)
                          .map(entry => entry[1])
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Transactions récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500">
                      <th className="text-left pb-4">Date</th>
                      <th className="text-left pb-4">Description</th>
                      <th className="text-left pb-4">Catégorie</th>
                      <th className="text-right pb-4">Montant</th>
                      <th className="text-left pb-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions
                      .slice(0, 5)
                      .map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="py-3">{transaction.date.toLocaleDateString('fr-FR')}</td>
                          <td className="py-3">{transaction.description}</td>
                          <td className="py-3">
                            {transaction.category === 'loyer' ? 'Loyer' : transaction.category}
                          </td>
                          <td className="py-3">
                            {transaction.type === 'income' ? '+' : '-'}
                            {transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'received' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>{
                              transaction.status === 'received' ? 'Reçu' :
                              transaction.status === 'paid' ? 'Payé' :
                              'En attente'
                            }</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );


};

export default FinancesPage;
