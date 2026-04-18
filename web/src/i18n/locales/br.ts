import { en } from "./en";

export const br = {
  ...en,
  dashboard: {
    ...en.dashboard,
    title: "Evolução de hoje",
    subtitle: "O shape não descansa, e você?",
    loading_title: "Carregando dashboard",
    loading_subtitle: "Buscando seus dados reais do dia...",
    workout_compensated: "Treino compensado",
    macros: {
      protein: "Proteinas",
      carbs: "Carboidratos",
      fats: "Gorduras",
    },
    add_meal: "Adicionar refeição",
    remaining: "Restantes",
    meta_label: "Meta",
    consumed_label: "Consumido",
    total_meals: "Total de refeições",
    macros_title: "Macronutrientes",
    cards: {
      ...en.dashboard.cards,
      water: "Água",
      workout: "Treino",
      tasks: "Tarefas",
      sleep: "Sono",
      goal_reached: "Meta batida hoje",
      remaining: "Ainda faltam ",
      no_synced_data: "Sem dados sincronizados ainda",
      tasks_postfix: " tarefas",
      workout_postfix: " exercícios",
    },
  },
  navbar: {
    sign_in: "Entrar",
    sign_up: "Cadastrar",
    sign_out: "Sair da conta",
    account: "Minha conta",
  },
  account: {
    ...en.account,
    title: "Minha conta",
    subtitle: "Gerencie sua experiência",
    save_updates: "Salvar alterações",
    unsaved_changes: {
      title: "Você tem alterações não salvas",
      description: "Se você sair agora, suas alterações não serão salvas.",
      stay: "Continuar aqui",
      leave: "Sair mesmo assim",
    },
    logout_confirm: {
      title: "Sair da conta?",
      description:
        "Se você sair agora, a sessão atual será encerrada neste dispositivo.",
      cancel: "Cancelar",
      confirm: "Sair",
    },
    sidebar: {
      ...en.account.sidebar,
      profile: "Perfil",
      goals: "Metas",
      preferences: "Preferências",
      notifications: "Notificações",
      help: "Ajuda e reports",
      about: "Sobre",
      sign_out: "Sair da conta",
    },
    profile: {
      ...en.account.profile,
      title: "Perfil",
      name: "Nome",
      age: "Idade",
      weight: "Peso",
      height: "Altura",
      gender: "Gênero",
      goal: "Meta",
      activity_level: "Nível de atividade",
      unknown_user: "Usuário",
      warning_recalculate:
        "Ao mudar peso, altura, idade, gênero, meta ou nível de atividade, todas as suas metas serão recalculadas.",
      change_picture: "Trocar foto",
      saving: "Salvando perfil...",
    },
    goals: {
      ...en.account.goals,
      title: "Configurações de metas",
      subtitle:
        "Gerencie suas metas diárias, as tolerâncias do seu streak e preferências do contrato.",
      streak_tolerance: "Tolerância de Streak",
      water: {
        title: "Meta de Água",
        subtitle: "Alvo diário e tolerância de streak",
        tolerance_tip: "Conta a partir de {{{tolerance}} ml}",
        min_tip: " · mín. {{min}} ml (OMS)",
        goal: "Meta Diária",
      },
      sleep: {
        title: "Meta de Sono",
        subtitle: "Duração de descanso e tolerância",
        tolerance_tip: "Conta a partir de {{{tolerance}} hrs}",
        duration: "Duração",
      },
      nutrition: {
        title: "Nutrição e Macros",
        subtitle: "Alvo de calorias e divisão de nutrientes",
        calorie_goal: "Meta de Calorias",
        protein: "Proteína",
        carbs: "Carbos",
        fat: "Gordura",
        tolerance_tip: "Streak contabilizado a partir de {{{tolerance}} kcal}",
        streak_tip:
          "Apenas as calorias contam para o seu streak, mas mantenha o equilíbrio dos seus macros para uma nutrição completa.",
      },
      workout: {
        title: "Meta de Treino",
        subtitle: "Limite de conclusão de exercícios",
        minimum_completion: "Conclusão Mínima",
        tolerance_tip:
          "Em um treino de 10 exercícios, você pode perder {{{tolerance}}} e ainda manter seu streak",
      },
      tasks: {
        title: "Meta de Tarefas",
        subtitle: "Alvo diário de produtividade",
        input_label: "Tarefas por dia",
        unit: "tarefas",
      },
      saving: "Salvando metas...",
      reactivate_goal: {
        title: "Reativar Meta",
        description:
          "Para reativar este objetivo com um streak ativo, o contrato exige um sacrifício de {2 vidas}. Esta ação é imediata e não pode ser desfeita.",
        confirm: "Pagar 2 vidas",
        cancel: "Agora não",
      },
      disable_goal: {
        title: "Tem certeza?",
        description:
          "Ao desativar esta meta, ela não contará para o seu contrato. Além disso, você ficará bloqueado de reativá-la por {7 dias} e a reativação custará {2 vidas} caso seu streak esteja ativo.",
        confirm: "Sim, desativar",
        cancel: "Manter o foco",
      },
      cooldown_active: {
        title: "Meta Bloqueada",
        description:
          "Esta meta está em período de descanso para evitar abusos no streak. Você poderá reativá-la em { {{days}} dias}.",
        confirm: "Entendido",
      },
    },
    preferences: {
      ...en.account.preferences,
      title: "Preferências",
      language: {
        title: "Idioma do app",
        subtitle: "Escolha o idioma preferido",
        options: {
          en: "English (US)",
          br: "Português (BR)",
          es: "Español",
        },
      },
      weight_unit: {
        title: "Unidade de peso",
        subtitle: "Escolha a unidade de peso preferida",
      },
      saving: "Salvando preferências...",
    },
    notifications: {
      ...en.account.notifications,
      title: "Notificações",
      subtitle: "Controle o e-mail usado para alertas e relatórios mensais.",
      email_label: "E-mail para notificações",
      email_hint:
        "Use o mesmo e-mail do login ou outro que você realmente acompanha.",
      verified: "Verificado",
      verify: "Verificar e-mail",
      verifying: "Enviando verificação...",
      save_before_verify: "Salve o e-mail antes",
      alerts: "Alertas",
      alerts_hint: "Receba lembretes e avisos importantes sobre suas metas.",
      reports: "Relatórios mensais",
      reports_hint:
        "Receba um resumo mensal de água, refeições, treinos, sono e tasks.",
      saving: "Salvando notificações...",
      test_report: "Enviar relatório de teste",
      sending_report: "Enviando relatório...",
    },
    help: {
      title: "Ajuda e reports",
      subtitle:
        "Envie uma mensagem direto pelo app para reportar bugs, pedir ajuda ou mandar feedback.",
      subject: "Assunto",
      subject_placeholder: "Exemplo: Problema ao salvar refeições",
      message: "Mensagem",
      message_placeholder:
        "Explique o que aconteceu, o que você esperava e qualquer detalhe que ajude a reproduzir.",
      send: "Enviar mensagem",
      sending: "Enviando mensagem...",
    },
    about: {
      title: "Sobre",
      subtitle: "Saiba mais sobre PinicoFit e seus criadores.",
      app_proposal_title: "A Proposta",
      app_proposal_text:
        "O PinicoFit nasceu para simplificar o rastreio de saúde. O foco é a consistência, não a perfeição. Controle seus treinos, nutrição e hábitos de forma simples e intuitiva.",
      developer_title: "O Desenvolvedor",
      developer_bio:
        "Desenvolvedor Full-stack apaixonado por construir ferramentas que melhoram a vida das pessoas através de tecnologia e bom design.",
      links_title: "Presença & Código",
      luana: "Para você, Luana",
    },
  },
  home: {
    ...en.home,
    title_0: "Evolua para sua ",
    title_1: "melhor",
    title_2: " versão.",
    subtitle:
      "O PinicoFit organiza sua dieta e seus treinos para você focar no que importa: o shape dos sonhos. Sem enrolação, só resultado.",
    start_button: "Começar",
  },
  sign_in: {
    ...en.sign_in,
    title: "Bem-vindo de volta.",
    subtitle: "Entre para continuar evoluindo e bater as metas de hoje.",
    password: "Senha",
    sign_in_button: "Vamos continuar",
    loading: "Entrando...",
    sign_up_button: "Não tem uma conta? Cadastre-se",
    forgot_password: "Esqueceu a senha? Recupere",
    pass_placeholder: "senha123",
    error: "Falha no login:",
    serverError: "Erro ao conectar com o servidor",
  },
  sign_up: {
    ...en.sign_up,
    title: "Junte-se ao PinicoFit.",
    subtitle:
      "O primeiro passo para o seu novo shape começa aqui. Vamos configurar seu plano.",
    name: "Nome",
    password: "Senha",
    confirm_password: "Confirmar senha",
    pass_placeholder: "senha123",
    sign_up_button: "Vamos começar",
    loading: "Criando conta...",
    sign_in_button: "Já tem uma conta? Entre",
    error: "Erro ao criar conta",
  },
  onboarding: {
    ...en.onboarding,
    title: "Só mais alguns detalhes...",
    subtitle: "Precisamos dessas informações para calcular suas metas.",
    age: "Idade",
    weight: "Peso",
    height: "Altura",
    gender: "Gênero",
    goal: "Qual é a sua meta?",
    activity_level: {
      title: "Nível de atividade",
      helper:
        "Isso ajuda a calcular calorias, água e macros com mais precisão.",
      options: {
        sedentary: "Sedentário",
        light: "Atividade leve (1-2x/semana)",
        moderate: "Atividade moderada (3-4x/semana)",
        active: "Ativo (5-6x/semana)",
        intense: "Atividade intensa (todos os dias / alto volume)",
      },
    },
    goal_options: {
      bulk: "Ganhar massa muscular",
      cut: "Emagrecer",
      maintain: "Manter o peso",
    },
    gender_options: {
      male: "Masculino",
      female: "Feminino",
      other: "Outro",
    },
    select_placeholder: "Selecione...",
    finalize_button: "Finalizar perfil",
    loading: "Salvando informações...",
    logout_button: "Entrou na conta errada? Sair",
    placeholders: {
      age: "Ex: 25",
      weight: "Ex: 75.5",
      height: "Ex: 175",
    },
    user_missing: "Usuário não encontrado. Faça login novamente.",
    unexpected_error: "Erro inesperado ao salvar perfil",
  },
  meals: {
    loading_title: "Carregando refeições",
    loading_subtitle: "Buscando suas refeições e macros do dia...",
    remaining_calories: "Calorias restantes",
    saved_meals: "Refeições salvas",
    no_saved_meals: "Nenhuma refeição salva ainda.",
    quick_add: "Adicionar rápido",
    history: {
      today: "Hoje",
      yesterday: "Ontem",
    },
    buckets: {
      breakfast: "Café da manhã",
      lunch: "Almoço",
      snack: "Lanche",
      dinner: "Jantar",
      breakfast_empty: "Nada registrado pela manhã",
      lunch_empty: "Nada registrado no almoço",
      snack_empty: "Nada registrado no lanche",
      dinner_empty: "Nada registrado no jantar",
      pending: "Pendente",
    },
    nutrients: {
      sugar: "Açúcar",
      sodium: "Sódio",
      within_target: "Dentro do recomendado para hoje.",
      above_target: "Acima do recomendado para hoje.",
    },
    modal: {
      add_title: "Adicionar",
      food: "Alimento",
      meal: "Refeição",
      search_placeholder_food: "Buscar alimentos...",
      search_placeholder_meal: "Buscar refeições...",
      global: "Global",
      database: "PinicoDB",
      taco: "TACO",
      my_items: "Meus itens",
      created_foods: "Meus alimentos",
      favorite_foods: "Alimentos salvos",
      created_meals: "Minhas refeições",
      favorite_meals: "Refeições salvas",
      no_results: "Nenhum item encontrado.",
      end_results: "Fim dos resultados",
      create_food: "Criar alimento",
      create_meal: "Criar refeição",
      favorite: "Salvar item",
      unfavorite: "Remover dos salvos",
      edit: "Editar",
      delete: "Remover",
      public_label: "Público",
      created_section: "Criados",
      saved_section: "Salvos",
      collapse: "Fechar",
      expand: "Abrir",
    },
    bucket_modal: {
      meal_label: "Refeição",
      add: "Adicionar",
      empty: "Nenhum item nessa refeição ainda.",
      amount_and_kcal: "{{amount}} g/ml • {{kcal}} kcal",
    },
    measurement: {
      generic: "Genérico",
      adjust_quantity: "Ajustar quantidade",
      choose_measure: "Escolha a medida",
      nutrition: "Informação nutricional",
      proteins: "Proteínas",
      carbs: "Carboidratos",
      fats: "Gorduras",
      fibers: "Fibras",
      total_weight: "Peso total",
      watch_out: "Fique atento",
      sugar_warning:
        "Esta porção já consome cerca de {{percent}}% da sua meta diária de açúcar.",
      sodium_warning:
        "Esta porção já consome cerca de {{percent}}% da sua meta diária de sódio.",
      unit_suffix_g: "g",
      unit_suffix_ml: "ml",
      confirm_add: "Adicionar",
      confirm_save: "Salvar",
    },
    editor: {
      new_food: "Novo alimento",
      edit_food: "Editar alimento",
      new_meal: "Nova refeição",
      edit_meal: "Editar refeição",
      name: "Nome",
      english_name: "Nome em inglês",
      spanish_name: "Nome em espanhol",
      description: "Descrição",
      brand: "Marca",
      calories: "Calorias",
      protein: "Proteína",
      carbs: "Carboidratos",
      fat: "Gorduras",
      fiber: "Fibras",
      sodium: "Sódio",
      sugar: "Açúcar",
      category: "Categoria",
      density: "Densidade",
      uses_ml: "Usa ml",
      public_toggle: "Tornar público",
      search_foods: "Buscar alimentos para montar esta refeição",
      meal_items: "Itens da refeição",
      empty_items: "Adicione pelo menos um alimento para montar sua refeição.",
      add_food: "Adicionar alimento",
      save: "Salvar",
      cancel: "Cancelar",
      remove: "Remover",
      quantity: "Quantidade",
      no_description: "Sem descrição",
    },
  },
  goals: {
    ...en.goals,
    loading_title: "Preparando seu plano diário...",
    loading_subtitle: "Sincronizando seus foguinhos e contando seu progresso.",
    title: "A Forja",
    subtitle: "Seu contrato com o seu futuro eu.",
    today_contract: "Contrato de Hoje",
    disabled_streak: "Streak Desativado",
    consistency_days: "Dias de Consistência",
    cards: {
      nutrition: "Alimentação",
      nutrition_subtitle: "Cumprir o plano nutricional diário.",
      tasks: "Tarefas de Foco",
      tasks_subtitle: "Executar as obrigações de alta prioridade.",
      water: "Água",
      sleep: "Sono",
      workout: "Treino",
      streak_shield: "Seguro de Streak",
      left_lives:
        "Você tem {{lives}} ressurreições disponíveis este mês. Use com sabedoria{{name}}.",
    },
    help_modal: {
      main: {
        title: "O Contrato Diário",
        rules_summary:
          "O Contrato Diário define as regras para manter seu streak.",
        status_total: {
          label: "Meta Total Batida",
          details: "Objetivo 100% concluído",
        },
        status_guaranteed: {
          label: "Contrato Garantido",
          details: "Dentro da tolerância permitida",
        },
        status_risk: {
          label: "Abaixo do Mínimo",
          details: "Risco de quebra de contrato",
        },
        headers: {
          min_goal: "Mínimo / Meta (Tol.)",
          realized: "Realizado",
        },
        rows: {
          nutrition: "Alimentação",
          water: "Água",
          sleep: "Sono",
          workout: "Treino",
          tasks: "Tarefas",
          rest: "Descanso",
          disabled: "Desabilitado",
        },
        footer: {
          warning: "ATENÇÃO:",
          note: "NOTA:",
          no_lives:
            "Você não possui mais Vidas disponíveis este mês. Se o dia acabar com qualquer meta em vermelho, seu Streak será resetado imediatamente.",
          with_lives:
            "Se o dia acabar em vermelho, uma vida será consumida automaticamente para proteger o streak. {{lives}} vida(s) restante(s).",
        },
      },
      flame: {
        title: "Status da Chama",
        description:
          "A chama reflete seu compromisso diário. Seu estado atual é determinado pelo cumprimento das tolerâncias de todas as suas metas ativas.",
        off: {
          label: "Apagada (Cinza)",
          details:
            "Pendente. O mínimo do contrato ainda não foi atingido hoje.",
        },
        streak: {
          label: "Chama Streak (Laranja)",
          details:
            "Ativa. Você bateu as tolerâncias e garantiu a manutenção do seu streak.",
        },
        supreme: {
          label: "Chama Suprema (Azul)",
          details:
            "Nível Máximo. Desbloqueada apenas quando TODAS as metas estão habilitadas e TODAS as tolerâncias estão em 100%.",
        },
        potential: {
          label: "Potencial Atual",
          supreme: "Nível Supremo",
          standard: "Nível Padrão",
        },
      },
      nutrition: {
        title: "Alimentação",
        description:
          "Controle calórico é a base de qualquer transformação física. Manter-se na faixa de tolerância garante que você não saia do plano.",
        status: {
          current: "Atualmente",
          ideal: "Meta Ideal",
          minimum: "Mínimo (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Foco Desativado",
          completed: "Dieta Batida",
          adjust: "Ajustar Nutrientes",
          log: "Registrar Refeição",
        },
      },
      water: {
        title: "Água",
        description:
          "A hidratação é essencial para o metabolismo e performance. Bater a meta de água garante que seu corpo funcione em alto nível.",
        status: {
          current: "Atualmente",
          ideal: "Meta Ideal",
          minimum: "Mínimo (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Foco Desativado",
          completed: "Hidratação Concluída",
          complete_ideal: "Completar Ideal",
          drink: "Beber Água",
        },
      },
      sleep: {
        title: "Sono",
        description:
          "O descanso é onde o resultado acontece. Menos sono significa menos performance e pior recuperação muscular.",
        status: {
          current: "Atualmente",
          ideal: "Meta Ideal",
          minimum: "Mínimo (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Foco Desativado",
          completed: "Descanso em Dia",
          log: "Registrar Sono",
        },
      },
      workout: {
        title: "Treino",
        description:
          "Consistência vence intensidade. Bater o volume mínimo de exercícios mantém o hábito vivo mesmo nos dias mais difíceis.",
        status: {
          completed_exercises: "Exercícios Concluídos",
          minimum: "Mínimo (Tol. {{pct}}%)",
          min_exercises: "{{count}} exercícios",
          progress: "Progresso",
        },
        button: {
          disabled: "Foco Desativado",
          completed: "Treino Finalizado",
          rest_day: "Dia de Descanso",
          complete_remaining: "Completar Restante",
          hit_goal: "Bater Meta",
        },
      },
      tasks: {
        title: "Tarefas de Foco",
        description:
          "As tarefas de foco são suas vitórias não-físicas. Cumprir suas obrigações diárias constrói a disciplina necessária.",
        status: {
          completed: "Concluídas",
          progress: "Progresso",
        },
        button: {
          disabled: "Foco Desativado",
          completed: "Foco Total Atingido",
          finish: "Finalizar Pendências",
        },
      },
      streak_shield: {
        title: "Seguro de Streak",
        how_it_works: {
          title: "Como funciona o Seguro:",
          description:
            "O sistema de vidas é sua única proteção contra falhas inevitáveis. Se o dia encerrar e qualquer uma das suas metas estiver em {VERMELHO}, uma vida será consumida automaticamente para evitar que seu fogo se apague.",
        },
        protection: {
          title: "Proteção Automática",
          description:
            "Você não precisa ativar nada. O contrato consome a vida no último segundo do dia se você falhar.",
        },
        death: {
          title: "Morte Súbita",
          description:
            "Se o seu contador de vidas chegar a {zero}, qualquer falha resultará no reset imediato do seu streak. Sem avisos, sem volta.",
        },
        recharge: {
          title: "Recarga Mensal",
          description:
            "As vidas são limitadas por ciclo. Use com sabedoria, pois a disciplina não aceita desculpas frequentes.",
        },
        status_label: "Status do Seguro",
      },
    },
    water: {
      ...en.goals.water,
      title: "Água",
      loading_title: "Carregando água",
      loading_subtitle: "Buscando sua hidratação de hoje...",
      goal: "Meta",
      remaining: "Faltam ? para bater a meta!",
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
        beaten: "Metas batidas",
        graph_title: "Visão mensal",
      },
    },
    workout: {
      ...en.goals.workout,
      workout_label: "Treino {{letter}}",
      workout_window: {
        ...en.goals.workout.workout_window,
        title: "Treino",
        badge_title: "Treino",
        yesterday: "Ontem",
        today: "Hoje",
        tomorrow: "Amanhã",
        focus: "Foco",
        calories: "Calorias",
        time: "Tempo",
        total_volume: "Volume total",
        exercise_order: "Ordem dos exercícios",
        exercises: "Exercícios",
        rest: "Descanso",
        rest_day: "Dia de descanso - Recuperação muscular",
        rest_msg: "É no descanso que a evolução acontece.",
        see_summary: "Ver sumário",
        locked_summary: "Conclua para desbloquear",
        next_round: "Próximo ciclo",
        next_round_msg: "{{workout}} • em {{distance}}",
        details_modal: {
          ...en.goals.workout.workout_window.details_modal,
          standard: "Padrão",
          warmup: "Aquecimento",
          exercise: "Exercício",
          failed: "Falhou",
          done: "Concluído",
          increased: "Subiu carga",
          rest: "Descanso",
          technique: "Técnica",
          save_button: "Salvar e fechar",
          reps: "Repetições",
          weight_done: "Peso real",
        },
      },
      plan_window: {
        ...en.goals.workout.plan_window,
        badge_title: "Planejar",
        title: "Planejamento",
        week_days: "DSTQQSS",
        rest_label: "Descanso",
        unnamed_workout: "Sem nome",
        synchronized: "Sincronizado",
        pending: "Mudanças pendentes",
        changes_apply: {
          0: "Atualizar o ciclo atual",
          or: " ou ",
          1: "começar um novo ciclo hoje",
        },
        explore_presets: "Explorar presets",
        saving: "Salvando...",
        cycle_structure: {
          ...en.goals.workout.plan_window.cycle_structure,
          title: "Estrutura do ciclo",
          subtitle: "Segure e arraste para reordenar",
          length: "Dias",
          configure: "Configurar",
          workout_add: "Treino",
          clear_btn: "Limpar",
          actions: {
            ...en.goals.workout.plan_window.cycle_structure.actions,
            quick_edit: "Atualizar e manter o ciclo",
            quick_edit_mobile: "Atualizar",
            new_cycle: "Aplicar como novo ciclo",
            new_cycle_mobile: "Novo",
            configure: "Configurar todos os treinos",
            mobile_configure: "Configurar",
            discard: "Descartar alterações",
          },
        },
        monthly_projection: {
          title: "Projeção mensal",
          recovery: "Recuperação",
          exercise_count: "{{count}} exercícios",
        },
        edit_workout_modal: {
          ...en.goals.workout.plan_window.edit_workout_modal,
          title: "Editando {{workout}}",
          workout_name: "Nome do treino",
          save_to_library: "Salvar na biblioteca",
          same_name_error: "Já existe um treino com esse nome",
          exercise: "Exercício",
          add_exercises: "Adicionar exercícios",
          inputs: {
            ...en.goals.workout.plan_window.edit_workout_modal.inputs,
            name: "Nome",
            group: "Grupo",
            group_ph: "Selecione o grupo...",
            sets: "Séries",
            reps: "Repetições",
            weight: "Peso",
            rest: "Descanso",
            rest_format: "Formato MM:SS (exemplo: 1:30)",
            obs: "Observações",
            type: {
              ...en.goals.workout.plan_window.edit_workout_modal.inputs.type,
              title: "Tipo",
              warmup: "Aquecimento",
              exercise: "Exercício",
            },
            technique: {
              ...en.goals.workout.plan_window.edit_workout_modal.inputs
                .technique,
              title: "Técnica",
              standard: "Padrão",
              bi_set: "Bi-set",
              drop_set: "Drop-set",
              rest_pause: "Rest-pause",
            },
            apply: "Aplicar ao ciclo",
          },
        },
        presets_modal: {
          ...en.goals.workout.plan_window.presets_modal,
          title: "Biblioteca",
          subtitle: "Meus treinos",
          no_workouts: "Nenhum treino salvo",
          exercises: "{{qty}} exercícios",
        },
        confirm_exit_modal: {
          ...en.goals.workout.plan_window.confirm_exit_modal,
          title: "Mudanças não salvas!",
          subtitle:
            "Se você sair agora, todo o progresso deste planejamento será perdido. Tem certeza de que quer sair?",
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
      summary_modal: {
        change_theme: "Mudar tema",
        saving: "Salvando...",
        saving_error: "Erro ao salvar",
        share: "Compartilhar",
        export_error: "Erro ao gerar imagem. Tente novamente.",
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
    sleep: {
      title: "Sono",
      subtitle: "Registre seu sono principal e qualquer cochilo extra do dia.",
      target: "Meta",
      main_duration: "Duração do sono principal",
      main_sleep: "Sono principal",
      nap: "Cochilo extra",
      bedtime: "Dormiu",
      wake_time: "Acordou",
      nap_start: "Começo do cochilo",
      nap_end: "Fim do cochilo",
      nap_duration: "Duração do cochilo",
      total_today: "Sono total de hoje",
      duration: "Duração",
      slept_at: "Dormiu",
      woke_at: "Acordou",
      save: "Salvar sono",
      saving: "Salvando...",
      recent_history: "Histórico recente",
      average: "Média",
      no_data: "Nenhum registro recente.",
      history_total: "{{hours}}h no total",
      history_nap: "Cochilo: {{hours}}h",
      helper:
        "Ajuste a duração ou os horários e o total será atualizado automaticamente.",
      overwrite_title: "Substituir o sono de hoje?",
      overwrite_description:
        "Já existe um registro de sono para hoje. Se salvar novamente, o registro atual será substituído.",
      confirm_overwrite: "Substituir registro",
      cancel: "Cancelar",
    },
    tasks: {
      title: "Tasks",
      subtitle: "Organize lembretes diários e tasks com data em um só lugar.",
      add: "Adicionar",
      today: "Hoje",
      scheduled: "Agendadas",
      none_today: "Nenhuma task ativa para hoje.",
      none_scheduled: "Nenhuma task agendada no momento.",
      daily: "Diária",
      one_time: "Data específica",
      new_task: "Nova task",
      edit_task: "Editar task",
      title_label: "Título",
      title_placeholder: "Exemplo: Pegar as chaves de casa",
      notes_label: "Detalhes",
      notes_placeholder:
        "Detalhes, contexto ou qualquer coisa que você queira lembrar",
      daily_label: "Repetir diariamente",
      target_date: "Data dessa task",
      reminder_label: "Lembrete",
      reminder_hint: "Data e hora opcionais para reforçar o lembrete",
      cancel: "Cancelar",
      save: "Salvar",
      pending_today: "{{count}} pendente(s) para hoje",
      complete: "Marcar como concluída",
      incomplete: "Voltar para pendente",
    },
  },
  zod: {
    ...en.zod,
    sign_in: {
      email: "E-mail inválido",
      password: "Senha é obrigatória",
    },
    sign_up: {
      name: "Nome muito curto",
      email: "E-mail inválido",
      password: "Mínimo de 6 caracteres",
      confirm_password: "As senhas não coincidem",
    },
    onboarding: {
      age: {
        required: "A idade é obrigatória",
        min: "Idade mínima de 10 anos",
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
        invalid: "Selecione uma meta válida",
      },
      activity_level: {
        required: "Selecione seu nível de atividade",
        invalid: "Selecione um nível de atividade válido",
      },
    },
  },
  tutorials: {
    ...en.tutorials,
    close: "Continuar",
    do_not_show_again: "Não mostrar novamente",
    workout: {
      title: "Como o workout funciona",
      subtitle:
        "Planeje o ciclo, preserve o passado e conclua cada exercício pela aba de treino.",
      steps: {
        plan: {
          title: "Planeje e configure",
          description:
            "Adicione treinos ou descansos, abra cada card para configurar exercícios e use presets para acelerar tudo.",
        },
        reorder: {
          title: "Arraste para reordenar",
          description:
            "Você pode arrastar a estrutura do ciclo. O passado fica preservado; só a projeção futura muda.",
        },
        complete: {
          title: "Conclua pela aba de treino",
          description:
            "Abra o treino de hoje, toque em um exercício e marque como concluído, falho ou subiu carga.",
        },
        save_modes: {
          title: "Entenda os dois salvamentos",
          description:
            "Aplicar como novo ciclo reinicia o ciclo a partir de hoje. Atualizar e manter o ciclo preserva a fase atual e muda apenas o que vem depois.",
        },
      },
    },
    water: {
      title: "Como a meta de água funciona",
      subtitle:
        "Registre água rapidamente, acompanhe o histórico e compare o progresso com sua meta diária.",
      steps: {
        quick_add: {
          title: "Use os botões rápidos",
          description:
            "Toque em 200ml, 500ml ou 1L para registrar com um toque.",
        },
        custom: {
          title: "Quantidade personalizada",
          description:
            "Use o campo personalizado quando você beber uma quantidade diferente.",
        },
        history: {
          title: "Confira o histórico",
          description:
            "Alterne entre hoje, semana e mês para acompanhar a consistência e remover registros errados.",
        },
        goal: {
          title: "Meta diária",
          description:
            "Sua meta é calculada no onboarding, mas você pode ajustar depois nas metas da conta.",
        },
      },
    },
    meals: {
      title: "Como as refeições funcionam",
      subtitle:
        "Pesquise alimentos reais, escolha a medida certa e acompanhe calorias, açúcar e sódio.",
      steps: {
        add: {
          title: "Adicione alimentos",
          description:
            "Use o botão de adicionar, pesquise pelo nome e escolha o alimento que mais combina com o que você comeu.",
        },
        measure: {
          title: "Escolha a medida certa",
          description:
            "Antes de salvar, selecione gramas, ml ou medidas caseiras para manter os macros corretos.",
        },
        warning: {
          title: "Veja os alertas",
          description:
            "Alimentos com muito açúcar ou sódio mostram um alerta antes da confirmação.",
        },
        dashboard: {
          title: "Acompanhe o dia",
          description:
            "As refeições atualizam o dashboard e o progresso dos macros para você sempre saber o que ainda falta.",
        },
      },
    },
    sleep: {
      title: "Como o sono funciona",
      subtitle:
        "Acompanhe o sono total do dia com um bloco principal e um cochilo opcional.",
      steps: {
        duration: {
          title: "Sono principal primeiro",
          description:
            "A duração do sono principal é o valor central. Dormiu e acordou ajudam a chegar nele.",
        },
        automatic: {
          title: "Sincronização automática",
          description:
            "Quando você muda a duração, o horário de acordar tem prioridade e o horário de dormir se ajusta. Se editar dormiu e acordou, a duração recalcula.",
        },
        nap: {
          title: "Adicione cochilos também",
          description:
            "Você pode registrar um cochilo extra para que o total do dia fique correto.",
        },
        history: {
          title: "Acompanhe a consistência",
          description:
            "O histórico mostra sua média recente e ajuda a entender se você está dormindo o suficiente.",
        },
      },
    },
    tasks: {
      title: "Como as tasks funcionam",
      subtitle:
        "Crie lembretes recorrentes, tasks para hoje ou algo agendado para uma data futura.",
      steps: {
        daily: {
          title: "Tasks diárias",
          description:
            "Use tasks diárias para coisas que você quer lembrar todos os dias, como pegar as chaves ou tomar um suplemento.",
        },
        dated: {
          title: "Tasks por data",
          description:
            "Você também pode criar algo específico para uma data, como ir ao banco ou resolver um compromisso.",
        },
        reminder: {
          title: "Lembrete opcional",
          description:
            "Você pode adicionar uma data e hora de lembrete para tornar a task mais acionável.",
        },
        dashboard: {
          title: "Dashboard",
          description:
            "As tasks pendentes aparecem no dashboard para servir como lembrete rápido.",
        },
      },
    },
  },
  app_loading: {
    entering_title: "Entrando",
    entering_subtitle: "Preparando seu espaço...",
    syncing_title: "Sincronizando",
    syncing_subtitle:
      "Carregando dashboard, treino, água, refeições, tasks e sono...",
  },
  server: {
    ...en.server,
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
