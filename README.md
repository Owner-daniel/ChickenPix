# ChickenPix
Projeto Colaborativo desenvolvido como forma de avaliação da Disciplina de Gerência de Configuração do curso de Engenharia de Software da Universidade Federal do Ceará - UFC



## Executando e testando o aplicativo no celular

O ChickenPIX permite testar o aplicativo React Native em um dispositivo físico, conectado ao backend Spring Boot que está sendo executado localmente no computador.
 Para isso, é necessário que o computador e o celular estejam conectados à mesma rede Wi-Fi.

### 1. Pré-requisitos

Antes de iniciar, verifique se você possui:

- [Node.js](https://nodejs.org/) instalado.
- Java 21 instalado.
- Maven instalado.
- Docker instalado e configurado.
- [Expo Go](https://expo.dev/go) instalado no celular.
- O projeto frontend e backend configurados localmente.

### 2. Iniciando o banco de dados

Inicie o container do PostgreSQL utilizando Docker.

Caso o container já esteja configurado no projeto, execute:

```bash
docker compose up -d
```

Verifique se o container está em execução:

```bash
docker ps
```

### 3. Iniciando o backend Spring Boot

Abra um terminal na pasta do backend e execute:

```bash
mvn spring-boot:run
```

Por padrão, o backend estará disponível na porta `8080`:

```text
http://localhost:8080
```

**Importante:** para permitir que o celular acesse o backend, o servidor não deve estar limitado à interface `127.0.0.1`. Por padrão, o Spring Boot aceita conexões nas interfaces disponíveis, desde que o firewall permita.

### 4. Descobrindo o endereço IP do computador

O celular não consegue acessar o `localhost` do computador. Por isso, precisamos utilizar o endereço IP local da máquina.

No Windows, abra o CMD ou PowerShell e execute:

```bash
ipconfig
```

Localize o adaptador Wi-Fi e procure o campo `Endereço IPv4`.

Exemplo:

```text
Endereço IPv4: 192.168.1.10
```

O endereço acima é apenas ilustrativo. Utilize o IP apresentado no seu computador.

### 5. Configurando a conexão no frontend

No frontend, localize o arquivo responsável pelas requisições HTTP, por exemplo:

```text
src/services/api.ts
```

Configure o endereço do backend utilizando o IP encontrado anteriormente:

```typescript
const API_URL = 'http://192.168.1.10:8080';

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}
```

**Atenção:** substitua `192.168.1.10` pelo endereço IPv4 real do seu computador.

Não utilize `localhost` ou `127.0.0.1` nessa configuração quando estiver testando em um celular físico.

### 6. Iniciando o frontend no celular

Com o backend em execução, abra um terminal na pasta do frontend e execute:

```bash
npx expo start
```

O Expo apresentará um QR Code no terminal ou na interface de desenvolvimento.

Para abrir o aplicativo:

1. Certifique-se de que o celular e o computador estão conectados à mesma rede Wi-Fi.
2. Abra o aplicativo Expo Go no celular.
3. Leia o QR Code apresentado pelo Expo.
4. Aguarde o carregamento do aplicativo.

Após esses passos, o aplicativo será executado diretamente no celular e poderá realizar requisições ao backend Spring Boot.

### 7. Testando uma funcionalidade integrada

Depois de integrar uma funcionalidade, é possível testá-la diretamente no dispositivo físico.

Por exemplo, ao implementar a consulta de saldo:

1. Inicie o banco de dados.
2. Inicie o backend Spring Boot.
3. Inicie o frontend pelo Expo.
4. Abra o aplicativo no celular.
5. Acesse a tela que utiliza a funcionalidade integrada.
6. Verifique se os dados apresentados correspondem às informações armazenadas no banco.

Também é possível acompanhar as requisições e identificar erros pelos logs do terminal do Spring Boot e do Expo.

### 8. Solução de problemas

| Problema | Possível solução |
|---|---|
| `Network request failed` | Verifique o IP do computador e a conexão Wi-Fi. |
| `Connection refused` | Verifique se o backend está em execução na porta 8080. |
| `404 Not Found` | Confira se o endpoint utilizado existe no backend. |
| `403 Forbidden` | Verifique as permissões e configurações de autenticação. |
| Celular não consegue acessar o backend | Verifique se o firewall do Windows permite conexões na porta 8080 pela rede privada. |
| QR Code não conecta | Verifique a rede Wi-Fi ou tente iniciar o Expo no modo Tunnel. |

### 9. Observações importantes

- O IP local do computador pode mudar quando você se conecta a outra rede Wi-Fi. Nesse caso, atualize o endereço configurado no frontend.
- Durante o desenvolvimento, mantenha o backend e o frontend em execução simultaneamente.
- Caso utilize um emulador Android, o endereço `http://10.0.2.2:8080` normalmente permite acessar o backend executado no computador.
- Caso utilize um dispositivo físico, utilize o IP local do computador.
- Essa configuração é destinada ao ambiente de desenvolvimento. Não utilize HTTP sem proteção para disponibilizar o aplicativo em produção.

---

**Resumo dos comandos para executar o projeto:**

| Etapa | Comando |
|---|---|
| Iniciar banco de dados | `docker compose up -d` |
| Iniciar backend | `mvn spring-boot:run` |
| Iniciar frontend | `npx expo start` |

Com essas configurações, é possível desenvolver e testar cada funcionalidade do ChickenPIX diretamente no celular, conforme as integrações entre frontend e backend forem sendo implementadas.