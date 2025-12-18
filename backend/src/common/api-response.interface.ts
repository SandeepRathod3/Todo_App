export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: Date;
}

export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: Date;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date();
  }

  static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      message,
      data,
    });
  }

  static error(message: string, errors: string[] = []): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: false,
      message,
      errors,
    });
  }
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}