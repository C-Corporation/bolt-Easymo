import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, TrendingUp, Users, Calendar, Clock, DollarSign, House } from "lucide-react";

export const EmptyDashboardState = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="mb-4">
          <Building2 className="mx-auto h-12 w-12 text-white" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Aucune donnée disponible
        </h3>
        <p className="text-black">
          Commencez par ajouter des biens immobiliers et des locataires pour voir vos statistiques.
        </p>
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: <DollarSign className="h-4 w-4" /> },
                  { icon: <Building2 className="h-4 w-4" /> },
                  { icon: <Users className="h-4 w-4" /> },
                  { icon: <House className="h-4 w-4" /> }
                ].map((stat, index) => (
                  <div key={index} className="flex flex-col items-center p-4">
                    <div className="h-4 w-4 text-gray-400">{stat.icon}</div>
                    <div className="h-16 w-full bg-gray-100 animate-pulse rounded-lg mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 w-32 rounded animate-pulse" />
                      <div className="h-3 bg-gray-100 w-48 rounded animate-pulse" />
                    </div>
                    <div className="h-3 bg-gray-100 w-20 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Échéanciers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 w-32 rounded animate-pulse" />
                      <div className="h-3 bg-gray-100 w-48 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-3 bg-gray-100 w-24 rounded animate-pulse" />
                      <div className="px-2 py-1 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
