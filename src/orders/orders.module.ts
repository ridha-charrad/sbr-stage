import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Produit, ProduitSchema } from '../produit/schemas/produit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Produit.name, schema: ProduitSchema }, // ✅ ADD THIS
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}