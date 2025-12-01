import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import CreateCourseDTO from './dtos/create-course.dto';
import UpdateCourseDTO from './dtos/update-course.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tags.entity';

@Injectable()
export class CoursesService {
  private logger: Logger = new Logger('CoursesService.name');

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) { }

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({ relations: ['tags'] });
  }
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id }, relations: ['tags'] });
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return course;

  }

  async create(courseDTO: CreateCourseDTO): Promise<Course> {
    const tags = await Promise.all(
      courseDTO.tags.map(name => this.preloadTagByName(name)
      ))
    this.logger.log(`Tags carregadas: ${tags.map(tag => tag.name).join(', ')}`)
    this.logger.log(`Criando curso com os dados courseDTO: ${JSON.stringify(courseDTO)}`);
    const course = this.courseRepository.create({
      ...courseDTO,
      tags
    });
    this.logger.log(`Curso criado: ${JSON.stringify(course)}`);
    return await this.courseRepository.save(course);
  }

  async update(id: string, courseDTO: UpdateCourseDTO): Promise<Course> {
    const tags = courseDTO.tags && (await Promise.all(
      courseDTO.tags.map(name => this.preloadTagByName(name)
      )))


    const course = await this.courseRepository.preload({ id, ...courseDTO, tags });
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return await this.courseRepository.save(course);
  }

  async delete(id: string): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    await this.courseRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { name } });
    if (tag) return tag;

    return this.tagRepository.create({ name });
  }
}
