import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { model, Schema } from "mongoose";
import Config from "../config";
import { IUserDocument } from "../types/types";
import { passwordValidator, emailValidator } from "../validators";
import { Roles } from "../types/enums";

const userSchema = new Schema<IUserDocument>(
  {
    fullName: { type: String },
    email: {
      type: String,
      validate: {
        validator: emailValidator,
        message: (props: any) => `${props.value} is not a valid email address.`,
      },
      required: [true, "Email is required"],
    },
    stripeId: {type: String},
    subscriptionId: {type: String},
    password: {
      type: String,
      minlength: 8,
      validate: {
        validator: passwordValidator,
        message: (props: any) =>
          `${props.value} is not a valid password. Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character and must be between 8 and 20 characters long.`,
      },
    },
    verified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: [Roles.ADMIN, Roles.USER, Roles.DESIGNER],
      default: Roles.USER,
    },
  },
  { timestamps: true, bufferTimeoutMS: 50000 }
);

//Save Password Hash
userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await hash(this.password, 10);
});

//Compare Hashed Password with User Entered Password
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return compare(password, this.password);
};

//Generate JWT Token
userSchema.methods.getToken = function () {
  return sign({ id: this._id }, Config.JWT_SECRET as string, {
    expiresIn: Config.JWT_EXPIRE_TIME,
  });
};

const User = model<IUserDocument>("User", userSchema);

export default User;