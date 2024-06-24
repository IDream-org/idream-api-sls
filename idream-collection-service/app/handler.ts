import { Handler } from "aws-lambda";
import { CollectionController } from "./controller/collection";

const collectionController = new CollectionController();

export const getCollectionsByUserId: Handler = async (event: any) => {
  return await collectionController.getByUserId(event);
};

export const createCollection: Handler = async (event: any) => {
  return await collectionController.create(event);
};

export const deleteCollectionById: Handler = async (event: any) => {
  return await collectionController.deleteById(event);
};
