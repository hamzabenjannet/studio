export const formatEntityRecursive = (
  entity: any,
  depth: number = 0,
): string | undefined => {
  if (entity === null || entity === undefined) return "";
  if (typeof entity !== "object") return String(entity);
  if (entity instanceof Date) return entity.toLocaleString();

  const indent = " ".repeat(depth * 2);

  if (Array.isArray(entity)) {
    if (entity.length === 0) return "[]";
    return (
      entity
        .map((item, index) => {
          const val = formatEntityRecursive(item, depth + 1);
          return `${indent}- [${index}]: item._id:${item?._id || "N/A"} \n${val}`;
        })
        // .filter((item) => !item)
        .join("\n --- \n")
    );
  }
};
