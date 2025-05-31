export interface queryObject {
  title: string | undefined;
  category_id: string | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  page: string | undefined;
}

export interface eventQueryVerify {
  slots: number | string;
  status: string | string;
  latitude: number | string;
  longitude: number | string;
}

export interface objectReturnAdminUpdate {
  columns_name: string[];
  columns_values: (string | number | boolean)[];
}
