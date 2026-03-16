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
    },
    preferences: {
      title: "Preferences",
      language: {
        title: "App Language",
        subtitle: "Choose your preferred language",
      },
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
