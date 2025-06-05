# Visant® Studio Portfolio

Visant® Studio Portfolio é um webapp moderno para agências de design apresentarem seus projetos, clientes e identidade visual de forma dinâmica e profissional. Construído com Next.js, Coda e Supabase, oferece uma experiência rápida, responsiva e fácil de gerenciar.

## ✨ Principais Funcionalidades

- **Portfólio dinâmico:** Exiba projetos, cases e clientes com imagens, descrições e links personalizados.
- **Gestão via Coda:** Integração com Coda para atualização fácil de conteúdo sem precisar mexer no código.
- **Backend Supabase:** Armazenamento seguro de dados, autenticação e imagens via Supabase.
- **SEO e Social:** Metadados otimizados para redes sociais (Open Graph, Twitter Card) e buscadores.
- **Design moderno:** UI/UX limpos, responsivos e com animações suaves.
- **Analytics e Performance:** Integração com Vercel Analytics e Speed Insights.

## 🚀 Stack Utilizada

- **Next.js:** Framework React para SSR, SSG e rotas modernas.
- **Coda:** Gerenciamento de conteúdo dinâmico e colaborativo.
- **Supabase:** Backend as a Service (BaaS) para banco de dados, autenticação e storage.
- **Tailwind CSS:** Estilização rápida e responsiva.
- **Vercel:** Deploy e hospedagem otimizados para projetos Next.js.

## 📦 Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```
2. **Configure as variáveis de ambiente:**
   - Renomeie `.env.example` para `.env.local` e preencha com suas chaves do Supabase e Coda.
3. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   O app estará disponível em [localhost:3000](http://localhost:3000/).

## 🌐 Deploy

- Deploy recomendado na [Vercel](https://vercel.com/), com integração automática para projetos Next.js.
- Configure as variáveis de ambiente no painel da Vercel.

## 📁 Estrutura do Projeto

- `/app` — Páginas e layouts do Next.js
- `/components` — Componentes reutilizáveis de UI
- `/lib` — Integrações com Supabase e Coda
- `/public` — Imagens e arquivos estáticos

## 🛠️ Customização

- Adicione ou edite projetos diretamente no Coda, sem precisar redeployar.
- Personalize o visual editando os componentes e estilos em `/components` e `/app`.

## 🤝 Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## 📄 Licença

[MIT](LICENSE)

---

Desenvolvido por [Visant® Studio](https://www.visant.co/) — Onde marcas visionárias ganham vida.
