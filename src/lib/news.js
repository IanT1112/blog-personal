import { supabase } from "./supabase";

export async function getLatestNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("importance", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(40);

  if (error) {
    console.error("Error cargando noticias:", error);
    return [];
  }

  const selected = [];

  const limits = {
    IA: 2,
    Tecnología: 2,
    Negocios: 3,
    Economía: 2,
    Geopolítica: 2,
    Proyecciones: 1,
  };

  const counters = {
    IA: 0,
    Tecnología: 0,
    Negocios: 0,
    Economía: 0,
    Geopolítica: 0,
    Proyecciones: 0,
  };

  for (const article of data) {
    const category = article.category;

    if (
      limits[category] !== undefined &&
      counters[category] < limits[category]
    ) {
      selected.push(article);
      counters[category]++;
    }

    if (selected.length >= 12) {
      break;
    }
  }

  return selected;
}