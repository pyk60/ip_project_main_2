import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DramaService } from './drama.service';
import { CreateDramaDto } from './dto/create-drama.dto';
import { UpdateDramaDto } from './dto/update-drama.dto';
import { PaginationQuery } from '../../common/dto/pagination-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@ApiTags('dramas')
@ApiBearerAuth()
@Controller('dramas')
export class DramaController {
  constructor(private readonly dramaService: DramaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new drama' })
  @ApiResponse({
    status: 201,
    description: 'The drama has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createDramaDto: CreateDramaDto) {
    return this.dramaService.create(createDramaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dramas with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Return all dramas.' })
  async findAll(@Query() paginationQuery: PaginationQuery) {
    return this.dramaService.findAll(paginationQuery);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get all drama posts' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Return all drama posts.' })
  async findAllDramaPosts(@Query() paginationQuery: PaginationQuery) {
    return this.dramaService.findAllDramaPosts(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a drama by ID' })
  @ApiResponse({ status: 200, description: 'Return the drama.' })
  @ApiResponse({ status: 404, description: 'Drama not found' })
  findOne(@Param('id') id: string) {
    return this.dramaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a drama by ID' })
  @ApiResponse({
    status: 200,
    description: 'The drama has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Drama not found' })
  update(@Param('id') id: string, @Body() updateDramaDto: UpdateDramaDto) {
    return this.dramaService.update(+id, updateDramaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
  @ApiOperation({ summary: 'Delete a drama by ID' })
  @ApiResponse({
    status: 200,
    description: 'The drama has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Drama not found' })
  remove(@Param('id') id: string) {
    return this.dramaService.remove(+id);
  }
}
