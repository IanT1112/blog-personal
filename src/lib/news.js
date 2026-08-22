import { supabase } from "./supabase";

export async function getLatestNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error cargando noticias:", error);
    return [];
  }

  const limits = {
    IA: 2,
    Tecnología: 2,
    Negocios: 2,
    Mercados: 2,
    Economía: 2,
    Geopolítica: 1,
    Proyecciones: 1,
  };

  const counters = {
    IA: 0,
    Tecnología: 0,
    Negocios: 0,
    Mercados: 0,
    Economía: 0,
    Geopolítica: 0,
    Proyecciones: 0,
  };

  const selected = [];

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