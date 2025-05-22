
import React from 'react';

const FinancesPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Finances</h1>
          <p className="text-muted-foreground">Suivez vos revenus et dépenses</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#E84A33] hover:bg-[#d43f2a] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <span className="h-4 w-4">+</span>
            Ajouter une transaction
          </button>
          <button className="border border-[#E84A33] text-[#E84A33] px-4 py-2 rounded-md flex items-center gap-2">
            <span className="h-4 w-4">↓</span>
            Exporter
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Revenus</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">8500€</p>
            <p className="text-sm text-green-600">+5% ce mois-ci</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Dépenses</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">2300€</p>
            <p className="text-sm text-red-600">+12% ce mois-ci</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-medium">Bénéfice net</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">6200€</p>
            <p className="text-sm text-green-600">+2% ce mois-ci</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium">Transactions récentes</h3>
        </div>
        <div className="p-0">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Description</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Catégorie</th>
                  <th className="py-3 px-4 text-right text-sm font-medium">Montant</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '05/05/2023', desc: 'Loyer Appartement 1', cat: 'Revenu', amount: '+850€', type: 'income' },
                  { date: '10/05/2023', desc: 'Réparation plomberie', cat: 'Dépense', amount: '-350€', type: 'expense' },
                  { date: '15/05/2023', desc: 'Loyer Appartement 2', cat: 'Revenu', amount: '+950€', type: 'income' },
                ].map((tx, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4 text-sm">{tx.date}</td>
                    <td className="py-3 px-4 text-sm">{tx.desc}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.cat}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm text-right ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancesPage;
