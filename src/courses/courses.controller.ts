import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import CourseDTO from './dtos/create-course.dto';
import CreateCourseDTO from './dtos/create-course.dto';
import UpdateCourseDTO from './dtos/update-course.dto';

@Controller('/courses')
export class CoursesController {

  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  finddAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  Create(@Body() body: CreateCourseDTO) {
    return this.coursesService.create(body);
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() body: UpdateCourseDTO) {
    return this.coursesService.update(id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

}
