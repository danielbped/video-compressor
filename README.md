# CompactaVideos API

Trata-se da API de uma aplicação que possibilita os usuários de anexar arquivos, que serão comprimidos e ficarão armazenados na nuvem através do [Google Cloud Storage](https://cloud.google.com/storage/docs/). Estes vídeos anexados poderão ser visualizados, excluídos ou baixados. A API é independente, não necessita do [Frontend](https://github.com/danielbped/video-compressor-frontend), mas podem ser utilizados em conjunto completamente.

# Sumário
- [Tecnologias utilizadas](#tecnologias)
- [Instruções para rodar o projeto](#instrucoes)
  - [.env](#env)
  - [Iniciando a aplicação](#start)
- [Rotas e autenticação](#rotas)
  - [Autenticação](#token)
  - [Criar um novo usuário](#post-user)
  - [Login do usuário](#login)
  - [Anexar um ou mais vídeos](#post-file)
  - [Buscar vídeos pelo id do usuário](#get-files)
  - [Deletar um vídeo](#delete-file)
- [Testes](#testes)
- [Banco de dados](#db)

## Tecnologias utilizadas <a name="tecnologias"></a>
- **[TypeScript](https://www.typescriptlang.org/)**: Um superconjunto de JavaScript que adiciona tipagem estática opcional ao código. Ele ajuda os desenvolvedores a detectar erros mais cedo durante o desenvolvimento e oferece ferramentas avançadas para trabalhar em projetos de grande escala, melhorando a manutenibilidade e escalabilidade do código.

- **[Node.js](https://nodejs.org/en/)**: Plataforma de desenvolvimento para construção do ambiente de servidor.
- **[NestJS](https://docs.nestjs.com/)**: Framework web para Node.js utilizado na construção da API.
- **[TypeORM](https://typeorm.io/)**: ORM (Object-Relational Mapping) para TypeScript e JavaScript que simplifica o acesso e manipulação de banco de dados relacionais.
- **[MySQL](https://www.mysql.com/)**: Sistema de gerenciamento de banco de dados relacional utilizado para armazenar os dados da aplicação.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: Biblioteca para hashing de senhas utilizada para armazenar senhas de forma segura.
- **[Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: Implementação de JSON Web Tokens (JWT) para autenticação de usuários.
- **[Dotenv](https://www.npmjs.com/package/dotenv)**: Módulo que carrega variáveis de ambiente a partir de um arquivo .env para o processo do Node.js.
- **[Cors](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS)**: Middleware para Express que habilita o controle de acesso HTTP (CORS).
- **[Http Status Codes](https://www.npmjs.com/package/http-status-codes)**: Status Codes: Pacote que fornece uma lista de constantes para códigos de status HTTP.
- **[Jest](https://jestjs.io/pt-BR/)**: Framework de teste em JavaScript com foco na simplicidade.
- **[Uuidv4](https://www.npmjs.com/package/uuidv4)**: Pacote para geração de UUIDs (identificadores únicos universais) versão 4.
- **[Docker](https://docs.docker.com/compose/)**: Uma ferramenta para definir e executar aplicações multi-contêineres. É a chave para desbloquear uma experiência de desenvolvimento e implantação simplificada e eficiente.
- **[Swagger](https://swagger.io/)**: Ferramente utilizada para criar documentações exemplificando a utilização das rotas, de uma forma prática.
- **[Terraform](https://www.terraform.io/)**: Uma ferramenta de infraestrutura como código (IaC) para provisionar e gerenciar recursos de infraestrutura de forma declarativa. É utilizado para automatizar implantações, oferecendo consistência e confiabilidade.
- **[Google Cloud](https://cloud.google.com/)**: Uma plataforma de computação em nuvem do Google, oferecendo uma ampla gama de serviços para desenvolvimento, armazenamento e implantação de aplicações. Com infraestrutura global e recursos avançados, é uma escolha popular para migrar cargas de trabalho para a nuvem.
- **[Google Cloud Storage](https://cloud.google.com/storage/docs/)**: Ferramenta de armazenamento de arquivos em nuvem da Google.
- **[Fluent ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)**: Biblioteca utilizada para realizar a compressão de vídeos, reduzindo seu tamanho original sem perder a qualidade.

# Instruções para rodar o projeto <a name="instrucoes"></a>

### Será necessário ter instalado na sua máquina:

```
  Git
  Docker
```

- Clone o repositório com o comando git clone:

```
  git clone git@github.com:danielbped/video-compressor.git
```

- Entre no diretório que acabou de ser criado:

```
  cd video-compressor
```

## .env <a name="env"></a>

Para que a aplicação funcione corretamente, algumas variáveis de ambiente precisam ser configuradas, basta seguir os passos a seguir.

Na raiz do projeto, basta renomear o arquivo .env.example para .env, lá já se encontram todas as variáveis necessárias para iniciar o banco de dados, porém algumas informações precisam ser adicionadas para que a aplicação funcione corretamente.

```
MYSQL_DB_HOST=localhost
MYSQL_DB_PORT=3311
MYSQL_DB_USER=user
MYSQL_DB_PASSWORD=password
MYSQL_DB_ROOT_PASSWORD=rootpassword
MYSQL_DB_NAME=database
GOOGLE_APPLICATION_CREDENTIALS=
GCS_BUCKET_NAME=
```

Pode-se notar que as variáveis **GOOGLE_APPLICATION_CREDENTIALS** e **GCS_BUCKET_NAME** estão vazias, para rodar a aplicação corretamente, é necessário criar uma conta na [Cloud Storage](https://cloud.google.com/storage/docs/), criar um projeto e gerar uma credencial, esta credencial deve ser baixada no formato JSON, e o caminho relativo dela deve ser adicionado ao **GOOGLE_APPLICATION_CREDENTIALS**, as credenciais terão o formato parecido com este:

```json
  {
    "type": "service_account",
    "project_id": "video-compressor-123456",
    "private_key_id": "rua09our09eaqr4",
    "private_key": "-----BEGIN PRIVATE KEY-----90uieq309rfq..."
  }
```

Feito isso, será necessário criar um novo bucket e adicionar o nome do bucket à variável **GCS_BUCKET_NAME**, durante o desenvolvimento utilizei o nome de bucket **video-compressor-bucket**, para ter como exemplo.


## Iniciando a aplicação <a name="start"></a>

Com as variáveis de ambiente configuradas, basta executar o comando do Docker abaixo para buildar a aplicação:

```
  docker-compose up -d --build
```

Caso tudo tenha dado certo, algo parecido com isso deve aparecer no terminal

```
[Nest] 89884  - 08/22/2025, 1:38:12 PM     LOG [RoutesResolver] UserController {/api}: +33ms
[Nest] 89884  - 08/22/2025, 1:38:12 PM     LOG [RouterExplorer] Mapped {/api/user, POST} route +2ms
[Nest] 89884  - 08/22/2025, 1:38:12 PM     LOG [RouterExplorer] Mapped {/api/login, POST} route +0ms
[Nest] 89884  - 08/22/2025, 1:38:12 PM     LOG [RoutesResolver] FileController {/api}: +0ms
```

Agora basta acessar a URL http://localhost:3000/docs para visualizar as rotas disponíveis da API.

# Rotas e autenticação <a name="rotas"></a>

## Autenticação <a name="token"></a>

As requisições que envolvem usuário (`POST /api/user` e `POST /api/login`) possuem um comportamento semelhante. Ambas irão retornar o usuário logado e um token. **Este token será necessário para as demais rotas**, sendo passado no parâmetro Authorization dos headers das requisições. No seguinte formato `Bearer token`. Por exemplo, se o token for `yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ`, o parâmetro Authorization terá o seguinte valor `Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ`.

## Criar um novo usuário <a name="post-user"></a>
### POST /api/users

### **Parâmetros da Requisição**
  
  | Parâmetro   | Tipo     | Descrição              | Exemplo                  |
  |-------------|----------|------------------------|--------------------------|
  | `firstName` | String   | Nome do usuário        | "Douglas"                |
  | `lastName`  | String   | Sobrenome do usuário   | "Adams"                  |
  | `email`     | String   | E-mail do usuário      | "douglasadams@email.com" |
  | `password`  | String   | Senha do usuário       | "s3nh4_f0rt3"            |

### **Respostas**

  - Status **201** (Created)
    - **Descrição:** Criado com sucesso.
    ### Corpo da Resposta:
      ```json
      {
        "token": "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ",
        "user": {
          "firstName": "Douglas",
          "lastName": "Adams",
          "email": "douglasadams@email.com",
          "id": "02006e98-990a-45d1-b5fb-b9caeeca34cb",
          "createdAt": "2024-05-02T12:00:00Z",
          "updatedAt": "2024-05-02T12:00:00Z"
        }
      }
      ```

  - Status **400** (Bad Request)
    - **Descrição:** Dados inválidos.

  - Status **500** (Internal Server Error)
    -**Descrição:** Erro interno do sistema.

## Login do usuário <a name="login"></a>
### POST /api/login

### **Parâmetros da Requisição**
  
  | Parâmetro   | Tipo     | Descrição              | Exemplo                  |
  |-------------|----------|------------------------|--------------------------|
  | `email`     | String   | E-mail do usuário      | "douglasadams@email.com" |
  | `password`  | String   | Senha do usuário       | "s3nh4_f0rt3"            |

### **Respostas**
  - Status **200** (OK)
    - **Descrição:** Sucesso no login.
    ### Corpo da Resposta:
      ```json
      {
        "token": "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ",
        "user": {
          "firstName": "Douglas",
          "lastName": "Adams",
          "email": "douglasadams@email.com",
          "id": "02006e98-990a-45d1-b5fb-b9caeeca34cb",
          "createdAt": "2024-05-02T12:00:00Z",
          "updatedAt": "2024-05-02T12:00:00Z"
        }
      }
      ```

  - Status **401** (Unauthorized)
    - **Descrição:** Credenciais inválidas.

  - Status **500** (Internal Server Error)
    - **Descrição:** Erro interno do sistema.

## Anexar um ou mais vídeos <a name="post-file"></a>
### POST /api/videos

### **Parâmetros da Requisição**
  
  | Parâmetro     | Tipo     | Descrição                            | Observação                                      |
  |---------------|----------|--------------------------------------|----------------------------------------------|
  | `files`     | Array   | Array com os vídeos anexados   | Há um limite de 5 vídeos e 10MB por vídeo. |

### Respostas
  - Status **201** (Created)
    - **Descrição:** Criado com sucesso.
  - Status **400** (Bad Request)
    - **Descrição:** Dados inválidos.
  - Status **401** (Unauthorized)
    - **Descrição:** Usuário não autorizado.
  - Status **500** (Internal Server Error)
    - **Descrição:** Erro interno do sistema.

### Corpo da Resposta:
   
```json
[
    {
      "id": "bfc3f0e2-acc8-4d3b-b5d1-e803a65dcae3",
      "user": {
          "id": "02006e98-990a-45d1-b5fb-b9caeeca34cb",
          "email": "douglasadams@email.com",
          "firstName": "Douglas",
          "lastName": "Adams",
      },
      "createdAt": "2025-08-23T00:34:46.825Z",
      "updatedAt": "2025-08-23T00:34:46.825Z",
      "compressed_url": "https://storage.googleapis.com/nome-do-bucket/nome-do-video_compressed.mp4",
      "compressed_path": "nome-do-video_compressed.mp4",
      "original_url": "https://storage.googleapis.com/nome-do-bucket/nome-do-video.mp4",
      "original_path": "nome-do-video.mp4",
      "original_filename": "nome-do-video.mp4",
      "compressed_filename": "nome-do-video_compressed.mp4",
      "original_size": 9472319,
      "compressed_size": 7009207,
      "compression_percentage": 26
  }
]
```

## Buscar vídeos pelo id do usuário <a name="get-files"></a>
### GET /api/videos

```json
[
    {
      "id": "bfc3f0e2-acc8-4d3b-b5d1-e803a65dcae3",
      "user": {
          "id": "02006e98-990a-45d1-b5fb-b9caeeca34cb",
          "email": "douglasadams@email.com",
          "firstName": "Douglas",
          "lastName": "Adams",
      },
      "createdAt": "2025-08-23T00:34:46.825Z",
      "updatedAt": "2025-08-23T00:34:46.825Z",
      "compressed_url": "https://storage.googleapis.com/nome-do-bucket/nome-do-video_compressed.mp4",
      "compressed_path": "nome-do-video_compressed.mp4",
      "original_url": "https://storage.googleapis.com/nome-do-bucket/nome-do-video.mp4",
      "original_path": "nome-do-video.mp4",
      "original_filename": "nome-do-video.mp4",
      "compressed_filename": "nome-do-video_compressed.mp4",
      "original_size": 9472319,
      "compressed_size": 7009207,
      "compression_percentage": 26
  }
]
```

### Respostas
  - Status **200** (OK)
    - **Descrição:** Dados retornados com sucesso.
  - Status **400** (Bad Request)
    - **Descrição:** Dados inválidos.
  - Status **401** (Unauthorized)
    - **Descrição:** Usuário não autorizado.
  - Status **500** (Internal Server Error)
    - **Descrição:** Erro interno do sistema.

## Deletar um vídeo <a name="delete-file"></a>
### DELETE /api/videos/:id

### **Parâmetros da Requisição**
  
  | Parâmetro | Tipo   | Descrição             | Exemplo      |
  |-----------|--------|-----------------------|--------------|
  | `id`      | String | ID do vídeo        | "02006e98-990a-45d1-b5fb-b9caeeca34cb"  |

### **Respostas**

  - Status **200** (OK)
    - **Descrição:** Deletado com sucesso.

  - Status **401** (Unauthorized)
    - **Descrição:** Usuário não autorizado.

  - Status **404** (Not Found)
    - **Descrição:** Conversa não encontrada.

  - Status **400** (Bad Request)
    - **Descrição:** Dados inválidos.

Ao rodar a aplicação, você poderá visualizar as rotas disponíveis, também como seus respectivos conteúdos de body e parametros, basta navegar para a rota **http://localhost:3000/docs**, onde está disponível uma documentação exclusiva das rotas, desenvolvida utilizando [Swagger](https://swagger.io/).

## Testes <a name="testes"></a>

A aplicação possui testes unitários de todas as rotas. Para rodar os testes, basta executar o comando abaixo:

```
  npm run test
```