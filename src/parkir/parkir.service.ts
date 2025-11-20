import { Injectable } from '@nestjs/common';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindParkirDto } from './dto/find-parkir.dto';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}
  async create(createParkirDto: CreateParkirDto) {
    try {
      const { platNomor, jenisKendaraan, durasi } = createParkirDto;

      const tarif = {
        RODA2: { jamPertama: 3000, jamBerikutnya: 2000 },
        RODA4: { jamPertama: 6000, jamBerikutnya: 4000 },
      };

      const jamPertama = tarif[jenisKendaraan].jamPertama;
      const jamBerikutnya = tarif[jenisKendaraan].jamBerikutnya;

      const total =
        durasi == 1 ? jamPertama : jamPertama + (durasi - 1) * jamBerikutnya;

      const createParkir = await this.prisma.parkir.create({
        data: {
          total,
          platNomor,
          jenisKendaraan,
          durasi,
        },
      });

      return {
        success: true,
        message: 'parkir data created successfully',
        data: createParkir,
      };
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(findParkirDto: FindParkirDto) {
    try {
      const {
        search = '',
        jenisKendaraan,
        page = 1,
        limit = 10,
      } = findParkirDto;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.platNomor = {
          contains: search,
        };
      }

      if (jenisKendaraan) {
        where.jenisKendaraan = jenisKendaraan;
      }

      const parkirs = await this.prisma.parkir.findMany({
        where,
        skip: skip,
        take: Number(limit),
      });
      const total = await this.prisma.parkir.count({ where });

      return {
        success: true,
        message: 'parkir data founded succesfully',
        data: parkirs,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `error when get parkir data: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const findParkir = await this.prisma.parkir.findFirst({
        where: { id: id },
      });
      if (!findParkir) {
        return {
          success: false,
          message: 'Parkir data does not exists',
          data: null,
        };
      }
      return {
        success: true,
        message: 'parkir data founded succesfully',
        data: findParkir,
      };
    } catch (error) {
      return {
        success: false,
        message: `error when get parkir data: ${error.message}`,
        data: null,
      };
    }
  }

  async getTotal() {
    try {
      const totalPendapatan = await this.prisma.parkir.aggregate({
        _sum: {
          total: true,
        },
      });

      return {
        success: true,
        message: 'total pendapatan founded successfully',
        totalPendapatan: totalPendapatan._sum.total,
        totalTransaksiParkir: await this.prisma.parkir.count(),
      };
    } catch (error) {
      return {
        success: false,
        message: `error when get total pendapatan: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateParkirDto: UpdateParkirDto) {
    try {
      const { platNomor, jenisKendaraan, durasi } = updateParkirDto;
      const findParkir = await this.prisma.parkir.findFirst({
        where: { id: id },
      });
      if (!findParkir) {
        return {
          success: false,
          message: 'Parkir data does not exists',
          data: null,
        };
      }

      const tarif = {
        RODA2: { jamPertama: 3000, jamBerikutnya: 2000 },
        RODA4: { jamPertama: 6000, jamBerikutnya: 4000 },
      };

      const jamPertama = tarif[jenisKendaraan].jamPertama;
      const jamBerikutnya = tarif[jenisKendaraan].jamBerikutnya;

      const total =
        durasi == 1 ? jamPertama : jamPertama + (durasi - 1) * jamBerikutnya;

      const updateMenu = await this.prisma.parkir.update({
        where: { id: id },
        data: {
          total: total ?? findParkir.total,
          platNomor: platNomor ?? findParkir.platNomor,
          jenisKendaraan: jenisKendaraan ?? findParkir.jenisKendaraan,
          durasi: Number(durasi) ?? findParkir.durasi,
        },
      });
      return {
        success: true,
        message: 'New Menu has updated',
        data: updateMenu,
      };
    } catch (error) {
      return {
        success: false,
        message: `error when update menu: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const findParkir = await this.prisma.parkir.findFirst({
        where: { id: id },
      });
      if (!findParkir) {
        return {
          success: false,
          message: 'Parkir data does not exists',
          data: null,
        };
      }
      const deletedParkir = await this.prisma.parkir.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'Parkir data has deleted',
        data: deletedParkir,
      };
    } catch (error) {
      return {
        success: false,
        message: `error when delete parkir data: ${error.message}`,
        data: null,
      };
    }
  }
}
