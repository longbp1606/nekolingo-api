import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class CreateDepositRequest {
	@ApiProperty({
		example: 50000,
		description: "Số tiền người dùng muốn nạp vào tài khoản (VNĐ)",
		minimum: 1000,
	})
	@IsNumber()
	@Min(1000, { message: "Số tiền nạp phải lớn hơn hoặc bằng 1.000 VNĐ" })
	amount: number;
}
