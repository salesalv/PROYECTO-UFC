import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TransactionHistory = ({ transactions, isLoading }) => {
  const { t } = useTranslation();

  const getTransactionIcon = (tipo) => {
    switch (tipo) {
      case 'ingreso':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'egreso':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Coins className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (tipo) => {
    switch (tipo) {
      case 'ingreso':
        return 'text-green-400';
      case 'egreso':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMotivoText = (motivo) => {
    const motivoMap = {
      'registro': t('transactions.registration'),
      'apuesta': t('transactions.bet'),
      'voto': t('transactions.vote'),
      'compra_paquete_basico': t('transactions.purchase_basic'),
      'compra_paquete_estandar': t('transactions.purchase_standard'),
      'compra_paquete_premium': t('transactions.purchase_premium'),
      'compra_paquete_pro': t('transactions.purchase_pro'),
      'ingreso': t('transactions.income'),
      'egreso': t('transactions.expense')
    };
    return motivoMap[motivo] || motivo;
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>{t('transactions.history')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg animate-pulse">
                <div className="h-4 w-4 bg-gray-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>{t('transactions.history')}</span>
          <Badge variant="secondary" className="ml-auto">
            {transactions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('transactions.no_transactions')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                {getTransactionIcon(transaction.tipo)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {getMotivoText(transaction.motivo)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(transaction.fecha)}
                  </div>
                </div>
                <div className={`text-sm font-bold ${getTransactionColor(transaction.tipo)}`}>
                  {transaction.tipo === 'ingreso' ? '+' : '-'}
                  {Number(transaction.cantidad).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
