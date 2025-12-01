import { PartialType } from "@nestjs/mapped-types";
import { IsString, isValidationOptions } from "class-validator";
import CreateCourseDTO from "./create-course.dto";

export default class UpdateCourseDTO extends PartialType(CreateCourseDTO) {
}
