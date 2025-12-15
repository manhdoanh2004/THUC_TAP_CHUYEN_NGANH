/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'selectr' {
  // Định nghĩa các tùy chọn cơ bản mà bạn sử dụng
  interface SelectrOptions {
    taggable?: boolean;
    data?: Array<{ value: string; text: string }>;
    multiple?: boolean;
    searchable?: boolean;
    placeholder?: string;
  }

  // Định nghĩa lớp Selectr
  export default class Selectr {
    constructor(selector: string | HTMLElement, options?: SelectrOptions);
    
    // Phương thức cần thiết để dọn dẹp (cleanup)
    destroy(): void;
    
    // Các phương thức khác (nếu cần)
    getValue(): string | string[];
    on(event: string, callback: (e: any) => void): void;
    add(data: Array<{ value: string; text: string }> | { value: string; text: string }): void;
  }
}