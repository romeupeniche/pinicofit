import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FoodsModule } from './foods/foods.module';
import { MealsModule } from './meals/meals.module';
import { RecipesModule } from './recipes/recipes.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { WaterModule } from './water/water.module';
import { TasksModule } from './tasks/tasks.module';
import { SleepModule } from './sleep/sleep.module';
import { MailModule } from './mail/mail.module';
import { StreakModule } from './streak/streak.module';
import { GoalsAggregatorModule } from './goals-aggregator/goals-aggregator.module';
import { HealthModule } from './health/health.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    FoodsModule,
    MealsModule,
    RecipesModule,
    WorkoutsModule,
    WaterModule,
    TasksModule,
    SleepModule,
    MailModule,
    StreakModule,
    GoalsAggregatorModule,
    HealthModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
