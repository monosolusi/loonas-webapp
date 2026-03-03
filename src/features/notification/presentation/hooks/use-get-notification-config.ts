"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { GetNotificationConfigUseCase } from "@/features/notification/domain/usecases/get-notification-config";
import { NotificationRepositoryImpl } from "../../data/repositories/notification";
import { NotificationServiceImpl } from "@/features/notification/data/sources/notification";

async function GetNotificationConfigFetcher([_, params]: [string, { clerk: ReturnType<typeof useClerk> }]) {
  const sessionService = new ClerkSessionService({ clerk: params.clerk });
  const sessionRepository = new SessionRepositoryImpl(sessionService);

  const http = new HttpRequest();
  const notificationService = new NotificationServiceImpl(http);
  const notificationRepository = new NotificationRepositoryImpl(notificationService);
  const get = new GetNotificationConfigUseCase(notificationRepository, sessionRepository);

  const config = await get.execute();
  if (config instanceof DataFailed) throw config.error;
  if (!config.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return config.data;
}

export function useGetNotificationConfig() {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(["get-notification-config", { clerk }], GetNotificationConfigFetcher);

  return {
    config: data,
    loading: isLoading,
    error: error,
    refresh: mutate,
  };
}
