import { Controller, Post, Body, Get, Req, UseGuards , Param, Patch } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Query } from '@nestjs/common';
import { FilterOrderDto } from './dto/filter-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @Post()
  createOrder(
    @Req() req,
    @Body()
    body: {
      items: { productId: string; quantity: number }[];
    },
  ) {
    return this.ordersService.createOrder(req.user.userId, body.items);
  }

  @Get('my-orders')
  getMyOrders(@Req() req,@Query() filter: FilterOrderDto,) {
    return this.ordersService.findUserOrders(
      req.user.userId,
      filter
    );
  }


  @UseGuards(RolesGuard)
  @Roles('vendor')
  @Get('my-sales')
  getMySales(@Req() req,@Query() filter: FilterOrderDto) {
    return this.ordersService.findVendorSales(
      req.user.userId,
      filter
    );
  }


  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  getAllOrders(@Query() filter: FilterOrderDto) {
    return this.ordersService.findAllOrders(filter);
  }


  @Get(':id')
  getOrder(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.ordersService.findOne(
      id,
      req.user.userId,
    );
  }

  @Patch(':id/cancel')
  cancelOrder(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.ordersService.cancelOrder(
      id,
      req.user.userId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.ordersService.findOne(
      id,
      req.user,
    );
  }

  
  
  

}