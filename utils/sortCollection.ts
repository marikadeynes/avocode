type TNestedArrayItem<T> = T | TNestedArrayItem<T>[];
export type TNestedArray<T = unknown> = TNestedArrayItem<T>[];

interface ICollectionSettings {
    idProperty: string;
    nodeProperty: string;
    parentProperty: string;
}

function getNestedItems<T>(
    items: TNestedArray<T>,
    root: unknown,
    parentProperty: string
): TNestedArray<T> {
    return items.filter((obj: T) => obj[parentProperty] === root);
}

/**
 * Recursively spreading hierarchy collection
 * @param collection Items collection with root
 * @param root Current root
 * @param settings Hierarchy settings
 * @returns Sorted array of items from origin collection with nested array
 */
function spreadCollection<T>(
    collection: TNestedArray<T>,
    {
        idProperty,
        nodeProperty,
        parentProperty
    }: ICollectionSettings,
    root: unknown = null
): TNestedArray<T>{
    return collection.reduce<TNestedArray<T>>((cache: TNestedArray<T>, obj: T) => {
        if (obj[nodeProperty] || obj[parentProperty] === root) {
            cache.push(obj);
        }
        if (obj[nodeProperty]) {
            cache.push(
                spreadCollection<T>(
                    getNestedItems<T>(
                        collection,
                        obj[idProperty],
                        parentProperty
                    ),
                    {
                        idProperty,
                        nodeProperty,
                        parentProperty
                    },
                    obj[idProperty]
                )
            );
        }
        return cache;
    }, []);
}

/**
 * Sorting hierarchy collection to flat order
 * @param items Collection of items
 * @param settings Hierarchy settings
 * @returns Sorted collection
 */
export default function sortCollection<T>(
    items: T[],
    settings: ICollectionSettings
): T[] {
    return spreadCollection(
        items,
        settings
    ).flat(Infinity);
}