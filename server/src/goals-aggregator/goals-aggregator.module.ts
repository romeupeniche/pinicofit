import { Module } from '@nestjs/common';
import { GoalsAggregatorController } from './goals-aggregator.controller';
import { GoalsAggregatorService } from './goals-aggregator.service';
import { UsersModule } from 'src/users/users.module';
import { StreakModule } from 'src/streak/streak.module';
import { WaterModule } from 'src/water/water.module';
import { MealsModule } from 'src/meals/meals.module';
import { WorkoutsModule } from 'src/workouts/workouts.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { SleepModule } from 'src/sleep/sleep.module';

@Module({
  imports: [
    UsersModule,
    StreakModule,
    WaterModule,
    MealsModule,
    WorkoutsModule,
    TasksModule,
    SleepModule,
  ],
  controllers: [GoalsAggregatorController],
  providers: [GoalsAggregatorService],
})
export class GoalsAggregatorModule {}

