import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { InventoryService } from './inventory.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { BulkCreateInventoryDto } from './dto/bulk-create-inventory.dto';


@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('vendor')
export class InventoryController {


  constructor(
    private readonly inventoryService: InventoryService,
  ) {}



  //-------------------------------------
  // ADD ONE ACCOUNT / KEY
  //-------------------------------------

  @Post()
  create(
    @Body() dto: CreateInventoryDto,
    @Req() req,
  ){

    return this.inventoryService.create(
      dto,
      req.user.userId,
    );

  }





  //-------------------------------------
  // BULK ADD ACCOUNTS / KEYS
  //-------------------------------------

  @Post('bulk')
  createMany(
    @Body() dto: BulkCreateInventoryDto,
    @Req() req,
  ){

    return this.inventoryService.createMany(
      dto.items,
      req.user.userId,
    );

  }





  //-------------------------------------
  // VENDOR ALL INVENTORY
  //-------------------------------------

  @Get('my')
  myInventory(
    @Req() req,
  ){

    return this.inventoryService.vendorInventory(
      req.user.userId,
    );

  }





  //-------------------------------------
  // VENDOR PRODUCT INVENTORY
  //-------------------------------------

  @Get('product/:productId')
  productInventory(
    @Param('productId') productId:string,
    @Req() req,
  ){

    return this.inventoryService.findProductInventory(
      productId,
      req.user.userId,
    );

  }





  //-------------------------------------
  // PRODUCT AVAILABLE COUNT
  //-------------------------------------

  @Get('product/:productId/count')
  count(
    @Param('productId') productId:string,
  ){

    return this.inventoryService.getAvailableCount(
      productId,
    );

  }





  //-------------------------------------
  // DELETE AVAILABLE ACCOUNT
  //-------------------------------------

  @Delete(':inventoryId')
  remove(
    @Param('inventoryId') inventoryId:string,
    @Req() req,
  ){

    return this.inventoryService.remove(
      inventoryId,
      req.user.userId,
    );

  }

}