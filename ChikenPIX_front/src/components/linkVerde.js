import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LinkVerde({ texto, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.area}>
            <Text style={styles.texto}>{texto}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    area: {
        // paddingVertical aumenta a área de toque sem mudar o visual.
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },
    texto: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00A88F',
        textDecorationLine: 'underline',
    },
});