import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProduitModule } from './produit/produit.module';
import { MailModule } from './mail/mail.module';
import { OrdersModule } from './orders/orders.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nexus'),UsersModule, AuthModule, ProduitModule, MailModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
