export function getContactDefaults(search: string) {
  const params = new URLSearchParams(search);
  const equipment = params.get("equipment")?.trim() ?? "";

  return {
    defaultType: params.get("type")?.trim() ?? "",
    defaultMessage: equipment ? `Equipment inquiry: ${equipment}\n\n` : "",
  };
}
