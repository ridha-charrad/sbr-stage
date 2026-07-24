import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Order, OrderDocument, OrderItem } from './schemas/order.schema';
import { Produit, ProduitDocument } from '../produit/schemas/produit.schema';
import { FilterOrderDto } from './dto/filter-order.dto';
import { InventoryService } from 'src/inventory/inventory.service';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,

    @InjectModel(Produit.name)
    private produitModel: Model<ProduitDocument>,

    private readonly inventoryService: InventoryService,
  ) {}

  async createOrder(
    userId:string,
    items:{
      productId:string;
      quantity:number;
    }[],
  ){

  let totalPrice = 0;

  const enrichedItems:OrderItem[]=[];



  for(const item of items){


  const product =
  await this.produitModel.findById(
  item.productId
  );



  if(!product){

  throw new NotFoundException(
  'Product not found'
  );

  }




  // RESERVE REAL INVENTORY
  const reserved =
  await this.inventoryService.reserveItems(
  product._id.toString(),
  userId,
  item.quantity,
  );




  const itemTotal =
  product.price * item.quantity;



  totalPrice += itemTotal;



  enrichedItems.push({

  productId:product._id,

  productName:product.name,

  coverImage:product.coverImage,

  platforms:product.platforms,

  sellerId:product.sellerId,

  quantity:item.quantity,

  unitPrice:product.price,

  itemTotal,


  // save reserved accounts
  inventoryItems:
  reserved.map(
  x=>x._id
  ),

  });


  }




  return this.orderModel.create({

  userId:
  new Types.ObjectId(userId),

  items:enrichedItems,

  totalPrice,

  status:'pending',

  });


  }

  async findUserOrders(
    userId: string,
    filter: FilterOrderDto,
  ) {
    let query = this.orderModel.find({
      userId: new Types.ObjectId(userId),
    });

    // Search by product name
    if (filter.name) {
      query = query.find({
        'items.productName': {
          $regex: filter.name,
          $options: 'i',
        },
      });
    }

    // Minimum total price
    if (filter.minPrice) {
      query = query.find({
        totalPrice: {
          $gte: Number(filter.minPrice),
        },
      });
    }

    // Maximum total price
    if (filter.maxPrice) {
      query = query.find({
        totalPrice: {
          $lte: Number(filter.maxPrice),
        },
      });
    }

    // Filter by status
    if (filter.status) {
      query = query.find({
        status: filter.status,
      });
    }

    // Sort by total price
    if (filter.sortBy === 'price') {
      query = query.sort({
        totalPrice: filter.order === 'asc' ? 1 : -1,
      });
    }

    // Sort by creation date
    if (filter.sortBy === 'date') {
      query = query.sort({
        createdAt: filter.order === 'asc' ? 1 : -1,
      });
    }

    return query.exec();
  }


  async findOne(
    orderId: string,
    user: any,
  ) {
    const query: any = {
      _id: orderId,
    };

    // Normal user: only his own orders
    if (user.role === 'user') {
      query.userId = user.userId;
    }

    const order = await this.orderModel
      .findOne(query);

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return order;
  }


  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId.toString() !== userId) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException(
        'Only pending orders can be cancelled',
      );
    }

    order.status = 'cancelled';

    await order.save();

    return order;
  }

  
  async findAllOrders(filter: FilterOrderDto) {
    let query = this.orderModel.find();

    if (filter.name) {
      query = query.find({
        'items.productName': {
          $regex: filter.name,
          $options: 'i',
        },
      });
    }

    if (filter.minPrice) {
      query = query.find({
        totalPrice: {
          $gte: Number(filter.minPrice),
        },
      });
    }

    if (filter.maxPrice) {
      query = query.find({
        totalPrice: {
          $lte: Number(filter.maxPrice),
        },
      });
    }

    if (filter.status) {
      query = query.find({
        status: filter.status,
      });
    }

    if (filter.sortBy === 'price') {
      query = query.sort({
        totalPrice: filter.order === 'asc' ? 1 : -1,
      });
    }

    if (filter.sortBy === 'date') {
      query = query.sort({
        createdAt: filter.order === 'asc' ? 1 : -1,
      });
    }

    return query.exec();
  }


  async findVendorSales(
    vendorId: string,
    filter: FilterOrderDto,
  ) {
    // Find products created by this vendor
    const vendorProducts = await this.produitModel.find({
      sellerId: vendorId,
    });

    const productIds = vendorProducts.map(
      product => product._id,
    );

    let query = this.orderModel.find({
      'items.productId': {
        $in: productIds,
      },
    });


    if (filter.name) {
      query = query.find({
        'items.productName': {
          $regex: filter.name,
          $options: 'i',
        },
      });
    }


    if (filter.minPrice) {
      query = query.find({
        totalPrice: {
          $gte: Number(filter.minPrice),
        },
      });
    }


    if (filter.maxPrice) {
      query = query.find({
        totalPrice: {
          $lte: Number(filter.maxPrice),
        },
      });
    }


    if (filter.status) {
      query = query.find({
        status: filter.status,
      });
    }


    if (filter.sortBy === 'price') {
      query = query.sort({
        totalPrice: filter.order === 'asc' ? 1 : -1,
      });
    }


    if (filter.sortBy === 'date') {
      query = query.sort({
        createdAt: filter.order === 'asc' ? 1 : -1,
      });
    }


    return query.exec();
  }
}