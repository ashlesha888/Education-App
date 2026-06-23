import Course from "../models/course.js";
import User from "../models/user.js";

// ==========================================
// 1. CREATE A NEW COURSE (Instructors Only)
// ==========================================
export const createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, thumbnail, tag } = req.body;

        // 1. Validate required inputs
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !thumbnail || !tag) {
            return res.status(400).json({
                success: false,
                message: "All course fields are required",
            });
        }

        // 2. Fetch the instructor ID directly from the decoded auth middleware payload
        const instructorId = req.user.id;

        // 3. Create the course record in the database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorId,
            whatYouWillLearn,
            price,
            thumbnail,
            tag,
        });

        // 4. Update the Instructor's user record to add this course ID to their list
        await User.findByIdAndUpdate(
            instructorId,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};

// ==========================================
// 2. FETCH ALL COURSES (For the Marketplace)
// ==========================================
export const getAllCourses = async (req, res) => {
    try {
        // Fetch all courses and populate the instructor details (excluding password)
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        })
        .populate({
            path: "instructor",
            select: "firstName lastName email image", // Only retrieve public data
        })
        .exec();

        return res.status(200).json({
            success: true,
            data: allCourses,
            message: "All courses fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.message,
        });
    }
};
