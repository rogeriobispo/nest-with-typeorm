import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddTagsIdToCoursesTagsTable1764519752990 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('courses_tags_tags', new TableColumn({
      name: 'tagsId',
      type: 'uuid',
      isNullable: true,
    }))

    await queryRunner.createForeignKey('courses_tags_tags',
      new TableForeignKey({
        name: 'FK_Tags_CoursesTags',
        columnNames: ['tagsId'],
        referencedTableName: 'tags',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('courses_tags_tags', 'FK_Tags_CoursesTags');
    await queryRunner.dropColumn('courses_tags_tags', 'tagsId');
  }

}
