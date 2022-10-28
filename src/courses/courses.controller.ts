import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Controller("courses")
export class CoursesController {
    constructor(private readonly coursesServices: CoursesService) {}

    @Get("list")
    findAll() {
        return this.coursesServices.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.coursesServices.findOne(id);
    }

    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesServices.create(createCourseDto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesServices.update(id, updateCourseDto);
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.coursesServices.remove(id);
    }
}
