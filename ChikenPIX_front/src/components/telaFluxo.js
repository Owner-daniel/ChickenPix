import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Logo from './logo';
import BotaoCircular from './botaoCircular';


export default function TelaFluxo({
                                      titulo,
                                      icone = 'chevron-back',
                                      onVoltar,
                                      iconeBotao = 'arrow-forward',
                                      onContinuar,
                                      botaoDesabilitado = false,
                                      carregando = false,
                                      children,
                                  }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableOpacity
                    style={styles.botaoTopo}
                    onPress={onVoltar}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={icone === 'close' ? 'Fechar' : 'Voltar'}
                >
                    <Ionicons name={icone} size={26} color="#2D2D2D" />
                </TouchableOpacity>

                <ScrollView
                    style={styles.conteudo}
                    contentContainerStyle={styles.conteudoInterno}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoArea}>
                        <Logo />
                    </View>

                    <Text style={styles.titulo}>{titulo}</Text>

                    {children}
                </ScrollView>

                <View style={styles.rodape}>
                    <BotaoCircular
                        icone={iconeBotao}
                        onPress={onContinuar}
                        desabilitado={botaoDesabilitado}
                        carregando={carregando}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    botaoTopo: {
        paddingVertical: 12,
        width: 44,
    },
    conteudo: {
        flex: 1,
    },
    conteudoInterno: {
        paddingBottom: 16,
    },
    logoArea: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        lineHeight: 28,
        marginBottom: 24,
    },
    rodape: {
        alignItems: 'flex-end',
        paddingVertical: 20,
    },
});