const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: String,
    }
  ],
  ipAddress: String, // for blocking duplicates
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});
