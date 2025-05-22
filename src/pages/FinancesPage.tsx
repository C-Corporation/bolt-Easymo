
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const FinancesPage: React.FC = () => {
  // Données pour les graphiques
  const monthlyData = [
    { name: 'Jan', revenus: 6500, depenses: 2100 },
    { name: 'Fév', revenus: 6800, depenses: 1900 },
    { name: 'Mar', revenus: 6800, depenses: 2200 },
    { name: 'Avr', revenus: 6500, depenses: 2000 },
    { name: 'Mai', revenus: 6750, depenses: 2300 },
    { name: 'Jun', revenus: 6750, depenses: 1800 },
  ];

  const pieData = [
    { name: 'Loyers', value: 6750, color: '#E84A33' },
    { name: 'Charges', value: 1200, color: '#4A4F55' },
    { name: 'Maintenance', value: 800, color: '#9CA3AF' },
    { name: 'Assurances', value: 350, color: '#63686F' },
    { name: 'Taxes', value: 450, color: '#2A2F36' },
  ];
  
  const COLORS = pieData.map(item => item.color);

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#2A2F36]">Finances</h1>
        
        {/* Statistiques financières */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Revenu mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#E84A33]">6 750 €</p>
              <p className="text-xs text-gray-500">+2.5% vs mois dernier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Dépenses mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2 300 €</p>
              <p className="text-xs text-gray-500">+3.1% vs mois dernier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Bénéfice net</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">4 450 €</p>
              <p className="text-xs text-gray-500">+2.2% vs mois dernier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Rentabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5.8%</p>
              <p className="text-xs text-gray-500">+0.1% vs mois dernier</p>
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
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => `${value} €`} />
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
                    <th className="text-left pb-4">Montant</th>
                    <th className="text-left pb-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3">10/05/2025</td>
                    <td className="py-3">Loyer - Appartement Paris</td>
                    <td className="py-3">Revenus</td>
                    <td className="py-3 text-green-600">+1 200 €</td>
                    <td className="py-3"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Reçu</span></td>
                  </tr>
                  <tr>
                    <td className="py-3">05/05/2025</td>
                    <td className="py-3">Réparation plomberie</td>
                    <td className="py-3">Maintenance</td>
                    <td className="py-3 text-red-600">-350 €</td>
                    <td className="py-3"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Payé</span></td>
                  </tr>
                  <tr>
                    <td className="py-3">03/05/2025</td>
                    <td className="py-3">Loyer - Studio Lyon</td>
                    <td className="py-3">Revenus</td>
                    <td className="py-3 text-green-600">+650 €</td>
                    <td className="py-3"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Reçu</span></td>
                  </tr>
                  <tr>
                    <td className="py-3">01/05/2025</td>
                    <td className="py-3">Assurance habitation</td>
                    <td className="py-3">Assurances</td>
                    <td className="py-3 text-red-600">-180 €</td>
                    <td className="py-3"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Payé</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancesPage;
