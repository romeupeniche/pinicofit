export const en = {
  dashboard: {
    title: "Today's Evolution",
    subtitle: "The shape doesn't rest, do you?",
    loading_title: "Loading dashboard",
    loading_subtitle: "Fetching your real daily data...",
    workout_compensated: "Workout compensated",
    macros: {
      protein: "Proteins",
      carbs: "Carbohydrates",
      fats: "Fats",
    },
    add_meal: "Add Meal",
    remaining: "Remaining",
    meta_label: "Goal",
    consumed_label: "Consumed",
    total_meals: "Total Meals",
    macros_title: "Macronutrients",
    cards: {
      water: "Water",
      workout: "Workout",
      tasks: "Tasks",
      sleep: "Sleep",
      goal_reached: "Goal reached today",
      remaining: "Still missing ",
      no_synced_data: "No synced data yet",
      tasks_postfix: " tasks",
      workout_postfix: " exercises",
    },
  },
  navbar: {
    sign_in: "Sign In",
    sign_up: "Sign Up",
    sign_out: "Sign Out",
    account: "My Account",
  },
  account: {
    title: "Account",
    subtitle: "Manage your experience",
    save_updates: "Save Updates",
    unsaved_changes: {
      title: "You have unsaved changes",
      description: "If you leave now, your changes will not be saved.",
      stay: "Stay here",
      leave: "Leave anyway",
    },
    logout_confirm: {
      title: "Sign out?",
      description:
        "If you leave now, your current session will be closed on this device.",
      cancel: "Cancel",
      confirm: "Sign out",
    },
    sidebar: {
      profile: "Profile",
      goals: "Goals",
      preferences: "Preferences",
      notifications: "Notifications",
      help: "Help & reports",
      about: "About",
      sign_out: "Sign Out",
    },
    profile: {
      title: "Profile",
      name: "Name",
      age: "Age",
      weight: "Weight",
      height: "Height",
      gender: "Gender",
      goal: "Goal",
      activity_level: "Activity level",
      unknown_user: "User",
      warning_recalculate:
        "When you change weight, height, age, gender, goal, or activity level, all of your goals will be recalculated.",
      change_picture: "Change Picture",
      saving: "Saving profile...",
    },
    goals: {
      title: "Goal Settings",
      subtitle: "Here you can adjust your calories and macros manually.",
      adjust_button: "Adjust Goals",
      fields: {
        water: "Water Goal (ml)",
        calories: "Daily Calories (kcal)",
        sleep: "Sleep Goal (hours)",
        tasks: "Tasks Goal",
        protein: "Protein (g)",
        carbs: "Carbs (g)",
        fat: "Fat (g)",
        sodium: "Sodium (mg)",
        sugar: "Sugar (g)",
      },
      macro_title: "Nutrition & limits",
      saving: "Saving goals...",
    },
    preferences: {
      title: "Preferences",
      language: {
        title: "App Language",
        subtitle: "Choose your preferred language",
        options: {
          en: "English (US)",
          br: "Português (BR)",
          es: "Español",
        },
      },
      weight_unit: {
        title: "Weight Unit",
        subtitle: "Choose your preferred weight unit",
      },
      saving: "Saving preferences...",
    },
    notifications: {
      title: "Notifications",
      subtitle: "Control the email used for alerts and monthly reports.",
      email_label: "Notification Email",
      email_hint:
        "Use the same email you used to sign in, or another email you actually check.",
      verified: "Verified",
      verify: "Verify email",
      verifying: "Verifying...",
      save_before_verify: "Save email first",
      alerts: "Alerts",
      alerts_hint: "Receive reminders and important updates about your goals.",
      reports: "Monthly reports",
      reports_hint:
        "Get a monthly progress summary for water, meals and workouts.",
      saving: "Saving notifications...",
      test_report: "Send test report",
      sending_report: "Sending report...",
    },
    help: {
      title: "Help & reports",
      subtitle:
        "Send a message straight from the app so we can review bugs, feedback, or any issue you found.",
      subject: "Subject",
      subject_placeholder: "Example: Problem when saving meals",
      message: "Message",
      message_placeholder:
        "Explain what happened, what you expected, and any detail that may help reproduce the issue.",
      send: "Send message",
      sending: "Sending message...",
    },
    about: {
      title: "About",
      subtitle: "Learn more about PinicoFit and its creators.",
      app_proposal_title: "The Proposal",
      app_proposal_text:
        "PinicoFit was born to simplify health tracking. Focus on consistency, not perfection. Track your workouts, nutrition, and habits in a simple and intuitive way.",
      developer_title: "The Developer",
      developer_bio:
        "Full-stack developer passionate about building tools that improve people's lives through technology and good design.",
      links_title: "Presence & Code",
      luana: "For you, Luana",
    },
  },
  home: {
    title_0: "Evolve into your ",
    title_1: "best",
    title_2: " self.",
    subtitle:
      "PinicoFit streamlines your diet and workouts so you can focus on what matters: your dream physique. No fluff, just results.",
    start_button: "Get Started",
  },
  sign_in: {
    title: "Welcome back.",
    subtitle: "Sign in to keep evolving and crush today's goals.",
    password: "Password",
    sign_in_button: "Let's continue",
    loading: "Logging in...",
    sign_up_button: "Don't have an account? Sign up",
    forgot_password: "Forgot your password? Reset it",
    pass_placeholder: "pass123",
    error: "Login failed:",
    serverError: "Error connecting to the server",
  },
  sign_up: {
    title: "Join PinicoFit.",
    subtitle:
      "The first step to your new shape starts here. Let's configure your plan.",
    name: "Name",
    password: "Password",
    confirm_password: "Confirm Password",
    pass_placeholder: "pass123",
    sign_up_button: "Let's start",
    loading: "Creating account...",
    sign_in_button: "Already have an account? Sign in",
    error: "Error creating account",
  },
  onboarding: {
    title: "Just a few more details...",
    subtitle: "We need this information to calculate your goals.",
    age: "Age",
    weight: "Weight",
    height: "Height",
    gender: "Gender",
    goal: "What is your goal?",
    activity_level: {
      title: "Activity level",
      helper:
        "This helps us calculate calories, water and macros more accurately.",
      options: {
        sedentary: "Sedentary",
        light: "Light activity (1-2x/week)",
        moderate: "Moderate activity (3-4x/week)",
        active: "Active (5-6x/week)",
        intense: "Intense activity (daily / high volume)",
      },
    },
    goal_options: {
      bulk: "Gain muscle mass (Bulking)",
      cut: "Lose weight (Cutting)",
      maintain: "Maintenance",
    },
    gender_options: {
      male: "Male",
      female: "Female",
      other: "Other",
    },
    select_placeholder: "Select...",
    finalize_button: "Complete Profile",
    loading: "Saving Information...",
    logout_button: "Wrong account? Sign out",
    placeholders: {
      age: "Ex: 25",
      weight: "Ex: 75.5",
      height: "Ex: 175",
    },
    user_missing: "User not found. Please sign in again.",
    unexpected_error: "Unexpected error while saving your profile",
  },
  meals: {
    loading_title: "Loading meals",
    loading_subtitle: "Fetching your meals and macros for today...",
    remaining_calories: "Remaining calories",
    saved_meals: "Saved meals",
    no_saved_meals: "No saved meals yet.",
    quick_add: "Quick add",
    history: {
      today: "Today",
      yesterday: "Yesterday",
    },
    buckets: {
      breakfast: "Breakfast",
      lunch: "Lunch",
      snack: "Snack",
      dinner: "Dinner",
      breakfast_empty: "Nothing logged in the morning",
      lunch_empty: "Nothing logged for lunch",
      snack_empty: "Nothing logged for snacks",
      dinner_empty: "Nothing logged for dinner",
      pending: "Pending",
    },
    nutrients: {
      sugar: "Sugar",
      sodium: "Sodium",
      within_target: "Within the recommended target for today.",
      above_target: "Above the recommended target for today.",
    },
    modal: {
      add_title: "Add",
      food: "Food",
      meal: "Meal",
      search_placeholder_food: "Search foods...",
      search_placeholder_meal: "Search meals...",
      global: "Global",
      database: "PinicoDB",
      taco: "TACO",
      my_items: "My items",
      created_foods: "My foods",
      favorite_foods: "Saved foods",
      created_meals: "My meals",
      favorite_meals: "Saved meals",
      no_results: "No items found.",
      end_results: "End of results",
      create_food: "Create food",
      create_meal: "Create meal",
      favorite: "Save item",
      unfavorite: "Remove from saved",
      edit: "Edit",
      delete: "Delete",
      public_label: "Public",
      created_section: "Created",
      saved_section: "Saved",
      collapse: "Collapse",
      expand: "Expand",
    },
    bucket_modal: {
      meal_label: "Meal",
      add: "Add",
      empty: "No items in this meal yet.",
      amount_and_kcal: "{{amount}} g/ml • {{kcal}} kcal",
    },
    measurement: {
      generic: "Generic",
      adjust_quantity: "Adjust quantity",
      choose_measure: "Choose measure",
      nutrition: "Nutrition facts",
      proteins: "Proteins",
      carbs: "Carbs",
      fats: "Fats",
      fibers: "Fibers",
      total_weight: "Total weight",
      watch_out: "Pay attention",
      sugar_warning:
        "This serving already uses about {{percent}}% of your daily sugar target.",
      sodium_warning:
        "This serving already uses about {{percent}}% of your daily sodium target.",
      unit_suffix_g: "g",
      unit_suffix_ml: "ml",
      confirm_add: "Add",
      confirm_save: "Save",
    },
    editor: {
      new_food: "New food",
      edit_food: "Edit food",
      new_meal: "New meal",
      edit_meal: "Edit meal",
      name: "Name",
      english_name: "English name",
      spanish_name: "Spanish name",
      description: "Description",
      brand: "Brand",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbs",
      fat: "Fats",
      fiber: "Fibers",
      sodium: "Sodium",
      sugar: "Sugar",
      category: "Category",
      density: "Density",
      uses_ml: "Uses ml",
      public_toggle: "Make public",
      search_foods: "Search foods to build this meal",
      meal_items: "Meal items",
      empty_items: "Add at least one food to build your meal.",
      add_food: "Add food",
      save: "Save",
      cancel: "Cancel",
      remove: "Remove",
      quantity: "Quantity",
      no_description: "No description",
    },
  },
  goals: {
    loading_title: "Preparing your daily plan...",
    loading_subtitle: "Syncing your streaks and counting your progress.",
    title: "The Forge",
    subtitle: "Your contract with your future self.",
    today_contract: "Today's Contract",
    disabled_streak: "Streak Disabled",
    consistency_days: "Days of Consistency",
    cards: {
      nutrition: "Nutrition",
      nutrition_subtitle: "Fulfill the daily nutritional plan.",
      tasks: "Focus Tasks",
      tasks_subtitle: "Execute high-priority obligations.",
      water: "Water",
      sleep: "Sleep",
      workout: "Workout",
      streak_shield: "Streak Shield",
      left_lives:
        "You have {{lives}} resurrections available this month. Use them wisely{{name}}.",
    },
    help_modal: {
      main: {
        title: "The Daily Contract",
        rules_summary:
          "The Daily Contract defines the rules to maintain your streak.",
        status_total: {
          label: "Goal Fully Met",
          details: "Objective 100% completed",
        },
        status_guaranteed: {
          label: "Contract Guaranteed",
          details: "Within allowed tolerance",
        },
        status_risk: {
          label: "Below Minimum",
          details: "Risk of breaking contract",
        },
        headers: {
          min_goal: "Min / Goal (Tol.)",
          realized: "Achieved",
        },
        rows: {
          nutrition: "Nutrition",
          water: "Water",
          sleep: "Sleep",
          workout: "Workout",
          tasks: "Tasks",
          rest: "Rest Day",
          disabled: "Disabled",
        },
        footer: {
          warning: "WARNING:",
          note: "NOTE:",
          no_lives:
            "You have no more Lives available this month. If the day ends with any goal in red, your streak will be reset immediately.",
          with_lives:
            "If the day ends in red, a life will be automatically consumed to protect the streak. {{lives}} life(s) remaining.",
        },
      },
      flame: {
        title: "Flame Status",
        description:
          "The flame reflects your daily commitment. Your current status is determined by meeting the tolerances of all your active goals.",
        off: {
          label: "Extinguished (Gray)",
          details:
            "Pending. The minimum contract requirement hasn't been met yet today.",
        },
        streak: {
          label: "Streak Flame (Orange)",
          details:
            "Active. You have met the tolerances and secured your streak maintenance.",
        },
        supreme: {
          label: "Supreme Flame (Blue)",
          details:
            "Maximum Level. Unlocked only when ALL goals are enabled and ALL tolerances are set to 100%.",
        },
        potential: {
          label: "Current Potential",
          supreme: "Supreme Level",
          standard: "Standard Level",
        },
      },
      nutrition: {
        title: "Nutrition",
        description:
          "Caloric control is the foundation of any physical transformation. Staying within the tolerance range ensures you stay on track with the plan.",
        status: {
          current: "Currently",
          ideal: "Ideal Goal",
          minimum: "Minimum (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Focus Disabled",
          completed: "Diet Met",
          adjust: "Adjust Nutrients",
          log: "Log Meal",
        },
      },
      water: {
        title: "Water",
        description:
          "Hydration is essential for metabolism and performance. Hitting your water goal ensures your body functions at a high level.",
        status: {
          current: "Currently",
          ideal: "Ideal Goal",
          minimum: "Minimum (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Focus Disabled",
          completed: "Hydration Completed",
          complete_ideal: "Complete Ideal",
          drink: "Drink Water",
        },
      },
      sleep: {
        title: "Sleep",
        description:
          "Rest is where the results happen. Less sleep means lower performance and worse muscle recovery.",
        status: {
          current: "Currently",
          ideal: "Ideal Goal",
          minimum: "Minimum (Tol. {{pct}}%)",
        },
        button: {
          disabled: "Focus Disabled",
          completed: "Rest Up to Date",
          log: "Log Sleep",
        },
      },
      workout: {
        title: "Workout",
        description:
          "Consistency beats intensity. Meeting the minimum exercise volume keeps the habit alive even on the toughest days.",
        status: {
          completed_exercises: "Exercises Completed",
          minimum: "Minimum (Tol. {{pct}}%)",
          min_exercises: "{{count}} exercises",
          progress: "Progress",
        },
        button: {
          disabled: "Focus Disabled",
          completed: "Workout Finished",
          rest_day: "Rest Day",
          complete_remaining: "Complete Remaining",
          hit_goal: "Hit the Goal",
        },
      },
      tasks: {
        title: "Focus Tasks",
        description:
          "Focus tasks are your non-physical victories. Fulfilling your daily obligations builds the necessary discipline.",
        status: {
          completed: "Completed",
          progress: "Progress",
        },
        button: {
          disabled: "Focus Disabled",
          completed: "Total Focus Achieved",
          finish: "Finish Pendencies",
        },
      },
      streak_shield: {
        title: "Streak Shield",
        how_it_works: {
          title: "How the Shield works:",
          description:
            "The life system is your only protection against inevitable failures. If the day ends and any of your goals are in {RED}, a life will be automatically consumed to keep your fire from going out.",
        },
        protection: {
          title: "Automatic Protection",
          description:
            "You don't need to activate anything. The contract consumes the life at the last second of the day if you fail.",
        },
        death: {
          title: "Sudden Death",
          description:
            "If your life counter reaches {zero}, any failure will result in an immediate reset of your streak. No warnings, no going back.",
        },
        recharge: {
          title: "Monthly Recharge",
          description:
            "Lives are limited per cycle. Use them wisely, as discipline does not accept frequent excuses.",
        },
        status_label: "Shield Status",
      },
    },
    water: {
      title: "Water",
      loading_title: "Loading water",
      loading_subtitle: "Fetching your hydration progress for today...",
      goal: "Goal",
      remaining: "? left to reach your goal!",
      start: "Time to hydrate!",
      done: "Daily goal reached!",
      beaten: "Surpassed goal by",
      today_history: {
        title: "Today",
        empty_state: "No logs today",
      },
      week_history: {
        title: "Week",
        consumed: "consumed",
      },
      month_history: {
        title: "Month",
        average: "Average",
        day: "day",
        beaten: "Goals Hit",
        graph_title: "Monthly View",
      },
    },
    workout: {
      workout_label: "Workout {{letter}}",
      workout_window: {
        title: "Workout",
        badge_title: "Workout",
        yesterday: "Yesterday",
        today: "Today",
        tomorrow: "Tomorrow",
        focus: "Focus",
        calories: "Calories",
        time: "Time",
        total_volume: "Total Volume",
        exercise_order: "Exercise Order",
        exercises: "Exercises",
        rest: "Rest",
        rest_day: "Rest Day - Muscle Recovery",
        rest_msg: "Rest is where evolution happens.",
        see_summary: "Explore Summary",
        locked_summary: "Complete to Unlock",
        next_round: "Next Round",
        next_round_msg: "{{workout}} • in {{distance}}",
        details_modal: {
          standard: "Standard",
          warmup: "Warm-up",
          exercise: "Exercise",
          failed: "Failed",
          done: "Completed",
          increased: "Weight Up",
          rest: "Rest",
          technique: "Technique",
          save_button: "Save & Close",
          reps: "Reps",
          weight_done: "Actual Weight",
        },
      },
      plan_window: {
        badge_title: "Plan",
        title: "Planning",
        week_days: "SMTWTFS",
        rest_label: "Rest",
        unnamed_workout: "Unnamed workout",
        synchronized: "Synchronized",
        pending: "Pending Changes",
        changes_apply: {
          0: "Update current progress",
          or: " or ",
          1: "start a fresh cycle today",
        },
        explore_presets: "Explore Presets",
        saving: "Saving...",
        cycle_structure: {
          title: "Cycle Structure",
          subtitle: "Hold and drag to reorder",
          length: "Days",
          configure: "Configure",
          workout_add: "Workout",
          clear_btn: "Clear",
          actions: {
            quick_edit: "Quick Edit (Keep Cycle)",
            quick_edit_mobile: "Update",
            new_cycle: "Apply as New Cycle",
            new_cycle_mobile: "New",
            configure: "Configure All Workouts",
            mobile_configure: "Configure",
            discard: "Discard Changes",
          },
        },
        monthly_projection: {
          title: "Monthly Projection",
          recovery: "Recovery",
          exercise_count: "{{count}} exercises",
        },
        edit_workout_modal: {
          title: "Editing {{workout}}",
          workout_name: "Workout Name",
          save_to_library: "Save to Library",
          same_name_error: "There is already a workout with this name",
          exercise: "Exercise",
          add_exercises: "Add exercises",
          inputs: {
            name: "Name",
            group: "Group",
            group_ph: "Select group...",
            sets: "Sets",
            reps: "Reps",
            weight: "Weight",
            rest: "Rest",
            rest_format: "Format MM:SS (example: 1:30)",
            obs: "Observations",
            type: {
              title: "Type",
              warmup: "Warmup",
              exercise: "Exercise",
            },
            technique: {
              title: "Technique",
              standard: "Standard",
              bi_set: "Bi-set",
              drop_set: "Drop-set",
              rest_pause: "Rest-pause",
            },
            apply: "Apply to Cycle",
          },
        },
        presets_modal: {
          title: "Library",
          subtitle: "My Workouts",
          no_workouts: "No workouts saved",
          exercises: "{{qty}} Exercises",
        },
        confirm_exit_modal: {
          title: "Unsaved changes!",
          subtitle:
            "If you leave now, all your workout progress will be lost. Are you sure you want to exit?",
          actions: {
            discard: "Exit and discard",
            cancel: "Keep editing",
          },
        },
      },
      presets: {
        "preset-chest-triceps": {
          title: "Chest & Triceps",
          "preset-supino-reto-barra":
            "Barbell Bench Press;Focus on progressive overload and controlled eccentric",
          "preset-supino-inclinado-halteres":
            "Incline Dumbbell Press;30º to 45º incline",
          "preset-crucifixo-maquina":
            "Machine Fly (Peck Deck);1s peak contraction at the top",
          "preset-crossover-polia-alta":
            "High Cable Cross-over;Focus on lower chest",
          "preset-triceps-pulley-corda":
            "Triceps Rope Pushdown;Flaring the rope at the bottom",
          "preset-triceps-testa-barra-ez":
            "EZ-Bar Triceps Extension;Keep elbows tucked in",
          "preset-triceps-frances-halter":
            "Overhead Dumbbell Extension;Maximum fiber stretch",
        },
        "preset-back-biceps": {
          title: "Back & Biceps",
          "preset-puxada-pulley-frente": "Lat Pulldown;Focus on lat width",
          "preset-remada-curvada-barra":
            "Bent Over Barbell Row;Supinated grip for better activation",
          "preset-remada-unilateral-serrote":
            "Single-Arm Dumbbell Row;Keep torso parallel to the bench",
          "preset-pull-down-corda":
            "Straight Arm Lat Pulldown;Arms nearly straight, focus on lats",
          "preset-rosca-direta-barra-ez":
            "EZ-Bar Curl;No body swinging, keep elbows fixed",
          "preset-rosca-martelo-halteres":
            "Dumbbell Hammer Curl;Focus on brachioradialis and brachialis",
          "preset-rosca-concentrada-halter":
            "Concentration Curl;Peak contraction at the top",
        },
        "preset-legs-shoulders": {
          title: "Legs & Shoulders",
          "preset-agachamento-livre-barra":
            "Barbell Back Squat;Controlled descent, focus on full range of motion",
          "preset-leg-press-45":
            "45º Leg Press;Shoulder-width feet, do not lock knees",
          "preset-extensora-maquina":
            "Leg Extension;2s peak contraction at the top",
          "preset-mesa-flexora": "Lying Leg Curl;Focus on hamstring stretch",
          "preset-stiff-com-halteres":
            "Dumbbell Stiff-Leg Deadlift;Keep back straight, feel the hamstrings stretch",
          "preset-desenvolvimento-ombros-halter":
            "Dumbbell Shoulder Press;Seated, focus on anterior deltoid",
          "preset-elevacao-lateral-polia":
            "Cable Lateral Raise;Cable passing behind the body",
        },
        "preset-abs-core": {
          title: "Abs & Core",
          "preset-abd-infra-paralela":
            "Hanging Knee Raise;Focus on posterior pelvic tilt",
          "preset-abd-crunches-polia":
            "Cable Crunch;Moderate weight, focus on contraction",
          "preset-abd-obliquo-polia":
            "Cable Woodchopper;Controlled torso rotation",
          "preset-core-plancha": "Plank;Hold maximum contraction for 1 min",
          "preset-lombar-extensao-banco":
            "Hyperextension (45º Back Extension);Controlled ascent, do not overextend",
          "preset-lombar-superman":
            "Superman;2s isometric contraction at the top",
        },
        "preset-fb-performance": {
          title: "Full Body Performance",
          "preset-fb-agachamento":
            "Back Squat;Primary lower body compound move",
          "preset-fb-supino-reto": "Barbell Bench Press;Focus on strength",
          "preset-fb-puxada-frente": "Lat Pulldown;Focus on width",
          "preset-fb-desenvolvimento-halter":
            "Dumbbell Press;Seated with dumbbells",
          "preset-fb-stiff": "Dumbbell Stiff-Leg Deadlift;Focus on hamstrings",
          "preset-fb-rosca-martelo": "Hammer Curl;Arm work",
          "preset-fb-triceps-corda": "Triceps Rope Pushdown;Arm finisher",
        },
        "preset-fb-calisthenics-pro": {
          title: "Full Body Calisthenics Pro",
          "preset-cali-barra-fixa-pronada": "Pull Ups;Wide grip, chest to bar",
          "preset-cali-paralelas-peito":
            "Chest Dips;Lean forward to target the chest",
          "preset-cali-agachamento-bulgaro":
            "Bulgarian Split Squat;One leg at a time, focus on depth",
          "preset-cali-flexao-arqueiro":
            "Archer Pushups;Alternating sides for unilateral load",
          "preset-cali-chin-ups":
            "Chin-Ups;Maximum biceps contraction at the top",
          "preset-cali-flexao-diamante":
            "Diamond Pushups;Hands together forming a diamond shape",
          "preset-cali-elevacao-pernas-barra":
            "Hanging Leg Raise;No momentum, explosive lift",
        },
        "preset-cardio-burn-hiit": {
          title: "Cardio Burn & HIIT",
          "preset-cardio-bike-hiit":
            "HIIT Bike;30s max sprint / 30s low intensity",
          "preset-cardio-esteira-incl":
            "Incline Treadmill;15 min / 12% Incline / 5.0km/h",
          "preset-cardio-burpees": "Burpees;45 seconds of execution",
          "preset-cardio-corda": "Jump Rope;2 min constant pace",
          "preset-cardio-mountain-climber":
            "Mountain Climber;Focus on high heart rate",
          "preset-cardio-polichinelos":
            "Jumping Jacks;Fast execution to finish",
        },
      },
      metrics: {
        legs_compound: "Legs (Compound)",
        legs_isolated: "Legs (Isolated)",
        back_compound: "Back (Compound)",
        chest_compound: "Chest (Compound)",
        shoulders: "Shoulders",
        biceps_isolated: "Biceps (Isolated)",
        triceps_isolated: "Triceps (Isolated)",
        abs_core: "Abs/Core",
        cali_upper_compound: "Calisthenics (Upper)",
        cali_lower_compound: "Calisthenics (Lower)",
        cali_core_advanced: "Calisthenics (Core)",
        cardio_hiit: "Cardio HIIT",
        cardio_steady: "Steady-state Cardio",
        other: "Others",
      },
      summary_modal: {
        change_theme: "Change theme",
        saving: "Saving...",
        saving_error: "Saving error",
        share: "Share",
        export_error: "Error generating image. Please try again.",
        total_volume: "Total Volume",
        calories_burned: "Calories Burned",
        intensity: "Intensity",
        exercises_abrev: "EXERC.",
        workout_focus: "Workout Focus",
        general_performance: "Performance",
        surpassed_plan: {
          0: "You surpassed your planned volume by ",
          1: " in total.",
        },
      },
    },
    sleep: {
      title: "Sleep",
      subtitle: "Log your main sleep and any extra nap from the day.",
      target: "Target",
      main_duration: "Main sleep duration",
      main_sleep: "Main sleep",
      nap: "Extra nap",
      bedtime: "Bedtime",
      wake_time: "Wake-up time",
      nap_start: "Nap started",
      nap_end: "Nap ended",
      nap_duration: "Nap duration",
      total_today: "Total sleep today",
      recent_history: "Recent history",
      average: "Average",
      save: "Save sleep",
      saving: "Saving...",
      no_data: "No sleep logs yet.",
      history_total: "{{hours}}h total",
      history_nap: "Nap: {{hours}}h",
      helper: "Adjust duration or times and the total updates automatically.",
      overwrite_title: "Replace today's sleep?",
      overwrite_description:
        "A sleep entry already exists for today. Saving again will replace the current record.",
      confirm_overwrite: "Replace record",
      cancel: "Cancel",
    },
    tasks: {
      title: "Tasks",
      subtitle: "Organize daily reminders and date-based tasks in one place.",
      add: "Add",
      today: "Today",
      scheduled: "Scheduled",
      none_today: "No active tasks for today.",
      none_scheduled: "No scheduled tasks right now.",
      daily: "Daily",
      one_time: "Specific date",
      new_task: "New task",
      edit_task: "Edit task",
      title_label: "Title",
      title_placeholder: "Example: Pick up the house keys",
      notes_label: "Details",
      notes_placeholder: "Details, context, or anything you want to remember",
      daily_label: "Repeat every day",
      target_date: "Date for this task",
      reminder_label: "Reminder",
      reminder_hint: "Optional reminder date and time",
      cancel: "Cancel",
      save: "Save",
      pending_today: "{{count}} pending for today",
      complete: "Mark as done",
      incomplete: "Mark as pending",
    },
  },
  zod: {
    sign_in: {
      email: "Invalid email",
      password: "Password is required",
    },
    sign_up: {
      name: "Name too short",
      email: "Invalid email",
      password: "Minimum 6 characters",
      confirm_password: "Passwords do not match",
    },
    onboarding: {
      age: {
        required: "Age is required",
        min: "Minimum age is 10 years old",
        max: "Invalid age",
      },
      weight: {
        required: "Weight is required",
        min: "Weight is too low",
        max: "Weight is too high",
      },
      height: {
        required: "Height is required",
        min: "Height is too low",
        max: "Height is too high",
      },
      gender: {
        required: "Please select a gender",
        invalid: "Please select a valid gender",
      },
      goal: {
        required: "Please define your goal",
        invalid: "Please select a valid goal",
      },
      activity_level: {
        required: "Please select your activity level",
        invalid: "Please select a valid activity level",
      },
    },
  },
  tutorials: {
    close: "Start using the app",
    do_not_show_again: "Don't show again",
    workout: {
      title: "How workout works",
      subtitle:
        "Plan your cycle, preserve the past, and complete each exercise from the workout tab.",
      steps: {
        plan: {
          title: "Plan and configure",
          description:
            "Add workouts or rest days, open each card to configure exercises, and use presets to speed things up.",
        },
        reorder: {
          title: "Drag to reorder",
          description:
            "You can drag the cycle structure. Past days stay preserved; only future projection changes.",
        },
        complete: {
          title: "Complete from the workout tab",
          description:
            "Open today's workout, tap an exercise, and mark it as completed, failed, or weight up.",
        },
        save_modes: {
          title: "Know the two save modes",
          description:
            "Apply as New Cycle restarts the cycle from today. Quick Edit keeps the current cycle phase and only updates what comes next.",
        },
      },
    },
    water: {
      title: "How water works",
      subtitle:
        "Log your water quickly, track history, and compare progress with your daily target.",
      steps: {
        quick_add: {
          title: "Use quick buttons",
          description: "Tap 200ml, 500ml or 1L to log with one touch.",
        },
        custom: {
          title: "Custom amount",
          description:
            "Use the custom field when you drank a different amount.",
        },
        history: {
          title: "Check history",
          description:
            "Switch between today, week and month to see consistency and remove incorrect entries.",
        },
        goal: {
          title: "Daily target",
          description:
            "Your target is calculated in onboarding, but you can fine-tune it later in account goals.",
        },
      },
    },
    meals: {
      title: "How meals works",
      subtitle:
        "Search real foods, choose the right measure, and track calories, sugar, and sodium.",
      steps: {
        add: {
          title: "Add foods",
          description:
            "Use the add button, search by name, and pick the food that best matches what you ate.",
        },
        measure: {
          title: "Choose the right measure",
          description:
            "Before saving, select grams, ml or household measures so the macros stay accurate.",
        },
        warning: {
          title: "Watch alerts",
          description:
            "Foods with high sugar or sodium show a warning before you confirm.",
        },
        dashboard: {
          title: "Track your day",
          description:
            "Meals update your dashboard and macro progress so you always know what is left for the day.",
        },
      },
    },
    sleep: {
      title: "How sleep works",
      subtitle:
        "Track your total sleep with a main sleep block and an optional nap.",
      steps: {
        duration: {
          title: "Main sleep first",
          description:
            "Your main sleep duration is the central value. Bedtime and wake-up help you reach it.",
        },
        automatic: {
          title: "Automatic sync",
          description:
            "When you change duration, wake-up time takes priority and bedtime adjusts automatically. If you edit bedtime and wake-up, duration recalculates.",
        },
        nap: {
          title: "Add naps too",
          description:
            "You can also log an extra nap so your daily total reflects the full day.",
        },
        history: {
          title: "Track consistency",
          description:
            "The history card helps you see your recent average and whether you're sleeping enough.",
        },
      },
    },
    tasks: {
      title: "How tasks work",
      subtitle:
        "Create recurring reminders, tasks for today, or something scheduled for a future date.",
      steps: {
        daily: {
          title: "Daily reminders",
          description:
            "Use daily tasks for habits and recurring reminders, like taking your keys or a supplement.",
        },
        dated: {
          title: "Date-based tasks",
          description:
            "Use a specific date when something belongs only to one day, like going to the bank or remembering a birthday.",
        },
        reminder: {
          title: "Optional reminder",
          description:
            "You can add a reminder date and time to make the task more actionable.",
        },
        dashboard: {
          title: "Dashboard sync",
          description:
            "Pending tasks also show on the dashboard, so they work as quick reminders.",
        },
      },
    },
  },
  app_loading: {
    entering_title: "Entering",
    entering_subtitle: "Preparing your space...",
    syncing_title: "Syncing",
    syncing_subtitle:
      "Loading dashboard, workout, water, meals, tasks, and sleep...",
  },
  server: {
    errors: {
      auth: {
        token_not_found: "Token not found.",
        invalid_token: "Invalid or expired token.",
        email_not_found: "Email not found.",
        incorrect_password: "Incorrect password.",
      },
      users: {
        invalid_email: "Invalid email address.",
        invalid_password: "Password must be at least 6 characters long.",
        email_exists: "This email is already registered.",
      },
    },
  },
};
