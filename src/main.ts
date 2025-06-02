import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Env } from "@utils";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { initDbConnection } from "@db";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	await initDbConnection();

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("/api");
	app.enableCors({ origin: "*" });

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	if (Env.ENABLE_SWAGGER) {
		const config = new DocumentBuilder()
			.setTitle("API Documentation")
			.setDescription("API Description")
			.setVersion("1.0")
			.addBearerAuth()
			.addServer("http://localhost:3000")
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api/docs", app, document);
	}

	// app.use(helmet()); // Bật lại nếu cần security
	await app.listen(Env.LISTEN_PORT, "0.0.0.0");
}
bootstrap();
