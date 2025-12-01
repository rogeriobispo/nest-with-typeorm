import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './entities/courses.entity';
import { Tag } from './entities/tags.entity';
import CreateCourseDTO from './dtos/create-course.dto';
import UpdateCourseDTO from './dtos/update-course.dto';

type MockRepo<T = any> = {
  find: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  preload: jest.Mock;
  remove: jest.Mock;
};

const mockRepository = (): MockRepo => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepo: MockRepo<Course>;
  let tagRepo: MockRepo<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: mockRepository() },
        { provide: getRepositoryToken(Tag), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepo = module.get(getRepositoryToken(Course));
    tagRepo = module.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all courses with tags', async () => {
      const courses = [{ id: '1' } as Course];
      courseRepo.find.mockResolvedValue(courses);

      const result = await service.findAll();

      expect(courseRepo.find).toHaveBeenCalledWith({ relations: ['tags'] });
      expect(result).toBe(courses);
    });
  });

  describe('findOne', () => {
    it('returns a course when found', async () => {
      const course = { id: '1' } as Course;
      courseRepo.findOne.mockResolvedValue(course);

      await expect(service.findOne('1')).resolves.toBe(course);
      expect(courseRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['tags'] });
    });

    it('throws NotFoundException when not found', async () => {
      courseRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a course with tags', async () => {
      const dto: CreateCourseDTO = { name: 'nodejs', description: 'curso de nodejs', tags: ['javascript', 'nodejs'] } as any;
      tagRepo.findOne.mockResolvedValue(null);
      tagRepo.create.mockImplementation(({ name }) => ({ name } as any));
      const createdCourse = { ...dto, tags: [{ name: 'javascript' }, { name: 'nodejs' }] } as Course;
      courseRepo.create.mockReturnValue(createdCourse);
      courseRepo.save.mockResolvedValue({ ...createdCourse, id: '1' } as Course);

      const result = await service.create(dto);

      expect(tagRepo.findOne).toHaveBeenCalledTimes(2);
      expect(tagRepo.create).toHaveBeenCalledWith({ name: 'javascript' });
      expect(tagRepo.create).toHaveBeenCalledWith({ name: 'nodejs' });
      expect(courseRepo.create).toHaveBeenCalledWith({
        ...dto,
        tags: [{ name: 'javascript' }, { name: 'nodejs' }],
      });
      expect(courseRepo.save).toHaveBeenCalledWith(createdCourse);
      expect(result).toEqual({ ...createdCourse, id: '1' });
    });
  });

  describe('update', () => {
    it('updates a course and returns it', async () => {
      const dto: UpdateCourseDTO = { name: 'updated', tags: ['t1'] } as any;
      tagRepo.findOne.mockResolvedValue({ id: '10', name: 't1' } as Tag);
      const preloaded = { id: '1', name: 'updated' } as Course;
      courseRepo.preload.mockResolvedValue(preloaded);
      courseRepo.save.mockResolvedValue(preloaded);

      const result = await service.update('1', dto);

      expect(courseRepo.preload).toHaveBeenCalledWith({
        id: '1',
        ...dto,
        tags: [{ id: '10', name: 't1' }],
      });
      expect(result).toBe(preloaded);
    });

    it('throws NotFoundException when course to update does not exist', async () => {
      courseRepo.preload.mockResolvedValue(undefined);

      await expect(service.update('1', {} as any)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('delete', () => {
    it('removes existing course', async () => {
      const course = { id: '1' } as Course;
      courseRepo.findOne.mockResolvedValue(course);
      courseRepo.remove.mockResolvedValue(undefined);

      await service.delete('1');

      expect(courseRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(courseRepo.remove).toHaveBeenCalledWith(course);
    });

    it('throws NotFoundException when not found', async () => {
      courseRepo.findOne.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
