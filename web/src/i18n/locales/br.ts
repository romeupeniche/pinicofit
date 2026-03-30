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
      remaining: "Ainda faltam ",
      steps_postfix: " passos",
      workout_postfix: " exercícios",
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
      weight_unit: {
        title: "Unidade de Peso",
        subtitle: "Escolha sua unidade de peso preferida",
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
    workout: {
      workout_label: "Treino {{letter}}",
      workout_window: {
        badge_title: "Treinar",
        title: "Treino",
        yesterday: "Ontem",
        today: "Hoje",
        tomorrow: "Amanhã",
        focus: "Foco atual",
        calories: "Calorias",
        time: "Tempo",
        total_volume: "Volume Total",
        exercise_order: "Ordem de Execução",
        exercises: "Exercícios",
        rest: "Descanso",
        rest_day: "Dia de Descanso - Recuperação Muscular",
        rest_msg: "O descanso é onde a evolução acontece.",
        see_summary: "Explorar Sumário",
        locked_summary: "Conclua para Desbloquear",
        next_round: "Próximo Round",
        next_round_msg: "{{workout}} • em {{distance}}",
        details_modal: {
          standard: "Padrão",
          warmup: "Aquecimento",
          exercise: "Exercício",
          failed: "Falhei",
          done: "Concluído",
          increased: "Subi carga",
          rest: "Descanso",
          technique: "Técnica",
          save_button: "Salvar e Voltar",
          reps: "Repeticões",
          weight_done: "Peso Realizado",
        },
      },
      plan_window: {
        badge_title: "Planejar",
        title: "Planejamento",
        week_days: "DSTQQSS",
        rest_label: "Descanso",
        cicle_start_label: "Inicio do Ciclo Atual",
        synchronized: "Sincronizado",
        pending: "Alterações Pendentes",
        changes_apply: {
          0: "Atualize o progresso atual",
          or: " ou ",
          1: "inicie um novo ciclo hoje",
        },
        explore_presets: "Explorar Presets",
        saving: "Salvando...",
        cycle_structure: {
          title: "Estrutura do Ciclo",
          subtitle: "Segure e arraste para reordenar",
          length: "Dias",
          configure: "Configurar",
          workout_add: "Treino",
          actions: {
            quick_edit: "Atualizar (Manter Ciclo)",
            quick_edit_mobile: "Atualizar",
            new_cycle: "Aplicar como Novo Ciclo",
            new_cycle_mobile: "Novo",
            configure: "Configurar Todos os Treinos",
            mobile_configure: "Configurar",
            discard: "Descartar Alterações",
          },
        },
        monthly_projection: {
          title: "Projeção Mensal",
          recover_yourself: "Se Recupere",
          exercises: "Exercícios",
        },
        edit_workout_modal: {
          title: "Editando {{workout}}",
          workout_name: "Nome do Treino",
          save_to_library: "Salvar na Biblioteca",
          same_name_error: "Já existe um treino com esse nome",
          exercise: "Exercício",
          inputs: {
            name: "Nome",
            group: "Grupo",
            group_ph: "Selecione o grupo...",
            sets: "Séries",
            reps: "Repeticões",
            weight: "Carga",
            rest: "Descanso",
            obs: "Observações",
            type: {
              title: "Tipo",
              warmup: "Aquecimento",
              exercise: "Exercício",
            },
            technique: {
              title: "Técnica",
              standard: "Padrão",
            },
            apply: "Aplicar ao Ciclo",
          },
        },
        presets_modal: {
          title: "Biblioteca",
          subtitle: "Meus Treinos",
          no_workouts: "Nenhum treino salvo",
          exercises: "{{qty}} Exercícios",
        },
        confirm_exit_modal: {
          title: "Alterações não salvas!",
          subtitle:
            "Se você sair agora, todo o progresso do seu treino será perdido. Quer mesmo sair?",
          actions: {
            discard: "Sair e descartar",
            cancel: "Continuar editando",
          },
        },
      },
      presets: {
        "preset-chest-triceps": {
          title: "Peito e Tríceps",
          "preset-supino-reto-barra":
            "Supino Reto com Barra;Foco em progressão de carga, descida controlada",
          "preset-supino-inclinado-halteres":
            "Supino Inclinado com Halteres;Inclinação de 30º a 45º",
          "preset-crucifixo-maquina":
            "Crucifixo Máquina (Peck Deck);Pico de contração de 1s no meio",
          "preset-crossover-polia-alta":
            "Crossover Polia Alta;Foco na parte inferior do peitoral",
          "preset-triceps-pulley-corda":
            "Tríceps Pulley Corda;Abrir a corda no final do movimento",
          "preset-triceps-testa-barra-ez":
            "Tríceps Testa Barra EZ;Cuidado com os cotovelos, manter fechados",
          "preset-triceps-frances-halter":
            "Tríceps Francês Bilateral;Máximo alongamento da fibra",
        },
        "preset-back-biceps": {
          title: "Costas e Bíceps",
          "preset-puxada-pulley-frente":
            "Puxada Aberta no Pulley;Foco na expansão das dorsais",
          "preset-remada-curvada-barra":
            "Remada Curvada com Barra;Pegada supinada para maior ativação",
          "preset-remada-unilateral-serrote":
            "Remada Unilateral (Serrote);Manter o tronco paralelo ao banco",
          "preset-pull-down-corda":
            "Pull Down com Corda;Braços quase esticados, foco no lats",
          "preset-rosca-direta-barra-ez":
            "Rosca Direta Barra EZ;Sem balançar o corpo, cotovelos fixos",
          "preset-rosca-martelo-halteres":
            "Rosca Martelo com Halteres;Foco no braquiorradial e braquial",
          "preset-rosca-concentrada-halter":
            "Rosca Concentrada Unilateral;Pico de contração no topo",
        },
        "preset-legs-shoulders": {
          title: "Perna e Ombros",
          "preset-agachamento-livre-barra":
            "Agachamento Livre com Barra;Descida controlada, foco na amplitude máxima",
          "preset-leg-press-45":
            "Leg Press 45º;Pés na largura dos ombros, sem travar o joelho",
          "preset-extensora-maquina":
            "Cadeira Extensora;Pico de contração de 2s no topo",
          "preset-mesa-flexora":
            "Mesa Flexora (Posterior);Foco no alongamento do posterior",
          "preset-stiff-com-halteres":
            "Stiff com Halteres;Coluna reta, sentir alongar o posterior",
          "preset-desenvolvimento-ombros-halter":
            "Desenvolvimento com Halteres;Sentado, foco no deltoide anterior",
          "preset-elevacao-lateral-polia":
            "Elevação Lateral na Polia;Cabo passando por trás do corpo",
        },
        "preset-abs-core": {
          title: "Abdômen & Core",
          "preset-abd-infra-paralela":
            "Abdominal Infra na Paralela;Foco na elevação da pelve",
          "preset-abd-crunches-polia":
            "Abdominal Supra na Polia;Carga moderada, foco na contração",
          "preset-abd-obliquo-polia":
            "Abdominal Oblíquo na Polia;Giro de tronco controlado",
          "preset-core-plancha":
            "Prancha Abdominal;Manter contração máxima por 1 min",
          "preset-lombar-extensao-banco":
            "Extensão Lombar no Banco 45º;Subida controlada, não hiperestender demais",
          "preset-lombar-superman":
            "Superman (Solo);Foco na contração isométrica de 2s no topo",
        },
        "preset-fb-performance": {
          title: "Full Body Performance",
          "preset-fb-agachamento":
            "Agachamento Livre;Composto base de membros inferiores",
          "preset-fb-supino-reto": "Supino Reto com Barra;Foco em força",
          "preset-fb-puxada-frente": "Puxada Aberta Pulley;Foco em largura",
          "preset-fb-desenvolvimento-halter":
            "Desenvolvimento de Ombros;Sentado com halteres",
          "preset-fb-stiff": "Stiff com Halteres;Foco em posterior de coxa",
          "preset-fb-rosca-martelo": "Rosca Martelo;Trabalho de braço",
          "preset-fb-triceps-corda": "Tríceps Corda;Finalização de braço",
        },
        "preset-fb-calisthenics-pro": {
          title: "Full Body Calistenia Pro",
          "preset-cali-barra-fixa-pronada":
            "Barra Fixa (Pull Ups);Pegada aberta, peito na barra",
          "preset-cali-paralelas-peito":
            "Dips nas Paralelas;Inclinar o tronco para frente para focar no peito",
          "preset-cali-agachamento-bulgaro":
            "Agachamento Búlgaro;Uma perna de cada vez, foco em profundidade",
          "preset-cali-flexao-arqueiro":
            "Flexão Arqueiro (Archer Pushups);Alternando os lados para aumentar a carga unilateral",
          "preset-cali-chin-ups":
            "Chin-Ups (Barra Supinada);Foco na contração máxima do bíceps no topo",
          "preset-cali-flexao-diamante":
            "Flexão Diamante;Mãos juntas formando um diamante",
          "preset-cali-elevacao-pernas-barra":
            "Elevação de Pernas na Barra;Sem balanço (momentum), subida explosiva",
        },
        "preset-cardio-burn-hiit": {
          title: "Cardio Burn & HIIT",
          "preset-cardio-bike-hiit":
            "Bike HIIT (Intervalado);30s sprint máximo / 30s leve",
          "preset-cardio-esteira-incl":
            "Esteira Inclinada;15 min / Inclinação 12% / 5.0km/h",
          "preset-cardio-burpees": "Burpees;45 segundos de execução",
          "preset-cardio-corda": "Pular Corda;2 min constantes",
          "preset-cardio-mountain-climber":
            "Mountain Climber;Foco em ritmo cardíaco alto",
          "preset-cardio-polichinelos":
            "Polichinelos;Execução rápida para finalizar",
        },
      },
      metrics: {
        legs_compound: "Pernas (Multiarticular)",
        legs_isolated: "Pernas (Isolado)",
        back_compound: "Costas (Multiarticular)",
        chest_compound: "Peito (Multiarticular)",
        shoulders: "Ombros",
        biceps_isolated: "Bíceps (Isolado)",
        triceps_isolated: "Tríceps (Isolado)",
        abs_core: "Abdômen/Core",
        cali_upper_compound: "Calistenia Superior",
        cali_lower_compound: "Calistenia Inferior",
        cali_core_advanced: "Calistenia Core",
        cardio_hiit: "Cardio HIIT",
        cardio_steady: "Cardio Moderado",
        other: "Outros",
      },
      summary_story: {
        change_theme: "Mudar tema",
        saving: "Salvando...",
        saving_error: "Erro ao salvar",
        share: "Compartilhar",
        total_volume: "Volume Total",
        calories_burned: "Gasto Calórico",
        intensity: "Intensidade",
        exercises_abrev: "EXERC.",
        workout_focus: "Foco do Treino",
        general_performance: "Performance Geral",
        surpassed_plan: {
          0: "Você superou o planejado em ",
          1: " totais de volume.",
        },
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
