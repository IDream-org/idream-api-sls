import { Context, APIGatewayEvent, CustomAuthorizerEvent } from "aws-lambda";
import { AuthController } from "./controller/auth";

const authController = new AuthController();

export async function auth(event: any) {
  return await authController.authenticate(event);
}

export function publicEndpoint(
  _event: CustomAuthorizerEvent,
  _context: Context
) {
  return authController.publicEndpoint();
}

export async function privateEndpoint(
  event: APIGatewayEvent,
  context: Context
) {
  return authController.privateEndpoint(event, context);
}
