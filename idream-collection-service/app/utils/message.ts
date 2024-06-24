import { ResponseVO } from "../model/vo/responseVo";

enum StatusCode {
  success = 200,
  created = 201,
  barRequest = 400,
  unauthorized = 401,
  notFound = 404,
}

class Result {
  private statusCode: number;
  private code: number;
  private message: string;
  private data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString() {
    return {
      statusCode: this.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }),
    };
  }
}

export class MessageUtil {
  static success(data: object): ResponseVO {
    const result = new Result(
      StatusCode.success,
      StatusCode.success,
      "Success",
      data
    );

    return result.bodyToString();
  }

  static created(data: object): ResponseVO {
    const result = new Result(
      StatusCode.created,
      StatusCode.created,
      "Success",
      data
    );

    return result.bodyToString();
  }

  static badRequest(): ResponseVO {
    const result = new Result(
      StatusCode.barRequest,
      StatusCode.barRequest,
      "Bad Request"
    );

    return result.bodyToString();
  }

  static unauthorized(): ResponseVO {
    const result = new Result(
      StatusCode.unauthorized,
      StatusCode.unauthorized,
      "Unauthorized"
    );
    return result.bodyToString();
  }

  static notFound(): ResponseVO {
    const result = new Result(
      StatusCode.barRequest,
      StatusCode.barRequest,
      "Not Found"
    );

    return result.bodyToString();
  }

  static error(code: number = 1000, message: string) {
    const result = new Result(StatusCode.success, code, message);

    console.log(result.bodyToString());
    return result.bodyToString();
  }
}
