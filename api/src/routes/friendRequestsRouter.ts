import { Router } from "express";
import { friendRequestController } from "@/controllers/friendRequestsController.ts";

const friendRequestsRouter = Router();

friendRequestsRouter.post("/send", friendRequestController.sendRequest);
friendRequestsRouter.put("/accept/:request_id", friendRequestController.acceptRequest);
friendRequestsRouter.put("/reject/:request_id", friendRequestController.rejectRequest);

export default friendRequestsRouter;