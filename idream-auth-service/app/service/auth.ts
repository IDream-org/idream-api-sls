import jwt from "jsonwebtoken";

export class AuthService {
  protected getClaims(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, process.env.AUTH0_PUBLIC_KEY as string);
  }

  protected generatePolicy(
    principalId: string | (() => string) | undefined,
    methodArn: string
  ) {
    const apiGatewayWildcard = methodArn.split("/", 2).join("/") + "/*";

    return {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: apiGatewayWildcard,
          },
        ],
      },
    };
  }
}
