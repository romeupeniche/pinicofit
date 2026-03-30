const MUSCLE_QUOTES: Record<string, { br: string; en: string; es: string }[]> =
  {
    chest: [
      {
        br: "Peitoral de aço: a gravidade hoje passou mal.",
        en: "Steel chest: gravity struggled today.",
        es: "Pecho de acero: la gravedad hoy lo pasó mal.",
      },
      {
        br: "Supino não é só exercício, é terapia de choque.",
        en: "Bench press isn't just an exercise, it's shock therapy.",
        es: "El press de banca no es solo ejercicio, es terapia de choque.",
      },
      {
        br: "Volume de peito insano. O pump veio forte.",
        en: "Insane chest volume. The pump hit hard.",
        es: "Volumen de pecho insano. El pump vino fuerte.",
      },
    ],
    back: [
      {
        br: "Asas em construção. A dorsal agradece.",
        en: "Wings under construction. Lat spread is coming.",
        es: "Alas en construcción. El dorsal lo agradece.",
      },
      {
        br: "Puxada monstra. O V-Shape tá vindo.",
        en: "Monster pull-down. The V-Shape is loading.",
        es: "Jalón monstruoso. El V-Shape está llegando.",
      },
      {
        br: "Remada pesada: transformando costas em muralhas.",
        en: "Heavy rows: turning your back into a fortress.",
        es: "Remo pesado: transformando la espalda en una muralla.",
      },
    ],
    legs: [
      {
        br: "Leg day concluído: andar amanhã será um desafio.",
        en: "Leg day done: walking tomorrow will be a challenge.",
        es: "Leg day terminado: caminar mañana será un desafío.",
      },
      {
        br: "Agachamento é o que separa os homens dos meninos.",
        en: "Squats separate the men from the boys.",
        es: "La sentadilla es lo que separa a los hombres de los niños.",
      },
      {
        br: "Pernas de titã. O alicerce tá pago.",
        en: "Titan legs. The foundation is set.",
        es: "Piernas de titán. La base está pagada.",
      },
    ],
    biceps: [
      {
        br: "Pico do bíceps tá on. O braço não dobra mais.",
        en: "Bicep peak is on. The arm won't bend anymore.",
        es: "Pico de bíceps activado. El brazo ya no dobla.",
      },
      {
        br: "Rosca direta não é exercício, é religião.",
        en: "Barbell curls aren't an exercise, they're a religion.",
        es: "El curl de bíceps no es un ejercicio, es una religión.",
      },
      {
        br: "O pump de bíceps hoje foi nível competição.",
        en: "Today's bicep pump was competition level.",
        es: "El pump de bíceps de hoy fue nivel competición.",
      },
    ],
    triceps: [
      {
        br: "Ferradura marcada: o tríceps decidiu aparecer.",
        en: "Horseshoe marked: the triceps decided to show up.",
        es: "Herradura marcada: el tríceps decidió aparecer.",
      },
      {
        br: "Tríceps explodindo. 2/3 do braço devidamente pagos.",
        en: "Triceps exploding. 2/3 of the arm fully paid.",
        es: "Tríceps explotando. 2/3 del brazo debidamente pagados.",
      },
      {
        br: "Extensão pesada. Braço preenchendo a manga com sucesso.",
        en: "Heavy extensions. Sleeve-filling arms successfully achieved.",
        es: "Extensión pesada. Brazo llenando la manga con éxito.",
      },
    ],
    shoulders: [
      {
        br: "Ombros de granito. A ombreira natural tá on.",
        en: "Granite shoulders. Natural shoulder pads activated.",
        es: "Hombros de granito. La hombrera natural está on.",
      },
      {
        br: "Desenvolvimento pesado. Blindando o deltóide.",
        en: "Heavy press. Armoring the deltoids.",
        es: "Press militar pesado. Blindando el deltoides.",
      },
      {
        br: "Foco no topo: ombros largos, meta batida.",
        en: "Focus on top: wide shoulders, goal achieved.",
        es: "Foco en la cima: hombros anchos, meta cumplida.",
      },
    ],
    cardio: [
      {
        br: "Coração de ferro. O condicionamento hoje foi elite.",
        en: "Iron heart. Elite conditioning today.",
        es: "Corazón de hierro. El acondicionamiento hoy fue de élite.",
      },
      {
        br: "Fôlego infinito. O motor aeróbico tá calibrado.",
        en: "Infinite breath. The aerobic engine is calibrated.",
        es: "Aliento infinito. El motor aeróbico está calibrado.",
      },
      {
        br: "Suor pago. A queima de hoje foi nível profissional.",
        en: "Sweat paid off. Professional level calorie burn.",
        es: "Sudor pagado. La quema de hoy fue nivel profesional.",
      },
      {
        br: "Cardio concluído: resistência de atleta, foco de monstro.",
        en: "Cardio done: athlete endurance, monster focus.",
        es: "Cardio terminado: resistencia de atleta, foco de monstruo.",
      },
      {
        br: "KM por KM, o condicionamento tá vindo forte.",
        en: "Mile by mile, the conditioning is coming in strong.",
        es: "KM por KM, el acondicionamiento viene fuerte.",
      },
    ],
    cali: [
      {
        br: "Domínio total: o corpo obedece, a gravidade aceita.",
        en: "Total mastery: body obeys, gravity accepts.",
        es: "Dominio total: el cuerpo obedece, la gravedad acepta.",
      },
      {
        br: "Força bruta com o peso do corpo. Controle é tudo.",
        en: "Raw bodyweight strength. Control is everything.",
        es: "Fuerza bruta con el peso corporal. El control lo es todo.",
      },
      {
        br: "Calistenia na veia: transformando repetições em arte.",
        en: "Calisthenics in the veins: turning reps into art.",
        es: "Calistenia en las venas: transformando repeticiones en arte.",
      },
      {
        br: "Mestre do próprio peso. A barra hoje foi testemunha.",
        en: "Master of your own weight. The bar was the witness.",
        es: "Maestro de su propio peso. La barra hoy fue testigo.",
      },
      {
        br: "Equilíbrio e potência. O shape esculpido no ar.",
        en: "Balance and power. Sculpting the physique in mid-air.",
        es: "Equilibrio y potencia. El físico esculpido en el aire.",
      },
    ],
    abs: [
      {
        br: "Core blindado. Estabilidade de aço hoje.",
        en: "Armored core. Steel stability today.",
        es: "Core blindado. Estabilidad de acero hoy.",
      },
      {
        br: "Cada repetição conta. O tanquinho tá sendo forjado.",
        en: "Every rep counts. Six-pack under construction.",
        es: "Cada repetición cuenta. El six-pack se está forjando.",
      },
      {
        br: "Abdômen em brasas. Definição é o objetivo.",
        en: "Abs on fire. Definition is the goal.",
        es: "Abdomen en llamas. La definición es el objetivo.",
      },
      {
        br: "Foco no centro: core firme, corpo forte.",
        en: "Focus on the center: firm core, strong body.",
        es: "Foco en el centro: core firme, cuerpo fuerte.",
      },
      {
        br: "Prancha e infra pagos. A base tá sólida como rocha.",
        en: "Plank and leg raises done. Rock-solid foundation.",
        es: "Plancha e inferior pagados. La base está sólida como una roca.",
      },
    ],
    default: [
      {
        br: "Treino pago. A consistência é a única regra.",
        en: "Workout done. Consistency is the only rule.",
        es: "Entrenamiento pagado. La consistencia es la única regla.",
      },
      {
        br: "Menos desculpa, mais carga. Evolução constante.",
        en: "Less excuses, more weight. Constant evolution.",
        es: "Menos excusas, más carga. Evolución constante.",
      },
      {
        br: "O PinicoFit não mente: você destruiu hoje.",
        en: "PinicoFit doesn't lie: you crushed it today.",
        es: "PinicoFit no miente: hoy lo has roto.",
      },
    ],
  };

export default MUSCLE_QUOTES;
