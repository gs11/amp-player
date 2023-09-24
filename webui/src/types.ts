export namespace Types {
  export interface Artist {
    id: number;
    handle: string;
    real_name?: string;
    country?: string;
    amp_url: string;
  }

  export interface Module {
    id: number;
    name: string;
    composers: string[];
    format: string;
    size: string;
  }
}
