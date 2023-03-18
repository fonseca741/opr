import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin', 'author'])
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    await this.articleService.createArticle({
      ...createArticleDto,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['admin', 'author'])
  async updateArticle(
    @Param() { id },
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    await this.articleService.updateArticle(id, updateArticleDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async loadAllArticles() {
    return await this.articleService.loadAllArticles();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async loadArticleById(@Param() { id }) {
    return await this.articleService.loadArticleById({ id });
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  async loadArticlesByUserId(@Param() { id }) {
    return await this.articleService.loadArticlesByUserId({ id });
  }

  @Get('reviewer/:id')
  @UseGuards(AuthGuard)
  async loadArticleReviewers(@Param() { id }) {
    return await this.articleService.loadArticleReviewers({ id });
  }
}
