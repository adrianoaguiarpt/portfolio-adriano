/* =========================================================
   PROJETOS DO PORTFÓLIO
   ---------------------------------------------------------
   Para adicionar um trabalho novo:
   1. Guarda as capturas em img/projetos/ (16:10, ex. 1280x800, .webp)
   2. Copia um bloco { ... } abaixo, cola no topo da lista e edita.
   A ordem da lista é a ordem do carrossel.

   categoria: "site" | "loja" | "app"   (usado nos filtros)
   estado:    texto da etiqueta (ex. "Em produção", "Novo")
   ========================================================= */

window.PROJETOS = [
  {
    nome: 'Andreia Alves — Acupuntura & Massagem',
    cliente: 'Terapeuta · Porto, Portugal',
    categoria: 'site',
    estado: 'Novo',
    resumo: 'Site próprio, rápido e otimizado para o Google, que substituiu um Webnode difícil de atualizar.',
    descricao: 'A Andreia tinha um site Webnode lento e difícil de atualizar. Criei um site próprio, rápido e otimizado para ser encontrado no Google por quem procura terapias no Porto e no Norte.',
    destaques: [
      'Páginas geradas a partir de um único ficheiro de dados — fácil de atualizar',
      'Formulário de marcação com envio de e-mail (Node + Nodemailer)',
      'SEO local com JSON-LD, sitemap e Open Graph',
      'Aviso de privacidade sem cookies de publicidade (RGPD)'
    ],
    stack: ['Node.js', 'Express', 'JavaScript', 'Nodemailer', 'Vercel'],
    imagens: [
      { src: 'img/projetos/andreia-inicio.webp', legenda: 'Página inicial' },
      { src: 'img/projetos/andreia-terapias.webp', legenda: 'Terapias' }
    ],
    site: 'https://terapeuta-andreia-alves.vercel.app',
    codigo: 'https://github.com/adrianoaguiarpt/terapeuta-andreia-alves'
  },
  {
    nome: 'James Tattoo Art',
    cliente: 'Estúdio de tatuagem · Brasília, Brasil',
    categoria: 'site',
    estado: 'Em produção',
    resumo: 'Portefólio do estúdio com galeria filtrável e pedido de orçamento direto para o WhatsApp.',
    descricao: 'O estúdio dependia só do Instagram para mostrar trabalhos e receber pedidos. Criei um site próprio que mostra o portefólio e leva o cliente direto ao orçamento.',
    destaques: [
      'Galeria com filtros por estilo e visualização em ecrã inteiro',
      'Antes e depois de coberturas com fotos reais de clientes',
      'Pedido de orçamento enviado direto para o WhatsApp',
      'Modo claro/escuro e layout pensado para telemóvel'
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    imagens: [
      { src: 'img/projetos/james-inicio.webp', legenda: 'Página inicial' },
      { src: 'img/projetos/james-trabalhos.webp', legenda: 'Galeria' },
      { src: 'img/projetos/james-cobertura.webp', legenda: 'Antes e depois' },
      { src: 'img/projetos/james-telemovel.webp', legenda: 'Telemóvel' }
    ],
    site: 'https://adrianoaguiarpt.github.io/studio-james-tattoo/',
    codigo: 'https://github.com/adrianoaguiarpt/studio-james-tattoo'
  },
  {
    nome: 'Tech Atacado',
    cliente: 'Catálogo B2B de tecnologia para lojistas',
    categoria: 'loja',
    estado: 'Full Stack',
    resumo: 'Catálogo com carrinho e área de cliente — preços visíveis só para lojistas aprovados.',
    descricao: 'Uma loja de revenda precisava de mostrar o catálogo a todos, mas os preços só a lojistas aprovados. Construí a aplicação completa, com autenticação e base de dados.',
    destaques: [
      'Marcas, categorias, pesquisa e carrinho de compras',
      'Área do cliente com login e preços visíveis só para lojistas',
      'Dados e autenticação com Supabase (PostgreSQL)',
      'Tipado de ponta a ponta com TypeScript'
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'PostgreSQL'],
    imagens: [
      { src: 'img/projetos/tech-atacado-inicio.webp', legenda: 'Página inicial' },
      { src: 'img/projetos/tech-atacado-catalogo.webp', legenda: 'Catálogo' }
    ],
    site: 'https://loja-acessorios.vercel.app',
    codigo: 'https://github.com/adrianoaguiarpt/loja-acessorios'
  },
  {
    nome: 'SantosNovaArts',
    cliente: 'Estofados e restauro de móveis',
    categoria: 'site',
    estado: 'Cliente',
    resumo: 'Site de serviços com antes e depois e pedido de orçamento por WhatsApp.',
    descricao: 'Site de apresentação para uma empresa de estofados: mostra os serviços, prova a qualidade com fotos de antes e depois e transforma visitas em pedidos de orçamento.',
    destaques: [
      'Página de serviços clara e organizada',
      'Galeria de antes e depois dos restauros',
      'Formulário de orçamento com contacto por WhatsApp'
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    imagens: [
      { src: 'img/projetos/santos-servicos.webp', legenda: 'Serviços' }
    ],
    site: 'https://adrianoaguiarpt.github.io/santos_site/',
    codigo: 'https://github.com/adrianoaguiarpt/santos_site'
  }
];
