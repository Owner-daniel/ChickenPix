import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function BotaoCircular({
                                          icone = 'arrow-forward',
                                          onPress,
                                          desabilitado = false,
                                          carregando = false,
                                      }) {
    const bloqueado = desabilitado || carregando;

    return (
        <TouchableOpacity
            style={[styles.botao, bloqueado ? styles.botaoDesabilitado : null]}
            onPress={onPress}
            disabled={bloqueado}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={icone === 'checkmark' ? 'Concluir' : 'Continuar'}
        >
            {carregando ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Ionicons name={icone} size={28} color="#FFFFFF" />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    botao: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#00A88F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoDesabilitado: {
        opacity: 0.5,
    },
});