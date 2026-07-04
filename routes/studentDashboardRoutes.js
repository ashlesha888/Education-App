

const router = express.Router();

router.get(
  "/dashboard",
  auth,
  isStudent,
  getStudentDashboard
);

export default router;
