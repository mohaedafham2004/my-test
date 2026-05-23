export interface RegisterDto {
  user_name: string;
  phone: string;
  email?: string;
  password?: string;
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN';
}

export interface LoginDto {
  phone?: string;
  email?: string;
  password: string;
}

export interface UpdateUserDto {
  user_name?: string;
  phone?: string;
  email?: string;
}

export interface CreateLocationDto {
  place_name?: string;
  special_name?: string;
  town?: string;
  district?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> {}

export interface LocationFilters {
  province?: string;
  district?: string;
  town?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpsertOpinionDto {
  location_id: string;
  favourite?: boolean;
  saved?: boolean;
  previous_visit?: string;
  future_visit?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface SearchHistoryPayload {
  query: string;
  type: string;
  locationId: string;
  weatherFetched: boolean;
  verdict?: string;
  timestamp: string;
}
