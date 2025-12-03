import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses.module';
import { Course } from './entities/courses.entity';
import { Tag } from './entities/tags.entity';

describe('CoursesController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /courses', () => {

    it('should create a course', async () => {
      const data = {
        name: 'Test Course',
        description: 'This is a test course',
        tags: [{ name: 'Test Tag' }],
      };

      const res = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        name: data.name,
        description: data.description,
        tags: expect.any(Array),
      });
    });
  });

  describe('GET /courses/:id', () => {
    it('should get a course by id', async () => {
      const data = {
        name: 'Test Course 2',
        description: 'This is another test course',
        tags: [{ name: 'Tag 2' }],
      };

      const createRes = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      const id = createRes.body.id;

      const getRes = await request(app.getHttpServer())
        .get(`/courses/${id}`)
        .expect(200);

      expect(getRes.body).toMatchObject({
        id: id,
        name: data.name,
        description: data.description,
        tags: expect.any(Array),
      });
    });
  });

  describe('GET /courses', () => {
    it('should list courses', async () => {
      const data = {
        name: 'List Test Course',
        description: 'Course to test list endpoint',
        tags: [{ name: 'List Tag' }],
      };

      const createRes = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      const listRes = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(Array.isArray(listRes.body)).toBe(true);
      expect(listRes.body.length).toBeGreaterThan(0);
      expect(listRes.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            tags: expect.any(Array),
          }),
        ]),
      );
    });
  });

  describe('PUT /courses/:id', () => {
    it('should update a course', async () => {
      const createData = {
        name: 'Original Course',
        description: 'Original description',
        tags: [{ name: 'Original Tag' }],
      };

      const createRes = await request(app.getHttpServer())
        .post('/courses')
        .send(createData)
        .expect(201);

      const id = createRes.body.id;

      const updateData = {
        name: 'Updated Course',
        description: 'Updated description',
        tags: [{ name: 'Updated Tag' }],
      };

      await request(app.getHttpServer())
        .put(`/courses/${id}`)
        .send(updateData)
        .expect(200);

      const getRes = await request(app.getHttpServer())
        .get(`/courses/${id}`)
        .expect(200);

      expect(getRes.body).toMatchObject({
        id: id,
        name: updateData.name,
        description: updateData.description,
        tags: expect.any(Array),
      });
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should delete a course', async () => {
      const data = {
        name: 'Course to Delete',
        description: 'Delete me',
        tags: [{ name: 'Delete Tag' }],
      };

      const createRes = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      const id = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/courses/${id}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/courses/${id}`)
        .expect(404);
    });
  });
});
