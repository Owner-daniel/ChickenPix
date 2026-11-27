import React from 'react';
import { Stack } from 'expo-router';
import { CadastroProvider } from '../../src/context/CadastroContext';

export default function CadastroLayout() {
    return (
        <CadastroProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </CadastroProvider>
    );
}