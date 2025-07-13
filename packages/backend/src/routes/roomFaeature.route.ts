import { Router } from "express";
import { RoomFeatureController } from "../controllers/roomFeature.controller";

const featureController = new RoomFeatureController();
const featureRouter = Router();

featureRouter.get("/getAllFeaturs", featureController.GetAllFeatures.bind(featureController));
featureRouter.get("/getFeatureById/:id", featureController.GetFeatureById.bind(featureController));
featureRouter.post("/createFeature", featureController.CreateRoomFeature.bind(featureController));
featureRouter.put("/updateFeature/:id", featureController.UpdateFeature.bind(featureController));
featureRouter.delete("/deleteFeature/:id", featureController.deleteFeature.bind(featureController));
export default featureRouter;