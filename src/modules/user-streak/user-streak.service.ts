import { Injectable, NotFoundException } from "@nestjs/common";
import { UserModel, UserStreakProgressModel } from "@db/models";
import { Types } from "mongoose";

@Injectable()
export class UserStreakService {
	async getUserById(userId: Types.ObjectId) {
		const user = await UserModel.findById(userId);
		if (!user) throw new NotFoundException("User not found");
		return user;
	}

	async updateStreak(userId: Types.ObjectId, isActiveToday = true) {
		const user = await UserModel.findById(userId);
		if (!user) throw new NotFoundException("User not found");

		const now = new Date();
		const today = new Date(now.toDateString());

		const existingLog = await UserStreakProgressModel.findOne({
			userId,
			date: today,
		});
		if (existingLog) {
			return {
				streak_days: user.streak_days,
				is_freeze: user.is_freeze,
				freeze_count: user.freeze_count,
			};
		}

		const lastActive = user.last_active_date
			? new Date(user.last_active_date.toDateString())
			: new Date(user.createdAt?.toDateString() || now.toDateString());

		const daysDiff = Math.floor(
			(today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (isActiveToday) {
			if (daysDiff === 1) {
				user.streak_days += 1;
				user.is_freeze = false;
			} else if (daysDiff === 2 && user.freeze_count >= 1) {
				const yesterday = new Date(today);
				yesterday.setDate(today.getDate() - 1);

				await UserStreakProgressModel.updateOne(
					{ userId, date: yesterday },
					{ $set: { isStreak: false, isFreeze: true } },
					{ upsert: true },
				);

				user.freeze_count = Math.max(0, user.freeze_count - 1);
				user.is_freeze = true;
			} else {
				user.streak_days = 1;
				user.is_freeze = false;
			}

			await UserStreakProgressModel.updateOne(
				{ userId, date: today },
				{ $set: { isStreak: true, isFreeze: false } },
				{ upsert: true },
			);

			user.last_active_date = now;
			await user.save();

			return {
				streak_days: user.streak_days,
				is_freeze: user.is_freeze,
				freeze_count: user.freeze_count,
			};
		}

		if (daysDiff >= 2 && daysDiff <= 2 + user.freeze_count) {
			const neededFreeze = daysDiff - 1;

			for (let i = 1; i <= neededFreeze; i++) {
				const skipDate = new Date(today);
				skipDate.setDate(today.getDate() - i);

				await UserStreakProgressModel.updateOne(
					{ userId, date: skipDate },
					{ $set: { isStreak: false, isFreeze: true } },
					{ upsert: true },
				);
			}

			user.freeze_count = Math.max(0, user.freeze_count - neededFreeze);
			user.is_freeze = true;
		} else {
			user.streak_days = 0;
			user.is_freeze = false;
		}

		await UserStreakProgressModel.updateOne(
			{ userId, date: today },
			{ $set: { isStreak: false, isFreeze: user.is_freeze } },
			{ upsert: true },
		);

		await user.save();

		return {
			streak_days: user.streak_days,
			is_freeze: user.is_freeze,
			freeze_count: user.freeze_count,
		};
	}

	async getWeeklyStreakStatus(userId: Types.ObjectId) {
		const user = await UserModel.findById(userId);
		if (!user) throw new NotFoundException("User not found");

		const now = new Date();
		const todayDay = now.getDay();
		const diffToMonday = todayDay === 0 ? -6 : 1 - todayDay;

		const monday = new Date(now);
		monday.setDate(now.getDate() + diffToMonday);
		monday.setHours(0, 0, 0, 0);

		const weekDates = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(monday);
			date.setDate(monday.getDate() + i);
			return date;
		});

		const logs = await UserStreakProgressModel.find({
			userId,
			date: { $gte: weekDates[0], $lte: weekDates[6] },
		});

		const dayNames = [
			"Chủ nhật",
			"Thứ 2",
			"Thứ 3",
			"Thứ 4",
			"Thứ 5",
			"Thứ 6",
			"Thứ 7",
		];

		const result = weekDates.map((date) => {
			const log = logs.find(
				(l) => l.date.toDateString() === date.toDateString(),
			);

			let status: "streak" | "freeze" | "missed" = "missed";
			if (log?.isStreak) status = "streak";
			else if (log?.isFreeze) status = "freeze";

			return {
				day: dayNames[date.getDay()],
				date: date.toISOString().split("T")[0],
				status,
			};
		});

		return result;
	}
}
