import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Document, FileStatusEnum } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { validate } from 'class-validator';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private readonly documentRepo: Repository<Document>,
    @InjectQueue('document-processing') private readonly documentQueue: Queue,
  ) { }

  async createDocument(createDocumentDto: CreateDocumentDto): Promise<Document> {

    const validatedcreateDocumentDto = new CreateDocumentDto();
    validatedcreateDocumentDto.fileName = createDocumentDto.fileName;
    validatedcreateDocumentDto.filePath = createDocumentDto.filePath;

    const errors = await validate(validatedcreateDocumentDto);

    if (errors.length > 0) {
      const messages = errors.map(e => Object.values(e.constraints ?? {})).flat();
      throw new BadRequestException(messages);
    }

    const document = this.documentRepo.create({
      filename: createDocumentDto.fileName,
      filepath: createDocumentDto.filePath,
      filestatus: FileStatusEnum.UPLOADED,
    });

    const saved = await this.documentRepo.save(document);

    await this.documentQueue.add('process-document', {
      documentId: saved.id,
    });

    saved.filestatus = FileStatusEnum.QUEUED;
    await this.documentRepo.save(saved);

    return saved;
  }
}