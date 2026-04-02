// Group definitions based on poster: Group 1 (Class 6-8), Group 2 (9-10), Group 3 (11-12)
export const GROUPS = [
  { value: "group1", label: "Group 1", classes: "Class 6 - 8", description: "कक्षा 6 से 8 तक" },
  { value: "group2", label: "Group 2", classes: "Class 9 - 10", description: "कक्षा 9 से 10 तक" },
  { value: "group3", label: "Group 3", classes: "Class 11 - 12", description: "कक्षा 11 से 12 तक" },
];

export function getGroupLabel(value: string): string {
  return GROUPS.find(g => g.value === value)?.label || value;
}

export function getGroupClasses(value: string): string {
  return GROUPS.find(g => g.value === value)?.classes || "";
}

export function getGroupForClass(cls: string): string {
  const c = parseInt(cls);
  if (c >= 6 && c <= 8) return "group1";
  if (c >= 9 && c <= 10) return "group2";
  if (c >= 11 && c <= 12) return "group3";
  return "group1";
}

// Get full group details
export function getGroupDetails(value: string) {
  return GROUPS.find(g => g.value === value);
}