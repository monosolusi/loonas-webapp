import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankModel } from "../models/bank";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountInquiryResultModel } from "@/features/bank/data/models/account-inquiry-result";
import { BankAccountModel } from "@/features/bank/data/models/bank-account";
import { BankService } from "@/features/bank/domain/sources/bank";
import { AccountBankAccountModel } from "@/features/account/data/models/account-bank-account";

export class BankServiceImpl implements BankService {
  public async createBankAccountForAccount(params: {
    bankId: string;
    accountNumber: string;
  }, session: SessionEntity): Promise<AccountBankAccountModel> {
    try {
      if (!session.accessToken) throw new ServerError(ErrorCodes.NO_VALID_SESSION);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const method = "POST";
      const url = `${baseUrl}/accounts/bank-accounts`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      };

      const body = {
        bank_id: params.bankId,
        account_number: params.accountNumber
      };

      const response = await fetch(url, { method, body: JSON.stringify(body), headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return AccountBankAccountModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getBankAccount(params: {
    partnerId: string;
    id: string;
  }, session: SessionEntity): Promise<BankAccountModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners/${params.partnerId}/bank-accounts/${params.id}`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
      };

      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return BankAccountModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listBanks(session: SessionEntity): Promise<BankModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/banks`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) {
        throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      }

      return data.map(item => BankModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }


  public async listBankAccounts(partnerId: string, session: SessionEntity): Promise<BankAccountModel[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners/${partnerId}/bank-accounts`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
      };

      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return data.map(item => BankAccountModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async verifyAccountHolder(bankId: string, accountNumber: string, session: SessionEntity): Promise<AccountInquiryResultModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/banks/${bankId}/verify`;
      const body = {
        account_number: accountNumber
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return AccountInquiryResultModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async createBankAccount(bankId: string, accountNumber: string, accountHolderName: string, partnerId: string, session: SessionEntity): Promise<BankAccountModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners/${partnerId}/bank-accounts`;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      };

      const body = {
        bank_id: bankId,
        account_number: accountNumber,
        account_holder_name: accountHolderName
      };

      const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return BankAccountModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
