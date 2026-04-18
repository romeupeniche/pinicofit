import { en } from "./en";

export const es = {
  ...en,
  dashboard: {
    ...en.dashboard,
    title: "Evolución de hoy",
    subtitle: "El cuerpo no descansa, ¿y tú?",
    loading_title: "Cargando panel",
    loading_subtitle: "Buscando tus datos reales del día...",
    workout_compensated: "Entrenamiento compensado",
    macros: {
      protein: "Proteinas",
      carbs: "Carbohidratos",
      fats: "Grasas",
    },
    add_meal: "Añadir comida",
    remaining: "Restantes",
    meta_label: "Meta",
    consumed_label: "Consumido",
    total_meals: "Comidas totales",
    macros_title: "Macronutrientes",
    cards: {
      ...en.dashboard.cards,
      water: "Agua",
      workout: "Entrenamiento",
      tasks: "Tareas",
      sleep: "Sueño",
      goal_reached: "Meta cumplida hoy",
      remaining: "Todavía faltan ",
      no_synced_data: "Aún no hay datos sincronizados",
      tasks_postfix: " tareas",
      workout_postfix: " ejercicios",
    },
  },
  navbar: {
    sign_in: "Entrar",
    sign_up: "Registrarse",
    sign_out: "Cerrar sesión",
    account: "Mi cuenta",
  },
  account: {
    ...en.account,
    title: "Mi cuenta",
    subtitle: "Gestiona tu experiencia",
    save_updates: "Guardar cambios",
    unsaved_changes: {
      title: "Tienes cambios sin guardar",
      description: "Si sales ahora, tus cambios no se guardarán.",
      stay: "Quedarme aquí",
      leave: "Salir de todos modos",
    },
    logout_confirm: {
      title: "¿Cerrar sesión?",
      description:
        "Si sales ahora, la sesión actual se cerrará en este dispositivo.",
      cancel: "Cancelar",
      confirm: "Salir",
    },
    sidebar: {
      ...en.account.sidebar,
      profile: "Perfil",
      goals: "Metas",
      preferences: "Preferencias",
      notifications: "Notificaciones",
      help: "Ayuda y reportes",
      about: "Acerca de",
      sign_out: "Cerrar sesión",
    },
    profile: {
      ...en.account.profile,
      title: "Perfil",
      name: "Nombre",
      age: "Edad",
      weight: "Peso",
      height: "Altura",
      gender: "Género",
      goal: "Meta",
      activity_level: "Nivel de actividad",
      unknown_user: "Usuario",
      warning_recalculate:
        "Al cambiar peso, altura, edad, género, meta o nivel de actividad, todas tus metas se recalcularán.",
      change_picture: "Cambiar foto",
      saving: "Guardando cambios...",
    },
    goals: {
      ...en.account.goals,
      title: "Configuración de metas",
      subtitle: "Ajusta agua, calorías, macronutrientes y límites diarios.",
      streak_tolerance: "Tolerancia de racha",
      water: {
        title: "Meta de Agua",
        subtitle: "Objetivo diario y tolerancia de racha",
        tolerance_tip: "Cuenta a partir de {{{tolerance}} ml}",
        min_tip: " · mín. {{min}} ml (OMS)",
        goal: "Meta Diaria",
      },
      sleep: {
        title: "Meta de Sueño",
        subtitle: "Duración ideal de descanso y tolerancia",
        tolerance_tip: "Cuenta a partir de {{{tolerance}} hrs}",
        duration: "Duración",
      },
      nutrition: {
        title: "Nutrición y Macros",
        subtitle: "Objetivo de calorías y división de nutrientes",
        calorie_goal: "Meta de Calorías",
        protein: "Proteína",
        carbs: "Carbos",
        fat: "Grasa",
        tolerance_tip: "Racha contabilizada a partir de {{{tolerance}} kcal}",
        streak_tip:
          "Solo las calorías cuentan para tu racha, pero mantén el equilibrio de tus macros para una nutrición completa.",
      },
      workout: {
        title: "Meta de Entrenamiento",
        subtitle: "Umbral de finalización de ejercicios",
        minimum_completion: "Conclusión Mínima",
        tolerance_tip:
          "En una sesión de 10 ejercicios, puedes perder {{{tolerance}}} y aún así mantener tu racha",
      },
      tasks: {
        title: "Meta de Tareas",
        subtitle: "Objetivo diario de productividad",
        input_label: "Tareas por día",
        unit: "tareas",
      },
      saving: "Guardando metas...",
      reactivate_goal: {
        title: "Reactivate Goal",
        description:
          "To reactivate this goal with an active streak, the contract requires a sacrifice of {2 lives}. This action is immediate and cannot be undone.",
        confirm: "Pay 2 lives",
        cancel: "Not now",
      },
      disable_goal: {
        title: "Are you sure?",
        description:
          "By deactivating this goal, it will no longer count toward your contract. Additionally, you will be blocked from reactivating it for {7 days}, and reactivation will cost {2 lives} if your streak is active.",
        confirm: "Yes, deactivate",
        cancel: "Stay focused",
      },
      cooldown_active: {
        title: "Meta Bloqueada",
        description:
          "Esta meta está en periodo de descanso para evitar abusos en la racha. Podrás reactivarla en { {{days}} días}.",
        confirm: "Entendido",
      },
    },
    preferences: {
      ...en.account.preferences,
      title: "Preferencias",
      language: {
        title: "Idioma de la app",
        subtitle: "Elige tu idioma preferido",
        options: {
          en: "English (US)",
          br: "Português (BR)",
          es: "Español",
        },
      },
      weight_unit: {
        title: "Unidad de peso",
        subtitle: "Elige tu unidad de peso preferida",
      },
      saving: "Guardando preferencias...",
    },
    notifications: {
      ...en.account.notifications,
      title: "Notificaciones",
      subtitle: "Controla el correo usado para alertas e informes mensuales.",
      email_label: "Correo para notificaciones",
      email_hint:
        "Usa el mismo correo con el que iniciaste sesión u otro que revises de verdad.",
      verified: "Verificado",
      verify: "Verificar correo",
      verifying: "Enviando verificación...",
      save_before_verify: "Guarda el correo primero",
      alerts: "Alertas",
      alerts_hint: "Recibe recordatorios y avisos importantes sobre tus metas.",
      reports: "Informes mensuales",
      reports_hint:
        "Recibe un resumen mensual de agua, comidas, entrenamientos, sueño y tareas.",
      saving: "Guardando notificaciones...",
      test_report: "Enviar informe de prueba",
      sending_report: "Enviando informe...",
    },
    help: {
      title: "Ayuda y reportes",
      subtitle:
        "Envía un mensaje desde la app para reportar bugs, pedir ayuda o compartir feedback.",
      subject: "Asunto",
      subject_placeholder: "Ejemplo: Problema al guardar comidas",
      message: "Mensaje",
      message_placeholder:
        "Explica qué pasó, qué esperabas y cualquier detalle que ayude a reproducirlo.",
      send: "Enviar mensaje",
      sending: "Enviando mensaje...",
    },
    about: {
      title: "Acerca de",
      subtitle: "Obtén más información sobre PinicoFit y sus creadores.",
      app_proposal_title: "La Propuesta",
      app_proposal_text:
        "PinicoFit nació para simplificar el seguimiento de la salud. El enfoque es la consistência, no la perfección. Controle sus entrenamientos, nutrición y hábitos de forma sencilla e intuitiva.",
      developer_title: "El Desarrollador",
      developer_bio:
        "Desarrollador Full-stack apasionado por construir herramientas que mejoran la vida de las personas a través de la tecnología y el buen diseño.",
      links_title: "Presencia y Código",
      luana: "Para ti, Luana",
    },
  },
  home: {
    ...en.home,
    title_0: "Evoluciona hacia tu ",
    title_1: "mejor",
    title_2: " versión.",
    subtitle:
      "PinicoFit organiza tu dieta y tus entrenamientos para que te concentres en lo que importa: el físico de tus sueños. Sin vueltas, solo resultados.",
    start_button: "Empezar",
  },
  sign_in: {
    ...en.sign_in,
    title: "Bienvenido de nuevo.",
    subtitle:
      "Inicia sesión para seguir evolucionando y cumplir las metas de hoy.",
    password: "Contraseña",
    sign_in_button: "Continuar",
    loading: "Entrando...",
    sign_up_button: "¿No tienes una cuenta? Regístrate",
    forgot_password: "¿Olvidaste tu contraseña? Recupérala",
    pass_placeholder: "clave123",
    error: "Error al iniciar sesión:",
    serverError: "Error al conectar con el servidor",
  },
  sign_up: {
    ...en.sign_up,
    title: "Únete a PinicoFit.",
    subtitle:
      "El primer paso hacia tu nuevo físico empieza aquí. Vamos a configurar tu plan.",
    name: "Nombre",
    password: "Contraseña",
    confirm_password: "Confirmar contraseña",
    pass_placeholder: "clave123",
    sign_up_button: "Empezar",
    loading: "Creando cuenta...",
    sign_in_button: "¿Ya tienes una cuenta? Inicia sesión",
    error: "Error al crear la cuenta",
  },
  onboarding: {
    ...en.onboarding,
    title: "Solo faltan algunos datos...",
    subtitle: "Necesitamos esta información para calcular tus metas.",
    age: "Edad",
    weight: "Peso",
    height: "Altura",
    gender: "Género",
    goal: "¿Cuál es tu meta?",
    activity_level: {
      title: "Nivel de actividad",
      helper:
        "Esto nos ayuda a calcular calorías, agua y macros con más precisión.",
      options: {
        sedentary: "Sedentario",
        light: "Actividad ligera (1-2x/semana)",
        moderate: "Actividad moderada (3-4x/semana)",
        active: "Activo (5-6x/semana)",
        intense: "Actividad intensa (diaria / alto volumen)",
      },
    },
    goal_options: {
      bulk: "Ganar masa muscular",
      cut: "Bajar de peso",
      maintain: "Mantener el peso",
    },
    gender_options: {
      male: "Masculino",
      female: "Femenino",
      other: "Otro",
    },
    select_placeholder: "Selecciona...",
    finalize_button: "Completar perfil",
    loading: "Guardando información...",
    logout_button: "¿Entraste con la cuenta equivocada? Salir",
    placeholders: {
      age: "Ej: 25",
      weight: "Ej: 75.5",
      height: "Ej: 175",
    },
    user_missing: "Usuario no encontrado. Inicia sesión otra vez.",
    unexpected_error: "Error inesperado al guardar el perfil",
  },
  meals: {
    loading_title: "Cargando comidas",
    loading_subtitle: "Buscando tus comidas y macros del día...",
    remaining_calories: "Calorías restantes",
    saved_meals: "Comidas guardadas",
    no_saved_meals: "Todavía no hay comidas guardadas.",
    quick_add: "Añadir rápido",
    history: {
      today: "Hoy",
      yesterday: "Ayer",
    },
    buckets: {
      breakfast: "Desayuno",
      lunch: "Almuerzo",
      snack: "Merienda",
      dinner: "Cena",
      breakfast_empty: "Nada registrado por la mañana",
      lunch_empty: "Nada registrado en el almuerzo",
      snack_empty: "Nada registrado en la merienda",
      dinner_empty: "Nada registrado en la cena",
      pending: "Pendiente",
    },
    nutrients: {
      sugar: "Azúcar",
      sodium: "Sodio",
      within_target: "Dentro de lo recomendado para hoy.",
      above_target: "Por encima de lo recomendado para hoy.",
    },
    modal: {
      add_title: "Añadir",
      food: "Alimento",
      meal: "Comida",
      search_placeholder_food: "Buscar alimentos...",
      search_placeholder_meal: "Buscar comidas...",
      global: "Global",
      database: "PinicoDB",
      taco: "TACO",
      my_items: "Mis elementos",
      created_foods: "Mis alimentos",
      favorite_foods: "Alimentos guardados",
      created_meals: "Mis comidas",
      favorite_meals: "Comidas guardadas",
      no_results: "No se encontraron elementos.",
      end_results: "Fin de los resultados",
      create_food: "Crear alimento",
      create_meal: "Crear comida",
      favorite: "Guardar elemento",
      unfavorite: "Quitar de guardados",
      edit: "Editar",
      delete: "Eliminar",
      public_label: "Público",
      created_section: "Creados",
      saved_section: "Guardados",
      collapse: "Cerrar",
      expand: "Abrir",
    },
    bucket_modal: {
      meal_label: "Comida",
      add: "Añadir",
      empty: "Todavía no hay elementos en esta comida.",
      amount_and_kcal: "{{amount}} g/ml • {{kcal}} kcal",
    },
    measurement: {
      generic: "Genérico",
      adjust_quantity: "Ajustar cantidad",
      choose_measure: "Elige la medida",
      nutrition: "Información nutricional",
      proteins: "Proteínas",
      carbs: "Carbohidratos",
      fats: "Grasas",
      fibers: "Fibras",
      total_weight: "Peso total",
      watch_out: "Atención",
      sugar_warning:
        "Esta porción ya consume cerca del {{percent}}% de tu meta diaria de azúcar.",
      sodium_warning:
        "Esta porción ya consume cerca del {{percent}}% de tu meta diaria de sodio.",
      unit_suffix_g: "g",
      unit_suffix_ml: "ml",
      confirm_add: "Añadir",
      confirm_save: "Guardar",
    },
    editor: {
      new_food: "Nuevo alimento",
      edit_food: "Editar alimento",
      new_meal: "Nueva comida",
      edit_meal: "Editar comida",
      name: "Nombre",
      english_name: "Nombre en inglés",
      spanish_name: "Nombre en español",
      description: "Descripción",
      brand: "Marca",
      calories: "Calorías",
      protein: "Proteína",
      carbs: "Carbohidratos",
      fat: "Grasas",
      fiber: "Fibras",
      sodium: "Sodio",
      sugar: "Azúcar",
      category: "Categoría",
      density: "Densidad",
      uses_ml: "Usa ml",
      public_toggle: "Hacer público",
      search_foods: "Buscar alimentos para construir esta comida",
      meal_items: "Elementos de la comida",
      empty_items: "Añade al menos un alimento para construir tu comida.",
      add_food: "Añadir alimento",
      save: "Guardar",
      cancel: "Cancelar",
      remove: "Eliminar",
      quantity: "Cantidad",
      no_description: "Sin descripción",
    },
  },
  goals: {
    ...en.goals,
    loading_title: "Preparando tu plan diario...",
    loading_subtitle: "Sincronizando tus rachas y contando tu progreso.",
    title: "La Forja",
    subtitle: "Tu contrato con tu futuro yo.",
    today_contract: "Contrato de Hoy",
    disabled_streak: "Racha Desactivada",
    consistency_days: "Días de Consistencia",
    cards: {
      nutrition: "Alimentación",
      nutrition_subtitle: "Cumplir el plan nutricional diario.",
      tasks: "Tareas de Enfoque",
      tasks_subtitle: "Ejecutar obligaciones de alta prioridad.",
      water: "Agua",
      sleep: "Sueño",
      workout: "Entrenamiento",
      streak_shield: "Escudo de Racha",
      left_lives:
        "Tienes {{lives}} resurrecciones disponibles este mes. Úsalas con sabiduría{{name}}.",
    },
    help_modal: {
      main: {
        title: "El Contrato Diario",
        rules_summary:
          "El Contrato Diario define las reglas para mantener tu racha.",
        status_total: {
          label: "Meta Total Cumplida",
          details: "Objetivo 100% completado",
        },
        status_guaranteed: {
          label: "Contrato Garantizado",
          details: "Dentro de la tolerancia permitida",
        },
        status_risk: {
          label: "Debajo del Mínimo",
          details: "Riesgo de ruptura de contrato",
        },
        headers: {
          min_goal: "Mínimo / Meta (Tol.)",
          realized: "Realizado",
        },
        rows: {
          nutrition: "Alimentación",
          water: "Agua",
          sleep: "Sueño",
          workout: "Entrenamiento",
          tasks: "Tareas",
          rest: "Descanso",
          disabled: "Deshabilitado",
        },
        footer: {
          warning: "ATENCIÓN:",
          note: "NOTA:",
          no_lives:
            "No tienes más Vidas disponibles este mes. Si el día termina con cualquier meta en rojo, tu racha se reiniciará inmediatamente.",
          with_lives:
            "Si el día termina en rojo, se consumirá automáticamente una vida para proteger la racha. {{lives}} vida(s) restante(s).",
        },
      },
      flame: {
        title: "Estado de la Llama",
        description:
          "La llama refleja tu compromiso diario. Tu estado actual se determina cumpliendo con las tolerancias de todas tus metas activas.",
        off: {
          label: "Apagada (Gris)",
          details:
            "Pendiente. El mínimo del contrato aún no se ha alcanzado hoy.",
        },
        streak: {
          label: "Llama Streak (Naranja)",
          details:
            "Activa. Has cumplido con las tolerancias y asegurado el mantenimiento de tu racha.",
        },
        supreme: {
          label: "Llama Suprema (Azul)",
          details:
            "Nivel Máximo. Se desbloquea solo cuando TODAS las metas están activadas y TODAS las tolerancias están al 100%.",
        },
        potential: {
          label: "Potencial Actual",
          supreme: "Nivel Supremo",
          standard: "Nivel Estándar",
        },
      },
      nutrition: {
        title: "Alimentación",
        description:
          "El control calórico es la base de cualquier transformación física. Mantenerse en el rango de tolerancia asegura que no te desvíes del plan.",
        status: {
          current: "Actualmente",
          ideal: "Meta Ideal",
          minimum: "Mínimo (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Enfoque Desactivado",
          completed: "Dieta Cumplida",
          adjust: "Ajustar Nutrientes",
          log: "Registrar Comida",
        },
      },
      water: {
        title: "Agua",
        description:
          "La hidratación es esencial para el metabolismo y el rendimiento. Alcanzar la meta de agua asegura que tu cuerpo funcione a un alto nivel.",
        status: {
          current: "Actualmente",
          ideal: "Meta Ideal",
          minimum: "Mínimo (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Enfoque Desactivado",
          completed: "Hidratación Completada",
          complete_ideal: "Completar Ideal",
          drink: "Beber Agua",
        },
      },
      sleep: {
        title: "Sueño",
        description:
          "El descanso es donde ocurre el resultado. Menos sueño significa menos rendimiento y una peor recuperación muscular.",
        status: {
          current: "Actualmente",
          ideal: "Meta Ideal",
          minimum: "Mínimo (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Enfoque Desactivado",
          completed: "Descanso al Día",
          log: "Registrar Sueño",
        },
      },
      workout: {
        title: "Entrenamiento",
        description:
          "La consistencia vence a la intensidad. Alcanzar el volumen mínimo de ejercicios mantiene vivo el hábito incluso en los días más difíciles.",
        status: {
          completed_exercises: "Ejercicios Completados",
          minimum: "Mínimo (Tol. {{pct}}%)",
          min_exercises: "{{count}} ejercicios",
          progress: "Progreso",
        },
        button: {
          disabled: "Enfoque Desactivado",
          completed: "Entrenamiento Finalizado",
          rest_day: "Día de Descanso",
          complete_remaining: "Completar Restante",
          hit_goal: "Alcanzar Meta",
        },
      },
      tasks: {
        title: "Tareas de Enfoque",
        description:
          "Las tareas de enfoque son tus victorias no físicas. Cumplir con tus obligaciones diarias construye la disciplina necesaria.",
        status: {
          completed: "Completadas",
          progress: "Progreso",
        },
        button: {
          disabled: "Enfoque Desactivado",
          completed: "Enfoque Total Alcanzado",
          finish: "Finalizar Pendientes",
        },
      },
      streak_shield: {
        title: "Escudo de Racha",
        how_it_works: {
          title: "Cómo funciona el Seguro:",
          description:
            "El sistema de vidas es tu única protección contra fallos inevitables. Si el día termina y cualquiera de tus metas está en {ROJO}, se consumirá una vida automáticamente para evitar que tu fuego se apague.",
        },
        protection: {
          title: "Protección Automática",
          description:
            "No necesitas activar nada. El contrato consume la vida en el último segundo del día si fallas.",
        },
        death: {
          title: "Muerte Súbita",
          description:
            "Si tu contador de vidas llega a {cero}, cualquier fallo resultará en el reinicio inmediato de tu racha. Sin avisos, sin vuelta atrás.",
        },
        recharge: {
          title: "Recarga Mensual",
          description:
            "Las vidas son limitadas por ciclo. Úsalas con sabiduría, ya que la disciplina no acepta excusas frecuentes.",
        },
        status_label: "Estado del Seguro",
      },
    },
    water: {
      ...en.goals.water,
      title: "Agua",
      loading_title: "Cargando agua",
      loading_subtitle: "Buscando tu hidratación de hoy...",
      goal: "Meta",
      remaining: "Te faltan ? para cumplir la meta.",
      start: "¡Hora de hidratarse!",
      done: "¡Meta diaria alcanzada!",
      beaten: "Superaste la meta por",
      today_history: {
        title: "Hoy",
        empty_state: "Sin registros hoy",
      },
      week_history: {
        title: "Semana",
        consumed: "consumidos",
      },
      month_history: {
        title: "Mes",
        average: "Promedio",
        day: "día",
        beaten: "Metas logradas",
        graph_title: "Vista mensual",
      },
    },
    workout: {
      ...en.goals.workout,
      workout_label: "Entrenamiento {{letter}}",
      workout_window: {
        ...en.goals.workout.workout_window,
        title: "Entrenamiento",
        badge_title: "Entrenamiento",
        yesterday: "Ayer",
        today: "Hoy",
        tomorrow: "Mañana",
        focus: "Enfoque",
        calories: "Calorías",
        time: "Tiempo",
        total_volume: "Volumen total",
        exercise_order: "Orden de ejercicios",
        exercises: "Ejercicios",
        rest: "Descanso",
        rest_day: "Día de descanso - Recuperación muscular",
        rest_msg: "En el descanso también ocurre la evolución.",
        see_summary: "Ver resumen",
        locked_summary: "Completa para desbloquear",
        next_round: "Próximo ciclo",
        next_round_msg: "{{workout}} • en {{distance}}",
        details_modal: {
          ...en.goals.workout.workout_window.details_modal,
          standard: "Estándar",
          warmup: "Calentamiento",
          exercise: "Ejercicio",
          failed: "Falló",
          done: "Completado",
          increased: "Subió carga",
          rest: "Descanso",
          technique: "Técnica",
          save_button: "Guardar y cerrar",
          reps: "Repeticiones",
          weight_done: "Peso real",
        },
      },
      plan_window: {
        ...en.goals.workout.plan_window,
        badge_title: "Planificar",
        title: "Planificación",
        week_days: "DSTQQSS",
        rest_label: "Descanso",
        unnamed_workout: "Sin nombre",
        synchronized: "Sincronizado",
        pending: "Cambios pendientes",
        changes_apply: {
          0: "Actualizar el ciclo actual",
          or: " o ",
          1: "empezar un nuevo ciclo hoy",
        },
        explore_presets: "Explorar presets",
        saving: "Guardando...",
        cycle_structure: {
          ...en.goals.workout.plan_window.cycle_structure,
          title: "Estructura del ciclo",
          subtitle: "Mantén pulsado y arrastra para reordenar",
          length: "Días",
          configure: "Configurar",
          workout_add: "Entrenamiento",
          clear_btn: "Limpiar",
          actions: {
            ...en.goals.workout.plan_window.cycle_structure.actions,
            quick_edit: "Actualizar y mantener el ciclo",
            quick_edit_mobile: "Actualizar",
            new_cycle: "Aplicar como nuevo ciclo",
            new_cycle_mobile: "Nuevo",
            configure: "Configurar todos los entrenamientos",
            mobile_configure: "Configurar",
            discard: "Descartar cambios",
          },
        },
        monthly_projection: {
          title: "Proyección mensual",
          recovery: "Recuperación",
          exercise_count: "{{count}} ejercicios",
        },
        edit_workout_modal: {
          ...en.goals.workout.plan_window.edit_workout_modal,
          title: "Editando {{workout}}",
          workout_name: "Nombre del entrenamiento",
          save_to_library: "Guardar en la biblioteca",
          same_name_error: "Ya existe un entrenamiento con ese nombre",
          exercise: "Ejercicio",
          add_exercises: "Añadir ejercicios",
          inputs: {
            ...en.goals.workout.plan_window.edit_workout_modal.inputs,
            name: "Nombre",
            group: "Grupo",
            group_ph: "Selecciona el grupo...",
            sets: "Series",
            reps: "Repeticiones",
            weight: "Peso",
            rest: "Descanso",
            rest_format: "Formato MM:SS (ejemplo: 1:30)",
            obs: "Observaciones",
            type: {
              ...en.goals.workout.plan_window.edit_workout_modal.inputs.type,
              title: "Tipo",
              warmup: "Calentamiento",
              exercise: "Ejercicio",
            },
            technique: {
              ...en.goals.workout.plan_window.edit_workout_modal.inputs
                .technique,
              title: "Técnica",
              standard: "Estándar",
              bi_set: "Bi-set",
              drop_set: "Drop-set",
              rest_pause: "Rest-pause",
            },
            apply: "Aplicar al ciclo",
          },
        },
        presets_modal: {
          ...en.goals.workout.plan_window.presets_modal,
          title: "Biblioteca",
          subtitle: "Mis entrenamientos",
          no_workouts: "No hay entrenamientos guardados",
          exercises: "{{qty}} ejercicios",
        },
        confirm_exit_modal: {
          ...en.goals.workout.plan_window.confirm_exit_modal,
          title: "¡Cambios sin guardar!",
          subtitle:
            "Si sales ahora, se perderá todo el progreso de esta planificación. ¿Seguro que quieres salir?",
          actions: {
            discard: "Salir y descartar",
            cancel: "Seguir editando",
          },
        },
      },
      presets: {
        "preset-chest-triceps": {
          title: "Pecho y Tríceps",
          "preset-supino-reto-barra":
            "Press de Banca con Barra;Enfoque en progresión de carga, descenso controlado",
          "preset-supino-inclinado-halteres":
            "Press Inclinado con Mancuernas;Inclinación de 30º a 45º",
          "preset-crucifixo-maquina":
            "Aperturas en Máquina (Peck Deck);Pico de contracción de 1s en el centro",
          "preset-crossover-polia-alta":
            "Cruce de Poleas Altas;Enfoque en la parte inferior del pectoral",
          "preset-triceps-pulley-corda":
            "Tríceps en Polea con Cuerda;Abrir la cuerda al final del movimiento",
          "preset-triceps-testa-barra-ez":
            "Press Francés con Barra EZ;Cuidado con los codos, mantenerlos cerrados",
          "preset-triceps-frances-halter":
            "Extensión de Tríceps sobre la Cabeza;Máximo estiramiento de la fibra",
        },
        "preset-back-biceps": {
          title: "Espalda y Bíceps",
          "preset-puxada-pulley-frente":
            "Jalón al Pecho en Polea;Enfoque en la amplitud de los dorsales",
          "preset-remada-curvada-barra":
            "Remo con Barra;Agarre supinado para mayor activación",
          "preset-remada-unilateral-serrote":
            "Remo Unilateral (Serrucho);Mantener el tronco paralelo al banco",
          "preset-pull-down-corda":
            "Pull Down con Cuerda;Brazos casi rectos, enfoque en los dorsales",
          "preset-rosca-direta-barra-ez":
            "Curl de Bíceps con Barra EZ;Sin balancear el cuerpo, codos fijos",
          "preset-rosca-martelo-halteres":
            "Curl Martillo con Mancuernas;Enfoque en braquiorradial y braquial",
          "preset-rosca-concentrada-halter":
            "Curl Concentrado Unilateral;Pico de contracción en la parte superior",
        },
        "preset-legs-shoulders": {
          title: "Piernas y Hombros",
          "preset-agachamento-livre-barra":
            "Sentadilla Libre con Barra;Descenso controlado, enfoque en rango máximo",
          "preset-leg-press-45":
            "Leg Press 45º;Pies a la anchura de los hombros, sin bloquear rodillas",
          "preset-extensora-maquina":
            "Extensión de Piernas;Pico de contracción de 2s arriba",
          "preset-mesa-flexora":
            "Curl Femoral Tumbado;Enfoque en el estiramiento del femoral",
          "preset-stiff-com-halteres":
            "Peso Muerto Rumano con Mancuernas;Espalda recta, sentir el estiramiento",
          "preset-desenvolvimento-ombros-halter":
            "Press Militar con Mancuernas;Sentado, enfoque en deltoide anterior",
          "preset-elevacao-lateral-polia":
            "Elevación Lateral en Polea;Cable pasando por detrás del cuerpo",
        },
        "preset-abs-core": {
          title: "Abdomen y Core",
          "preset-abd-infra-paralela":
            "Elevación de Piernas en Paralelas;Enfoque en la elevación de la pelvis",
          "preset-abd-crunches-polia":
            "Crunch Abdominal en Polea;Carga moderada, enfoque en la contracción",
          "preset-abd-obliquo-polia":
            "Abdominales Oblicuos en Polea;Giro de tronco controlado",
          "preset-core-plancha":
            "Plancha Abdominal;Mantener contracción máxima por 1 min",
          "preset-lombar-extensao-banco":
            "Extensión Lumbar en Banco 45º;Subida controlada, no hiperextender",
          "preset-lombar-superman":
            "Superman (Suelo);Pico de contracción isométrica de 2s arriba",
        },
        "preset-fb-performance": {
          title: "Full Body Performance",
          "preset-fb-agachamento":
            "Sentadilla Libre;Compuesto base de miembros inferiores",
          "preset-fb-supino-reto": "Press de Banca con Barra;Enfoque en fuerza",
          "preset-fb-puxada-frente": "Jalón al Pecho;Enfoque en amplitud",
          "preset-fb-desenvolvimento-halter":
            "Press de Hombros;Sentado con mancuernas",
          "preset-fb-stiff": "Peso Muerto Rumano;Enfoque en isquiotibiales",
          "preset-fb-rosca-martelo": "Curl Martillo;Trabajo de brazo",
          "preset-fb-triceps-corda": "Tríceps Cuerda;Finalización de brazo",
        },
        "preset-fb-calisthenics-pro": {
          title: "Full Body Calistenia Pro",
          "preset-cali-barra-fixa-pronada":
            "Dominadas (Pull Ups);Agarre abierto, pecho a la barra",
          "preset-cali-paralelas-peito":
            "Fondos en Paralelas;Inclinar el tronco hacia adelante para el pecho",
          "preset-cali-agachamento-bulgaro":
            "Sentadilla Búlgara;Una pierna a la vez, enfoque en profundidad",
          "preset-cali-flexao-arqueiro":
            "Flexiones de Arquero;Alternando lados para carga unilateral",
          "preset-cali-chin-ups":
            "Chin-ups (Agarre Supinado);Máxima contracción de bíceps arriba",
          "preset-cali-flexao-diamante":
            "Flexiones Diamante;Manos juntas formando un diamante",
          "preset-cali-elevacao-pernas-barra":
            "Elevación de Piernas en Barra;Sin balanceo, subida explosiva",
        },
        "preset-cardio-burn-hiit": {
          title: "Quema de Cardio y HIIT",
          "preset-cardio-bike-hiit":
            "Bici HIIT (Intervalos);30s sprint máximo / 30s suave",
          "preset-cardio-esteira-incl":
            "Cinta Inclinada;15 min / Inclinación 12% / 5.0km/h",
          "preset-cardio-burpees": "Burpees;45 segundos de ejecución",
          "preset-cardio-corda": "Saltar la Cuerda;2 min constantes",
          "preset-cardio-mountain-climber":
            "Escaladores;Enfoque en ritmo cardíaco alto",
          "preset-cardio-polichinelos":
            "Jumping Jacks;Ejecución rápida para finalizar",
        },
      },
      metrics: {
        legs_compound: "Piernas (Multiarticular)",
        legs_isolated: "Piernas (Aislado)",
        back_compound: "Espalda (Multiarticular)",
        chest_compound: "Pecho (Multiarticular)",
        shoulders: "Hombros",
        biceps_isolated: "Bíceps (Aislado)",
        triceps_isolated: "Tríceps (Aislado)",
        abs_core: "Abdomen/Core",
        cali_upper_compound: "Calistenia Superior",
        cali_lower_compound: "Calistenia Inferior",
        cali_core_advanced: "Calistenia Core",
        cardio_hiit: "Cardio HIIT",
        cardio_steady: "Cardio Moderado",
        other: "Otros",
      },
      summary_modal: {
        change_theme: "Cambiar tema",
        saving: "Guardando...",
        saving_error: "Error al guardar",
        share: "Compartir",
        export_error: "Error al generar imagen. Inténtalo de nuevo.",
        total_volume: "Volumen Total",
        calories_burned: "Gasto Calórico",
        intensity: "Intensidad",
        exercises_abrev: "EJERC.",
        workout_focus: "Foco del Entrenamiento",
        general_performance: "Rendimiento General",
        surpassed_plan: {
          0: "Superaste lo planeado por ",
          1: " en volumen total.",
        },
      },
    },
    sleep: {
      title: "Sueño",
      subtitle: "Registra tu sueño principal y cualquier siesta extra del día.",
      target: "Meta",
      main_duration: "Duración del sueño principal",
      main_sleep: "Sueño principal",
      nap: "Siesta extra",
      bedtime: "Se durmió",
      wake_time: "Se despertó",
      nap_start: "Inicio de la siesta",
      nap_end: "Fin de la siesta",
      nap_duration: "Duración de la siesta",
      total_today: "Sueño total de hoy",
      duration: "Duración",
      slept_at: "Se durmió",
      woke_at: "Se despertó",
      save: "Guardar sueño",
      saving: "Guardando...",
      recent_history: "Historial reciente",
      average: "Promedio",
      no_data: "Sin registros recientes.",
      history_total: "{{hours}}h en total",
      history_nap: "Siesta: {{hours}}h",
      helper:
        "Ajusta la duración o las horas y el total se actualizará automáticamente.",
      overwrite_title: "¿Reemplazar el sueño de hoy?",
      overwrite_description:
        "Ya existe un registro de sueño para hoy. Si vuelves a guardar, el registro actual será reemplazado.",
      confirm_overwrite: "Reemplazar registro",
      cancel: "Cancelar",
    },
    tasks: {
      title: "Tareas",
      subtitle:
        "Organiza recordatorios diarios y tareas con fecha en un solo lugar.",
      add: "Añadir",
      today: "Hoy",
      scheduled: "Programadas",
      none_today: "No hay tareas activas para hoy.",
      none_scheduled: "No hay tareas programadas por ahora.",
      daily: "Diaria",
      one_time: "Programada",
      overdue: "Atrasada",
      completed: "Finalizada",
      new_task: "Nueva tarea",
      edit_task: "Editar tarea",
      title_label: "Título",
      title_placeholder: "Ejemplo: Coger las llaves de casa",
      notes_label: "Detalles",
      notes_placeholder:
        "Detalles, contexto o cualquier cosa que quieras recordar",
      daily_label: "Repetir diariamente",
      target_date: "Fecha de esta tarea",
      reminder_label: "Recordatorio",
      reminder_hint: "Fecha y hora opcionales para reforzar el recordatorio",
      cancel: "Cancelar",
      save: "Guardar",
      pending_today: "{{count}} pendiente(s) para hoy",
      complete: "Marcar como hecha",
      incomplete: "Volver a pendiente",
    },
  },
  zod: {
    ...en.zod,
    sign_in: {
      email: "Correo inválido",
      password: "La contraseña es obligatoria",
    },
    sign_up: {
      name: "Nombre demasiado corto",
      email: "Correo inválido",
      password: "Mínimo 6 caracteres",
      confirm_password: "Las contraseñas no coinciden",
    },
    onboarding: {
      age: {
        required: "La edad es obligatoria",
        min: "Edad mínima de 10 años",
        max: "Edad inválida",
      },
      weight: {
        required: "El peso es obligatorio",
        min: "Peso demasiado bajo",
        max: "Peso demasiado alto",
      },
      height: {
        required: "La altura es obligatoria",
        min: "Altura demasiado baja",
        max: "Altura demasiado alta",
      },
      gender: {
        required: "Selecciona un género",
        invalid: "Selecciona un género válido",
      },
      goal: {
        required: "Define tu meta",
        invalid: "Selecciona una meta válida",
      },
      activity_level: {
        required: "Selecciona tu nivel de actividad",
        invalid: "Selecciona un nivel de actividad válido",
      },
    },
  },
  tutorials: {
    ...en.tutorials,
    close: "Continuar",
    do_not_show_again: "No volver a mostrar",
    dashboard: {
      title: "Dominando tu Dashboard",
      subtitle:
        "Sigue tu evolución diaria, gestiona tus metas y mantén tu llama encendida.",
      steps: {
        streak: {
          title: "Mantén el fuego encendido",
          description:
            "Tu contador de racha en la parte superior muestra tu constancia. Completa metas diarias para subir el nivel de la llama y no perder vidas.",
        },
        nutrition: {
          title: "Control de Macronutrientes",
          description:
            "Visualiza tus calorías restantes y la distribución de Proteínas, Carbos y Grasas. Haz clic en 'Añadir comida' para registrar tu consumo.",
        },
        goals: {
          title: "Metas Rápidas",
          description:
            "Sigue Agua, Entreno, Tareas y Sueño en tiempo real. Cada tarjeta muestra el progreso actual frente al objetivo definido.",
        },
        summary: {
          title: "Evolución de Hoy",
          description:
            "El gráfico central resume tu día. Mira el total de kcal consumidas, número de comidas y el impacto del entreno en tu gasto calórico.",
        },
      },
    },
    workout: {
      title: "Cómo funciona workout",
      subtitle:
        "Planifica tu ciclo, conserva el pasado y completa cada ejercicio desde la pestaña de entrenamiento.",
      steps: {
        plan: {
          title: "Planifica y configura",
          description:
            "Añade entrenamientos o descansos, abre cada tarjeta para configurar ejercicios y usa presets para acelerar el proceso.",
        },
        reorder: {
          title: "Arrastra para reordenar",
          description:
            "Puedes arrastrar la estructura del ciclo. Los días pasados se preservan; solo cambia la proyección futura.",
        },
        complete: {
          title: "Completa desde la pestaña de entrenamiento",
          description:
            "Abre el entrenamiento de hoy, toca un ejercicio y márcalo como completado, fallido o subió carga.",
        },
        save_modes: {
          title: "Conoce los dos guardados",
          description:
            "Aplicar como nuevo ciclo reinicia el ciclo desde hoy. Actualizar y mantener el ciclo conserva la fase actual y solo cambia lo que viene después.",
        },
      },
    },
    water: {
      title: "Cómo funciona el agua",
      subtitle:
        "Registra agua rápidamente, sigue el historial y compara el progreso con tu meta diaria.",
      steps: {
        quick_add: {
          title: "Usa botones rápidos",
          description:
            "Toca 200ml, 500ml o 1L para registrar con un solo toque.",
        },
        custom: {
          title: "Cantidad personalizada",
          description:
            "Usa el campo personalizado cuando hayas tomado una cantidad diferente.",
        },
        history: {
          title: "Revisa el historial",
          description:
            "Cambia entre hoy, semana y mes para ver la constancia y eliminar registros incorrectos.",
        },
        goal: {
          title: "Meta diaria",
          description:
            "Tu meta se calcula en el onboarding, pero puedes ajustarla después en las metas de la cuenta.",
        },
      },
    },
    meals: {
      title: "Cómo funcionan las comidas",
      subtitle:
        "Busca alimentos reales, elige la medida correcta y sigue calorías, azúcar y sodio.",
      steps: {
        add: {
          title: "Añade alimentos",
          description:
            "Usa el botón de añadir, busca por nombre y elige el alimento que mejor representa lo que comiste.",
        },
        measure: {
          title: "Elige la medida correcta",
          description:
            "Antes de guardar, selecciona gramos, ml o medidas caseras para mantener los macros correctos.",
        },
        warning: {
          title: "Observa las alertas",
          description:
            "Los alimentos con mucho azúcar o sodio muestran una alerta antes de confirmar.",
        },
        dashboard: {
          title: "Sigue tu día",
          description:
            "Las comidas actualizan tu dashboard y el progreso de macros para que siempre sepas qué falta.",
        },
      },
    },
    sleep: {
      title: "Cómo funciona el sueño",
      subtitle:
        "Sigue el sueño total del día con un bloque principal y una siesta opcional.",
      steps: {
        duration: {
          title: "Sueño principal primero",
          description:
            "La duración del sueño principal es el valor central. La hora de dormir y de despertar ayudan a llegar a él.",
        },
        automatic: {
          title: "Sincronización automática",
          description:
            "Cuando cambias la duración, la hora de despertar tiene prioridad y la hora de dormir se ajusta. Si editas ambas horas, la duración se recalcula.",
        },
        nap: {
          title: "Añade siestas también",
          description:
            "También puedes registrar una siesta extra para que el total del día sea correcto.",
        },
        history: {
          title: "Sigue tu constancia",
          description:
            "El historial muestra tu promedio reciente y ayuda a entender si estás durmiendo lo suficiente.",
        },
      },
    },
    tasks: {
      title: "Cómo funcionan las tareas",
      subtitle:
        "Crea recordatorios diarios, tareas solo para hoy y tareas programadas para fechas futuras.",
      steps: {
        daily: {
          title: "Tareas diarias",
          description:
            "Usa tareas diarias para cosas que quieres recordar todos los días, como coger tus llaves o tomar un suplemento.",
        },
        dated: {
          title: "Tareas por fecha",
          description:
            "También puedes crear algo específico para una fecha, como ir al banco o resolver un compromiso.",
        },
        reminder: {
          title: "Recordatorio opcional",
          description:
            "Puedes añadir una fecha y una hora para que la tarea sea más accionable.",
        },
        dashboard: {
          title: "Dashboard",
          description:
            "Las tareas pendientes aparecen en el dashboard como recordatorio rápido.",
        },
      },
    },
  },
  app_loading: {
    entering_title: "Entrando",
    entering_subtitle: "Preparando tu espacio...",
    syncing_title: "Sincronizando",
    syncing_subtitle:
      "Cargando dashboard, entrenamiento, agua, comidas, tareas y sueño...",
  },
  server: {
    ...en.server,
    errors: {
      auth: {
        token_not_found: "Token no encontrado.",
        invalid_token: "Token inválido o expirado.",
        email_not_found: "Correo no encontrado.",
        incorrect_password: "Contraseña incorrecta.",
      },
      users: {
        invalid_email: "Correo inválido.",
        invalid_password: "La contraseña debe tener al menos 6 caracteres.",
        email_exists: "Este correo ya está registrado.",
      },
    },
  },
};
