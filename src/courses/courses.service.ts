import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCourseDto } from "./dto/create-course.dto";
import { Course } from "./entities/course.entity";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,

        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    public findAll() {
        return this.courseRepository.find({ relations: ["tags"] });
    }

    public async findOne(id: string) {
        const course = await this.courseRepository.findOne(id, {
            relations: ["tags"],
        });

        if (!course) {
            throw new NotFoundException(`Course ID ${id} not found.`);
        }

        return course;
    }

    public async create(createCourseDto: CreateCourseDto) {
        const tags = await Promise.all(
            createCourseDto.tags.map((name) => this.preloadTagByName(name)),
        );

        const course = this.courseRepository.create({
            ...createCourseDto,
            tags,
        });

        return this.courseRepository.save(course);
    }

    public async update(id: string, updateCourseDto: any) {
        const tags =
            updateCourseDto.tags &&
            (await Promise.all(
                updateCourseDto.tags.map((name) => this.preloadTagByName(name)),
            ));

        const course = await this.courseRepository.preload({
            id: Number(id),
            ...updateCourseDto,
            tags,
        });

        if (!course) {
            throw new NotFoundException(`Course ID ${id} not found.`);
        }

        return this.courseRepository.save(course);
    }

    public async remove(id: string) {
        const course = await this.courseRepository.findOne(id);

        if (!course) {
            throw new NotFoundException(`Course ID ${id} not found.`);
        }

        return this.courseRepository.remove(course);
    }

    private async preloadTagByName(name: string): Promise<Tag> {
        const tag = await this.tagRepository.findOne({ name });

        if (tag) {
            return tag;
        }

        return this.tagRepository.create({ name });
    }
}
