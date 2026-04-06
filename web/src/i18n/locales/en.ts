export const en = {
  dashboard: {
    title: "Today's Evolution",
    subtitle: "The shape doesn't rest, do you?",
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
      steps: "Steps",
      sleep: "Sleep",
      goal_reached: "Goal reached today",
      remaining: "Still missing ",
      steps_postfix: " steps",
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
    sidebar: {
      profile: "Profile",
      goals: "Goals",
      preferences: "Preferences",
      security: "Security",
      notifications: "Notifications",
      sign_out: "Sign Out",
    },
    profile: {
      title: "Profile",
      name: "Name",
      change_picture: "Change Picture",
      save_updates: "Save Updates",
    },
    goals: {
      title: "Goal Settings",
      subtitle: "Here you can adjust your calories and macros manually.",
      adjust_button: "Adjust Goals",
      fields: {
        water: "Water Goal (ml)",
        calories: "Daily Calories (kcal)",
        sleep: "Sleep Goal (hours)",
        steps: "Steps Goal",
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
      },
      weight_unit: {
        title: "Weight Unit",
        subtitle: "Choose your preferred weight unit",
      },
    },
    notifications: {
      title: "Notifications",
      subtitle: "Control the email used for alerts and monthly reports.",
      email_label: "Notification Email",
      email_hint: "Use the same email you used to sign in, or another email you actually check.",
      verified: "Verified",
      verify: "Verify email",
      verifying: "Verifying...",
      alerts: "Alerts",
      alerts_hint: "Receive reminders and important updates about your goals.",
      reports: "Monthly reports",
      reports_hint: "Get a monthly progress summary for water, meals and workouts.",
      saving: "Saving notifications...",
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
      helper: "This helps us calculate calories, water and macros more accurately.",
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
  },
  goals: {
    water: {
      title: "Water",
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
          recover_yourself: "Recover Yourself",
          exercises: "Exercises",
        },
        edit_workout_modal: {
          title: "Editing {{workout}}",
          workout_name: "Workout Name",
          save_to_library: "Save to Library",
          same_name_error: "There is already a workout with this name",
          exercise: "Exercise",
          inputs: {
            name: "Name",
            group: "Group",
            group_ph: "Select group...",
            sets: "Sets",
            reps: "Reps",
            weight: "Weight",
            rest: "Rest",
            obs: "Observations",
            type: {
              title: "Type",
              warmup: "Warmup",
              exercise: "Exercise",
            },
            technique: {
              title: "Technique",
              standard: "Standard",
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
    workout: {
      title: "How workout works",
      subtitle: "Plan your cycle, preserve the past, and complete each exercise from the workout tab.",
      steps: {
        plan: {
          title: "Plan and configure",
          description: "Add workouts or rest days, open each card to configure exercises, and use presets to speed things up.",
        },
        reorder: {
          title: "Drag to reorder",
          description: "You can drag the cycle structure. Past days stay preserved; only future projection changes.",
        },
        complete: {
          title: "Complete from the workout tab",
          description: "Open today's workout, tap an exercise, and mark it as completed, failed, or weight up.",
        },
        save_modes: {
          title: "Know the two save modes",
          description: "Apply as New Cycle restarts the cycle from today. Quick Edit keeps the current cycle phase and only updates what comes next.",
        },
      },
    },
    water: {
      title: "How water works",
      subtitle: "Log your water quickly, track history, and compare progress with your daily target.",
      steps: {
        quick_add: {
          title: "Use quick buttons",
          description: "Tap 200ml, 500ml or 1L to log with one touch.",
        },
        custom: {
          title: "Custom amount",
          description: "Use the custom field when you drank a different amount.",
        },
        history: {
          title: "Check history",
          description: "Switch between today, week and month to see consistency and remove incorrect entries.",
        },
        goal: {
          title: "Daily target",
          description: "Your target is calculated in onboarding, but you can fine-tune it later in account goals.",
        },
      },
    },
    meals: {
      title: "How meals works",
      subtitle: "Search real foods, choose the right measure, and track calories, sugar, and sodium.",
      steps: {
        add: {
          title: "Add foods",
          description: "Use the add button, search by name, and pick the food that best matches what you ate.",
        },
        measure: {
          title: "Choose the right measure",
          description: "Before saving, select grams, ml or household measures so the macros stay accurate.",
        },
        warning: {
          title: "Watch alerts",
          description: "Foods with high sugar or sodium show a warning before you confirm.",
        },
        dashboard: {
          title: "Track your day",
          description: "Meals update your dashboard and macro progress so you always know what is left for the day.",
        },
      },
    },
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
