import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CofeeService } from './cofee.service';
import { CreateCofeeDto } from './dto/create-cofee.dto';
import { UpdateCofeeDto } from './dto/update-cofee.dto';

@Controller('cofee')
export class CofeeController {
  constructor(private readonly cofeeService: CofeeService) {}

  @Post()
  create(@Body() createCofeeDto: CreateCofeeDto) {
    return this.cofeeService.create(createCofeeDto);
  }

  @Get()
  findAll() {
    return this.cofeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cofeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCofeeDto: UpdateCofeeDto) {
    return this.cofeeService.update(+id, updateCofeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cofeeService.remove(+id);
  }
}
