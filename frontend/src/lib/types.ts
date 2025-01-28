export type AxiosError = {
    message: string;
    response?: {
      status: number;
      data: {
        message: string;
      };
    };
    isAxiosError: boolean;
  };
  