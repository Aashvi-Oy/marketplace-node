export interface Item {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    image?: string;
    price: number;
    tags: string[];
    ratings: number[];
}

export type ItemCreateInput = Omit<Item, 'id' | 'ownerId'>;
