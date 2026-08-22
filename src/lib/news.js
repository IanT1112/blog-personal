import { supabase } from "./supabase";

export async function getLatestNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error cargando noticias:", error);
    return [];
  }

  const limits = {
    IA: 5,
    Tecnología: 5,
    Negocios: 5,
    Mercados: 5,
    Economía: 5,
    Geopolítica: 3,
    Proyecciones: 2,
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

    if (selected.length >= 30) {
      break;
    }
  }

  return selected;
}