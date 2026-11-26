import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';


export default function CampoTexto({ erro, style, ...props }) {
    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={[styles.input, erro ? styles.inputErro : null]}
                placeholderTextColor="#B0B0B0"
                autoCapitalize="none"
                autoCorrect={false}
                {...props}
            />
            {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    input: {
        fontSize: 16,
        color: '#000000',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    inputErro: {
        borderBottomColor: '#D32F2F',
    },
    erro: {
        fontSize: 12,
        color: '#D32F2F',
        marginTop: 4,
    },
});