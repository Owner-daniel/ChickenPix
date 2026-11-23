import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { fazerLogin } from '../src/services/authService';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    async function handleEntrar() {
        setErro('');

        if (!email.trim() || !senha.trim()) {
            setErro('Preencha e-mail e senha.');
            return;
        }

        try {
            setLoading(true);
            const dados = await fazerLogin({
                email: email.trim(),
                senha,
            });

            const numeroConta = dados?.conta?.numeroConta ?? dados?.numeroConta ?? '';

            if (!numeroConta) {
                setErro('Usuário autenticado, mas nenhuma conta foi encontrada.');
                return;
            }

            router.replace({
                pathname: '/home',
                params: { numeroConta: String(numeroConta) },
            });
        } catch (err) {
            setErro(err.message || 'Não foi possível entrar.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Entrar</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <TouchableOpacity
                style={styles.botao}
                onPress={handleEntrar}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.textoBotao}>Entrar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    botao: {
        backgroundColor: '#111',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
    erro: { color: '#c00', fontSize: 14 },
});