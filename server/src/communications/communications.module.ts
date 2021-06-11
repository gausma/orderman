import { Module } from '@nestjs/common';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Communication, CommunicationSchema } from './contracts/Communication';

@Module({
    imports: [MongooseModule.forFeature([{ name: Communication.name, schema: CommunicationSchema }])],
    controllers: [CommunicationsController],
    providers: [CommunicationsService],
    exports: [CommunicationsService],
})
export class CommunicationsModule { }
