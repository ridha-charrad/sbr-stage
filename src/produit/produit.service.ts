import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Produit,
  ProduitDocument,
} from './schemas/produit.schema';

import { CreateProduitDto } from './dto/create-produit.dto';
import { FilterProduitDto } from './dto/filter-produit.dto';


@Injectable()
export class ProduitService {

  constructor(
    @InjectModel(Produit.name)
    private produitModel: Model<ProduitDocument>,
  ) {}


  // CREATE PRODUCT
  async create(
    dto: CreateProduitDto,
    sellerId: string,
  ) {

    return this.produitModel.create({
      ...dto,
      sellerId,
    });

  }



  // GET ALL PRODUCTS
  async findAll(
    filter: FilterProduitDto,
  ) {

    const query:any = {
      isActive:true,
    };


    if(filter.name){

      query.name = {
        $regex: filter.name,
        $options:'i',
      };

    }



    if(filter.genres){

      query.genres = {
        $in: filter.genres.split(','),
      };

    }



    if(filter.platforms){

      query.platforms = {
        $in: filter.platforms.split(','),
      };

    }



    if(
      filter.minPrice ||
      filter.maxPrice
    ){

      query.price = {};


      if(filter.minPrice){

        query.price.$gte =
          Number(filter.minPrice);

      }


      if(filter.maxPrice){

        query.price.$lte =
          Number(filter.maxPrice);

      }

    }



    const sort:any={};


    switch(filter.sortBy){

      case 'price':

        sort.price =
          filter.order === 'desc'
          ? -1
          : 1;

      break;



      case 'salesCount':

        sort.salesCount =
          filter.order === 'desc'
          ? -1
          : 1;

      break;



      case 'name':

        sort.name =
          filter.order === 'desc'
          ? -1
          : 1;

      break;



      default:

        sort.createdAt=-1;

    }



    return this.produitModel
      .find(query)
      .sort(sort)
      .populate(
        'sellerId',
        'firstName lastName email',
      );

  }





  // GET ONE PRODUCT
  async findOne(
    id:string,
  ){

    const product =
      await this.produitModel
        .findById(id)
        .populate(
          'sellerId',
          'firstName lastName email',
        );


    if(!product){

      throw new NotFoundException(
        'Product not found',
      );

    }


    return product;

  }





  // GET PRODUCTS OF A SELLER
  async findBySeller(
    sellerId:string,
  ){

    return this.produitModel.find({
      sellerId,
    });

  }



}