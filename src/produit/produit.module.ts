import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';

import {
  Produit,
  ProduitSchema,
} from './schemas/produit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Produit.name,
        schema: ProduitSchema,
      },
    ]),
  ],
  controllers: [ProduitController],
  providers: [ProduitService],
  exports: [ProduitService],
})
export class ProduitModule {}