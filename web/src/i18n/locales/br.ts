export const br = {
  dashboard: {
    title: "Evolução de hoje",
    subtitle: "O shape não descansa, e você?",
    macros: {
      protein: "Proteínas",
      carbs: "Carboidratos",
      fats: "Gorduras",
    },
    add_meal: "Adicionar Refeição",
    remaining: "Restantes",
    meta_label: "Meta",
    consumed_label: "Consumido",
    total_meals: "Total Refeições",
    macros_title: "Macronutrientes",
    cards: {
      water: "Água",
      workout: "Treino",
      steps: "Passos",
      sleep: "Sono",
      goal_reached: "Meta batida hoje",
    },
  },
  navbar: {
    sign_in: "Entrar",
    sign_up: "Cadastrar",
    sign_out: "Sair da conta",
    account: "Minha Conta",
  },
  account: {
    title: "Minha Conta",
    subtitle: "Gerencie sua experiência",
    sidebar: {
      profile: "Perfil",
      goals: "Minhas Metas",
      preferences: "Preferências",
      security: "Segurança",
      notifications: "Notificações",
      sign_out: "Sair da conta",
    },
    profile: {
      title: "Meu Perfil",
      name: "Nome",
      change_picture: "Mudar Foto",
      save_updates: "Salvar Alterações",
    },
    goals: {
      title: "Configurações de Metas",
      subtitle: "Aqui você poderá ajustar suas calorias e macros manualmente.",
      adjust_button: "Ajustar Metas",
    },
    preferences: {
      title: "Preferências",
      language: {
        title: "Idioma do App",
        subtitle: "Escolha seu idioma preferido",
      },
    },
  },
  home: {
    title_0: "Evolua sua ",
    title_1: "melhor",
    title_2: " versão.",
    subtitle:
      "O PinicoFit organiza sua dieta e treinos para vocé focar no que importa: o shape dos sonhos. Sem complicações, direto ao ponto.",
    start_button: "Começar",
  },
  sign_in: {
    title: "Bem-vindo de volta.",
    subtitle: "Entre para continuar sua evolução e bater as metas de hoje.",
    password: "Senha",
    sign_in_button: "Vamos continuar",
    loading: "Entrando...",
    sign_up_button: "Não tem uma conta? Cadastre-se",
    forgot_password: "Esqueceu a senha? Recuperar",
    pass_placeholder: "senha123",
    error: "Falha no login:",
    serverError: "Erro ao conectar com o servidor",
  },
  sign_up: {
    title: "Junte-se ao PinicoFit.",
    subtitle:
      "O primeiro passo para o seu novo shape começa aqui. Vamos configurar seu plano.",
    name: "Nome",
    password: "Senha",
    confirm_password: "Confirmar Senha",
    pass_placeholder: "senha123",
    sign_up_button: "Vamos começar",
    loading: "Criando conta...",
    sign_in_button: "Já tem uma conta? Entre",
    error: "Erro ao criar conta",
  },
  onboarding: {
    title: "Só mais alguns detalhes...",
    subtitle: "Precisamos dessas informações para calcular suas metas.",
    age: "Idade",
    weight: "Peso",
    height: "Altura",
    gender: "Gênero",
    goal: "Qual a sua meta?",
    goal_options: {
      bulk: "Ganhar massa muscular (Bulking)",
      cut: "Emagrecer (Cutting)",
      maintain: "Manter o meu corpo",
    },
    gender_options: {
      male: "Masculino",
      female: "Feminino",
      other: "Outro",
    },
    select_placeholder: "Selecione...",
    finalize_button: "Finalizar Perfil",
    loading: "Salvando Informações...",
    logout_button: "Entrou na conta errada? Sair",
  },
  goals: {
    water: {
      title: "Água",
      goal: "Meta",
      remaining: "Faltam ? pra bater a meta!",
      start: "Hora de hidratar!",
      done: "Meta diária batida!",
      beaten: "Superou a meta em",
      today_history: {
        title: "Hoje",
        empty_state: "Nenhum registro hoje",
      },
      week_history: {
        title: "Semana",
        consumed: "consumidos",
      },
      month_history: {
        title: "Mês",
        average: "Média",
        day: "dia",
        beaten: "Batidas",
        graph_title: "Visão Mensal",
      },
    },
  },
  zod: {
    sign_in: {
      email: "E-mail inválido",
      password: "Senha é obrigatória",
    },
    sign_up: {
      name: "Nome muito curto",
      email: "E-mail inválido",
      password: "Mínimo 6 caracteres",
      confirm_password: "As senhas não coincidem",
    },
    onboarding: {
      age: {
        required: "A idade é obrigatória",
        min: "Idade mínima 10 anos",
        max: "Idade inválida",
      },
      weight: {
        required: "O peso é obrigatório",
        min: "Peso muito baixo",
        max: "Peso muito alto",
      },
      height: {
        required: "A altura é obrigatória",
        min: "Altura muito baixa",
        max: "Altura muito alta",
      },
      gender: {
        required: "Selecione um gênero",
        invalid: "Selecione um gênero válido",
      },
      goal: {
        required: "Defina sua meta",
        invalid: "Selecione uma meta valida",
      },
    },
  },
  server: {
    errors: {
      auth: {
        token_not_found: "Token não encontrado.",
        invalid_token: "Token inválido ou expirado.",
        email_not_found: "E-mail não encontrado.",
        incorrect_password: "Senha incorreta.",
      },
      users: {
        invalid_email: "E-mail inválido.",
        invalid_password: "A senha deve ter no mínimo 6 caracteres.",
        email_exists: "Este e-mail já está cadastrado.",
      },
    },
  },
};
