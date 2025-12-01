import { DataSource } from "typeorm";
import { dataSourceOptions } from "./database.module";
import { CreateCourseTable1764510041264 } from "src/migrations/1764510041264-CreateCourseTable";

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
})
