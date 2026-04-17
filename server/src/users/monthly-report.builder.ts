export type MailLang = 'en' | 'br' | 'es';

export interface MonthlyReportData {
  monthLabel: string;
  scoreCards: {
    disciplineScore: number;
    dietAdherence: number;
    hydrationAverageLiters: number;
    workoutEfficiency: number;
  };
  workout: {
    totalVolumeTons: number;
    caloriesBurned: number;
    totalHours: number;
    totalMinutes: number;
    trainingDays: number;
    restDays: number;
    completedExercises: number;
    loadIncreases: number;
    failedExercises: number;
    progressionGroupName: string;
    progressionGroupCount: number;
    progressionExerciseName: string;
    progressionExerciseCount: number;
    volumeIncreasePercent: number;
    frictionGroupName: string;
    frictionGroupCount: number;
    frictionExerciseName: string;
    completedDays: number;
    failedDays: number;
    focusGroupName: string;
    focusVolumeShare: number;
  };
  water: {
    goalLiters: number;
    goalHitDays: number;
    adherenceRate: number;
    peakWindowLabel: string;
    eveningDropPercent: number;
    trainingDayHydrationLift: number;
    peakDateLabel: string;
    peakLiters: number;
    peakContext: string;
  };
  sleep: {
    averageHours: number;
    belowSixHoursDays: number;
    consistentNights: number;
    volumeBoostAfterConsistentNights: number;
    weekendVariationHours: number;
    topSleepHours: number;
    topSleepCount: number;
  };
  nutrition: {
    calorieAdherenceDays: number;
    topFoods: string[];
    topFoodsShare: number;
    hardestMacroName: string;
    hardestMacroMissRate: number;
    perfectMatchDateLabel: string;
    perfectMatchAvailable: boolean;
    failedWorkoutMacroName: string;
    failedWorkoutMacroDelta: number;
  };
  habits: {
    syncDays: number;
    longestStreak: number;
    ruptureWeekdayLabel: string;
    restDietConsistency: number;
  };
}

const ICONS = {
  flame: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s4 3.4 4 7.5c0 2.4-1.4 4.2-4 4.2s-4-1.8-4-4.2C8 7.3 12 3 12 3Z"/><path d="M12 14.7c1.8 0 3 1.2 3 3.2A3.3 3.3 0 0 1 11.7 21 3.3 3.3 0 0 1 8.5 18c0-1.5.8-2.7 2-3.7"/></svg>`,
};

const COPY: Record<MailLang, any> = {
  en: {
    preheader: 'Your PinicoFit monthly report is ready.',
    eyebrow: 'MONTHLY REWIND',
    heroTitle: 'Your month in motion.',
    heroSubtitle: 'A visual recap of your discipline engine.',
    scoreLabel: 'Discipline Score',
    openApp: 'Open PinicoFit',
    sections: {
      workout: 'Workout Control',
      water: 'Hydration Flow',
      sleep: 'Recovery Lab',
      nutrition: 'Nutrition Precision',
      habits: 'Discipline Engine',
    },
    labels: {
      totalVolume: 'Total volume',
      calories: 'Fuel burned',
      focusTime: 'Focus time',
      monthBalance: 'Month balance',
      actionCounter: 'Actions',
      progressionKing: 'Progression king',
      volumeUpgrade: 'Volume upgrade',
      frictionPoint: 'Friction point',
      target: 'Daily target',
      goalHits: 'Goal hits',
      criticalWindow: 'Peak window',
      trainSync: 'Train-water sync',
      peakDay: 'Peak day',
      averageSleep: 'Average sleep',
      debt: 'Recovery debt',
      consistentNights: 'Consistent nights',
      weekendGap: 'Weekend shift',
      calorieAdherence: 'Calorie adherence',
      topFoods: 'Top foods',
      macroBottleneck: 'Macro bottleneck',
      perfectDay: 'Perfect day',
      syncDays: 'Full sync days',
      bestStreak: 'Best streak',
      ruptureDay: 'Rupture day',
      restDiscipline: 'Rest-day discipline',
      noData: 'No data',
    },
    footer: 'PinicoFit monthly report',
  },
  br: {
    preheader: 'Seu relatório mensal do PinicoFit está pronto.',
    eyebrow: 'REWIND DO MÊS',
    heroTitle: 'Seu mês em movimento.',
    heroSubtitle: 'Um resumo visual do seu motor de disciplina.',
    scoreLabel: 'Score de Disciplina',
    openApp: 'Abrir PinicoFit',
    sections: {
      workout: 'Controle de Treino',
      water: 'Fluxo de Hidratação',
      sleep: 'Recuperação',
      nutrition: 'Nutrição',
      habits: 'Disciplina',
    },
    labels: {
      totalVolume: 'Volume total',
      calories: 'Kcal queimadas',
      focusTime: 'Tempo de foco',
      monthBalance: 'Saldo do mês',
      actionCounter: 'Ações',
      progressionKing: 'Rei da progressão',
      volumeUpgrade: 'Upgrade de volume',
      frictionPoint: 'Ponto de atrito',
      target: 'Meta diária',
      goalHits: 'Dias na meta',
      criticalWindow: 'Janela crítica',
      trainSync: 'Sinergia treino+água',
      peakDay: 'Pico do mês',
      averageSleep: 'Sono médio',
      debt: 'Dívida de sono',
      consistentNights: 'Noites consistentes',
      weekendGap: 'Variação fds',
      calorieAdherence: 'Aderência calórica',
      topFoods: 'Top alimentos',
      macroBottleneck: 'Gargalo macros',
      perfectDay: 'Dia perfeito',
      syncDays: 'Sincronia total',
      bestStreak: 'Melhor sequência',
      ruptureDay: 'Dia de ruptura',
      restDiscipline: 'Foco no descanso',
      noData: 'Sem dados',
    },
    footer: 'Relatório mensal PinicoFit',
  },
  es: {
    preheader: 'Tu informe mensual de PinicoFit está listo.',
    eyebrow: 'REBOBINADO DEL MES',
    heroTitle: 'Tu mes en movimiento.',
    heroSubtitle: 'Un resumen visual de tu motor de disciplina.',
    scoreLabel: 'Puntaje de Disciplina',
    openApp: 'Abrir PinicoFit',
    sections: {
      workout: 'Entrenamiento',
      water: 'Hidratación',
      sleep: 'Recuperación',
      nutrition: 'Nutrición',
      habits: 'Disciplina',
    },
    labels: {
      totalVolume: 'Volumen total',
      calories: 'Kcal quemadas',
      focusTime: 'Tiempo de enfoque',
      monthBalance: 'Balance del mes',
      actionCounter: 'Acciones',
      progressionKing: 'Rey progresión',
      volumeUpgrade: 'Upgrade volumen',
      frictionPoint: 'Punto de fricción',
      target: 'Meta diaria',
      goalHits: 'Días en meta',
      criticalWindow: 'Ventana crítica',
      trainSync: 'Sinergia entreno+agua',
      peakDay: 'Pico del mes',
      averageSleep: 'Sueño promedio',
      debt: 'Deuda de sueño',
      consistentNights: 'Noches consistentes',
      weekendGap: 'Variación fds',
      calorieAdherence: 'Adherencia calórica',
      topFoods: 'Top alimentos',
      macroBottleneck: 'Cuello de botella',
      perfectDay: 'Día perfecto',
      syncDays: 'Sincronía total',
      bestStreak: 'Mejor racha',
      ruptureDay: 'Día de ruptura',
      restDiscipline: 'Foco en descanso',
      noData: 'Sin datos',
    },
    footer: 'Informe mensual PinicoFit',
  },
};

const normalizeText = (v: string) =>
  String(v || '')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã£/g, 'ã')
    .replace(/Ã©/g, 'é')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ã´/g, 'ô')
    .replace(/Ãµ/g, 'õ')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã/g, 'Á')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã/g, 'Í')
    .replace(/Ã“/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã‡/g, 'Ç');
const escapeHtml = (v: string) =>
  normalizeText(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const formatNumber = (lang: MailLang, v: number, max = 0) =>
  new Intl.NumberFormat(
    lang === 'br' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
    { maximumFractionDigits: max },
  ).format(v || 0);

const zigzagBorder = (color: string) => `
  <div style="background-color:${color}; height: 20px; width: 100%; clip-path: polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%); margin-top: -1px;"></div>
`;

const largeStat = (label: string, value: string, color = '#fff') => `
  <div style="margin-bottom: 24px;">
    <div style="font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: ${color}; opacity: 0.7;">${escapeHtml(label)}</div>
    <div style="font-size: 42px; font-weight: 900; color: ${color}; line-height: 1;">${escapeHtml(value)}</div>
  </div>
`;

export const buildMonthlyReportEmail = (
  userName: string,
  report: MonthlyReportData,
  lang: MailLang = 'en',
) => {
  const t = COPY[lang];
  const l = t.labels;

  const section = (
    title: string,
    bgColor: string,
    textColor: string,
    content: string,
  ) => `
    <div style="background-color: ${bgColor}; padding: 40px 30px; color: ${textColor};">
      <div style="font-size: 14px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 30px; border-bottom: 2px solid ${textColor}; display: inline-block; padding-bottom: 4px;">
        ${escapeHtml(title)}
      </div>
      <div>${content}</div>
    </div>
  `;

  const htmlReturn = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        </style>
      </head>
      <body>
        <div style="max-width: 500px; margin: 0 auto; background-color: #000; overflow: hidden;">
          
          <div style="background-color: #FF4632; padding: 50px 30px; color: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px;">${t.eyebrow} • ${report.monthLabel}</div>
                ${ICONS.flame}
            </div>
            <h1 style="font-size: 56px; font-weight: 900; line-height: 0.9; margin: 40px 0 20px; letter-spacing: -2px;">
                ${t.heroTitle
                  .split(' ')
                  .map(
                    (s, idx) =>
                      `<span style="color: ${idx === t.heroTitle.split(' ').length - 1 ? '#a855f7' : '#fff'};">${s}</span>`,
                  )
                  .join('<br>')}
            </h1>
            <p style="font-size: 18px; font-weight: 700; opacity: 0.9; margin: 0;">${t.heroSubtitle}</p>
          </div>
          ${zigzagBorder('#FF4632')}

          <div style="background-color: #7D4BFF; padding: 50px 30px; color: #fff; text-align: center;">
            <div style="font-size: 14px; font-weight: 900; letter-spacing: 3px; margin-bottom: 10px;">${t.scoreLabel.toUpperCase()}</div>
            <div style="font-size: 120px; font-weight: 900; line-height: 1;">${formatNumber(lang, report.scoreCards.disciplineScore)}<span style="font-size: 40px;">%</span></div>
          </div>
          ${zigzagBorder('#7D4BFF')}

          ${section(
            t.sections.workout,
            '#1ED760',
            '#000',
            `
            ${largeStat(l.totalVolume, formatNumber(lang, report.workout.totalVolumeTons, 1) + 't', '#000')}
            ${largeStat(l.calories, formatNumber(lang, report.workout.caloriesBurned) + ' kcal', '#000')}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                <div>
                    <div style="font-size: 10px; font-weight: 900; opacity: 0.6;">${l.progressionKing}</div>
                    <div style="font-size: 18px; font-weight: 900;">${report.workout.progressionGroupName}</div>
                </div>
                <div>
                    <div style="font-size: 10px; font-weight: 900; opacity: 0.6;">${l.volumeUpgrade}</div>
                    <div style="font-size: 18px; font-weight: 900;">+${report.workout.volumeIncreasePercent}%</div>
                </div>
            </div>
          `,
          )}

          ${section(
            t.sections.water,
            '#1D75FF',
            '#fff',
            `
            ${largeStat(l.target, formatNumber(lang, report.water.goalLiters, 1) + 'L')}
            ${largeStat(l.goalHits, formatNumber(lang, report.water.goalHitDays) + ' days')}
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 4px; margin-top: 20px;">
                <div style="font-size: 10px; font-weight: 900; letter-spacing: 1px;">${l.criticalWindow}</div>
                <div style="font-size: 20px; font-weight: 900;">${report.water.peakWindowLabel}</div>
            </div>
          `,
          )}

          ${section(
            t.sections.nutrition,
            '#F59B23',
            '#000',
            `
            ${largeStat(l.calorieAdherence, formatNumber(lang, report.nutrition.calorieAdherenceDays) + ' days', '#000')}
            <div style="margin-top: 20px;">
                <div style="font-size: 10px; font-weight: 900; margin-bottom: 10px; opacity: 0.7;">${l.topFoods}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${report.nutrition.topFoods.map((f) => `<span style="background:#000; color:#fff; padding:6px 12px; font-size:12px; font-weight:900; border-radius:2px; text-transform:uppercase;">${f}</span>`).join(' ')}
                </div>
            </div>
          `,
          )}

          <div style="background-color: #000; padding: 60px 30px; text-align: center; color: #fff;">
            <div style="font-size: 12px; opacity: 0.5; margin-bottom: 30px;">${t.footer} • ${userName}</div>
            <a href="https://pinicofit.netlify.app" style="background-color: #fff; color: #000; padding: 18px 32px; font-size: 14px; font-weight: 900; text-decoration: none; border-radius: 50px; letter-spacing: 2px; text-transform: uppercase;">
                ${t.openApp}
            </a>
          </div>

        </div>
      </body>
    </html>
  `;
  console.log(htmlReturn);
  return htmlReturn;
};
