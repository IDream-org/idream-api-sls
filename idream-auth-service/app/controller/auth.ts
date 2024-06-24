import { Context, APIGatewayEvent, CustomAuthorizerEvent } from "aws-lambda";

import { AuthService } from "../service/auth";

export class AuthController extends AuthService {
  constructor() {
    super();
  }

  // By default, API Gateway authorizations are cached (TTL) for 300 seconds.
  // This policy will authorize all requests to the same API Gateway instance where the
  // request is coming from, thus being efficient and optimising costs.
  async authenticate(event: CustomAuthorizerEvent) {
    if (!event.authorizationToken) {
      throw "Unauthorized";
    }
    const token: string = event.authorizationToken.replace("Bearer ", "");

    try {
      const claims = this.getClaims(token);
      const policy = this.generatePolicy(claims.sub, event.methodArn);

      return {
        ...policy,
        context: claims,
      };
    } catch (error) {
      console.log(error);
      throw "Unauthorized";
    }
  }

  publicEndpoint() {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Hi ⊂◉‿◉つ from Public API",
      }),
    };
  }

  privateEndpoint(event: APIGatewayEvent, context: Context) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        event,
        context,
      }),
    };
  }
}
