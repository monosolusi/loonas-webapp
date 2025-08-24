"use client";

import useSWR from "swr";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { GetNotificationConfigUseCase } from "@/features/notification/domain/usecases/get-notification-config";
import { NotificationRepositoryImpl } from "../../data/repositories/notification";
import { NotificationServiceImpl } from "@/features/notification/data/sources/notification";

async function GetNotificationConfigFetcher() {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);

  const http = new HttpRequest();
  let notificationService: any;
  notificationService = new NotificationServiceImpl(http);
  const notificationRepository = new NotificationRepositoryImpl(notificationService);
  const get = new GetNotificationConfigUseCase(notificationRepository, sessionRepository);

  const config = await get.execute();
  if (config instanceof DataFailed) throw config.error;
  if (!config.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return config.data;
}

export function useGetNotificationConfig() {
  const { data, isLoading, error, mutate } = useSWR("get-notification-config", GetNotificationConfigFetcher);

  return {
    config: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
