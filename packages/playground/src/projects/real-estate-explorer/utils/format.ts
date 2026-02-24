export function formatPrice(price: number): string {
  const billion = Math.floor(price / 10000);
  const million = price % 10000;

  if (billion > 0 && million > 0) {
    return `${billion}억 ${million}만원`;
  } else if (billion > 0) {
    return `${billion}억원`;
  } else {
    return `${million}만원`;
  }
}

export function formatArea(area: number): string {
  return `${area}평`;
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: "아파트",
    villa: "빌라",
    officetel: "오피스텔",
    house: "주택"
  };
  return labels[type] ?? type;
}

export function getPriceColor(price: number): string {
  if (price < 70000) return "#10B981";
  if (price < 150000) return "#F59E0B";
  if (price < 250000) return "#EF4444";
  return "#7C3AED";
}
