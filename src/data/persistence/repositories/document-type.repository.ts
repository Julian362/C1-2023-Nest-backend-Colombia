import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypeEntity } from '../entities';
import { DocumentTypeRepositoryInterface } from './interfaces';

@Injectable()
export class DocumentTypeRepository implements DocumentTypeRepositoryInterface {
  constructor(
    @InjectRepository(DocumentTypeEntity)
    private readonly documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {
    this.documentTypeRepository.save({
      id: 'c822487e-5e89-4a49-98d5-50ce60b300b1',
      name: 'Cédula de ciudadanía',
      state: true,
    });
    this.documentTypeRepository.save({
      id: '64911806-283f-4e71-ab94-f9098e18cf9a',
      name: 'Cédula de extranjería',
      state: true,
    });
  }

  register(entity: DocumentTypeEntity): Promise<DocumentTypeEntity> {
    return this.documentTypeRepository.save(entity);
  }

  update(id: string, entity: DocumentTypeEntity): Promise<DocumentTypeEntity> {
    return this.documentTypeRepository.update(id, entity).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
      return entity;
    });
  }

  delete(id: string) {
    this.findOneById(id);
    this.documentTypeRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`El Id: ${id} no existe en base de datos`);
      }
    });
  }

  findAll(): Promise<DocumentTypeEntity[]> {
    return this.documentTypeRepository.find();
  }

  findOneById(id: string): Promise<DocumentTypeEntity> {
    return this.documentTypeRepository
      .findOne({ where: { id } })
      .then((result) => {
        if (result) {
          return result;
        } else {
          throw new NotFoundException(
            `El Id: ${id} no existe en base de datos`,
          );
        }
      });
  }

  findByState(state: boolean): Promise<DocumentTypeEntity[]> {
    return this.documentTypeRepository.find({ where: { state } });
  }

  findByName(name: string): Promise<DocumentTypeEntity[]> {
    return this.documentTypeRepository.find({ where: { name } });
  }
}
