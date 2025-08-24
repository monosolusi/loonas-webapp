import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { NotificationService } from "@/features/notification/domain/sources/notification";
import { NotificationConfigModel } from "../models/notification-config";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class NotificationServiceImpl implements NotificationService {
  constructor(private readonly http: HttpRequest) {}

  public async listConfig(session: SessionEntity): Promise<NotificationConfigModel> {
    const path = "/notifications/configs";
    const method = "GET";
    const result = await this.http.request({ path, method, session });
    if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return NotificationConfigModel.fromJson(result);
  }
}
