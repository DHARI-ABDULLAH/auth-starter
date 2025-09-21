import { Schema, model, models, HydratedDocument, Model } from "mongoose";
import bcrypt from "bcrypt";

// [A1] What — Define User schema/model — Why — Auth & ownership — Result: persisted users

export interface IUser {
  name: string;
  email: string;
  password: string;
  serialNumber: string;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    serialNumber: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) return next();
  try {
    // If already hashed (60-char bcrypt), skip re-hashing
    if (typeof this.password === "string" && this.password.startsWith("$2b$") && this.password.length === 60) {
      return next();
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default User;


