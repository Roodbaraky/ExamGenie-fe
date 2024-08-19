

export interface UploadFormValues {
    difficulty: string;
    tags: object;
    images: string[];
  }
  export interface Tag {
    id: number;
    tag: string;
    category: string;
  }
  export type TagObject = Record<number,Tag>
