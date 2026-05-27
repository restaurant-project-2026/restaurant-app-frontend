const RESTAURANT_HERO =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80';

const RESTAURANT_INTERIOR =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80';

const CATEGORY_IMAGES = {
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  entree: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  plat: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
  boisson: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
};

export function getRestaurantHeroImage() {
  return RESTAURANT_HERO;
}

export function getRestaurantInteriorImage() {
  return RESTAURANT_INTERIOR;
}

export function getDishImage(menuItem, categoryName = '') {
  const name = (categoryName || menuItem?.name || '').toLowerCase();
  if (name.includes('entr') || name.includes('salad') || name.includes('soup')) {
    return CATEGORY_IMAGES.entree;
  }
  if (name.includes('dessert') || name.includes('gâteau') || name.includes('gateau')) {
    return CATEGORY_IMAGES.dessert;
  }
  if (name.includes('boisson') || name.includes('vin') || name.includes('drink')) {
    return CATEGORY_IMAGES.boisson;
  }
  if (name.includes('plat') || name.includes('viande') || name.includes('poisson')) {
    return CATEGORY_IMAGES.plat;
  }
  return CATEGORY_IMAGES.default;
}
