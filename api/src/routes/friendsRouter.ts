import { Router } from "express";
import { friendRequestController } from "@/controllers/friendsController";

const friendRequestsRouter = Router();

friendRequestsRouter.get("/pending", friendRequestController.getRequests);
friendRequestsRouter.get("/pending/:userId", friendRequestController.getPendingRequests);

friendRequestsRouter.post("/send", friendRequestController.sendRequest);
friendRequestsRouter.delete("/cancel", friendRequestController.cancelRequest);

friendRequestsRouter.get("/status", friendRequestController.checkRequestStatus);
friendRequestsRouter.post("/unfriend", friendRequestController.unfriend);

friendRequestsRouter.put("/accept/:request_id", friendRequestController.acceptRequest);
friendRequestsRouter.put("/reject/:request_id", friendRequestController.rejectRequest);

export default friendRequestsRouter;