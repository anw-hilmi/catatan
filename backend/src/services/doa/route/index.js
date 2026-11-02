import express from "express";
import { doaController } from "../controllers/doaController.js";
import { uploadPdf } from "../../../middlewares/uploadMiddlewares.js";

const router = express.Router();

router.get("/", doaController.getAllHandler);
router.get("/pdf/:fileId", doaController.streamPdf);
router.post("/", uploadPdf.array("files"), doaController.createHandler);
router.delete("/:id", doaController.deleteHandler);
router.put("/:id", uploadPdf.array("files"), doaController.updateHandler);

export default router;
