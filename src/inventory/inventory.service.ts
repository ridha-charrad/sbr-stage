import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import {
  Inventory,
  InventoryDocument,
} from './schemas/inventory.schema';

import {
  Produit,
  ProduitDocument,
} from '../produit/schemas/produit.schema';


@Injectable()
export class InventoryService {

  constructor(

    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,


    @InjectModel(Produit.name)
    private produitModel: Model<ProduitDocument>,

  ) {}



  //-------------------------------------
  // ADD ONE ACCOUNT / KEY
  //-------------------------------------

  async create(
    dto:any,
    vendorId:string,
  ){

    const product =
      await this.produitModel.findById(
        dto.productId
      );


    if(!product){
      throw new NotFoundException(
        'Product not found'
      );
    }


    if(product.sellerId.toString() !== vendorId){
      throw new ForbiddenException(
        'You do not own this product'
      );
    }


    const item =
    await this.inventoryModel.create({

    productId: product._id,

    sellerId: product.sellerId,

    type: dto.type,

    login: dto.login ?? null,

    password: dto.password ?? null,

    cdKey: dto.cdKey ?? null,

    state:'available',

    });

    await this.updateProductStock(
      dto.productId
    );


    return item;

  }





  //-------------------------------------
  // BULK ADD
  //-------------------------------------

  async createMany(
    items:any[],
    vendorId:string,
  ){

    const created: any[]=[];


    for(const item of items){

      created.push(
        await this.create(
          item,
          vendorId
        )
      );

    }


    return created;

  }





  //-------------------------------------
  // VENDOR INVENTORY
  //-------------------------------------

  async vendorInventory(
    vendorId:string,
  ){

    return this.inventoryModel

      .find({
        sellerId:
          new Types.ObjectId(vendorId)
      })

      .populate(
        'productId',
        'name coverImage price'
      )

      .sort({
        createdAt:1
      });

  }





  //-------------------------------------
  // PRODUCT INVENTORY
  //-------------------------------------

  async findProductInventory(
    productId:string,
    vendorId:string,
  ){

    const product =
      await this.produitModel.findById(
        productId
      );


    if(!product){
      throw new NotFoundException();
    }


    if(product.sellerId.toString() !== vendorId){

      throw new ForbiddenException();

    }


    return this.inventoryModel

      .find({
        productId
      })

      .sort({
        createdAt:1
      });

  }





  //-------------------------------------
  // DELETE AVAILABLE ITEM
  //-------------------------------------

  async remove(
    inventoryId:string,
    vendorId:string,
  ){

    const item =
      await this.inventoryModel.findById(
        inventoryId
      );


    if(!item){
      throw new NotFoundException();
    }


    if(item.sellerId.toString() !== vendorId){
      throw new ForbiddenException();
    }


    if(
      item.state !==
      'AVAILABLE'
    ){

      throw new BadRequestException(
        'Cannot delete reserved or sold item'
      );

    }


    const productId =
      item.productId;


    await item.deleteOne();


    await this.updateProductStock(
      productId
    );


    return {
      message:
      'Inventory removed'
    };

  }





  //-------------------------------------
  // COUNT AVAILABLE STOCK
  //-------------------------------------

  async getAvailableCount(
    productId:string,
  ){

    return this.inventoryModel.countDocuments({

      productId,

      state:
      'AVAILABLE',

    });

  }





  //-------------------------------------
  // RESERVE FIFO STOCK
  //-------------------------------------

  async reserveItems(
    productId:string,
    buyerId:string,
    quantity:number,
  ){


    const items =
      await this.inventoryModel

      .find({

        productId,

        state:
        'AVAILABLE',

      })

      .sort({
        createdAt:1
      })

      .limit(quantity);



    if(items.length < quantity){

      throw new BadRequestException(
        'Not enough inventory'
      );

    }



    const expiry =
      new Date();


    expiry.setMinutes(
      expiry.getMinutes()+30
    );



    for(const item of items){

      item.state =
      'RESERVED';


      item.reservedBy =
      new Types.ObjectId(buyerId);


      item.reservedUntil =
      expiry;


      await item.save();

    }



    await this.updateProductStock(
      productId
    );


    return items;

  }





  //-------------------------------------
  // RELEASE RESERVATION
  //-------------------------------------

  async releaseReservation(
    buyerId:string,
  ){


    const items =
      await this.inventoryModel.find({

        reservedBy:
        new Types.ObjectId(buyerId),

        state:
        'RESERVED',

    });



    for(const item of items){

      item.state =
      'AVAILABLE';


      item.reservedBy = undefined;

      item.reservedUntil = undefined;


      await item.save();


      await this.updateProductStock(
        item.productId
      );

    }


    return {
      released:
      items.length
    };

  }





  //-------------------------------------
  // PAYMENT SUCCESS
  //-------------------------------------

  async sellItems(
    inventoryIds:Types.ObjectId[],
    buyerId:string,
    orderId:Types.ObjectId,
  ){


    for(const id of inventoryIds){


      const item =
        await this.inventoryModel.findById(
          id
        );


      if(!item){
        continue;
      }



      item.state =
      'SOLD';


      item.soldTo =
      new Types.ObjectId(buyerId);


      item.orderId =
      orderId;



      item.reservedBy =
      undefined;


      item.reservedUntil =
      undefined;



      await item.save();

    }


    return true;

  }





  //-------------------------------------
  // BUYER PURCHASED ACCOUNTS
  //-------------------------------------

  async getBuyerItems(
    buyerId:string,
  ){

    return this.inventoryModel

      .find({

        soldTo:
        new Types.ObjectId(buyerId)

      })

      .populate(
        'productId',
        'name coverImage'
      );

  }





  //-------------------------------------
  // UPDATE PRODUCT STOCK CACHE
  //-------------------------------------

  private async updateProductStock(
    productId:any
  ){

    const count =
      await this.inventoryModel.countDocuments({

        productId,

        state:
        'AVAILABLE',

      });



    await this.produitModel.findByIdAndUpdate(

      productId,

      {
        stock:count
      }

    );

  }


}