import { Router } from "express";
import { eventController } from "@/controllers/eventsController.ts";

const eventsRouter = Router();

eventsRouter.post("/", eventController.createEvent);
eventsRouter.put("/:event_id/add-creator", eventController.addCreator);
eventsRouter.put("/:event_id/remove-creator", eventController.removeCreator);
eventsRouter.put("/:event_id/join", eventController.joinEvent);
eventsRouter.put("/:event_id/leave", eventController.leaveEvent);

export default eventsRouter;