import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { FilterProduitDto } from './dto/filter-produit.dto';
import {
  Produit,
  ProduitDocument,
} from './schemas/produit.schema';

import { CreateProduitDto } from './dto/create-produit.dto';

@Injectable()
export class ProduitService {
  constructor(
    @InjectModel(Produit.name)
    private produitModel: Model<ProduitDocument>,
  ) {}

  async create(
    dto: CreateProduitDto,
    sellerId: string,
  ) {
    return this.produitModel.create({
      ...dto,
      sellerId,
    });
  }

  ///findAll() {
    ///return this.produitModel
      ///.find({ isActive: true })
      ///.populate(
        ///'sellerId',
        ///'firstName lastName email',
     /// );
  ///}
  async findAll(filter: FilterProduitDto) {
    const query: any = {
      isActive: true,
    };

    // Search by name
    if (filter.name) {
      query.name = {
        $regex: filter.name,
        $options: 'i',
      };
    }

    // Stock availability
    if (filter.stock !== undefined) {
      if (filter.stock) {
        query.stock = { $gt: 0 };
      } else {
        query.stock = 0;
      }
    }

    // Multiple genres
    if (filter.genres) {
      query.genres = {
        $in: filter.genres.split(','),
      };
    }

    // Multiple platforms
    if (filter.platforms) {
      query.platforms = {
        $in: filter.platforms.split(','),
      };
    }

    // Price range
    if (filter.minPrice || filter.maxPrice) {
      query.price = {};

      if (filter.minPrice)
        query.price.$gte = Number(filter.minPrice);

      if (filter.maxPrice)
        query.price.$lte = Number(filter.maxPrice);
    }

    const sort: any = {};

    switch (filter.sortBy) {
      case 'price':
        sort.price = filter.order === 'desc' ? -1 : 1;
        break;

      case 'salesCount':
        sort.salesCount =
          filter.order === 'desc' ? -1 : 1;
        break;

      case 'name':
        sort.name =
          filter.order === 'desc' ? -1 : 1;
        break;

      default:
        sort.createdAt = -1;
    }

    return this.produitModel
      .find(query)
      .sort(sort)
      .populate(
        'sellerId',
        'firstName lastName email',
      );
  }
  async updateStock(
    productId: string,
    quantity: number,
    vendorId: string,
  ) {
    const product = await this.produitModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Seller can only modify his own products
    if (product.sellerId.toString() !== vendorId) {
      throw new ForbiddenException(
        'You can only manage your own products',
      );
    }

    product.stock += quantity;

    if (product.stock < 0) {
      throw new BadRequestException(
        'Stock cannot be negative',
      );
    }

    await product.save();

    return {
      message: 'Stock updated successfully',
      stock: product.stock,
    };
  }
}