import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddCoursesIdToCoursesTagsTable1764519043645 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('courses_tags_tags', new TableColumn({
      name: 'coursesId',
      type: 'uuid',
      isNullable: false,
    }))

    await queryRunner.createForeignKey(
      'courses_tags_tags',
      new TableForeignKey({
        name: 'FK_Course_CoursesTags',
        columnNames: ['coursesId'],
        referencedTableName: 'courses',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('courses_tags_tags', 'FK_Course_CoursesTags');
    await queryRunner.dropColumn('courses_tags_tags', 'courseId');
  }

}
