import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankModel } from "../models/bank";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountInquiryResultModel } from "@/features/bank/data/models/account-inquiry-result";
import { BankAccountModel } from "@/features/bank/data/models/bank-account";

export abstract class BankService {
  /**
   * Retrieves a list of available banks
   * @param session Current user session
   * @returns Promise resolving to array of BankModel
   */
  public abstract listBanks(session: SessionEntity): Promise<BankModel[]>;

  /**
   * Retrieves bank accounts for a specific partner
   * @param partnerId ID of the partner
   * @param session Current user session
   * @returns Promise resolving to an array of BankAccountModel
   */
  public abstract listBankAccounts(partnerId: string, session: SessionEntity): Promise<BankAccountModel[]>;

  /**
   * Verifies the holder of a bank account
   * @param bankId ID of the bank
   * @param accountNumber Account number to verify
   * @param session Current user session
   * @returns Promise resolving to AccountInquiryResultModel
   */
  public abstract verifyAccountHolder(bankId: string, accountNumber: string, session: SessionEntity): Promise<AccountInquiryResultModel>;

  /**
   * Creates a new bank account for a partner
   * @param bankId ID of the bank
   * @param accountNumber Account number
   * @param accountHolderName Name of the account holder
   * @param partnerId ID of the partner
   * @param session Current user session
   * @returns Promise resolving to created BankAccountModel
   */
  public abstract createBankAccount(bankId: string, accountNumber: string, accountHolderName: string, partnerId: string, session: SessionEntity): Promise<BankAccountModel>;
}

export class BankServiceImpl implements BankService {
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
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners/${partnerId}/bank-accounts`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
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
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/partners/${partnerId}/bank-accounts`;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
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