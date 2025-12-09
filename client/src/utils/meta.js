const SITE_NAME = 'Sellaids';

function _absImage(img) {
  if (!img) return `${process.env.PUBLIC_URL}/logo512.png`;
  if (/^https?:\/\//i.test(img)) return img;
  if (process.env.REACT_APP_API_URL) return `${process.env.REACT_APP_API_URL}/${img}`;
  return `${process.env.PUBLIC_URL}/${img}`;
}

function _pageUrl(url) {
  if (url) return url;
  if (typeof window !== 'undefined' && window.location) return window.location.href;
  return process.env.PUBLIC_URL || '/';
}

export function buildProductMeta(product = {}) {
  const title = product.name || product.title || 'Product';
  const price = product.price ? `₹${Number(product.price).toLocaleString()}` : '';
  const parts = [];
  if (product.condition) parts.push(product.condition);
  if (price) parts.push(price);
  const description = product.metaDescription || product.description || `${title}${parts.length ? ' • ' + parts.join(' • ') : ''}`;
  const image = _absImage(product.image || (product.images && product.images[0]));
  const url = _pageUrl(product.url);
  return { title: `${title} | ${SITE_NAME}`, description, image, url };
}

export function buildCategoryMeta(category = {}) {
  const title = category.name || 'Shop';
  const description = category.metaDescription || `Browse ${title} on ${SITE_NAME}`;
  const image = _absImage(category.image);
  const url = _pageUrl(category.url || `/product-category/${category.path || ''}`);
  return { title: `${title} | ${SITE_NAME}`, description, image, url };
}

export function buildGenericMeta({ title, description, image, url } = {}) {
  return {
    title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
    description: description || `Discover items on ${SITE_NAME}.`,
    image: _absImage(image),
    url: _pageUrl(url),
  };
}

export default { buildProductMeta, buildCategoryMeta, buildGenericMeta };
