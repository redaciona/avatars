# API Avartation

Uma API simples para gerar imagens de avatares personalizáveis.

## Uso da API

A URL base para a API é:
```
https://avatar.redaciona.com.br/api
```

### Parâmetros de Consulta

| Parâmetro  | Descrição                      | Intervalo      | Padrão     |
|------------|--------------------------------|----------------|------------|
| width      | Largura da imagem em pixels    | 1-640         | 320       |
| height     | Altura da imagem (opcional)    | proporcional  | auto      |
| bg         | Cor do fundo                   | RGB/HEX       | #fcA5A5   |
| body       | Estilo do corpo               | fixo          | padrão    |
| accessory  | Número do acessório           | 01-18         | aleatório |
| eyes       | Estilo dos olhos              | 01-06         | aleatório |
| face       | Estilo do rosto               | 01-08         | aleatório |
| hair       | Estilo do cabelo              | 01-32         | aleatório |
| mouth      | Estilo da boca                | 01-10         | aleatório |
| outfit     | Estilo da roupa               | 01-25         | aleatório |
| raw        | Retorna SVG puro              | true/false    | false     |

### Exemplos

1. Avatar básico com configurações padrão:
```
https://avatar.redaciona.com.br/api
```

2. Avatar personalizado com partes específicas:
```
https://avatar.redaciona.com.br/api?hair=05&eyes=02&mouth=03&face=01&outfit=12&accessory=08
```

3. Tamanho personalizado e fundo:
```
https://avatar.redaciona.com.br/api?width=400&bg=rgb(100,200,300)
```

### Referência de Intervalos das Partes

#### Acessórios (01-18)
- 01-03: Variedades de óculos
- 04-08: Chapéus e bonés
- 09-13: Brincos e piercings
- 14-18: Acessórios diversos

#### Olhos (01-06)
- 01: Olhos redondos
- 02: Olhos amendoados
- 03: Olhos sonolentos
- 04: Olhos grandes
- 05: Olhos fofos
- 06: Olhos fechados

#### Rostos (01-08)
- 01-02: Rostos redondos
- 03-04: Rostos ovais
- 05-06: Rostos quadrados
- 07-08: Rostos em forma de coração

#### Bocas (01-10)
- 01-03: Variações de sorriso
- 04-06: Expressões neutras
- 07-10: Expressões variadas

#### Cabelos (01-32)
- 01-08: Estilos curtos
- 09-16: Estilos médios
- 17-24: Estilos longos
- 25-32: Estilos especiais

#### Roupas (01-25)
- 01-06: Roupas casuais
- 07-12: Roupas formais
- 13-18: Estilos esportivos
- 19-25: Roupas especiais

### Cabeçalhos de Resposta

A API retorna cabeçalhos personalizados indicando quais partes foram usadas:
- `X-accessories`
- `X-eyes`
- `X-faces`
- `X-hairs`
- `X-mouths`
- `X-outfits`

### Formato de Resposta

A API retorna uma imagem PNG com a largura especificada (padrão 320px).

### Tratamento de Erros

Se ocorrer um erro, a API retornará um código de status 500 com uma mensagem de erro.

## Rotas da API

### GET /api

Gera um avatar personalizado com base nos parâmetros fornecidos.

### GET /api/random

Gera múltiplos avatares aleatórios em uma única requisição.

**Parâmetros de Consulta:**
- `count` - Quantidade de avatares (1-10, padrão: 1)
- `bg` - Cor do fundo (opcional, mesmo formato da rota principal)
- Aceita os mesmos parâmetros da rota principal para personalização

**Resposta:**
Para um único avatar:
```json
{
  "id": 1,
  "base64": "data:image/png;base64,..."
}
```

Para múltiplos avatares:
```json
{
  "count": 3,
  "avatars": [
    { "id": 1, "base64": "..." },
    { "id": 2, "base64": "..." },
    { "id": 3, "base64": "..." }
  ]
}
```

**Resposta com raw=true:**
Para um único avatar:
```json
{
  "id": 1,
  "svg": "<svg>...</svg>"
}
```

Para múltiplos avatares:
```json
{
  "count": 3,
  "avatars": [
    { "id": 1, "svg": "<svg>...</svg>" },
    { "id": 2, "svg": "<svg>...</svg>" },
    { "id": 3, "svg": "<svg>...</svg>" }
  ]
}
```

**Exemplos:**

1. Gerar 5 avatares aleatórios:
```
https://avatar.redaciona.com.br/api/random?count=5
```

2. Gerar 3 avatares com fundo personalizado:
```
https://avatar.redaciona.com.br/api/random?count=3&bg=blue
```

3. Gerar um único avatar aleatório:
```
https://avatar.redaciona.com.br/api/random
```

## Desenvolvimento

Para executar a API localmente:

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor:
```bash
npm start
```

A API estará disponível em `http://localhost:10000`
