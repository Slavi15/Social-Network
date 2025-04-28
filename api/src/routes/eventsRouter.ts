import { Router } from "express";
import { eventController } from "@/controllers/eventsController.ts";

const eventsRouter = Router();

eventsRouter.get("/", eventController.getEvents);
eventsRouter.get("/:eventId", eventController.getEventById);
eventsRouter.get("/title/:title", eventController.getEventByTitle);

eventsRouter.post("/create", eventController.createEvent);
eventsRouter.put("/:eventId/update", eventController.updateEvent);
eventsRouter.delete("/:eventId/delete", eventController.deleteEvent);

eventsRouter.put("/:eventId/add", eventController.addCreator);
eventsRouter.put("/:eventId/remove", eventController.removeCreator);
eventsRouter.put("/:eventId/join", eventController.joinEvent);
eventsRouter.put("/:eventId/leave", eventController.leaveEvent);

export default eventsRouter;