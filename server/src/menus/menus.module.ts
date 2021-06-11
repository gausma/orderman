import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './contracts/Menu';

@Module({
    imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }])],        
    controllers: [MenusController],
    providers: [MenusService],
    exports: [MenusService],
})
export class MenusModule {}
