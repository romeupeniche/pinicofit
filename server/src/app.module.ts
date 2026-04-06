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
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
