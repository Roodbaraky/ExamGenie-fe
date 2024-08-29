

export interface UploadFormValues {
    difficulty: string[];
    tags: string[][];
    images: string[];
    answerImages:string[];
  }
  export interface Tag {
    id: number;
    tag: string;
    category: string;
  }
  export type TagObject = Record<number,Tag>
