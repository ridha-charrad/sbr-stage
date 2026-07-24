import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';

import { ProduitService } from './produit.service';

import { CreateProduitDto } from './dto/create-produit.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Query } from '@nestjs/common';
import { FilterProduitDto } from './dto/filter-produit.dto';



@Controller('produit')
export class ProduitController {
  constructor(
    private readonly produitService: ProduitService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendor')
  create(
    @Body() dto: CreateProduitDto,
    @Req() req,
  ) {
    return this.produitService.create(
      dto,
      req.user.userId,
    );
  }
  
  @Get()
  findAll(@Query() filter: FilterProduitDto) {
    return this.produitService.findAll(filter);
  }
}