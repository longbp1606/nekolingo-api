import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IVocabTopic {
	topic: Types.ObjectId;
	vocabulary?: Types.ObjectId;
	grammar?: Types.ObjectId;
	order: number;
	is_required: boolean;
}

export type VocabTopicDocumentType = HydratedDocument<IVocabTopic>;

export type VocabTopicModelType = Model<
	IVocabTopic,
	{},
	{},
	{},
	VocabTopicDocumentType
>;

const VocabTopicSchema = new Schema<IVocabTopic, VocabTopicModelType>(
	{
		topic: {
			type: Schema.Types.ObjectId,
			ref: "Topic",
			required: true,
		},
		vocabulary: {
			type: Schema.Types.ObjectId,
			ref: "Vocabulary",
			required: false,
		},
		grammar: {
			type: Schema.Types.ObjectId,
			ref: "Grammar",
			required: false,
		},
		order: { type: Number, required: true },
		is_required: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

// Ensure at least one of vocabulary or grammar is provided
VocabTopicSchema.pre("save", function () {
	if (!this.vocabulary && !this.grammar) {
		throw new Error(
			"VocabTopic must have either vocabulary or grammar reference",
		);
	}
});

// Create compound index for topic + order
VocabTopicSchema.index({ topic: 1, order: 1 });

export const VocabTopicModel = mongoose.model<IVocabTopic, VocabTopicModelType>(
	"VocabTopic",
	VocabTopicSchema,
);
