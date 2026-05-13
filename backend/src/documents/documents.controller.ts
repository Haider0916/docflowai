import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = file.originalname + Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf)$/) || file.mimetype !== "application/pdf") {
        return cb(new BadRequestException('Only pdf files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    const document = await this.documentsService.createDocument({ fileName: file.originalname, filePath: file.path });

    return {
      id: document.id,
      fileName: document.filename
    };
  }
}
