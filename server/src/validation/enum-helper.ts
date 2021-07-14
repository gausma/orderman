type GenericEnum<T> = { [id: string]: T };

/**
 * Resolve an array of enum values for the given enum
 * @param e Enum to resolve
 * @returns List of enum values
 */
export function getEnumValues<T extends string | number>(e: GenericEnum<T>): T[] {
    return typeof e === "object" ? Object.keys(e).map((key) => e[key]) : [];
}