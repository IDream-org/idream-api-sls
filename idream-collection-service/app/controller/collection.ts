import { v4 as uuid } from "uuid";
import { MessageUtil } from "../utils/message";
import { CollectionService } from "../service/collection";
import { CreateCollectionDTO } from "../model/dto/CreateCollectionDTO";
import { APIGatewayProxyEventBase } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class CollectionController extends CollectionService {
  constructor() {
    super();
  }

  async getByUserId(event: APIGatewayProxyEventBase<{ sub: string }>) {
    const authorId = process.env.IS_OFFLINE
      ? "sls-offline"
      : event.requestContext.authorizer.sub;

    try {
      const collections = await this.getCollectionByUserId(authorId);
      if (!collections.Items) return MessageUtil.notFound();

      const collectionList = collections.Items.map((item) => unmarshall(item));
      return MessageUtil.success(collectionList);
    } catch (err: any) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async create(event: APIGatewayProxyEventBase<{ sub: string }>) {
    if (!event.body) return MessageUtil.badRequest();
    const params: CreateCollectionDTO = JSON.parse(event.body);
    console.log(process.env.IS_OFFLINE);
    const { title, image } = params;
    const id = uuid();

    try {
      const createdCollection = await this.createCollection({
        id,
        title,
        image: image || "",
        authorId: process.env.IS_OFFLINE
          ? "sls-offline"
          : event.requestContext.authorizer.sub,
      });
      return MessageUtil.created(createdCollection);
    } catch (err: any) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async deleteById(event: APIGatewayProxyEventBase<{ sub: string }>) {
    if (!event.pathParameters || !event.pathParameters.id) {
      return MessageUtil.badRequest();
    }
    const { id } = event.pathParameters;

    try {
      const collection = await this.getCollectionById(id);

      if (!collection.Items?.length) return MessageUtil.notFound();

      const collectionToDelete = collection.Items[0];
      const authorId = process.env.IS_OFFLINE
        ? "sls-offline"
        : event.requestContext.authorizer.sub;

      if (collectionToDelete.authorId !== authorId) {
        return MessageUtil.unauthorized();
      }

      await this.deleteCollectionById(collectionToDelete.id);
      return MessageUtil.success(collectionToDelete);
    } catch (err: any) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }
}
