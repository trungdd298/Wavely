import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // mongo db indexes unique fields
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String
    },
    avatarId: {
        type: String // Cloudinary public_id for deletion
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        sparse: true // allows null, if not null it must be unique
    }
}, {
    timestamps: true // mongoose adds createdAt and updatedAt
});

const User = mongoose.model("User", userSchema);
export default User;
