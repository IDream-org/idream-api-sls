import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { CreateCollectionDTO } from "../model/dto/CreateCollectionDTO";

const COLLECTIONS_TABLE = process.env.COLLECTIONS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

export class CollectionService {
  protected async getCollectionById(id: string) {
    const collection = await dynamoDbClient.send(
      new QueryCommand({
        TableName: COLLECTIONS_TABLE,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
    );
    return collection;
  }

  protected async getCollectionByUserId(authorId: string) {
    const collection = await dynamoDbClient.send(
      new ScanCommand({
        TableName: COLLECTIONS_TABLE,
        FilterExpression: "contains(#users, :authorId) or authorId = :authorId",
        ExpressionAttributeValues: {
          ":authorId": { S: authorId },
        },
        ExpressionAttributeNames: { "#users": "users" },
      })
    );
    return collection;
  }

  protected async createCollection(params: CreateCollectionDTO) {
    const { id, title, image, authorId } = params;
    const now = new Date();
    const collection = {
      id,
      title,
      image,
      private: true,
      users: [],
      authorId,
      createdAt: now.toISOString(),
    };

    await dynamoDbClient.send(
      new PutCommand({
        TableName: COLLECTIONS_TABLE,
        Item: collection,
      })
    );
    return collection;
  }

  protected async deleteCollectionById(id: string) {
    return await dynamoDbClient.send(
      new DeleteCommand({
        TableName: COLLECTIONS_TABLE,
        Key: {
          id,
        },
      })
    );
  }
}
