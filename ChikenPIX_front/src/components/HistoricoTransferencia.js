import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function formatarHora(dataHora) {
  if (!dataHora) return '--:--';
  const data = new Date(dataHora);
  if (Number.isNaN(data.getTime())) return String(dataHora);
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatarTipo(tipo) {
  if (!tipo) return 'Pix';
  return String(tipo).replaceAll('_', ' ');
}

export default function HistoricoTransferencia({
                                                 transacoes = [],
                                                 numeroConta = '',
                                                 loading = false,
                                                 error = null,
                                               }) {
  return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Histórico de Transferência</Text>
        <Text style={styles.subtitulo}>Hoje</Text>

        {loading && (
            <View style={styles.estadoCentro}>
              <ActivityIndicator size="small" color="#00A88F" />
              <Text style={styles.textoVazio}>Carregando movimentações...</Text>
            </View>
        )}

        {!loading && error && (
            <View style={styles.estadoCentro}>
              <Text style={styles.textoErro}>{error}</Text>
            </View>
        )}

        {!loading && !error && transacoes.length === 0 && (
            <View style={styles.estadoCentro}>
              <Text style={styles.textoVazio}>Nenhuma transferência encontrada.</Text>
            </View>
        )}

        {!loading &&
            !error &&
            transacoes.map((item, idx) => {
              const isSaida = item?.origem?.numeroConta === numeroConta;
              const isEntrada = !isSaida;
              const valorAbs = Math.abs(Number(item?.valor ?? 0));
              const valorFormatado = `${isEntrada ? '+ ' : '- '}R$ ${valorAbs.toFixed(2).replace('.', ',')}`;

              const contraparte = isSaida
                  ? item?.destino?.usuario?.nome || item?.destino?.numeroConta || 'Destinatário'
                  : item?.origem?.usuario?.nome || item?.origem?.numeroConta || 'Remetente';

              const horaFormatada = formatarHora(item?.dataHora);
              const tipoFormatado = formatarTipo(item?.tipo);

              return (
                  <View key={item?.id || idx} style={styles.itemRow}>
                    <View
                        style={[
                          styles.iconeCirculo,
                          isEntrada ? styles.circuloEntrada : styles.circuloSaida,
                        ]}
                    >
                      <Ionicons
                          name={isEntrada ? 'arrow-down-outline' : 'arrow-up-outline'}
                          size={20}
                          color={isEntrada ? '#00A88F' : '#333333'}
                      />
                    </View>

                    <View style={styles.infoArea}>
                      <Text style={styles.nome}>{contraparte}</Text>
                      <Text style={styles.detalhe}>
                        {horaFormatada} - {tipoFormatado}
                      </Text>
                    </View>

                    <Text style={[styles.valor, isEntrada ? styles.valorEntrada : styles.valorSaida]}>
                      {valorFormatado}
                    </Text>
                  </View>
              );
            })}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  estadoCentro: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoVazio: {
    fontSize: 13,
    color: '#666666',
    marginTop: 6,
  },
  textoErro: {
    fontSize: 13,
    color: '#C62828',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconeCirculo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circuloEntrada: {
    backgroundColor: '#BCEBE3',
  },
  circuloSaida: {
    backgroundColor: '#E0E0E0',
  },
  infoArea: {
    flex: 1,
  },
  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  detalhe: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  valor: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  valorEntrada: {
    color: '#00A88F',
  },
  valorSaida: {
    color: '#000000',
  },
});